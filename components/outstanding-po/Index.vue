<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors"
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
        <div class="flex my-4">
          <el-button
            type="primary"
            @click="showFilter"
          >
            <outline-filter-icon class="heroicons w-4 h-4" />
            Filter
          </el-button>
          <div class="flex-1"></div>
          <div class="w-64">
            <el-input
              v-model="search"
              placeholder="Search"
              clearable
            />
          </div>
        </div>
      </div>

      <div>
        <div class="my-4 font-bold text-xl">
          {{ zoneStr }}
        </div>
        <div class="my-4">
          <el-table
            v-loading="$apollo.loading"
            element-loading-text="Loading..."
            element-loading-spinner="el-icon-loading"
            :data="tableData"
            size="mini"
            border
          >
            <el-table-column type="index" align="center" width="50" fixed></el-table-column>
            <el-table-column
              label="PO Issue"
              prop="poIssue"
              align="center"
              width="90"
            ></el-table-column>
            <el-table-column
              label="Aproval Date"
              prop="approvalDate"
              align="center"
              width="90"
            ></el-table-column>
            <el-table-column
              label="Zone"
              prop="poZone"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              label="PO No."
              prop="poNo"
              align="center"
              width="70"
            ></el-table-column>
            <el-table-column label="Supplier" width="160">
              <template slot-scope="scope">
                <p :title="scope.row.poSupplier" class="truncate">
                  {{ scope.row.poSupplier }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="Description" width="160">
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
            <el-table-column align="right" width="90">
              <template slot="header">
                <p title="Latest Payment" class="truncate">
                  Latest Payment
                </p>
              </template>
              <template slot-scope="scope">
                {{ scope.row.poLpayment }}
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
      title="Filter"
      :visible.sync="showFilterDialog"
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
        <el-form-item label="Filter By Zones" prop="zone">
          <el-radio-group v-model="form.zone">
            <el-radio
              v-for="(v, k) in zones"
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
          @click="showFilterDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilter('form')"
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
import outp from '../../mixins/outstanding.po.zones';
import { GetAllOutstandingPo } from '../../apollo/outstandingPo/query';

export default {
  mixins: [table, outp],
  data() {
    return {
      showFilterDialog: false,
      loading: false,
      form: {},
      zoneStr: '',
      rules: {
        zone: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
      },
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['poNo', 'poSupplier'],
        storeFields: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'approvalDate', 'comp', 'hse',
          'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
        ],
      }),
    };
  },
  methods: {
    showFilter() {
      this.showFilterDialog = true;
    },
    handleFilter(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const zone = parseInt(
            (Object.keys(this.zones).find((key) => this.zones[key] === this.form.zone)
            ), 10,
          ) + 1;

          const { data: { getAllOutstandingPo } } = await this.$apollo.query({
            query: GetAllOutstandingPo,
            variables: { zone },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.zoneStr = this.form.zone;
          this.items = getAllOutstandingPo;
          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);

          this.loading = false;
          this.showFilterDialog = false;
        }
      });
    },
  },
};
</script>
