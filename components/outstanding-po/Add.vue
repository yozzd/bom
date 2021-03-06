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
          <div class="col-span-2 grid grid-cols-3 gap-x-4">
            <el-form-item label="Zone" prop="poZone">
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
              <el-input v-model="form.poNo" @blur="checkPo"></el-input>
            </el-form-item>
            <el-form-item
              label="Proposed Po No."
            >
              <span>{{ proposed }}</span>
              <el-tooltip effect="dark" content="Copy" placement="top">
                <a @click="copyProposed">
                  <client-only>
                    <v-icon name="ri-file-copy-line" class="remixicons w-4 h-4" />
                  </client-only>
                </a>
              </el-tooltip>
            </el-form-item>
          </div>
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
          <el-form-item label="Currency" prop="poKvalue">
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
import orderBy from 'lodash/orderBy';
import { CreateOutPo } from '../../apollo/outstandingPo/mutation';
import { CheckPo } from '../../apollo/outstandingPo/query';
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
    proposed: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        poNo: null,
      },
    };
  },
  watch: {
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    copyProposed() {
      this.form.poNo = null;
      this.form.poNo = this.proposed;
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.loading = false;
      this.errors = [];
      this.$emit('close', false);
    },
    async checkPo() {
      const { data: { checkPo: { status } } } = await this.$apollo.query({
        query: CheckPo,
        variables: { poNo: this.form.poNo },
        prefetch: false,
        error({ graphQLErrors, networkError }) {
          this.errors = graphQLErrors || networkError.result.errors;
        },
      });

      if (!status) {
        this.errors = [{ message: `This Po No '${this.form.poNo}' has been registered, please choose another number` }];
      } else {
        this.errors = [];
      }
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

                const odata = {};

                cdata[this.sdata].items.push(createOutPo);
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
              optimisticResponse: {
                __typename: 'Mutation',
                createOutPo: {
                  __typename: 'item',
                  id: -1,
                  poIssue: this.form.poIssue,
                  poZone: this.form.poZone,
                  poNo: this.form.poNo,
                  poSupplier: this.form.poSupplier,
                  poDescription: this.form.poDescription,
                  poKvalue: this.form.poKvalue,
                  poValue: parseFloat(this.form.poValue),
                  poLt: this.form.poLt,
                  poLpayment: this.form.poLpayment,
                  poBom: null,
                  poAdmin: null,
                  poFinance: null,
                  poEta: this.form.poEta,
                  poArrival: null,
                  poStatus: null,
                  approvalDate: null,
                  comp: null,
                  hse: null,
                  poValueUsd: null,
                  poPaidUsd: null,
                  poBalanceUsd: null,
                  arrivalStatus: null,
                  poRemarks: this.form.poRemarks,
                  poRemarksBom: null,
                  poRemarksAdmin: null,
                  poRemarksFinance: null,
                  poRemarksWarehouse: null,
                  poCancel: null,
                  colorClass: null,
                },
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
