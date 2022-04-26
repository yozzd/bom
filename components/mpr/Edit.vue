<template>
  <div>
    <el-dialog
      title="Edit"
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
            prop="woNo"
          >
            <el-input v-model="form.woNo" disabled></el-input>
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
          <el-form-item
            label="Product Name"
            prop="product"
            class="col-span-2"
          >
            <el-input
              v-model="form.product"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Unit"
            prop="unit"
          >
            <el-input v-model="form.unit"></el-input>
          </el-form-item>
          <el-form-item
            label="Category"
            prop="category"
          >
            <el-select
              v-model="form.category"
              filterable
            >
              <el-option
                v-for="item in category"
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
          @click="handleUpdate()"
        >
          Update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mpr from '../../mixins/mpr';

export default {
  mixins: [mpr],
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
    };
  },
  watch: {
    data(value) {
      this.form = value;
    },
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    handleCancel() {
      this.loading = false;
      this.errors = [];
      this.$emit('close', false);
    },
    handleUpdate() {
      console.log(this.form.wo);
    },
  },
};
</script>
