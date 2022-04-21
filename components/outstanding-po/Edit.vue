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
          <el-form-item label="Zone">
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
          <el-form-item label="Currency">
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
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleUpdate('form')"
        >
          Update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetZones } from '../../apollo/outstandingPo/query';
import GetAllSupplier from '../../apollo/supplier/query';

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
      visible: false,
      loading: false,
      form: {
        poIssue: '',
        approvalDate: '',
        poZone: '',
        poNo: '',
        poSupplier: '',
        poDescription: '',
        poKvalue: '',
        poValue: 0,
        poValueUsd: 0,
        poPaidUsd: 0,
      },
      rules: {
        poIssue: [{ required: true, message: 'This field is required' }],
      },
      zones: [],
      supplier: [],
      supplierLoading: false,
      currency: ['EUR', 'GBP', 'JPY', 'MYR', 'Rp', 'Rupe', 'SGD', 'USD'],
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
      this.$emit('close', false);
    },
    handleUpdate(form) {
      console.log(form);
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
  apollo: {
    getZones: {
      query: GetZones,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getZones } = data;
          this.zones = getZones;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
