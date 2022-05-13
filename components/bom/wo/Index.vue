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
        <el-breadcrumb-item :to="{ name: 'index' }" title="Home">
          <client-only>
            <v-icon name="ri-home-4-line" class="remixicons w-15px h-15px" />
          </client-only>
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

      <div>
        <div class="flex space-x-8 items-center my-4">
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
              <div slot="reference">
                <client-only>
                  <v-icon
                    name="ri-information-line"
                    class="remixicons w-4 h-4 text-blue-600"
                  />
                </client-only>
              </div>
            </el-popover>
          </div>
        </div>
        <table class="plain mb-4">
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
              <td>{{ status[wo.status] }}</td>
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

      <div>
        <el-tabs type="border-card" tab-position="top" class="my-4">
          <el-tab-pane label="BOM">
            <div
              v-for="h in modules"
              :key="h.id"
              class="flex flex-col divide-y divide-gray-400 divide-dashed"
            >
              <div class="text-xs font-bold my-4">
                {{ h.hid }} {{ h.header }}
              </div>
              <index-data-table
                v-if="h.items.length"
                :data="h.items"
                :wo="wo"
                @update="updateList"
              />
              <div></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="MPR">
            <div
              v-for="mpr in mprs"
              :key="mpr.id"
              class="flex flex-col divide-y divide-gray-400 divide-dashed"
            >
              <div
                class="flex font-bold text-xs my-4"
              >
                <div>MPR No. :</div>
                <div class="flex ml-2">
                  <nuxt-link
                    :to="{ name: 'mpr-id', params: { id: mpr.id } }"
                  >
                    {{ mpr.no }}
                  </nuxt-link>
                  <a
                    :href="`/mpr/${mpr.id}`"
                    title="Open in new tab"
                    target="_blank"
                    class="ml-2"
                  >
                    <client-only>
                      <v-icon name="ri-external-link-line" class="remixicons w-4 h-4" />
                    </client-only>
                  </a>
                </div>
                <div class="mx-2">
                  &bull;
                </div>
                <div>
                  Requestor: {{ mpr.requestorName }}
                </div>
                <div class="mx-2">
                  &bull;
                </div>
                <div>Approved By MRP: {{ mpr.bomTimestamp }}</div>
              </div>
              <div v-for="module in mpr.modules" :key="module.id">
                <div class="font-bold text-xs my-4">
                  {{ module.moduleChar }} {{ module.moduleName }}
                </div>
                <index-data-table :data="module.items" :wo="wo" :mpr="mpr" />
                <div></div>
              </div>
              <index-data-table
                v-if="mpr.items.length"
                :data="mpr.items"
                :wo="wo"
                :mpr="mpr"
              />
              <div></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { GetOneWO } from '../../../apollo/bom/query';
import bom from '../../../mixins/bom';

export default {
  mixins: [bom],
  data() {
    return {
      customer: {},
      total: {},
      wo: {},
      modules: {},
      mprs: [],
      errors: [],
    };
  },
  methods: {
    highlighter({ row }) {
      return row.colorClass;
    },
    updateList({ type, value }) {
      if (type === 'modules') {
        this.modules = {};
        this.modules = value;
      } else if (type === 'mprs') {
        this.mprs = {};
        this.mprs = value;
      }
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
          const {
            getOneWO: {
              lt: { customer, wos: [wos] },
              wo: { modules, ...wo },
              mpr: { mprs },
            },
          } = data;
          this.customer = customer;
          this.total = wos;
          this.wo = wo;
          this.modules = modules;

          this.mprs = mprs.filter((v) => {
            const { modules: m, items } = v;
            return (m.filter((n) => n.items.length).length) || items.length;
          });
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
