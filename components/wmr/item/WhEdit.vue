<template>
  <div>
    <el-dialog
      title="Edit WMR Item"
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
        label-position="top"
        class="grid grid-cols-5"
      >
        <div class="xl:col-span-3 xl:col-start-2">
          <el-form-item
            label="Quantity Issued"
            prop="qtyIssued"
          >
            <el-input v-model="form.qtyIssued"></el-input>
          </el-form-item>
          <el-form-item
            label="Remark"
            prop="wmrWhRemarks"
          >
            <client-only>
              <IndexEditor v-model="form.wmrWhRemarks" />
            </client-only>
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
import { UpdateWmrWhItem } from '../../../apollo/wmr/mutation';

export default {
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
      rules: {},
      visible: false,
      loading: false,
      errors: [],
    };
  },
  watch: {
    data(value) {
      this.form = { ...value };
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
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            await this.$apollo.mutate({
              mutation: UpdateWmrWhItem,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  isMpr: parseInt(this.form.isMpr, 10),
                  qtyIssued: parseFloat(this.form.qtyIssued),
                  wmrWhRemarks: this.form.wmrWhRemarks,
                },
              },
            });

            this.$message({
              type: 'success',
              message: 'Data has been updated successfully',
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
