<template>
  <div>
    <el-dialog
      title="Clone"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="30%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
        class="grid grid-cols-2 gap-x-4"
      >
        <el-form-item
          label="LT No."
          prop="ltNo"
          class="col-span-2"
        >
          <el-input v-model="form.ltNo"></el-input>
        </el-form-item>
        <el-form-item
          label="New WO No."
          prop="woNo"
          class="col-span-2"
        >
          <el-input v-model="form.woNo"></el-input>
        </el-form-item>
        <el-form-item
          label="Unit"
          prop="unit"
        >
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item
          label="ETA"
          prop="eta"
        >
          <el-date-picker
            v-model="form.bomEta"
            type="date"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSave"
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
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        ltNo: [{ required: true, message: 'This field is required' }],
        woNo: [{ required: true, message: 'This field is required' }],
        unit: [{ required: true, message: 'This field is required' }],
      },
      visible: false,
      loading: false,
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
    handleSave() {},
  },
};
</script>
