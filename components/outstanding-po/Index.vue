<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div class="flex flex-col divide-y divide-gray-400 divide-dashed">
      <el-breadcrumb separator="/" class="mb-4">
        <el-breadcrumb-item :to="{ name: 'index' }" title="Home">
          <client-only>
            <v-icon name="ri-home-4-line" class="remixicons w-15px h-15px" />
          </client-only>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          OUTSTANDING PO
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex my-4 space-x-4 items-center">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              <client-only>
                <v-icon name="ri-filter-line" class="remixicons w-4 h-4" />
              </client-only>
              Filter
              <client-only>
                <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
              </client-only>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                By Category
              </el-dropdown-item>
              <el-dropdown-item command="b">
                By Status
              </el-dropdown-item>
              <el-dropdown-item command="c">
                By Zone
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="$auth.$state.user.section === 212"
            type="primary"
            :disabled="!tableData.length"
            @click="showAdd"
          >
            <client-only>
              <v-icon name="ri-add-line" class="remixicons w-4 h-4" />
            </client-only>
            Add
          </el-button>
          <el-button
            v-if="$auth.$state.user.section === 212"
            type="danger"
            :disabled="!multipleSelection.length"
            @click="handleDelete"
          >
            <client-only>
              <v-icon name="ri-delete-bin-2-line" class="remixicons w-4 h-4" />
            </client-only>
            Delete
          </el-button>
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
                      <td class="bg-[#e53935]"></td>
                      <td class="pl-2">
                        Cancel
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#a5d6a7]"></td>
                      <td class="pl-2">
                        Close
                      </td>
                    </tr>
                    <tr>
                      <td class="w-6 bg-[#64b5f6]"></td>
                      <td class="pl-2">
                        Complete
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#fff176]"></td>
                      <td class="pl-2">
                        Paid by Finance
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#f48fb1]"></td>
                      <td class="pl-2">
                        Partial
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#ffffff]"></td>
                      <td class="pl-2">
                        Open / Unpaid
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
          <div class="w-64">
            <el-input
              v-model="search"
              placeholder="Search"
              clearable
              :disabled="!tableData.length"
            />
          </div>
        </div>
      </div>

      <div v-if="tableData.length">
        <div class="flex flex-col space-y-4 my-4">
          <div class="font-bold text-xl">
            {{ header }}
          </div>
          <div class="w-1/2">
            <table class="plain">
              <tbody>
                <tr>
                  <td>
                    Total PO Value
                  </td>
                  <td>:</td>
                  <td>
                    USD {{ totals.totalPoValueUsd | currency }}
                  </td>
                  <td>
                    Total PO Paid
                  </td>
                  <td>:</td>
                  <td>USD {{ totals.totalPoPaidUsd | currency }}</td>
                  <td>
                    Total PO Balance
                  </td>
                  <td>:</td>
                  <td>USD {{ totals.totalPoBalanceUsd | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="my-4">
          <el-table
            v-loading="$apollo.loading"
            element-loading-text="Loading..."
            element-loading-spinner="el-icon-loading"
            :data="tableData"
            :row-class-name="highlighter"
            size="mini"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="$auth.$state.user.section === 212"
              type="selection"
              width="40"
              align="center"
              fixed
            ></el-table-column>
            <el-table-column type="index" align="center" width="50" fixed></el-table-column>
            <el-table-column
              label="PO Issue"
              prop="poIssue"
              align="center"
              width="90"
              fixed
            ></el-table-column>
            <el-table-column
              label="Aproval Date"
              prop="approvalDate"
              align="center"
              width="90"
              fixed
            ></el-table-column>
            <el-table-column
              label="Zone"
              prop="poZone"
              align="center"
              width="50"
              fixed
            ></el-table-column>
            <el-table-column
              label="PO No."
              align="center"
              width="70"
              fixed
            >
              <template slot-scope="scope">
                <a
                  v-if="users.includes($auth.$state.user.section)"
                  @click="showEdit(scope.row)"
                >
                  {{ scope.row.poNo }}
                </a>
                <div v-else>
                  {{ scope.row.poNo }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="Supplier"
              width="160"
              :show-overflow-tooltip="true"
              fixed
            >
              <template slot-scope="scope">
                {{ scope.row.poSupplier }}
              </template>
            </el-table-column>
            <el-table-column
              label="Description"
              width="160"
              :show-overflow-tooltip="true"
              fixed
            >
              <template slot-scope="scope">
                {{ scope.row.poDescription }}
              </template>
            </el-table-column>
            <el-table-column label="PO Value" align="right" width="100">
              <template slot-scope="scope">
                {{ scope.row.poKvalue }} {{ scope.row.poValue | currency }}
              </template>
            </el-table-column>
            <el-table-column label="PO Value (USD)" align="right" width="100">
              <template slot-scope="scope">
                USD {{ scope.row.poValueUsd | currency }}
              </template>
            </el-table-column>
            <el-table-column label="PO Paid (USD)" align="right" width="100">
              <template slot-scope="scope">
                USD {{ scope.row.poPaidUsd | currency }}
              </template>
            </el-table-column>
            <el-table-column align="right" width="100">
              <template slot="header">
                <p title="PO Balance (USD)" class="truncate">
                  PO Balance (USD)
                </p>
              </template>
              <template slot-scope="scope">
                USD {{ scope.row.poBalanceUsd | currency }}
              </template>
            </el-table-column>
            <el-table-column
              label="LT Project"
              width="80"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.poLt }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="90">
              <template slot="header">
                <p title="Latest Payment" class="truncate">
                  Latest Payment
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poLpayment }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="110">
              <template slot="header">
                <p title="Production (Production Required)" class="truncate">
                  Production (Production Required)
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poBom }}
                <el-popover
                  v-if="scope.row.poRemarksBom"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksBom"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" width="110">
              <template slot="header">
                <p title="Documents to Finance + PI (Complete)" class="truncate">
                  Documents to Finance + PI (Complete)
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poAdmin }}
                <el-popover
                  v-if="scope.row.poRemarksAdmin"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksAdmin"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" width="110">
              <template slot="header">
                <p title="Payment Status" class="truncate">
                  Payment Status
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poFinance }}
                <el-popover
                  v-if="scope.row.poRemarksFinance"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksFinance"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" width="90">
              <template slot="header">
                <p title="ETA at Labtech" class="truncate">
                  ETA at Labtech
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poEta }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="110">
              <template slot="header">
                <p title="Time Arrival" class="truncate">
                  Time Arrival
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poArrival }}
                <el-popover
                  v-if="scope.row.poRemarksWarehouse"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksWarehouse"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" width="90">
              <template slot="header">
                <p title="Arrival Status" class="truncate">
                  Arrival Status
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.arrivalStatus }}
              </template>
            </el-table-column>
            <el-table-column
              label="Complete"
              prop="comp"
              align="center"
              width="70"
            ></el-table-column>
            <el-table-column
              label="HSE"
              prop="hse"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column label="Remarks" align="center" width="70">
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.poRemarks"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarks"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="" min-width="50"></el-table-column>
          </el-table>
        </div>
        <div>
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

      <div v-else>
        <div class="my-4">
          <el-alert
            title="Please select Filter first!"
            type="info"
            :closable="false"
            class="border border-gray-200"
          >
          </el-alert>
        </div>
      </div>
    </div>

    <el-dialog
      title="Filter By Category"
      :visible.sync="showFilterByCategoryDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item prop="category">
          <el-radio-group v-model="form.category">
            <el-radio
              v-for="(v, k) in categories"
              :key="k"
              :label="v"
              class="blk"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showFilterByCategoryDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilterByCategory('form')"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Filter By Status"
      :visible.sync="showFilterByStatusDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="(v, k) in status"
              :key="k"
              :label="v"
              class="blk"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showFilterByStatusDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilterByStatus('form')"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Filter By Zones"
      :visible.sync="showFilterByZonesDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item prop="zone">
          <el-radio-group
            v-model="form.zone"
            class="grid grid-cols-4"
          >
            <div
              v-for="(v, k) in zones"
              :key="k"
            >
              <el-radio
                :label="v.zone"
                class="blk"
              ></el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showFilterByZonesDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilterByZones('form')"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>

    <OutstandingPoAdd
      :show="showAddDialog"
      :query="query"
      :variables="variables"
      :sdata="sdata"
      :recommend="recommend"
      @close="closeAddDialog"
      @update="updateList"
    />

    <OutstandingPoEdit
      :data="dataEdit"
      :show="showEditDialog"
      @close="closeEditDialog"
    />
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import outp from '../../mixins/outstanding.po';
import {
  GetAllOutstandingPoByCategory,
  GetAllOutstandingPoByStatus,
  GetAllOutstandingPoByZones,
  GetRecommendPoNo,
} from '../../apollo/outstandingPo/query';
import { DeleteOutPo } from '../../apollo/outstandingPo/mutation';

export default {
  mixins: [table, outp],
  data() {
    return {
      users: [211, 212, 213, 219, 331],
      showFilterByCategoryDialog: false,
      showFilterByStatusDialog: false,
      showFilterByZonesDialog: false,
      loading: false,
      form: {},
      header: '',
      totals: {},
      rules: {
        category: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
        status: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
        zone: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
      },
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['poNo', 'poSupplier', 'poDescription'],
        storeFields: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'poStatus', 'approvalDate',
          'comp', 'hse', 'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
          'arrivalStatus', 'poRemarks', 'poRemarksBom', 'poRemarksAdmin',
          'poRemarksFinance', 'poRemarksWarehouse', 'poCancel', 'colorClass',
        ],
      }),
      query: {},
      variables: {},
      sdata: '',
      showAddDialog: false,
      dataEdit: {},
      showEditDialog: false,
      multipleSelection: [],
      cachedArr: [],
      recommend: '',
    };
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') this.showFilterByCategory();
      if (command === 'b') this.showFilterByStatus();
      if (command === 'c') this.showFilterByZones();
    },
    showFilterByCategory() {
      this.showFilterByCategoryDialog = true;
    },
    handleFilterByCategory(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const category = parseInt(
            (Object.keys(this.categories).find((key) => this.categories[key] === this.form.category)
            ), 10,
          ) + 1;

          const { data: { getAllOutstandingPoByCategory } } = await this.$apollo.query({
            query: GetAllOutstandingPoByCategory,
            variables: { category },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.items = {};
          const { items, totals: [totals] } = getAllOutstandingPoByCategory;
          this.items = items;
          this.totals = totals;
          this.header = this.form.category;

          this.query = GetAllOutstandingPoByCategory;
          this.variables = { category };
          this.sdata = 'getAllOutstandingPoByCategory';

          this.page = 1;
          this.pageSize = 10;

          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);

          this.loading = false;
          this.showFilterByCategoryDialog = false;
        }
      });
    },
    showFilterByStatus() {
      this.showFilterByStatusDialog = true;
    },
    handleFilterByStatus(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const status = parseInt(
            (Object.keys(this.status).find((key) => this.status[key] === this.form.status)
            ), 10,
          );

          const { data: { getAllOutstandingPoByStatus } } = await this.$apollo.query({
            query: GetAllOutstandingPoByStatus,
            variables: { status },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.items = {};
          const { items, totals: [totals] } = getAllOutstandingPoByStatus;
          this.items = items;
          this.totals = totals;
          this.header = `Status: ${this.form.status}`;

          this.query = GetAllOutstandingPoByStatus;
          this.variables = { status };
          this.sdata = 'getAllOutstandingPoByStatus';

          this.page = 1;
          this.pageSize = 10;

          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);

          this.loading = false;
          this.showFilterByStatusDialog = false;
        }
      });
    },
    showFilterByZones() {
      this.showFilterByZonesDialog = true;
    },
    handleFilterByZones(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.loading = true;

          const { data: { getAllOutstandingPoByZones } } = await this.$apollo.query({
            query: GetAllOutstandingPoByZones,
            variables: { zone: this.form.zone },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.items = {};
          const { items, totals: [totals] } = getAllOutstandingPoByZones;
          this.items = items;
          this.totals = totals;
          this.header = `Zone: ${this.form.zone}`;

          this.query = GetAllOutstandingPoByZones;
          this.variables = { zone: this.form.zone };
          this.sdata = 'getAllOutstandingPoByZones';

          this.page = 1;
          this.pageSize = 10;

          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);

          this.loading = false;
          this.showFilterByZonesDialog = false;
        }
      });
    },
    highlighter({ row }) {
      return row.colorClass;
    },
    showAdd() {
      this.showAddDialog = true;
    },
    closeAddDialog(value) {
      this.showAddDialog = value;
    },
    showEdit(row) {
      this.dataEdit = row;
      this.showEditDialog = true;
    },
    closeEditDialog(value) {
      this.showEditDialog = value;
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({ id: v.id }));
      this.cachedArr = arr;
    },
    handleDelete() {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteOutPo,
          variables: {
            input: this.multipleSelection,
          },
          update: (store, { data: { deleteOutPo } }) => {
            const cdata = store.readQuery({
              query: this.query,
              variables: this.variables,
            });

            pullAllBy(cdata[this.sdata].items, deleteOutPo, 'id');
            this.items = {};
            const { items, totals: [totals] } = cdata[this.sdata];
            this.items = items;
            this.totals = totals;

            store.writeQuery({
              query: this.query,
              variables: this.variables,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteOutPo: this.cachedArr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
      }).catch(() => {});
    },
    updateList(value) {
      this.items = {};
      const { items, totals: [totals] } = value;
      this.items = items;
      this.totals = totals;
    },
  },
  apollo: {
    getRecommendPoNo: {
      query: GetRecommendPoNo,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getRecommendPoNo: [{ poNo }] } = data;
          console.log(poNo);
          this.recommend = poNo;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
