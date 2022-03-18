<template>
  <div class="flex flex-col space-y-8">
    <div class="flex">
      <el-button
        type="primary"
        @click="showFilter"
      >
        <outline-filter-icon class="heroicons w-4 h-4" />
        Filter
      </el-button>
    </div>

    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

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
        label="Aprovall Date"
        prop="approvalDate"
        align="center"
        width="90"
      ></el-table-column>
    </el-table>
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
      rules: {
        zone: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
      },
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['poDescription'],
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
