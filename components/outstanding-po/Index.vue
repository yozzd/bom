<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div class="flex flex-col divide-y divide-gray-400 divide-dashed">
      <el-breadcrumb separator="/" class="mb-4">
        <el-breadcrumb-item :to="{ name: 'index' }">
          <outline-home-icon class="heroicons w-15px h-15px" />
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          OUTSTANDING PO
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex my-4 space-x-8 items-center">
          <el-button
            type="primary"
            @click="showFilterByCategory"
          >
            <outline-filter-icon class="heroicons w-4 h-4" />
            Filter By Category
          </el-button>
          <el-button
            type="primary"
            @click="showFilterByStatus"
          >
            <outline-filter-icon class="heroicons w-4 h-4" />
            Filter By Status
          </el-button>
          <div>
            By Zones
          </div>
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
                      <td class="w-6 bg-[#64b5f6]"></td>
                      <td class="pl-2">
                        Complete
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#f48fb1]"></td>
                      <td class="pl-2">
                        Partial
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#a5d6a7]"></td>
                      <td class="pl-2">
                        Close
                      </td>
                    </tr>
                    <tr>
                      <td class="bg-[#fff176]"></td>
                      <td class="pl-2">
                        Paid by Finance
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
              <outline-information-circle-icon
                slot="reference"
                class="heroicons w-4 h-4 text-blue-600"
              />
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
        <div class="my-4 font-bold text-xl">
          {{ header }}
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
          >
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
              prop="poNo"
              align="center"
              width="70"
              fixed
            ></el-table-column>
            <el-table-column label="Supplier" width="160" fixed>
              <template slot-scope="scope">
                <p :title="scope.row.poSupplier" class="truncate">
                  {{ scope.row.poSupplier }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="Description" width="160" fixed>
              <template slot-scope="scope">
                <p :title="scope.row.poDescription" class="truncate">
                  {{ scope.row.poDescription }}
                </p>
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
            <el-table-column label="LT Project" width="80">
              <template slot-scope="scope">
                <p :title="scope.row.poLt" class="truncate">
                  {{ scope.row.poLt }}
                </p>
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
                  placement="left"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksBom"></div>
                  </template>
                  <outline-chat-icon
                    slot="reference"
                    class="heroicons w-4 h-4"
                  />
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
                  placement="left"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksAdmin"></div>
                  </template>
                  <outline-chat-icon
                    slot="reference"
                    class="heroicons w-4 h-4"
                  />
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
                  placement="left"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksFinance"></div>
                  </template>
                  <outline-chat-icon
                    slot="reference"
                    class="heroicons w-4 h-4"
                  />
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
                  placement="left"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarksWarehouse"></div>
                  </template>
                  <outline-chat-icon
                    slot="reference"
                    class="heroicons w-4 h-4"
                  />
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
                  placement="left"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.poRemarks"></div>
                  </template>
                  <outline-chat-icon
                    slot="reference"
                    class="heroicons w-4 h-4"
                  />
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
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import outp from '../../mixins/outstanding.po';
import { GetAllOutstandingPoByCategory, GetAllOutstandingPoByStatus } from '../../apollo/outstandingPo/query';

export default {
  mixins: [table, outp],
  data() {
    return {
      showFilterByCategoryDialog: false,
      showFilterByStatusDialog: false,
      loading: false,
      form: {},
      header: '',
      rules: {
        category: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
        status: [
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
          'poRemarksFinance', 'poRemarksWarehouse', 'colorClass',
        ],
      }),
    };
  },
  methods: {
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
          this.items = getAllOutstandingPoByCategory;
          this.header = this.form.category;

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
          this.items = getAllOutstandingPoByStatus;
          this.header = this.form.category;

          this.page = 1;
          this.pageSize = 10;

          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);

          this.loading = false;
          this.showFilterByStatusDialog = false;
        }
      });
    },
    highlighter({ row }) {
      return row.colorClass;
    },
  },
};
</script>
