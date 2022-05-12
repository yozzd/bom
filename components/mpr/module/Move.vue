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
          prop="module"
        >
          <el-select
            v-model="form.module"
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
  },
  data() {
    return {
      form: {},
      rules: {
        module: [{ required: true, message: 'This field is required', trigger: 'change' }],
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
    handleSave() {},
  },
};
</script>
