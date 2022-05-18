<template>
  <div>
    <el-dialog
      title="Add Module"
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
        :inline="true"
      >
        <el-form-item label="Title">
          <el-input v-model="form.moduleChar" style="width: 60px;"></el-input>
        </el-form-item>
        <el-form-item label="" prop="moduleName">
          <el-input v-model="form.moduleName"></el-input>
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
import { GetOneMPR } from '../../../apollo/mpr/query';
import { AddMprModule } from '../../../apollo/mpr/mutation';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        moduleName: [{ required: true, message: 'This field is required' }],
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
    async handleSave() {
      try {
        this.loading = false;

        await this.$apollo.mutate({
          mutation: AddMprModule,
          variables: {
            input: {
              moduleChar: this.form.moduleChar,
              moduleName: this.form.moduleName,
              idMpr: parseInt(this.$route.params.id, 10),
            },
          },
          update: async (store, { data: { addMprModule } }) => {
            const cdata = store.readQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
            });

            cdata.getOneMPR.modules.push(addMprModule);

            this.$emit('update', { type: 'module', value: cdata.getOneMPR.modules });

            store.writeQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addMprModule: {
              __typename: 'MPRMODULE',
              id: -1,
              ...this.form,
              items: [],
            },
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
    },
  },
};
</script>
