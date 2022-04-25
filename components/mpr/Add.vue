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

          <el-form-item label="Status">
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
  watch: {
    show(value) {
      this.visible = value;
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
      form: {
        status: '',
      },
      rules: {},
      errors: [],
    };
  },
  methods: {
    handleCancel() {
      this.$refs.form.resetFields();
      this.loading = false;
      this.errors = [];
      this.$emit('close', false);
    },
    handleCreate() {},
  },
};
</script>
