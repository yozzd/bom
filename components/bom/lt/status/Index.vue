<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div class="flex flex-col space-y-8">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name: 'index' }">
          <outline-home-icon class="heroicons w-15px h-15px" />
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bom'}">
          LT
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          WO
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex space-x-4 items-center">
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

      <div class="w-1/3">
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
              <td>USD {{ lt.totalPriceWO | currency }}</td>
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
      >
        <el-table-column type="index" align="center" width="50" fixed></el-table-column>
        <el-table-column label="WO" width="180" fixed>
          <template slot-scope="scope">
            <div class="flex">
              <nuxt-link
                :to="{
                  name: 'bom-wo-idLt-id', params: { idLt: $route.params.id, id: scope.row.id }
                }"
                :title="scope.row.woNo"
                class="flex-1 truncate"
              >
                {{ scope.row.woNo }}
                <span v-if="scope.row.stage">[STAGE-{{ scope.row.stage }}]</span>
              </nuxt-link>
              <a
                :href="`/bom/wo/${$route.params.id}/${scope.row.id}`"
                title="Open in new tab"
                target="_blank"
              >
                <outline-external-link-icon class="heroicons w-4 h-4" />
              </a>
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
          width="110"
        >
          <template slot-scope="scope">
            <div class="flex items-center">
              <div class="flex-1">
                {{ scope.row.totalIncoming }} / {{ scope.row.totalItems }}
              </div>
              <div>
                <el-popover
                  trigger="hover"
                  placement="right"
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
                  <outline-information-circle-icon
                    slot="reference"
                    class="heroicons w-4 h-4 text-blue-600"
                  />
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
                  placement="right"
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
                  <outline-information-circle-icon
                    slot="reference"
                    class="heroicons w-4 h-4 text-blue-600"
                  />
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
                  placement="right"
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
                  <outline-information-circle-icon
                    slot="reference"
                    class="heroicons w-4 h-4 text-blue-600"
                  />
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
                  placement="right"
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
                  <outline-information-circle-icon
                    slot="reference"
                    class="heroicons w-4 h-4 text-blue-600"
                  />
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
import table from '../../../../mixins/table';
import { GetOneLT } from '../../../../apollo/bom/query';

export default {
  mixins: [table],
  data() {
    return {
      lt: { customer: {} },
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
      async result({ data, loading }) {
        if (!loading) {
          const {
            getOneLT: { lt: { wos, ...lt }, ltMpr: { wos: wosMpr, ...ltMpr } },
          } = data;

          const mergeLt = { ...lt };
          mergeLt.totalPriceWO += ltMpr.totalPriceWO;

          const mergeWos = await Promise.all(wos.map((v, i) => {
            const item = { ...v };
            item.bomIncoming = item.totalIncoming;
            item.mprIncoming = wosMpr[i].totalIncoming;
            item.bomPercentIncoming = item.percentIncoming;
            item.mprPercentIncoming = wosMpr[i].percentIncoming;
            item.bomValidation = item.totalValidation;
            item.mprValidation = wosMpr[i].totalValidation;
            item.bomPercentValidation = item.percentValidation;
            item.mprPercentValidation = wosMpr[i].percentValidation;
            item.totalIncoming += wosMpr[i].totalIncoming;
            item.totalItems += wosMpr[i].totalItems;
            item.totalValidation += wosMpr[i].totalValidation;
            item.totalPricePerUnit += wosMpr[i].totalPricePerUnit;
            item.totalPricePerWO += wosMpr[i].totalPricePerWO;
            item.totalPackingPerUnit += wosMpr[i].totalPackingPerUnit;
            item.totalPackingPerWO += wosMpr[i].totalPackingPerWO;
            item.totalYetToPurchase += wosMpr[i].totalYetToPurchase;
            item.totalMpr = wosMpr[i].totalMpr;
            item.difference -= wosMpr[i].totalPricePerWO;
            item.percentIncoming = (item.totalIncoming / item.totalItems) * 100;
            item.percentValidation = (item.totalValidation / item.totalItems) * 100;
            return item;
          }));

          this.lt = mergeLt;
          this.items = mergeWos;

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
