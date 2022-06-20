<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="$apollo.loading || loading"
      class="flex flex-col divide-y divide-gray-400 divide-dashed"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
    >
      <el-breadcrumb separator="/" class="mb-4">
        <el-breadcrumb-item :to="{ name: 'index' }" title="Home">
          <client-only>
            <v-icon name="ri-home-4-line" class="remixicons w-15px h-15px" />
          </client-only>
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bom'}">
          LT
        </el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ name: 'bom-lt-id-status', params: { id: wo.idLt, status: wo.status } }"
        >
          WO
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          ITEMS
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex space-x-8 items-center my-4">
          <div class="font-bold text-xl">
            {{ wo.woNo }} <span v-if="wo.stage">[STAGE-{{ wo.stage }}]</span>
          </div>
          <div class="flex-1"></div>
          <div>Issued: {{ wo.issued }}</div>
          <div>Production Dead Line: {{ customer.productionDeadLine }}</div>
          <div class="flex-1"></div>
          <div>
            <el-popover
              placement="left"
              trigger="hover"
            >
              <template #default>
                <table class="plain">
                  <tbody>
                    <tr>
                      <td class="w-6 bg-[#e1bee7]"></td>
                      <td class="pl-2">
                        Validated
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#64b5f6]"></td>
                      <td class="pl-2">
                        Stock
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#ffccbc]"></td>
                      <td class="pl-2">
                        PO Issued
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#a5d6a7]"></td>
                      <td class="pl-2">
                        Coming
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#ffa726]"></td>
                      <td class="pl-2">
                        Draft PO / PR
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#b0bec5]"></td>
                      <td class="pl-2">
                        Hold
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#ef5350]"></td>
                      <td class="pl-2">
                        Cancel
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#ffffff]"></td>
                      <td class="pl-2">
                        Open
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <div slot="reference">
                <client-only>
                  <v-icon
                    name="ri-information-line"
                    class="remixicons w-4 h-4 text-blue-600"
                  />
                </client-only>
              </div>
            </el-popover>
          </div>
        </div>
        <table class="plain mb-4">
          <tbody>
            <tr>
              <td class="w-32">
                Cat. No.
              </td>
              <td>:</td>
              <td class="w-80">
                {{ wo.cat }}
              </td>
              <td class="w-32">
                Budget
              </td>
              <td>:</td>
              <td>USD {{ total.budget | currency }}</td>
              <td class="w-32">
                Refer
              </td>
              <td>:</td>
              <td>{{ wo.refer }}</td>
              <td class="w-32">
                1 USD
              </td>
              <td>:</td>
              <td>SGD {{ wo.sgd | currency }}</td>
            </tr>
            <tr>
              <td>
                Model
              </td>
              <td>:</td>
              <td>{{ wo.model }}</td>
              <td>
                Expense
              </td>
              <td>:</td>
              <td>USD {{ total.totalPricePerWO | currency }}</td>
              <td>
                Status
              </td>
              <td>:</td>
              <td>{{ status[wo.status] }}</td>
              <td>
                1 USD
              </td>
              <td>:</td>
              <td>IDR {{ wo.idr | currency }}</td>
            </tr>
            <tr>
              <td>
                Product Name
              </td>
              <td>:</td>
              <td>
                <p :title="wo.product" class="w-72 truncate">
                  {{ wo.product }}
                </p>
              </td>
              <td>
                Difference
              </td>
              <td>:</td>
              <td>USD {{ total.difference | currency }}</td>
              <td>
                Materials Processed
              </td>
              <td>:</td>
              <td>USD {{ total.totalMaterialsProcessed | currency }}</td>
              <td>
                1 EURO
              </td>
              <td>:</td>
              <td>USD {{ wo.euro | currency }}</td>
            </tr>
            <tr>
              <td>
                PIC
              </td>
              <td>:</td>
              <td>{{ wo.picName }}</td>
              <td>
                Total Production
              </td>
              <td>:</td>
              <td>{{ wo.unit }} Unit</td>
              <td>
                Yet To Purchase
              </td>
              <td>:</td>
              <td>USD {{ total.totalYetToPurchase | currency }}</td>
              <td>
                1 GBP
              </td>
              <td>:</td>
              <td>USD {{ wo.gbp | currency }}</td>
            </tr>
            <tr>
              <td>
                RND In-Charge
              </td>
              <td>:</td>
              <td>{{ wo.rndic }}</td>
              <td>
                Packing / Unit
              </td>
              <td>:</td>
              <td>USD {{ total.totalPackingPerUnit | currency }}</td>
              <td>
                Deviation
              </td>
              <td>:</td>
              <td>USD {{ total.totalDeviation }}</td>
              <td>
                1 MYR
              </td>
              <td>:</td>
              <td>USD {{ wo.myr | currency }}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                Packing / WO
              </td>
              <td>:</td>
              <td>USD {{ total.totalPackingPerWO | currency }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div class="flex my-4 space-x-4 items-center">
          <div
            v-if="$auth.$state.user.isManager"
          >
            <el-button-group>
              <el-button
                type="success"
                :disabled="total.totalValidation !== total.totalItems"
                @click="handleValidateManager(1)"
              >
                <client-only>
                  <v-icon name="ri-check-line" class="remixicons w-4 h-4" />
                </client-only>
                Validate
              </el-button>
              <el-button
                type="success"
                :disabled="total.totalValidation !== total.totalItems"
                @click="handleValidateManager(0)"
              >
                <client-only>
                  <v-icon name="ri-close-line" class="remixicons w-4 h-4" />
                </client-only>
                Invalidate
              </el-button>
            </el-button-group>
          </div>
          <div
            v-if="production.includes($auth.$state.user.department)"
          >
            <el-button-group>
              <el-button
                type="primary"
                :disabled="!multipleSelection.length"
                @click="handleValidate(1)"
              >
                <client-only>
                  <v-icon name="ri-check-line" class="remixicons w-4 h-4" />
                </client-only>
                Validate
              </el-button>
              <el-button
                type="primary"
                :disabled="!multipleSelection.length"
                @click="handleValidate(0)"
              >
                <client-only>
                  <v-icon name="ri-close-line" class="remixicons w-4 h-4" />
                </client-only>
                Invalidate
              </el-button>
            </el-button-group>
          </div>
          <div
            v-if="$auth.$state.user.section === 213"
          >
            <el-button-group>
              <el-button
                type="primary"
                :disabled="!multipleSelection.length"
                @click="handleStock(1)"
              >
                <client-only>
                  <v-icon name="ri-check-line" class="remixicons w-4 h-4" />
                </client-only>
                Stock
              </el-button>
              <el-button
                type="primary"
                :disabled="!multipleSelection.length"
                @click="handleStock(0)"
              >
                <client-only>
                  <v-icon name="ri-close-line" class="remixicons w-4 h-4" />
                </client-only>
                Unstock
              </el-button>
            </el-button-group>
          </div>
          <div
            v-if="production.includes($auth.$state.user.department)"
          >
            <Dropdown
              trigger="custom"
              :visible="visible"
              placement="bottom-start"
              @on-click="handleAddToWmr"
              @on-clickoutside="visible = false"
            >
              <VButtonGroup>
                <VButton type="primary" size="large" icon="md-add" @click="handleAddWmr">
                  WMR
                </VButton>
                <VButton
                  type="primary"
                  size="large"
                  icon="ios-arrow-down"
                  @click="visible = true"
                >
                </VButton>
              </VButtonGroup>
              <DropdownMenu slot="list">
                <Dropdown placement="right-start">
                  <DropdownItem name="a">
                    Add to
                  </DropdownItem>
                </Dropdown>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Dropdown trigger="click" placement="bottom-start" @on-click="handleExport">
            <VButton type="primary" size="large">
              <client-only>
                <v-icon name="ri-share-forward-box-line" class="remixicons w-4 h-4" />
              </client-only>
              Export
              <client-only>
                <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
              </client-only>
            </VButton>
            <DropdownMenu slot="list">
              <Dropdown placement="right-start">
                <DropdownItem name="a">
                  XLS
                </DropdownItem>
              </Dropdown>
            </DropdownMenu>
          </Dropdown>
          <div class="flex-1"></div>
        </div>
      </div>

      <div>
        <el-tabs type="border-card" tab-position="top" class="my-4">
          <el-tab-pane label="BOM">
            <div
              v-for="h in modules"
              :key="h.id"
              class="flex flex-col divide-y divide-gray-400 divide-dashed"
            >
              <div class="flex space-x-4 text-xs font-bold my-4 group">
                <div>{{ h.hid }} {{ h.header }}</div>
                <div
                  v-if="$auth.$state.user.section === 211"
                  class="hidden group-hover:inline-block"
                >
                  <el-tooltip effect="dark" content="Add Items" placement="top">
                    <a @click="addNewItem(h.id)">
                      <client-only>
                        <v-icon name="ri-add-line" class="remixicons w-3.5 h-3.5" />
                      </client-only>
                    </a>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="Edit Module" placement="top">
                    <a @click="editModule(h)">
                      <client-only>
                        <v-icon name="ri-edit-2-line" class="remixicons w-3.5 h-3.5" />
                      </client-only>
                    </a>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="Delete Module" placement="top">
                    <a @click="deleteModule(h)">
                      <client-only>
                        <v-icon name="ri-delete-bin-2-line" class="remixicons w-3.5 h-3.5" />
                      </client-only>
                    </a>
                  </el-tooltip>
                </div>
              </div>
              <index-data-table
                v-if="h.items.length"
                ref="ptable"
                :data="h.items"
                :wo="wo"
                @selection-change="handleSelectionChange"
              />
              <div></div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">MPR ({{ mprs.length }})</span>
            <div
              v-for="mpr in mprs"
              :key="mpr.id"
              class="flex flex-col divide-y divide-gray-400 divide-dashed"
            >
              <div
                class="flex font-bold text-xs my-4"
              >
                <div>MPR No. :</div>
                <div class="flex ml-2 group">
                  <nuxt-link
                    :to="{ name: 'mpr-id', params: { id: mpr.id } }"
                  >
                    {{ mpr.no }}
                  </nuxt-link>
                  <div class="hidden group-hover:inline-block">
                    <el-tooltip effect="dark" content="Open in new tab" placement="top">
                      <a
                        :href="`/mpr/${mpr.id}`"
                        target="_blank"
                        class="ml-2"
                      >
                        <client-only>
                          <v-icon name="ri-external-link-line" class="remixicons w-3.5 h-3.5" />
                        </client-only>
                      </a>
                    </el-tooltip>
                  </div>
                </div>
                <div class="mx-2">
                  &bull;
                </div>
                <div>
                  Requestor: {{ mpr.requestorName }}
                </div>
                <div class="mx-2">
                  &bull;
                </div>
                <div>Approved By MRP: {{ mpr.bomTimestamp }}</div>
              </div>
              <div v-for="mod in mpr.modules" :key="mod.id">
                <div class="font-bold text-xs my-4">
                  {{ mod.moduleChar }} {{ mod.moduleName }}
                </div>
                <index-data-table
                  ref="ptable"
                  :data="mod.items"
                  :wo="wo"
                  :mpr="mpr"
                  @selection-change="handleSelectionChange"
                />
                <div></div>
              </div>
              <index-data-table
                v-if="mpr.items.length"
                ref="ptable"
                :data="mpr.items"
                :wo="wo"
                :mpr="mpr"
                @selection-change="handleSelectionChange"
              />
              <div></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <BomWoItemAdd
      :show="showKeywordDialog"
      :wo="wo"
      :id-header="idHeader"
      @close="closeKeywordDialog"
    />

    <BomWoModuleEdit
      :show="showEditModuleDialog"
      :data="module"
      @close="closeEditModuleDialog"
    />

    <WmrAdd
      :show="showWmrAddDialog"
      @close="closeWmrAddDialog"
    />
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import flatten from 'lodash/flatten';
import { GetOneWO, GenWoXLS } from '../../../apollo/bom/query';
import {
  DeleteWoModule, ValidateWo, ValidateWoItem, StockItem,
} from '../../../apollo/bom/mutation';
import bom from '../../../mixins/bom';

export default {
  mixins: [bom],
  data() {
    return {
      customer: {},
      total: {},
      wo: {},
      modules: {},
      mprs: [],
      errors: [],
      idHeader: 0,
      module: {},
      showKeywordDialog: false,
      showEditModuleDialog: false,
      showWmrAddDialog: false,
      multipleSelection: [],
      loading: false,
      production: [110, 120, 130, 150, 170],
      visible: false,
    };
  },
  methods: {
    highlighter({ row }) {
      return row.colorClass;
    },
    closeKeywordDialog(value) {
      this.showKeywordDialog = value;
    },
    closeEditModuleDialog(value) {
      this.showEditModuleDialog = value;
    },
    closeWmrAddDialog(value) {
      this.showWmrAddDialog = value;
    },
    addNewItem(id) {
      this.idHeader = 0;
      this.idHeader = id;
      this.showKeywordDialog = true;
    },
    editModule(module) {
      this.module = module;
      this.showEditModuleDialog = true;
    },
    deleteModule(selectedModule) {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteWoModule,
          variables: {
            id: parseInt(selectedModule.id, 10),
          },
          update: (store, { data: { deleteWoModule } }) => {
            const cdata = store.readQuery({
              query: GetOneWO,
              variables: {
                idLt: parseInt(this.$route.params.idLt, 10),
                id: parseInt(this.$route.params.id, 10),
              },
            });

            if (deleteWoModule.id) {
              pullAllBy(cdata.getOneWO.wo.modules, [deleteWoModule], 'id');
            } else {
              pullAllBy(cdata.getOneWO.wo.modules, [selectedModule], 'id');
            }

            store.writeQuery({
              query: GetOneWO,
              variables: {
                idLt: parseInt(this.$route.params.idLt, 10),
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteWoModule: selectedModule,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
      }).catch(() => {});
    },
    handleSelectionChange() {
      this.multipleSelection = flatten(this.$refs.ptable.map((v) => [...v.$refs.ctable.selection]));
    },
    clearSelection() {
      this.$refs.ptable.map((v) => {
        v.$refs.ctable.clearSelection();
        return true;
      });
    },
    handleValidate(val) {
      const arr = this.multipleSelection.map((v) => ({
        id: v.id,
        isMpr: v.isMpr,
        validasi: parseInt(val, 10),
      }));

      this.$confirm('You are about to validate the item(s), are you sure?', 'Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: ValidateWoItem,
          variables: {
            input: arr,
          },
          update: (store, { data: { validateWoItem } }) => {
            const cdata = store.readQuery({
              query: GetOneWO,
              variables: {
                idLt: parseInt(this.$route.params.idLt, 10),
                id: parseInt(this.$route.params.id, 10),
              },
            });

            validateWoItem.map((v) => {
              if (v.isMpr && v.idModule) {
                const idx1 = cdata.getOneWO
                  .mpr.mprs.findIndex((e) => e.id === v.mpr.id);
                const idx2 = cdata.getOneWO
                  .mpr.mprs[idx1].modules.findIndex((e) => e.id === v.idModule);
                const idx3 = cdata.getOneWO
                  .mpr.mprs[idx1].modules[idx2].items.findIndex((e) => e.id === v.id);
                cdata.getOneWO.mpr.mprs[idx1].modules[idx2].items[idx3].colorClass = v.colorClass;
                cdata.getOneWO.mpr.mprs[idx1].modules[idx2].items[idx3].__typename = 'MPRITEM';
              } else if (v.isMpr && !v.idModule) {
                const idx1 = cdata.getOneWO
                  .mpr.mprs.findIndex((e) => e.id === v.mpr.id);
                const idx2 = cdata.getOneWO
                  .mpr.mprs[idx1].items.findIndex((e) => e.id === v.id);
                cdata.getOneWO.mpr.mprs[idx1].items[idx2].colorClass = v.colorClass;
                cdata.getOneWO.mpr.mprs[idx1].items[idx2].__typename = 'MPRITEM';
              }

              this.clearSelection();
              return true;
            });

            store.writeQuery({
              query: GetOneWO,
              variables: {
                idLt: parseInt(this.$route.params.idLt, 10),
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been validate successfully',
        });
      }).catch(() => {});
    },
    handleValidateManager(val) {
      this.$confirm('You are about to validate this WO, are you sure?', 'Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: ValidateWo,
          variables: {
            id: parseInt(this.$route.params.id, 10),
            validated: parseInt(val, 10),
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been validate successfully',
        });
      }).catch(() => {});
    },
    handleStock(val) {
      const arr = this.multipleSelection.map((v) => ({
        id: v.id,
        isMpr: v.isMpr,
        bomQtyRqd: v.bomQtyRqd,
        type: parseInt(val, 10),
      }));

      this.$confirm('You are about to stock/unstock item(s), are you sure?', 'Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: StockItem,
          variables: {
            input: arr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Item(s) has been stock/unstock successfully',
        });
      }).catch(() => {});
    },
    handleExport(command) {
      if (command === 'a') this.genWoXLS();
    },
    async genWoXLS() {
      try {
        this.loading = true;
        const { data: { genWoXLS: { status } } } = await this.$apollo.mutate({
          mutation: GenWoXLS,
          variables: {
            id: parseInt(this.$route.params.id, 10),
          },
        });

        if (status) {
          this.loading = false;
          window.open(`/report/${this.wo.woNo}.xlsx`);
        }

        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return true;
      }
    },
    handleAddWmr() {
      this.visible = false;
      this.showWmrAddDialog = true;
    },
    handleAddToWmr(command) {
      console.log(command);
    },
  },
  apollo: {
    getOneWO: {
      query: GetOneWO,
      variables() {
        return {
          idLt: parseInt(this.$route.params.idLt, 10),
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            getOneWO: {
              lt: { customer, wos: [wos], ...lt },
              wo: { modules, ...wo },
              mpr: { mprs },
            },
          } = data;
          this.customer = customer;
          this.total = wos;
          this.lt = lt;
          this.wo = wo;
          this.modules = modules;

          this.mprs = mprs.filter((v) => {
            const { modules: m, items } = v;
            return (m.filter((n) => n.items.length).length) || items.length;
          });
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
