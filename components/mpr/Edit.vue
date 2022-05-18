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
          <div class="col-span-2 grid grid-cols-3 gap-x-4">
            <el-form-item prop="packing">
              <el-checkbox
                v-model="form.packing"
                :true-label="1"
              >
                Packing
              </el-checkbox>
            </el-form-item>
            <el-form-item prop="hold">
              <el-checkbox
                v-model="form.hold"
                :true-label="1"
                disabled
              >
                Hold
              </el-checkbox>
            </el-form-item>
            <el-form-item prop="cancel">
              <el-checkbox
                v-model="form.cancel"
                :true-label="1"
                disabled
              >
                Cancel
              </el-checkbox>
            </el-form-item>
          </div>
          <el-form-item label="Attachment">
            <el-upload
              ref="upload"
              action=""
              :on-change="handleOnChange"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button
                slot="trigger"
                type="primary"
                size="small"
              >
                Browse
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="remove">
            <el-checkbox
              v-model="form.remAttach"
              :true-label="1"
            >
              Remove Attachment
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
          @click="handleUpdate()"
        >
          Update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy';
import mpr from '../../mixins/mpr';
import { UpdateMpr } from '../../apollo/mpr/mutation';

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
      file: null,
      fileList: [],
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
      this.fileList = [];
      this.errors = [];
      this.$emit('close', false);
    },
    handleOnChange({ raw }) {
      this.file = raw;
    },
    handleUpdate() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            await this.$apollo.mutate({
              mutation: UpdateMpr,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  status: this.form.status,
                  woNo: this.form.woNo,
                  model: this.form.model,
                  product: this.form.product,
                  unit: parseInt(this.form.unit, 10),
                  category: parseInt(this.form.category, 10),
                  dor: this.form.dor,
                  remark: this.form.remark,
                  packing: parseInt(this.form.packing, 10) || 0,
                  hold: parseInt(this.form.hold, 10) || 0,
                  cancel: parseInt(this.form.cancel, 10) || 0,
                  idLt: this.form.wo.idLt,
                  file: this.file,
                  remAttach: parseInt(this.form.remAttach, 10) || 0,
                },
              },
              update: (store, { data: { updateMpr } }) => {
                const cdata = store.readQuery({
                  query: this.query,
                  variables: this.variables,
                });

                const odata = {};

                const index = cdata[this.sdata].findIndex((e) => e.id === this.form.id);
                cdata[this.sdata][index] = updateMpr;
                odata[this.sdata] = orderBy(cdata[this.sdata], ['category', 'dor'], ['desc', 'desc']);

                this.$emit('update', odata[this.sdata]);

                store.writeQuery({
                  query: this.query,
                  variables: this.variables,
                  data: odata,
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateMpr: this.form,
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
