<template>
  <div>
    <el-dialog
      title="Move To Module"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="40%"
    >
      <IndexErrorHandler
        v-if="errors.length"
        :errors="errors"
        class="mb-4"
      />

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-width="120px"
        class="w-2/3"
      >
        <el-form-item
          label="Module"
          prop="nIdModule"
        >
          <el-select
            v-model="form.nIdModule"
            filterable
          >
            <el-option
              v-for="item in modules"
              :key="item.id"
              :label="`${item.moduleChar} ${item.moduleName }`"
              :value="item.id"
            >
              <span>{{ item.moduleChar }} {{ item.moduleName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="handleCancel"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import { GetOneMPR } from '../../../apollo/mpr/query';
import { MoveToModule } from '../../../apollo/mpr/mutation';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Array,
      default: () => ([]),
    },
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      form: {},
      rules: {
        nIdModule: [{ required: true, message: 'This field is required', trigger: 'change' }],
      },
      loading: false,
      visible: false,
      errors: [],
    };
  },
  watch: {
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    handleCancel() {
      this.$refs.form.resetFields();
      this.errors = [];
      this.$emit('close', false);
    },
    handleSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            const items = await Promise.all(
              this.items.map((v) => ({
                id: v.id,
                isMpr: v.isMpr,
                oIdModule: v.idModule,
                idModule: this.form.nIdModule,
              })),
            );

            await this.$apollo.mutate({
              mutation: MoveToModule,
              variables: {
                input: items,
              },
              update: async (store, { data: { moveToModule } }) => {
                const cdata = store.readQuery({
                  query: GetOneMPR,
                  variables: {
                    id: parseInt(this.$route.params.id, 10),
                  },
                });

                const { nIdModule } = this.form;

                moveToModule.map((v) => {
                  const nIndex = cdata.getOneMPR.modules.findIndex((e) => e.id === nIdModule);
                  const oItems = [...cdata.getOneMPR.modules[nIndex].items];
                  cdata.getOneMPR.modules[nIndex].items = [...oItems, v];
                  if (v.oIdModule) {
                    const oIndex = cdata.getOneMPR
                      .modules.findIndex((e) => e.id === v.oIdModule);
                    pullAllBy(cdata.getOneMPR.modules[oIndex].items, [v], 'id');
                  } else {
                    pullAllBy(cdata.getOneMPR.items, [v], 'id');
                  }

                  return true;
                });

                store.writeQuery({
                  query: GetOneMPR,
                  variables: {
                    id: parseInt(this.$route.params.id, 10),
                  },
                  data: cdata,
                });
              },
            });

            this.$message({
              type: 'success',
              message: 'Data has been saved successfully',
              onClose: setTimeout(() => {
                this.handleCancel();
                this.loading = false;
              }, 1000),
            });

            return true;
          } catch ({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
            return false;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
