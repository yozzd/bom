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
          <el-form-item
            label="Date of Requirement"
            prop="dor"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.dor"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Remark"
            prop="remark"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.remark" />
            </client-only>
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
import orderBy from 'lodash/orderBy';
import { CreateMpr } from '../../apollo/mpr/mutation';
import mpr from '../../mixins/mpr';

export default {
  mixins: [mpr],
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
      form: {},
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

            await this.$apollo.mutate({
              mutation: CreateMpr,
              variables: {
                input: {
                  status: this.form.status,
                  woNo: this.form.wo.woNo,
                  model: this.form.model,
                  product: this.form.product,
                  unit: parseInt(this.form.unit, 10),
                  category: parseInt(this.form.category, 10),
                  dor: this.form.dor,
                  remark: this.form.remark,
                  idWo: this.form.wo.id,
                  idLt: this.form.wo.lt.id,
                  ltNo: this.form.wo.lt.ltNo,
                },
              },
              update: (store, { data: { createMpr } }) => {
                const cdata = store.readQuery({
                  query: this.query,
                  variables: this.variables,
                });

                const odata = {};

                cdata[this.sdata].push(createMpr);
                odata[this.sdata] = orderBy(cdata[this.sdata], ['category', 'dor'], ['desc', 'desc']);

                this.$emit('update', odata[this.sdata]);

                store.writeQuery({
                  query: this.query,
                  variables: this.variables,
                  data: odata,
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
