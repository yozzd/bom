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
            label="PO Issue"
            prop="poIssue"
          >
            <el-date-picker
              v-model="form.poIssue"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 212"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Approval Date"
            prop="approvalDate"
          >
            <el-date-picker
              v-model="form.approvalDate"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 219"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Zone" prop="poZone">
            <el-select
              v-model="form.poZone"
              :disabled="$auth.$state.user.section !== 212"
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
            <el-input
              v-model="form.poNo"
              :disabled="$auth.$state.user.section !== 212"
            ></el-input>
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
              :disabled="$auth.$state.user.section !== 212"
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
              :disabled="$auth.$state.user.section !== 212"
            ></el-input>
          </el-form-item>
          <el-form-item label="Currency" prop="poKvalue">
            <el-select
              v-model="form.poKvalue"
              :disabled="$auth.$state.user.section !== 212"
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
            <el-input
              v-model="form.poValue"
              :disabled="$auth.$state.user.section !== 212"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="PO Value (USD)"
            prop="poValueUsd"
          >
            <el-input
              v-model="form.poValueUsd"
              :disabled="$auth.$state.user.section !== 219"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="PO Paid (USD)"
            prop="poPaidUsd"
          >
            <el-input
              v-model="form.poPaidUsd"
              :disabled="$auth.$state.user.section !== 219"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="LT Project"
            prop="poLt"
          >
            <el-input
              v-model="form.poLt"
              :disabled="$auth.$state.user.section !== 212"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Latest Payment"
            prop="poLpayment"
          >
            <el-date-picker
              v-model="form.poLpayment"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 212"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Production (Production Required) Date"
            prop="poBom"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.poBom"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 211"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Documents to Finance + PI (Complete) Date"
            prop="poAdmin"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.poAdmin"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 219"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Payment Status Date"
            prop="poFinance"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.poFinance"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 331"
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
              :disabled="$auth.$state.user.section !== 212"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Time Arrival"
            prop="poArrival"
          >
            <el-date-picker
              v-model="form.poArrival"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 213"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Status">
            <el-select
              v-model="form.poStatus"
              :disabled="$auth.$state.user.section !== 213"
              filterable
            >
              <el-option
                v-for="item in statusWh"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Complete">
            <el-select
              v-model="form.comp"
              :disabled="$auth.$state.user.section !== 219"
              filterable
            >
              <el-option
                v-for="item in completeStatus"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="HSE">
            <el-select
              v-model="form.hse"
              :disabled="$auth.$state.user.section !== 219"
              filterable
            >
              <el-option
                v-for="item in hseStatus"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="poCancel"
          >
            <el-checkbox
              v-model="form.poCancel"
              :true-label="1"
              :disabled="$auth.$state.user.section !== 212"
            >
              Cancel
            </el-checkbox>
          </el-form-item>
          <el-form-item
            v-if="$auth.$state.user.section === 212"
            label="Remarks"
            prop="poRemarks"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.poRemarks" />
            </client-only>
          </el-form-item>
          <el-form-item
            v-if="$auth.$state.user.section === 211"
            label="Remarks"
            prop="poRemarksBom"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.poRemarksBom" />
            </client-only>
          </el-form-item>
          <el-form-item
            v-if="$auth.$state.user.section === 219"
            label="Remarks"
            prop="poRemarksAdmin"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.poRemarksAdmin" />
            </client-only>
          </el-form-item>
          <el-form-item
            v-if="$auth.$state.user.section === 331"
            label="Remarks"
            prop="poRemarksFinance"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.poRemarksFinance" />
            </client-only>
          </el-form-item>
          <el-form-item
            v-if="$auth.$state.user.section === 213"
            label="Remarks"
            prop="poRemarksWarehouse"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.poRemarksWarehouse" />
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
import { UpdateOutPo } from '../../apollo/outstandingPo/mutation';
import outp from '../../mixins/outstanding.po';

export default {
  mixins: [outp],
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
              mutation: UpdateOutPo,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  poIssue: this.form.poIssue,
                  approvalDate: this.form.approvalDate,
                  poZone: this.form.poZone,
                  poNo: this.form.poNo,
                  poSupplier: this.form.poSupplier,
                  poDescription: this.form.poDescription,
                  poKvalue: this.form.poKvalue,
                  poValue: parseFloat(this.form.poValue),
                  poValueUsd: parseFloat(this.form.poValueUsd),
                  poPaidUsd: parseFloat(this.form.poPaidUsd),
                  poLt: this.form.poLt,
                  poLpayment: this.form.poLpayment,
                  poBom: this.form.poBom,
                  poAdmin: this.form.poAdmin,
                  poFinance: this.form.poFinance,
                  poEta: this.form.poEta,
                  poArrival: this.form.poArrival,
                  poStatus: this.form.poStatus,
                  comp: this.form.comp,
                  hse: this.form.hse,
                  poCancel: parseInt(this.form.poCancel, 10),
                  poRemarks: this.form.poRemarks,
                  poRemarksBom: this.form.poRemarksBom,
                  poRemarksAdmin: this.form.poRemarksAdmin,
                  poRemarksFinance: this.form.poRemarksFinance,
                  poRemarksWarehouse: this.form.poRemarksWarehouse,
                },
              },
              update: (store, { data: { updateOutPo } }) => {
                const cdata = store.readQuery({
                  query: this.query,
                  variables: this.variables,
                });

                const odata = {};

                const index = cdata[this.sdata].items.findIndex((e) => e.id === this.form.id);
                cdata[this.sdata].items[index] = updateOutPo;
                const { items, ...obj } = cdata[this.sdata];
                odata[this.sdata] = obj;
                odata[this.sdata].items = orderBy(items, ['poIssue'], ['desc']);

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
