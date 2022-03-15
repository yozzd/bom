<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="$apollo.loading"
      class="flex flex-col space-y-8"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
    >
      <div class="flex space-x-4 items-center">
        <div class="font-bold">
          {{ wo.woNo }} <span v-if="wo.stage">[STAGE-{{ wo.stage }}]</span>
        </div>
        <div class="flex-1"></div>
      </div>
      <div v-for="h in headers" :key="h.id" class="flex flex-col space-y-4">
        <div class="text-xs font-bold">
          {{ h.hid }} {{ h.header }}
        </div>
        <el-table
          v-if="h.items.length"
          :data="h.items"
          size="mini"
          border
        >
          <el-table-column
            type="index"
            label="No"
            align="center"
            width="40"
            fixed
          ></el-table-column>
          <el-table-column label="CD" align="center" width="60" fixed>
            <template slot-scope="scope">
              {{ scope.row.idMaterial }}
            </template>
          </el-table-column>
          <el-table-column label="Description" width="140" fixed>
            <template slot-scope="scope">
              <p :title="scope.row.bomDescription" class="truncate">
                {{ scope.row.bomDescription }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="Specification" width="140" fixed>
            <template slot-scope="scope">
              <p :title="scope.row.bomSpecification" class="truncate">
                {{ scope.row.bomSpecification }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="Model" width="140">
            <template slot-scope="scope">
              <p :title="scope.row.bomModel" class="truncate">
                {{ scope.row.bomModel }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="Brand" width="140">
            <template slot-scope="scope">
              <p :title="scope.row.bomBrand" class="truncate">
                {{ scope.row.bomBrand }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="Qty / Unit" width="70">
            <template slot-scope="scope">
              {{ scope.row.bomQty }} {{ scope.row.bomUnit }}
            </template>
          </el-table-column>
          <el-table-column label="Qty Rqd" align="center" width="60">
            <template slot-scope="scope">
              {{ scope.row.bomQtyRqd | currency }}
            </template>
          </el-table-column>
          <el-table-column align="center" width="60">
            <template slot="header">
              <p title="Qty Balance" class="truncate">
                Qty Balance
              </p>
            </template>
            <template slot-scope="scope">
              <span
                :class="[{ 'text-red-600': scope.row.bomQtyBalance < 0 }]"
              >{{ scope.row.bomQtyBalance }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="60">
            <template slot="header">
              <p title="Qty Stock @W/H" class="truncate">
                Qty Stock @W/H
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.bomQtyStock | currency }}
            </template>
          </el-table-column>
          <el-table-column
            label="ETA"
            prop="bomEta"
            align="center"
            width="90"
          ></el-table-column>
          <el-table-column label="W/H Received" align="center">
            <el-table-column label="Qty" align="center" width="60">
              <template slot-scope="scope">
                {{ scope.row.bomQtyRec | currency }}
              </template>
            </el-table-column>
            <el-table-column
              label="Date"
              prop="bomDateRec"
              align="center"
              width="90"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="Price" align="center">
            <el-table-column label="CURR / Size" align="right" width="100">
              <template slot-scope="scope">
                {{ scope.row.bomCurrSizeC }} {{ scope.row.bomCurrSizeV | currency }}
              </template>
            </el-table-column>
            <el-table-column label="CURR / Ea" align="right" width="100">
              <template slot-scope="scope">
                {{ scope.row.bomCurrEaC }} {{ scope.row.bomCurrEaV | currency }}
              </template>
            </el-table-column>
            <el-table-column label="USD / Ea" align="right" width="100">
              <template slot-scope="scope">
                {{ scope.row.bomUsdEa | currency }}
              </template>
            </el-table-column>
            <el-table-column label="USD / Unit" align="right" width="100">
              <template slot-scope="scope">
                {{ scope.row.bomUsdUnit | currency }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Total Price (USD)" class="truncate">
                Total Price (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.bomUsdTotal | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Materials Processed (USD)" class="truncate">
                Materials Processed (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.materialsProcessed | currency }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="100">
            <template slot="header">
              <p title="Yet To Purchase (USD)" class="truncate">
                Yet To Purchase (USD)
              </p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.yetToPurchase | currency }}
            </template>
          </el-table-column>
          <el-table-column label="Supplier" width="140">
            <template slot-scope="scope">
              <p :title="scope.row.bomSupplier" class="truncate">
                {{ scope.row.bomSupplier }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="PO / PR" align="center">
            <el-table-column
              label="Date"
              prop="bomPoDate"
              align="center"
              width="90"
            ></el-table-column>
            <el-table-column label="No" align="center" width="80">
              <template slot-scope="scope">
                {{ scope.row.bomPoNo }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="" min-width="50"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { GetOneWO } from '../../../apollo/bom/bom.query';

export default {
  data() {
    return {
      wo: {},
      headers: {},
      errors: [],
    };
  },
  apollo: {
    getOneWO: {
      query: GetOneWO,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneWO: { headers, ...wo } } = data;
          this.wo = wo;
          this.headers = headers;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
