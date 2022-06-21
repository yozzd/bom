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
        <!--<index-data-table
          v-if="items.length"
          ref="mtable"
          :data="items"
          class="my-4"
          @selection-change="handleSelectionChange"
        />-->
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
            fixed
          ></el-table-column>
          <el-table-column
            type="index"
            label="No"
            align="center"
            width="50"
            fixed
          ></el-table-column>
          <el-table-column label="CD" align="center" width="60" fixed>
            <template slot-scope="scope">
              {{ scope.row.idMaterial }}
            </template>
          </el-table-column>
          <el-table-column
            label="Description"
            width="140"
            :show-overflow-tooltip="true"
            fixed
          >
            <template slot-scope="scope">
              {{ scope.row.bomDescription }}
            </template>
          </el-table-column>
          <el-table-column
            label="Specification"
            width="260"
            :show-overflow-tooltip="true"
            fixed
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
          <el-table-column label="Qty / Unit" width="80">
            <template slot-scope="scope">
              {{ scope.row.bomQty }} {{ scope.row.bomUnit }}
            </template>
          </el-table-column>
          <el-table-column label="Qty Rqd" align="center" width="60">
            <template slot-scope="scope">
              {{ scope.row.bomQtyRqd | currency }}
            </template>
          </el-table-column>
          <el-table-column label="" min-width="50"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { GetOneWmr } from '../../../apollo/wmr/query';

export default {
  data() {
    return {
      wmr: {},
      items: [],
      errors: [],
    };
  },
  methods: {
    handleSelectionChange() {},
    highlighter({ row }) {
      return row.colorClass;
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
