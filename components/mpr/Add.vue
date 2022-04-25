<template>
  <div>
    <el-dialog
      title="Add"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="50%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
        class="grid grid-cols-5"
      >
        <div class="col-span-3 col-start-2 grid grid-cols-2 gap-x-4">
          <IndexErrorHandler
            v-if="errors.length"
            :errors="errors"
            class="col-span-2 mb-4"
          />

          <el-form-item
            label="Status"
            prop="status"
          >
            <el-select
              v-model="form.status"
              filterable
            >
              <el-option
                v-for="item in pStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Wo No."
            prop="wo"
          >
            <el-select
              v-model="form.wo"
              value-key="id"
              remote
              :remote-method="woRunningRemote"
              :loading="woRunningLoading"
              filterable
            >
              <el-option
                v-for="item in woRunning"
                :key="item.id"
                :label="item.woNo"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="packing"
            class="col-span-2"
          >
            <el-checkbox
              v-model="form.packing"
              :true-label="1"
            >
              Packing
            </el-checkbox>
          </el-form-item>
          </el-form-item>
          <el-form-item
            label="Model"
            prop="model"
            class="col-span-2"
          >
            <el-input
              v-model="form.model"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleCreate()"
        >
          Save
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GetAllWoRunning from '../../apollo/bom/query';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    query: {
      type: Object,
      default: () => ({}),
    },
    variables: {
      type: Object,
      default: () => ({}),
    },
    sdata: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      pStatus: [
        { label: 'Non Project', value: 'NP' },
        { label: 'Project', value: 'P' },
      ],
      woRunning: [],
      woRunningLoading: false,
      form: {},
      rules: {
        wo: [{ required: true, message: 'This field is required', trigger: 'change' }],
      },
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
      this.loading = false;
      this.errors = [];
      this.$emit('close', false);
    },
    handleCreate() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            console.log(this.form);
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
    async woRunningRemote(key) {
      if (key) {
        this.woRunningLoading = true;
        const { data: { getAllWoRunning } } = await this.$apollo.query({
          query: GetAllWoRunning,
          variables: { key },
          prefetch: false,
          error({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
          },
        });
        this.woRunning = getAllWoRunning;
        this.woRunningLoading = false;
      } else {
        this.woRunning = [];
      }
    },
  },
};
</script>
