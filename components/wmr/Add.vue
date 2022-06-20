<template>
  <div>
    <el-dialog
      title="Add WMR"
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
        class="grid xl:grid-cols-5"
      >
        <div class="xl:col-span-3 xl:col-start-2">
          <el-form-item
            label="Request By"
            prop="requestBy"
          >
            <el-select
              v-model="form.requestBy"
              value-key="nk"
              remote
              :remote-method="getPersonDept"
              :loading="getPersonDeptLoading"
              filterable
            >
              <el-option
                v-for="person in persons"
                :key="person.nk"
                :label="person.nama"
                :value="person"
              >
                <span>{{ person.nama }}</span>
                <span class="float-right text-gray-400">{{ person.nk }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Authorized By"
            prop="authorizedBy"
          >
            <el-select
              v-model="form.authorizedBy"
              value-key="nk"
              remote
              :remote-method="getPersonDept"
              :loading="getPersonDeptLoading"
              filterable
            >
              <el-option
                v-for="person in persons"
                :key="person.nk"
                :label="person.nama"
                :value="person"
              >
                <span>{{ person.nama }}</span>
                <span class="float-right text-gray-400">{{ person.nk }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
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
          :loading="loadingSave"
          @click="handleSave"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetPersonDept } from '../../apollo/bom/query';
import { AddWmr } from '../../apollo/wmr/mutation';
import { GetWmrByWo } from '../../apollo/wmr/query';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        requestBy: this.$auth.$state.user.fullname,
        authorizedBy: '',
      },
      rules: {
        requestBy: [{ required: true, message: 'This field is required', trigger: 'change' }],
        authorizedBy: [{ required: true, message: 'This field is required', trigger: 'change' }],
      },
      loadingSave: false,
      visible: false,
      getPersonDeptLoading: false,
      persons: [],
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
    async getPersonDept(key) {
      if (key) {
        this.getPersonDeptLoading = true;
        const { data: { getPersonDept } } = await this.$apollo.query({
          query: GetPersonDept,
          variables: { key },
          prefetch: false,
          error({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
          },
        });
        this.persons = getPersonDept;
        this.getPersonDeptLoading = false;
      } else {
        this.persons = [];
      }
    },
    handleSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSave = false;

            await this.$apollo.mutate({
              mutation: AddWmr,
              variables: {
                input: {
                  requestById: this.form.requestBy.nk,
                  requestBy: this.form.requestBy.nama || this.$auth.$state.user.fullname,
                  authorizedById: this.form.authorizedBy.nk,
                  authorizedBy: this.form.authorizedBy.nama,
                  idWo: parseInt(this.$route.params.id, 10),
                },
              },
              update: (store, { data: { addWmr } }) => {
                const cdata = store.readQuery({
                  query: GetWmrByWo,
                  variables: {
                    idWo: parseInt(this.$route.params.id, 10),
                  },
                });

                cdata.getWmrByWo.push(addWmr);

                store.writeQuery({
                  query: GetWmrByWo,
                  variables: {
                    idWo: parseInt(this.$route.params.id, 10),
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
