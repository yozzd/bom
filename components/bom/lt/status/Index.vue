<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    <div class="flex flex-col space-y-8">
      <div class="flex space-x-4 items-center">
        <div class="font-bold">
          {{ lt.ltNo }} &bull; {{ lt.customer }}
        </div>
        <div class="flex-1"></div>
        <div>
          Total Budget: USD {{ lt.totalBudget | currency }}
        </div>
        <div>
          Total Price / WO: USD {{ lt.totalPriceWO | currency }}
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

      <el-table
        v-loading="$apollo.loading"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        size="mini"
        border
      >
        <el-table-column type="index" align="center" width="50" fixed></el-table-column>
        <el-table-column label="WO" width="160" fixed>
          <template slot-scope="scope">
            <a :href="`/bom/wo/${scope.row.id}`" target="_blank" class="font-bold">
              {{ scope.row.woNo }} <span v-if="scope.row.stage">[STAGE-{{ scope.row.stage }}]</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="Model" width="100"></el-table-column>
        <el-table-column
          label="Product Name"
          width="160"
        >
          <template slot-scope="scope">
            <p :title="scope.row.product" class="truncate">
              {{ scope.row.product }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="issued" label="Issued" align="center" width="90"></el-table-column>
        <el-table-column
          label="Incoming"
          align="center"
          width="70"
        >
          <template slot-scope="scope">
            {{ scope.row.totalIncoming }} / {{ scope.row.totalItems }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="70"
        >
          <template slot="header">
            <p title="% Incoming" class="truncate">
              % Incoming
            </p>
          </template>
          <template slot-scope="scope">
            {{ scope.row.percentIncoming | currency }}%
          </template>
        </el-table-column>
        <el-table-column
          label="Validation"
          align="center"
          width="70"
        >
          <template slot-scope="scope">
            {{ scope.row.totalValidation }} / {{ scope.row.totalItems }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="70"
        >
          <template slot="header">
            <p title="% Validation" class="truncate">
              % Validation
            </p>
          </template>
          <template slot-scope="scope">
            {{ scope.row.percentValidation | currency }}%
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="Unit" align="center" width="50"></el-table-column>
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
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../../../mixins/table';
import { GetOneLT } from '../../../../apollo/bom/bom.query';

export default {
  mixins: [table],
  data() {
    return {
      lt: {},
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['woNo', 'model', 'product'],
        storeFields: [
          'id', 'woNo', 'model', 'product', 'issued', 'unit', 'budget', 'stage',
          'totalIncoming', 'totalValidation', 'totalItems', 'percentIncoming',
          'percentValidation', 'totalPricePerUnit', 'totalPricePerWO',
          'difference', 'totalYetToPurchase', 'totalDeviation',
          'totalPackingPerUnit', 'totalPackingPerWO',
        ],
      }),
    };
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
      result({ data, loading }) {
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
