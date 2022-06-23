<template>
  <div>
    <el-dialog
      title="Edit"
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
            label="Requested By"
            prop="requestedBy"
          >
            <el-select
              v-model="form.requestedBy"
              value-key="nama"
              remote
              :remote-method="getPersonDept"
              :loading="getPersonDeptLoading"
              filterable
              :disabled="$auth.$state.user.section===213"
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
              value-key="nama"
              remote
              :remote-method="getPersonDept"
              :loading="getPersonDeptLoading"
              filterable
              :disabled="$auth.$state.user.section===213"
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
          :loading="loading"
          @click="handleUpdate"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetPersonDept } from '../../apollo/bom/query';
import { EditWmr } from '../../apollo/wmr/mutation';
import utils from '../../mixins/utils';

export default {
  mixins: [utils],
  props: {
    data: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        requestedBy: [{ required: true, message: 'This field is required', trigger: 'change' }],
        authorizedBy: [{ required: true, message: 'This field is required', trigger: 'change' }],
      },
      loading: false,
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
    data(value) {
      this.form = { ...value };
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
    handleUpdate() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSave = false;

            await this.$apollo.mutate({
              mutation: EditWmr,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  requestedById: typeof this.form.requestedBy === 'object' ? this.form.requestedBy.nk : this.form.requestedById,
                  requestedBy: typeof this.form.requestedBy === 'object' ? this.form.requestedBy.nama : this.form.requestedBy,
                  authorizedById: typeof this.form.authorizedBy === 'object' ? this.form.authorizedBy.nk : this.form.authorizedById,
                  authorizedBy: typeof this.form.authorizedBy === 'object' ? this.form.authorizedBy.nama : this.form.authorizedBy,
                  idWo: parseInt(this.form.wo.id, 10),
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
        } else {
          return false;
        }
      });
    },
  },
};
</script>
