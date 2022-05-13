<template>
  <div>
    <el-dialog
      title="Edit Item"
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
            label="Material CD"
            prop="idMaterial"
            class="col-span-2"
          >
            <el-input v-model="form.idMaterial"></el-input>
          </el-form-item>
          <el-form-item
            label="Description"
            prop="bomDescription"
            class="col-span-2"
          >
            <el-input v-model="form.bomDescription" type="textarea"></el-input>
          </el-form-item>
          <el-form-item
            label="Specification"
            prop="bomSpecification"
            class="col-span-2"
          >
            <el-input v-model="form.bomSpecification" type="textarea"></el-input>
          </el-form-item>
          <el-form-item
            label="Brand"
            prop="bomBrand"
          >
            <el-input v-model="form.bomBrand"></el-input>
          </el-form-item>
          <el-form-item
            label="Model"
            prop="bomModel"
          >
            <el-input v-model="form.bomModel"></el-input>
          </el-form-item>
          <el-form-item
            label="Qty"
            prop="bomQty"
          >
            <el-input v-model="form.bomQty"></el-input>
          </el-form-item>
          <el-form-item
            label="Unit"
            prop="bomUnit"
          >
            <el-input v-model="form.bomUnit"></el-input>
          </el-form-item>
          <el-form-item
            label="Stock Qty"
            prop="bomQtyStock"
          >
            <el-input v-model="form.bomQtyStock"></el-input>
          </el-form-item>
          <el-form-item
            label="Requirement"
          >
            {{ form.bomQty * (form.isMpr ? mpr.unit : wo.unit) }}
          </el-form-item>
          <el-form-item
            label="ETA"
            prop="bomEta"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.bomEta"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="W/H Qty Received"
            prop="bomQtyRec"
          >
            <el-input v-model="form.bomQtyRec"></el-input>
          </el-form-item>
          <el-form-item
            label="W/H Date Received"
            prop="bomDateRec"
          >
            <el-date-picker
              v-model="form.bomDateRec"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="PO curr/size"
            prop="bomCurrSizeC"
          >
            <el-select v-model="form.bomCurrSizeC" filterable>
              <el-option
                v-for="item in currency"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Value"
            prop="bomCurrSizeV"
          >
            <el-input v-model="form.bomCurrSizeV"></el-input>
          </el-form-item>
          <el-form-item
            label="PO curr/ea"
            prop="bomCurrEaC"
          >
            <el-select v-model="form.bomCurrEaC" filterable>
              <el-option
                v-for="item in currency"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Value"
            prop="bomCurrEaV"
          >
            <el-input v-model="form.bomCurrEaV"></el-input>
          </el-form-item>
          <el-form-item
            label="Supplier"
            prop="bomSupplier"
            class="col-span-2"
          >
            <el-select
              v-model="form.bomSupplier"
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
            label="PO/PR No"
            prop="bomPoNo"
          >
            <el-input v-model="form.bomPoNo"></el-input>
          </el-form-item>
          <el-form-item
            label="PO/PR Date"
            prop="bomPoDate"
          >
            <el-date-picker
              v-model="form.bomPoDate"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Materials Processed (USD)"
            prop="materialsProcessed"
          >
            <el-input v-model="form.materialsProcessed" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            label="Yet to Purchase (USD)"
            prop="yetToPurchase"
          >
            <el-input v-model="form.yetToPurchase" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            label="Remarks"
            prop="bomRemarks"
            class="col-span-2"
          >
            <client-only>
              <IndexEditor v-model="form.bomRemarks" />
            </client-only>
          </el-form-item>
          <el-form-item
            label="Priority"
            prop="priority"
          >
            <el-select
              v-model="form.priority"
              filterable
            >
              <el-option
                v-for="item in priorities"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="ETA Status"
            prop="bomEtaStatus"
          >
            <el-input v-model="form.bomEtaStatus" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            prop="sr"
          >
            <el-checkbox
              v-model="form.sr"
              :true-label="1"
            >
              Special Request
            </el-checkbox>
          </el-form-item>
          <el-form-item
            prop="packing"
          >
            <el-checkbox
              v-model="form.packing"
              :true-label="1"
            >
              Packing
            </el-checkbox>
          </el-form-item>
          <el-form-item
            prop="hold"
          >
            <el-checkbox
              v-model="form.hold"
              :true-label="1"
            >
              Hold
            </el-checkbox>
          </el-form-item>
          <el-form-item
            prop="cancel"
          >
            <el-checkbox
              v-model="form.cancel"
              :true-label="1"
            >
              Cancel
            </el-checkbox>
          </el-form-item>
          <el-form-item
            label="Module"
            class="col-span-2"
          >
            <el-select
              v-if="fromMpr"
              v-model="form.idModule"
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
            <el-select
              v-else
              v-model="form.idHeader"
            >
              <el-option
                v-for="item in modules"
                :key="item.id"
                :label="`${item.hid} ${item.header}`"
                :value="item.id"
              >
                <span>{{ item.hid }} {{ item.header }}</span>
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
          @click="handleUpdate('form')"
        >
          Update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import currency from '../../../mixins/currency';
import { GetOneWO, GetWoModules } from '../../../apollo/bom/query';
import { GetOneMPR, GetMprModules } from '../../../apollo/mpr/query';
import { UpdateItem } from '../../../apollo/bom/mutation';
import GetAllSupplier from '../../../apollo/supplier/query';

export default {
  mixins: [currency],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
    wo: {
      type: Object,
      default: () => ({}),
    },
    mpr: {
      type: Object,
      default: () => ({}),
    },
    fromMpr: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      supplier: [],
      supplierLoading: false,
      modules: [],
      form: {},
      oIdHeader: 0,
      oIdModule: 0,
      rules: {
        bomDescription: [{ required: true, message: 'This field is required' }],
      },
      priorities: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
      ],
      errors: [],
    };
  },
  watch: {
    show(value) {
      this.visible = value;
    },
    data(value) {
      this.form = { ...value };
      this.oIdHeader = value.idHeader;
      this.oIdModule = value.idModule;
    },
  },
  methods: {
    handleCancel() {
      this.$emit('close', false);
    },
    handleUpdate(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const unit = this.form.isMpr ? this.mpr.unit : this.wo.unit;

            await this.$apollo.mutate({
              mutation: UpdateItem,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  idMaterial: parseInt(this.form.idMaterial, 10),
                  bomDescription: this.form.bomDescription,
                  bomSpecification: this.form.bomSpecification,
                  bomModel: this.form.bomModel,
                  bomBrand: this.form.bomBrand,
                  bomQty: parseFloat(this.form.bomQty),
                  bomUnit: this.form.bomUnit,
                  bomQtyStock: parseFloat(this.form.bomQtyStock),
                  bomEta: this.form.bomEta,
                  bomQtyRec: parseFloat(this.form.bomQtyRec),
                  bomDateRec: this.form.bomDateRec,
                  bomCurrSizeC: this.form.bomCurrSizeC,
                  bomCurrSizeV: parseFloat(this.form.bomCurrSizeV),
                  bomCurrEaC: this.form.bomCurrEaC,
                  bomCurrEaV: parseFloat(this.form.bomCurrEaV),
                  bomSupplier: this.form.bomSupplier,
                  bomPoDate: this.form.bomPoDate,
                  bomPoNo: this.form.bomPoNo,
                  bomRemarks: this.form.bomRemarks,
                  priority: this.form.priority,
                  sr: parseInt(this.form.sr, 10),
                  packing: parseInt(this.form.packing, 10),
                  hold: parseInt(this.form.hold, 10),
                  cancel: parseInt(this.form.cancel, 10),
                  idHeader: parseInt(this.form.idHeader, 10),
                  idModule: parseInt(this.form.idModule, 10),
                  isMpr: parseInt(this.form.isMpr, 10),
                  unit: parseInt(unit, 10),
                  euro: parseFloat(this.wo.euro),
                  gbp: parseFloat(this.wo.gbp),
                  myr: parseFloat(this.wo.myr),
                  idr: parseFloat(this.wo.idr),
                  sgd: parseFloat(this.wo.sgd),
                  fromMpr: this.fromMpr,
                },
              },
              update: (store, { data: { updateItem } }) => {
                if (this.fromMpr) {
                  const cdata = store.readQuery({
                    query: GetOneMPR,
                    variables: {
                      id: parseInt(this.$route.params.id, 10),
                    },
                  });

                  if (this.form.idModule && this.form.idModule === this.oIdModule) {
                    const idx1 = cdata.getOneMPR
                      .modules.findIndex((e) => e.id === this.form.idModule);
                    const idx2 = cdata.getOneMPR
                      .modules[idx1].items.findIndex((e) => e.id === updateItem.id);
                    cdata.getOneMPR.modules[idx1].items[idx2] = updateItem;

                    this.$emit('update', { type: 'modules', values: cdata.getOneMPR.modules });
                  } else if (this.form.idModule && this.form.idModule !== this.oIdModule) {
                    const idx1 = cdata.getOneMPR
                      .modules.findIndex((e) => e.id === this.form.idModule);
                    cdata.getOneMPR.modules[idx1].items.push(updateItem);

                    const idx2 = cdata.getOneMPR
                      .modules.findIndex((e) => e.id === this.oIdModule);
                    pullAllBy(cdata.getOneMPR.modules[idx2].items, [updateItem], 'id');

                    this.$emit('update', { type: 'modules', value: cdata.getOneMPR.modules });
                  } else {
                    const index = cdata.getOneMPR.items.findIndex((e) => e.id === this.form.id);
                    cdata.getOneMPR.items[index] = updateItem;

                    this.$emit('update', { type: 'items', values: cdata.getOneMPR.items });
                  }

                  store.writeQuery({
                    query: GetOneMPR,
                    variables: {
                      id: parseInt(this.$route.params.id, 10),
                    },
                    data: cdata,
                  });
                } else {
                  const cdata = store.readQuery({
                    query: GetOneWO,
                    variables: {
                      idLt: parseInt(this.$route.params.idLt, 10),
                      id: parseInt(this.$route.params.id, 10),
                    },
                  });

                  if (
                    this.form.idHeader
                  && this.form.idHeader === this.oIdHeader
                  && !this.form.isMpr) {
                    const idx1 = cdata.getOneWO.wo
                      .modules.findIndex((e) => e.id === this.form.idHeader);
                    const idx2 = cdata.getOneWO.wo
                      .modules[idx1].items.findIndex((e) => e.id === updateItem.id);
                    cdata.getOneWO.wo.modules[idx1].items[idx2] = updateItem;

                    this.$emit('update', { type: 'modules', values: cdata.getOneWO.wo.modules });
                  } else if (
                    this.form.idHeader
                  && this.form.idHeader !== this.oIdHeader
                  && !this.form.isMpr) {
                    const idx1 = cdata.getOneWO.wo
                      .modules.findIndex((e) => e.id === this.form.idHeader);
                    cdata.getOneWO.wo.modules[idx1].items.push(updateItem);

                    const idx2 = cdata.getOneWO.wo
                      .modules.findIndex((e) => e.id === this.oIdHeader);
                    pullAllBy(cdata.getOneWO.wo.modules[idx2].items, [updateItem], 'id');

                    this.$emit('update', { type: 'modules', value: cdata.getOneWO.wo.modules });
                  } else if (this.form.idModule && !this.form.idHeader && this.form.isMpr) {
                    const idx1 = cdata.getOneWO.mpr
                      .mprs.findIndex((e) => e.id === this.form.mpr.id);
                    const idx2 = cdata.getOneWO.mpr
                      .mprs[idx1].modules.findIndex((e) => e.id === this.form.idModule);
                    const idx3 = cdata.getOneWO.mpr
                      .mprs[idx1].modules[idx2].items.findIndex((e) => e.id === this.form.id);
                    cdata.getOneWO.mpr.mprs[idx1].modules[idx2].items[idx3] = updateItem;

                    this.$emit('update', { type: 'mprs', values: cdata.getOneWO.mpr.mprs });
                  } else if (this.form.idModule && this.form.idHeader && this.form.isMpr) {
                    const idx1 = cdata.getOneWO.wo
                      .modules.findIndex((e) => e.id === this.form.idHeader);
                    cdata.getOneWO.wo.modules[idx1].items.push(updateItem);

                    const idx2 = cdata.getOneWO.mpr
                      .mprs.findIndex((e) => e.id === this.form.mpr.id);
                    const idx3 = cdata.getOneWO.mpr
                      .mprs[idx2].modules.findIndex((e) => e.id === this.form.idModule);
                    pullAllBy(cdata.getOneWO.mpr.mprs[idx2].modules[idx3].items, [updateItem], 'id');

                    this.$emit('update', {
                      type: 'both',
                      value: { modules: cdata.getOneWO.wo.modules, mprs: cdata.getOneWO.mpr.mprs },
                    });
                  } else if (!this.form.idModule && this.form.idHeader && this.form.isMpr) {
                    const idx1 = cdata.getOneWO.wo
                      .modules.findIndex((e) => e.id === this.form.idHeader);
                    cdata.getOneWO.wo.modules[idx1].items.push(updateItem);

                    const idx2 = cdata.getOneWO.mpr
                      .mprs.findIndex((e) => e.id === this.form.mpr.id);
                    pullAllBy(cdata.getOneWO.mpr.mprs[idx2].items, [updateItem], 'id');

                    this.$emit('update', {
                      type: 'both',
                      value: { modules: cdata.getOneWO.wo.modules, mprs: cdata.getOneWO.mpr.mprs },
                    });
                  } else {
                    const idx1 = cdata.getOneWO.mpr
                      .mprs.findIndex((e) => e.id === this.form.mpr.id);
                    const idx2 = cdata.getOneWO.mpr
                      .mprs[idx1].items.findIndex((e) => e.id === this.form.id);
                    cdata.getOneWO.mpr.mprs[idx1].items[idx2] = updateItem;

                    this.$emit('update', { type: 'mprs', values: cdata.getOneWO.mpr.mprs });
                  }

                  store.writeQuery({
                    query: GetOneWO,
                    variables: {
                      idLt: parseInt(this.$route.params.idLt, 10),
                      id: parseInt(this.$route.params.id, 10),
                    },
                    data: cdata,
                  });
                }
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
    getWoModules: {
      query: GetWoModules,
      variables() {
        return {
          idWo: parseInt(this.wo.id, 10),
        };
      },
      skip() {
        return this.fromMpr;
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getWoModules } = data;
          this.modules = getWoModules;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
    getMprModules: {
      query: GetMprModules,
      variables() {
        return {
          idMpr: parseInt(this.mpr.id, 10),
        };
      },
      skip() {
        return !this.fromMpr;
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getMprModules } = data;
          this.modules = getMprModules;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
