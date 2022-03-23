<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="$apollo.loading"
      class="flex flex-col divide-y divide-gray-400 divide-dashed"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
    >
      <el-breadcrumb separator="/" class="mb-4">
        <el-breadcrumb-item :to="{ name: 'index' }">
          <outline-home-icon class="heroicons w-15px h-15px" />
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bom'}">
          LT
        </el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ name: 'bom-lt-id-status', params: { id: wo.idLt, status: wo.status } }"
        >
          WO
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          ITEMS
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="flex space-x-4 items-center">
        <div class="flex flex-col space-y-4 w-full my-4">
          <div class="flex space-x-8 items-center">
            <div class="font-bold text-xl">
              {{ wo.woNo }} <span v-if="wo.stage">[STAGE-{{ wo.stage }}]</span>
            </div>
            <div class="flex-1"></div>
            <div>Issued: {{ wo.issued }}</div>
            <div>Production Dead Line: {{ customer.productionDeadLine }}</div>
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
                        <td class="w-6 bg-[#e1bee7]"></td>
                        <td class="pl-2">
                          Validated
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#64b5f6]"></td>
                        <td class="pl-2">
                          Stock
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ffccbc]"></td>
                        <td class="pl-2">
                          PO Issued
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#a5d6a7]"></td>
                        <td class="pl-2">
                          Coming
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ffa726]"></td>
                        <td class="pl-2">
                          Draft PO / PR
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#b0bec5]"></td>
                        <td class="pl-2">
                          Hold
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ef5350]"></td>
                        <td class="pl-2">
                          Cancel
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
          </div>
          <table class="plain">
            <tbody>
              <tr>
                <td class="w-32">
                  Cat. No.
                </td>
                <td>:</td>
                <td class="w-80">
                  {{ wo.cat }}
                </td>
                <td class="w-32">
                  Budget
                </td>
                <td>:</td>
                <td>USD {{ total.budget | currency }}</td>
                <td class="w-32">
                  Refer
                </td>
                <td>:</td>
                <td>{{ wo.refer }}</td>
                <td class="w-32">
                  1 USD
                </td>
                <td>:</td>
                <td>SGD {{ wo.sgd | currency }}</td>
              </tr>
              <tr>
                <td>
                  Model
                </td>
                <td>:</td>
                <td>{{ wo.model }}</td>
                <td>
                  Expense
                </td>
                <td>:</td>
                <td>USD {{ total.totalPricePerWO | currency }}</td>
                <td>
                  Status
                </td>
                <td>:</td>
                <td>{{ arrWoStatus[0][wo.status] }}</td>
                <td>
                  1 USD
                </td>
                <td>:</td>
                <td>IDR {{ wo.idr | currency }}</td>
              </tr>
              <tr>
                <td>
                  Product Name
                </td>
                <td>:</td>
                <td>
                  <p :title="wo.product" class="w-72 truncate">
                    {{ wo.product }}
                  </p>
                </td>
                <td>
                  Difference
                </td>
                <td>:</td>
                <td>USD {{ total.difference | currency }}</td>
                <td>
                  Materials Processed
                </td>
                <td>:</td>
                <td>USD {{ total.totalMaterialsProcessed | currency }}</td>
                <td>
                  1 EURO
                </td>
                <td>:</td>
                <td>USD {{ wo.euro | currency }}</td>
              </tr>
              <tr>
                <td>
                  PIC
                </td>
                <td>:</td>
                <td>{{ wo.picName }}</td>
                <td>
                  Total Production
                </td>
                <td>:</td>
                <td>{{ wo.unit }} Unit</td>
                <td>
                  Yet To Purchase
                </td>
                <td>:</td>
                <td>USD {{ total.totalYetToPurchase | currency }}</td>
                <td>
                  1 GBP
                </td>
                <td>:</td>
                <td>USD {{ wo.gbp | currency }}</td>
              </tr>
              <tr>
                <td>
                  RND In-Charge
                </td>
                <td>:</td>
                <td>{{ wo.rndic }}</td>
                <td>
                  Packing / Unit
                </td>
                <td>:</td>
                <td>USD {{ total.totalPackingPerUnit | currency }}</td>
                <td>
                  Deviation
                </td>
                <td>:</td>
                <td>USD {{ total.totalDeviation }}</td>
                <td>
                  1 MYR
                </td>
                <td>:</td>
                <td>USD {{ wo.myr | currency }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  Packing / WO
                </td>
                <td>:</td>
                <td>USD {{ total.totalPackingPerWO | currency }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex-1"></div>
      </div>
      <div v-for="h in modules" :key="h.id" class="flex flex-col">
        <div class="text-xs font-bold my-4">
          {{ h.hid }} {{ h.header }}
        </div>
        <el-table
          v-if="h.items.length"
          :data="h.items"
          size="mini"
          border
          class="mb-4"
          :row-class-name="highlighter"
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
          <el-table-column label="Remarks" align="center" width="70">
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.bomRemarks"
                placement="left"
                trigger="hover"
              >
                <template #default>
                  <div class="text-xs" v-html="scope.row.bomRemarks"></div>
                </template>
                <outline-chat-icon
                  slot="reference"
                  class="heroicons w-4 h-4"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="Priority"
            prop="priority"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column
            label="ETA Status"
            prop="bomEtaStatus"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column label="" min-width="50"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { GetOneWO } from '../../../apollo/bom/query';
import woStatus from '../../../mixins/woStatus';

export default {
  mixins: [woStatus],
  data() {
    return {
      customer: {},
      total: {},
      wo: {},
      modules: {},
      errors: [],
    };
  },
  computed: {
    arrWoStatus() {
      return this.optionsWoStatus.map((v) => ({
        [v.value]: v.label,
      }));
    },
  },
  methods: {
    highlighter({ row }) {
      return row.colorClass;
    },
  },
  apollo: {
    getOneWO: {
      query: GetOneWO,
      variables() {
        return {
          idLt: parseInt(this.$route.params.idLt, 10),
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneWO: { lt: { customer, wos: [wos] }, wo: { modules, ...wo } } } = data;
          this.customer = customer;
          this.total = wos;
          this.wo = wo;
          this.modules = modules;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
