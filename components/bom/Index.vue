<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <div class="w-48">
        <el-select v-model="status" placeholder="Select" @change="handleChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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

    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    <div>
      <el-table
        v-loading="$apollo.loading"
        :data="tableData"
        size="small"
        border
      >
        <el-table-column type="index" align="center" width="50"></el-table-column>
        <el-table-column label="LT" width="200">
          <template slot-scope="scope">
            <p :title="scope.row.ltNo" class="text-xs truncate font-bold">
              <a :href="`/bom/lt/${scope.row.id}/${status}`" target="_blank">
                {{ scope.row.ltNo }}
              </a>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="customer" label="Customer" width="400"></el-table-column>
        <el-table-column label="WO" min-width="50">
          <template slot-scope="scope">
            {{ scope.row.wos.length }}
          </template>
        </el-table-column>
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
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import { GetAllLT } from '../../apollo/bom/bom.query';

export default {
  mixins: [table],
  data() {
    return {
      status: 0,
      options: [{
        value: 0,
        label: 'Running',
      }, {
        value: 2,
        label: 'Validasi Approval',
      }, {
        value: 3,
        label: 'Temporary',
      }, {
        value: 1,
        label: 'Close',
      }],
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['ltNo', 'customer'],
        storeFields: ['id', 'ltNo', 'customer', 'wos'],
      }),
    };
  },
  methods: {
    handleChange(v) {
      this.status = v;
    },
  },
  apollo: {
    getAllLT: {
      query: GetAllLT,
      variables() {
        return {
          status: this.status,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllLT } = data;
          this.items = getAllLT;
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
