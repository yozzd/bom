<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="loading"
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
        <el-breadcrumb-item>
          WO
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex space-x-4 items-center my-4">
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
        </div>
      </div>

      <div>
        <div class="flex space-x-4 items-center my-4">
          <div class="font-bold text-xl">
            {{ lt.ltNo }} &bull; {{ lt.customer.name }}
          </div>
          <div class="flex-1"></div>
          <div class="w-64">
            <el-input
              v-model="search"
              placeholder="Search"
              clearable
            />
          </div>
        </div>

        <div class="w-1/3 mb-4">
          <table class="plain">
            <tbody>
              <tr>
                <td>
                  Total Budget
                </td>
                <td>:</td>
                <td>
                  USD {{ lt.totalBudget | currency }}
                </td>
                <td>
                  Total Price / WO
                </td>
                <td>:</td>
                <td>USD {{ lt.totalPrice | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <el-table
          v-loading="$apollo.loading"
          element-loading-text="Loading..."
          element-loading-spinner="el-icon-loading"
          :data="tableData"
          size="mini"
          border
          class="mb-4"
        >
          <el-table-column type="index" align="center" width="50" fixed></el-table-column>
          <el-table-column
            label="WO"
            width="160"
            fixed
            :show-overflow-tooltip="true"
            class-name="relative group"
          >
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="PIC not set!" placement="top">
                <client-only>
                  <v-icon
                    v-if="scope.row.pic===0 && $auth.$state.user.section === 211"
                    name="ri-error-warning-line"
                    fill="#fbbf24"
                    class="remixicons w-4 h-4"
                  />
                </client-only>
              </el-tooltip>
              <nuxt-link
                :to="{
                  name: 'bom-wo-idLt-id', params: { idLt: $route.params.id, id: scope.row.id }
                }"
              >
                {{ scope.row.woNo }}
                <span v-if="scope.row.stage">[STAGE-{{ scope.row.stage }}]</span>
              </nuxt-link>
              <div class="hidden group-hover:inline-block absolute top-1 right-0">
                <el-tooltip effect="dark" content="Open in new tab" placement="top">
                  <a
                    :href="`/bom/wo/${$route.params.id}/${scope.row.id}`"
                    target="_blank"
                  >
                    <client-only>
                      <v-icon name="ri-external-link-line" class="remixicons w-4 h-4" />
                    </client-only>
                  </a>
                </el-tooltip>
                <el-tooltip effect="dark" content="Edit" placement="top">
                  <a
                    v-if="$auth.$state.user.section === 211"
                    @click="editWo(scope.row)"
                  >
                    <client-only>
                      <v-icon name="ri-edit-2-line" class="remixicons w-3.5 h-3.5" />
                    </client-only>
                  </a>
                </el-tooltip>
                <el-tooltip effect="dark" content="Clone" placement="top">
                  <a
                    v-if="$auth.$state.user.section === 211"
                    @click="cloneWo(scope.row.id)"
                  >
                    <client-only>
                      <v-icon name="ri-file-copy-line" class="remixicons w-4 h-4" />
                    </client-only>
                  </a>
                </el-tooltip>
                <el-tooltip effect="dark" content="Delete" placement="top">
                  <a
                    v-if="$auth.$state.user.section === 211"
                    @click="deleteWo(scope.row)"
                  >
                    <client-only>
                      <v-icon name="ri-delete-bin-2-line" class="remixicons w-4 h-4" />
                    </client-only>
                  </a>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Model" width="140">
            <template slot-scope="scope">
              <p :title="scope.row.model" class="truncate">
                {{ scope.row.model }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="Product Name"
            width="200"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.product }}
            </template>
          </el-table-column>
          <el-table-column prop="issued" label="Issued" align="center" width="90"></el-table-column>
          <el-table-column
            label="Incoming"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <div class="flex items-center">
                <div class="flex-1">
                  {{ scope.row.totalIncoming }} / {{ scope.row.totalIncomingItems }}
                </div>
                <div>
                  <el-popover
                    trigger="hover"
                    placement="top"
                  >
                    <template #default>
                      <table class="plain">
                        <tbody>
                          <tr>
                            <td>BOM</td>
                            <td>:</td>
                            <td>{{ scope.row.bomIncoming }}</td>
                          </tr>
                          <tr>
                            <td>MPR</td>
                            <td>:</td>
                            <td>{{ scope.row.mprIncoming }}</td>
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
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="90"
          >
            <template slot="header">
              <p title="% Incoming" class="truncate">
                % Incoming
              </p>
            </template>
            <template slot-scope="scope">
              <div class="flex items-center">
                <div class="flex-1">
                  {{ scope.row.percentIncoming | currency }}%
                </div>
                <div>
                  <el-popover
                    trigger="hover"
                    placement="top"
                  >
                    <template #default>
                      <table class="plain">
                        <tbody>
                          <tr>
                            <td>BOM</td>
                            <td>:</td>
                            <td>{{ scope.row.bomPercentIncoming | currency }}%</td>
                          </tr>
                          <tr>
                            <td>MPR</td>
                            <td>:</td>
                            <td>{{ scope.row.mprPercentIncoming | currency }}%</td>
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
            </template>
          </el-table-column>
          <el-table-column
            label="Validation"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <div class="flex items-center">
                <div class="flex-1">
                  {{ scope.row.totalValidation }} / {{ scope.row.totalItems }}
                </div>
                <div>
                  <el-popover
                    trigger="hover"
                    placement="top"
                  >
                    <template #default>
                      <table class="plain">
                        <tbody>
                          <tr>
                            <td>BOM</td>
                            <td>:</td>
                            <td>{{ scope.row.bomValidation }}</td>
                          </tr>
                          <tr>
                            <td>MPR</td>
                            <td>:</td>
                            <td>{{ scope.row.mprValidation }}</td>
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
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="90"
          >
            <template slot="header">
              <p title="% Validation" class="truncate">
                % Validation
              </p>
            </template>
            <template slot-scope="scope">
              <div class="flex items-center">
                <div class="flex-1">
                  {{ scope.row.percentValidation | currency }}%
                </div>
                <div>
                  <el-popover
                    trigger="hover"
                    placement="top"
                  >
                    <template #default>
                      <table class="plain">
                        <tbody>
                          <tr>
                            <td>BOM</td>
                            <td>:</td>
                            <td>{{ scope.row.bomPercentValidation | currency }}%</td>
                          </tr>
                          <tr>
                            <td>MPR</td>
                            <td>:</td>
                            <td>{{ scope.row.mprPercentValidation | currency }}%</td>
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
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="Unit" align="center" width="50"></el-table-column>
          <el-table-column prop="totalMpr" label="MPR" align="center" width="50"></el-table-column>
          <el-table-column
            label="Budget (USD)"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.budget | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Price / Unit (USD)" class="truncate">
                Price / Unit (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.totalPricePerUnit | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Price / WO (USD)" class="truncate">
                Price / WO (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.totalPricePerWO | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Difference (USD)" class="truncate">
                Difference (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.difference | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Yet To Purchase (USD)" class="truncate">
                Yet To Purchase (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.totalYetToPurchase | currency }}
            </template>
          </el-table-column>
          <el-table-column
            label="Deviation (USD)"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.totalDeviation | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Packing / Unit (USD)" class="truncate">
                Packing / Unit (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.totalPackingPerUnit | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Packing / WO (USD)" class="truncate">
                Packing / WO (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.totalPackingPerWO | currency }}
            </template>
          </el-table-column>
          <el-table-column label="" min-width="50"></el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="page"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :total="search ? tableData.length : items.length"
          :pager-count="pagerCount"
          layout="slot, sizes, prev, pager, next"
          class="flex justify-end"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #default>
            <span class="font-normal">Total {{ tableData.length }}/{{ items.length }}</span>
          </template>
        </el-pagination>
      </div>
    </div>

    <BomWoClone
      :id="idWo"
      :show="showCloneDialog"
      @close="closeCloneDialog"
    />

    <BomLtStatusEdit
      :data="wo"
      :show="showEditDialog"
      @close="closeEditDialog"
    />
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import table from '../../../../mixins/table';
import { GetOneLT, GenLtXLS } from '../../../../apollo/bom/query';
import { DeleteWo } from '../../../../apollo/bom/mutation';

export default {
  mixins: [table],
  data() {
    return {
      lt: { customer: {} },
      showCloneDialog: false,
      showEditDialog: false,
      idWo: null,
      wo: {},
      loading: false,
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['woNo', 'model', 'product'],
        storeFields: [
          'id', 'woNo', 'model', 'product', 'issued', 'unit', 'budget', 'stage',
          'cat', 'pic', 'rndic', 'refer', 'status',
          'totalIncoming', 'totalValidation', 'totalItems', 'percentIncoming',
          'percentValidation', 'totalPricePerUnit', 'totalPricePerWO',
          'difference', 'totalYetToPurchase', 'totalDeviation',
          'totalPackingPerUnit', 'totalPackingPerWO',
        ],
      }),
    };
  },
  methods: {
    closeEditDialog(value) {
      this.showEditDialog = value;
    },
    closeCloneDialog(value) {
      this.showCloneDialog = value;
    },
    editWo(row) {
      this.wo = row;
      this.showEditDialog = true;
    },
    cloneWo(id) {
      this.idWo = id;
      this.showCloneDialog = true;
    },
    deleteWo(row) {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteWo,
          variables: {
            id: parseInt(row.id, 10),
          },
          update: (store, { data: { deleteWo } }) => {
            const cdata = store.readQuery({
              query: GetOneLT,
              variables: {
                id: parseInt(this.$route.params.id, 10),
                status: parseInt(this.$route.params.status, 10),
              },
            });

            if (deleteWo.id) {
              pullAllBy(cdata.getOneLT.wos, [deleteWo], 'id');
            } else {
              pullAllBy(cdata.getOneLT.wos, [row], 'id');
            }

            store.writeQuery({
              query: GetOneLT,
              variables: {
                id: parseInt(this.$route.params.id, 10),
                status: parseInt(this.$route.params.status, 10),
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteWo: row,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
      }).catch(() => {});
    },
    handleExport(command) {
      if (command === 'a') this.genLtXLS();
    },
    async genLtXLS() {
      try {
        this.loading = true;
        const { data: { genLtXLS: { status } } } = await this.$apollo.mutate({
          mutation: GenLtXLS,
          variables: {
            id: parseInt(this.$route.params.id, 10),
            status: parseInt(this.$route.params.status, 10),
          },
        });

        if (status) {
          this.loading = false;
          window.open(`/report/${this.lt.ltNo}.xlsx`);
        }

        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return true;
      }
    },
  },
  apollo: {
    getOneLT: {
      query: GetOneLT,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
          status: parseInt(this.$route.params.status, 10),
        };
      },
      prefetch: false,
      async result({ data, loading }) {
        if (!loading) {
          const {
            getOneLT: { wos, ...lt },
          } = data;

          this.lt = lt;
          this.items = wos;

          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
