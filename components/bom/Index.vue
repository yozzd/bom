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
        border
      >
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="LT No." min-width="300">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              :href="`/bom/${scope.row.id}/${status}`"
              target="_blank"
            >
              {{ scope.row.ltNo }}
            </el-link>
          </template>
        </el-table-column>
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
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import GetLT from '../../apollo/bom/bom.query';

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
        fields: ['ltNo'],
        storeFields: ['id', 'ltNo'],
      }),
    };
  },
  methods: {
    handleChange(v) {
      this.status = v;
    },
  },
  apollo: {
    getLT: {
      query: GetLT,
      variables() {
        return {
          status: this.status,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getLT } = data;
          this.items = getLT;
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
