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
        <el-breadcrumb-item :to="{ name: 'mpr'}">
          MPR
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          ITEMS
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex space-x-4 items-center">
        <div class="flex flex-col space-y-4 w-full my-4">
          <div class="flex space-x-8 items-center">
            <div class="font-bold text-xl">
              MPR No. : {{ mpr.no }}
            </div>
            <div class="flex-1"></div>
            <div>Date Of Requirement: {{ mpr.dor }}</div>
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
          <table class="plain">
            <tbody>
              <tr>
                <td class="w-32">
                  WO
                </td>
                <td>:</td>
                <td class="w-80">
                  {{ mpr.woNo }}
                </td>
                <td class="w-32">
                  Project Name
                </td>
                <td>:</td>
                <td>{{ mpr.projectName }}</td>
                <td class="w-32">
                  Requestor
                </td>
                <td>:</td>
                <td>{{ mpr.requestorName }}</td>
              </tr>
              <tr>
                <td class="w-32">
                  Model
                </td>
                <td>:</td>
                <td class="w-80">
                  {{ mpr.model }}
                </td>
                <td class="w-32">
                  Product Name
                </td>
                <td>:</td>
                <td>
                  <p :title="mpr.product" class="w-72 truncate">
                    {{ mpr.product }}
                  </p>
                </td>
                <td class="w-32">
                  Product Qty
                </td>
                <td>:</td>
                <td>{{ mpr.unit }}</td>
              </tr>
              <tr>
                <td class="w-32">
                  Category
                </td>
                <td>:</td>
                <td class="w-80">
                  <el-tag v-if="mpr.category" type="danger" size="mini">
                    Urgent
                  </el-tag>
                  <el-tag v-else type="info" size="mini">
                    Standard
                  </el-tag>
                </td>
                <td>
                </td>
                <td></td>
                <td></td>
                <td>
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="flex my-4 space-x-4 items-center">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              <client-only>
                <v-icon name="ri-search-line" class="remixicons w-4 h-4" />
              </client-only>
              Search
              <client-only>
                <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
              </client-only>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                By Items
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div v-if="modules.length">
        <div
          v-for="h in modules"
          :key="h.id"
          class="flex flex-col divide-y divide-gray-400 divide-dashed"
        >
          <div class="text-xs font-bold my-4">
            {{ h.moduleChar }} {{ h.moduleName }}
          </div>
          <index-data-table :data="h.items" :wo="wo" :mpr="mpr" from-mpr />
          <div></div>
        </div>
      </div>
      <div v-if="items.length">
        <index-data-table :data="items" :wo="wo" :mpr="mpr" from-mpr class="my-4" />
      </div>
      <div></div>
    </div>

    <el-dialog
      title="Search By Items"
      :visible.sync="showSearchByItemsDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <el-form
        ref="formItems"
        :model="formItems"
        :rules="rulesItems"
        :hide-required-asterisk="true"
        :inline="true"
      >
        <el-form-item label="Keyword" prop="keyword">
          <el-input v-model="formItems.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loadingSearchByItems"
            @click="handleSearchByItems"
          >
            Search
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-if="searchItems.length"
        :data="searchItems"
        size="mini"
        border
        class="mt-4"
        @selection-change="handleItemsSelection"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          type="index"
          label="No"
          align="center"
          width="40"
        ></el-table-column>
        <el-table-column
          label="Description"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomDescription }}
          </template>
        </el-table-column>
        <el-table-column
          label="Specification"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomSpecification }}
          </template>
        </el-table-column>
        <el-table-column
          label="Model"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomModel }}
          </template>
        </el-table-column>
        <el-table-column
          label="Brand"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomBrand }}
          </template>
        </el-table-column>
        <el-table-column
          label="Supplier"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomSupplier }}
          </template>
        </el-table-column>
        <el-table-column label="" min-width="50"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showSearchByItemsDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loadingSaveByItems"
          :disabled="!itemsSelection.length"
          @click="handleSaveByItems"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetOneMPR } from '../../../apollo/mpr/query';
import { GetSearchItems } from '../../../apollo/bom/query';

export default {
  data() {
    return {
      errors: [],
      mpr: {},
      wo: {},
      modules: [],
      items: [],
      showSearchByItemsDialog: false,
      formItems: {},
      rulesItems: {
        keyword: [{ required: true, message: 'This field is required' }],
      },
      loadingSearchByItems: false,
      searchItems: [],
      itemsSelection: [],
      loadingSaveByItems: false,
    };
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') this.showSearchByItemsDialog = true;
    },
    handleSearchByItems() {
      this.$refs.formItems.validate(async (valid) => {
        if (valid) {
          this.loadingSearchByItems = true;

          const { data: { getSearchItems } } = await this.$apollo.query({
            query: GetSearchItems,
            variables: { key: this.formItems.keyword },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.searchItems = getSearchItems;
          this.loadingSearchByItems = false;
        }
      });
    },
    handleItemsSelection(arr) {
      this.itemsSelection = arr.map((v) => ({ id: v.id, isMpr: v.isMpr }));
    },
    handleSaveByItems() {},
  },
  apollo: {
    getOneMPR: {
      query: GetOneMPR,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            getOneMPR: {
              wo, modules, items, ...mpr
            },
          } = data;
          this.mpr = mpr;
          this.wo = wo;
          this.modules = modules;
          this.items = items;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
