<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="$apollo.loading || loading"
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
        <el-breadcrumb-item :to="{ name: 'wmr'}">
          WMR
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          ITEMS
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="my-4">
          <div class="font-bold text-xl mb-4">
            WMR No. : {{ wmr.no }}
          </div>
          <table class="plain">
            <tbody>
              <tr>
                <td class="w-22">
                  WO
                </td>
                <td>:</td>
                <td class="w-80">
                  <span v-if="wmr.wo">{{ wmr.wo.woNo }}</span>
                </td>
                <td class="w-22">
                  Requested By
                </td>
                <td>:</td>
                <td>{{ wmr.requestedBy }}</td>
                <td class="w-22">
                  Authorized By
                </td>
                <td>:</td>
                <td>{{ wmr.authorizedBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="flex space-x-4 my-4">
          <el-button-group
            v-if="$auth.$state.user.section === 213"
          >
            <el-button
              type="primary"
              :disabled="!multipleSelection.length"
              @click="handleStock(1)"
            >
              <client-only>
                <v-icon name="ri-check-line" class="remixicons w-4 h-4" />
              </client-only>
              Stock
            </el-button>
            <el-button
              type="primary"
              :disabled="!multipleSelection.length"
              @click="handleStock(0)"
            >
              <client-only>
                <v-icon name="ri-close-line" class="remixicons w-4 h-4" />
              </client-only>
              Unstock
            </el-button>
          </el-button-group>
          <el-button
            type="primary"
            @click="handlePrint"
          >
            <client-only>
              <v-icon name="ri-printer-line" class="remixicons w-4 h-4" />
            </client-only>
            Print
          </el-button>
        </div>
      </div>

      <div>
        <el-table
          v-if="items.length"
          :data="items"
          size="mini"
          border
          class="my-4"
          :row-class-name="highlighter"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="$auth.$state.user.section === 213"
            type="selection"
            width="40"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label="No"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column label="CD" align="center" width="60">
            <template slot-scope="scope">
              {{ scope.row.idMaterial }}
            </template>
          </el-table-column>
          <el-table-column
            label="Description"
            width="140"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a
                v-if="production.includes($auth.$state.user.department)"
                @click="showWmrPrEdit(scope.row)"
              >
                {{ scope.row.bomDescription }}
              </a>
              <span v-else>
                {{ scope.row.bomDescription }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Specification"
            width="260"
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
          <el-table-column label="Quantity" align="center">
            <el-table-column label="Request" align="center" width="80">
              <template slot-scope="scope">
                {{ scope.row.bomQty }} {{ scope.row.bomUnit }}
              </template>
            </el-table-column>
            <el-table-column label="Issued" align="center" width="80">
              <template slot-scope="scope">
                <a
                  v-if="$auth.$state.user.section===213"
                  @click="showWmrWhEdit(scope.row)"
                >
                  {{ scope.row.qtyIssued | currency }} {{ scope.row.bomUnit }}
                </a>
                <div v-else>
                  {{ scope.row.qtyIssued | currency }} {{ scope.row.bomUnit }}
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="Remarks" align="center">
            <el-table-column label="Production" align="center" width="80">
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.wmrPrRemarks"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.wmrPrRemarks"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Warehouse" align="center" width="80">
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.wmrWhRemarks"
                  placement="top"
                  trigger="hover"
                >
                  <template #default>
                    <div class="text-xs" v-html="scope.row.wmrWhRemarks"></div>
                  </template>
                  <client-only slot="reference">
                    <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                  </client-only>
                </el-popover>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-if="$auth.$state.user.section === 213"
            label="Stock Ready"
            align="center"
            width="100"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.stockReady }}
            </template>
          </el-table-column>
          <el-table-column label="" min-width="50"></el-table-column>
        </el-table>
      </div>
    </div>

    <WmrItemWhEdit
      :show="showWmrWhEditDialog"
      :data="row"
      @close="closeWmrWhEditDialog"
    />

    <WmrItemPrEdit
      :show="showWmrPrEditDialog"
      :data="row"
      @close="closeWmrPrEditDialog"
    />
  </div>
</template>

<script>
import { GetOneWmr, PrintWmr } from '../../../apollo/wmr/query';
import { StockWmrItem } from '../../../apollo/wmr/mutation';
import utils from '../../../mixins/utils';

export default {
  mixins: [utils],
  data() {
    return {
      loading: false,
      wmr: {},
      items: [],
      multipleSelection: [],
      row: {},
      showWmrWhEditDialog: false,
      showWmrPrEditDialog: false,
      errors: [],
    };
  },
  methods: {
    handleSelectionChange(arr) {
      this.multipleSelection = arr;
    },
    highlighter({ row }) {
      return row.colorClass;
    },
    showWmrWhEdit(row) {
      this.row = row;
      this.showWmrWhEditDialog = true;
    },
    closeWmrWhEditDialog(value) {
      this.showWmrWhEditDialog = value;
    },
    showWmrPrEdit(row) {
      this.row = row;
      this.showWmrPrEditDialog = true;
    },
    closeWmrPrEditDialog(value) {
      this.showWmrPrEditDialog = value;
    },
    handleStock(val) {
      const arr = this.multipleSelection.map((v) => ({
        id: v.id,
        isMpr: v.isMpr,
        type: parseInt(val, 10),
      }));

      this.$confirm('You are about to stock/unstock item(s), are you sure?', 'Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: StockWmrItem,
          variables: {
            input: arr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Item(s) has been stock/unstock successfully',
        });
      }).catch(() => {});
    },
    async handlePrint() {
      this.loading = true;

      const { data } = await this.$apollo.mutate({
        mutation: PrintWmr,
        variables: {
          id: parseInt(this.$route.params.id, 10),
        },
      });

      this.loading = false;
      console.log(data);
    },
  },
  apollo: {
    getOneWmr: {
      query: GetOneWmr,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneWmr: { items, ...wmr } } = data;
          this.wmr = wmr;
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
