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
            label="PO Issue"
            prop="poIssue"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.poIssue"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Zone">
            <el-select
              v-model="form.poZone"
              filterable
            >
              <el-option
                v-for="item in zones"
                :key="item.zone"
                :label="item.zone"
                :value="item.zone"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Po No."
            prop="poNo"
          >
            <el-input v-model="form.poNo"></el-input>
          </el-form-item>
          <el-form-item
            label="Supplier"
            prop="poSupplier"
            class="col-span-2"
          >
            <el-select
              v-model="form.poSupplier"
              remote
              :remote-method="supplierRemote"
              :loading="supplierLoading"
              filterable
            >
              <el-option
                v-for="item in supplier"
                :key="item.suplierID"
                :label="item.suplierNM"
                :value="item.suplierNM"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Description"
            prop="poDescription"
            class="col-span-2"
          >
            <el-input
              v-model="form.poDescription"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="Currency">
            <el-select
              v-model="form.poKvalue"
              filterable
            >
              <el-option
                v-for="item in currency"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Value"
            prop="poValue"
          >
            <el-input v-model="form.poValue"></el-input>
          </el-form-item>
          <el-form-item
            label="LT Project"
            prop="poLt"
          >
            <el-input v-model="form.poLt"></el-input>
          </el-form-item>
          <el-form-item
            label="Latest Payment"
            prop="poLpayment"
          >
            <el-date-picker
              v-model="form.poLpayment"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="ETA at Labtech"
            prop="poEta"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.poEta"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Remarks"
            prop="poRemarks"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.poRemarks" />
            </client-only>
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
import { CreateOutPo } from '../../apollo/outstandingPo/mutation';
import GetAllSupplier from '../../apollo/supplier/query';
import outp from '../../mixins/outstanding.po';

export default {
  mixins: [outp],
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
      form: {
        poIssue: '',
        poZone: '',
        poNo: '',
        poSupplier: '',
        poDescription: '',
        poKvalue: '',
        poValue: 0,
        poLt: '',
        poLpayment: '',
        poEta: '',
        poRemarks: '',
      },
      rules: {
        poIssue: [{ required: true, message: 'This field is required' }],
        poZone: [{ required: true, message: 'This field is required' }],
        poNo: [{ required: true, message: 'This field is required' }],
        poDescription: [{ required: true, message: 'This field is required' }],
        poSupplier: [{ required: true, message: 'This field is required' }],
      },
      supplier: [],
      supplierLoading: false,
      currency: ['EUR', 'GBP', 'JPY', 'MYR', 'Rp', 'Rupe', 'SGD', 'USD'],
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

            await this.$apollo.mutate({
              mutation: CreateOutPo,
              variables: {
                input: {
                  poIssue: this.form.poIssue,
                  poZone: this.form.poZone,
                  poNo: this.form.poNo,
                  poSupplier: this.form.poSupplier,
                  poDescription: this.form.poDescription,
                  poKvalue: this.form.poKvalue,
                  poValue: parseFloat(this.form.poValue),
                  poLt: this.form.poLt,
                  poLpayment: this.form.poLpayment,
                  poEta: this.form.poEta,
                  poRemarks: this.form.poRemarks,
                },
              },
              update: (store, { data: { createOutPo } }) => {
                const cdata = store.readQuery({
                  query: this.query,
                  variables: this.variables,
                });

                cdata[this.sdata].items.push(createOutPo);
                cdata[this.sdata].items.sort((a, b) => b.poIssue.localeCompare(a.poIssue));

                this.$emit('update', cdata[this.sdata]);

                store.writeQuery({
                  query: this.query,
                  variables: this.variables,
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
    async supplierRemote(key) {
      if (key) {
        this.supplierLoading = true;
        const { data: { getAllSupplier } } = await this.$apollo.query({
          query: GetAllSupplier,
          variables: { key },
          prefetch: false,
          error({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
          },
        });
        this.supplier = getAllSupplier;
        this.supplierLoading = false;
      } else {
        this.supplier = [];
      }
    },
  },
};
</script>
