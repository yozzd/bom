<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
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
        <el-table-column label="WO" width="140">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              :href="`/bom/wo/${scope.row.id}`"
              target="_blank"
            >
              <span class="text-xs">{{ scope.row.woNo }}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="Unit" align="center" width="50"></el-table-column>
        <el-table-column
          label="Total Price / Unit"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.totalPricePerUnit }}
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
        :total="items.length"
        :pager-count="pagerCount"
        layout="total, sizes, prev, pager, next"
        class="flex justify-end"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../../../mixins/table';
import { GetLTOne } from '../../../../apollo/bom/bom.query';

export default {
  mixins: [table],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['woNo'],
        storeFields: ['id', 'woNo', 'unit', 'totalPricePerUnit', 'totalPricePerWO'],
      }),
    };
  },
  apollo: {
    getLTOne: {
      query: GetLTOne,
      variables() {
        return {
          idLt: parseInt(this.$route.params.id, 10),
          status: parseInt(this.$route.params.status, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getLTOne } = data;
          this.items = getLTOne.wos;
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
