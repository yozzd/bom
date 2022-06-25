<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="loading"
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
        <el-breadcrumb-item>
          Supplier
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex flex-col space-y-4 my-4">
          <div>
            <el-table
              :data="tableData"
              size="mini"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="40"
                align="center"
              ></el-table-column>
              <el-table-column type="index" align="center" width="50"></el-table-column>
              <el-table-column
                label="WMR No."
                :show-overflow-tooltip="true"
                width="130"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import outp from '../../mixins/outstanding.po';
import { GetAllSupplier } from '../../apollo/supplier/query';

export default {
  mixins: [table, outp],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['supplierNM', 'Country'],
        storeFields: [
          'suplierID', 'suplierNM', 'ContactPerson', 'Address', 'Country',
          'PostCode', 'OfficePhone', 'Email', 'HomePage', 'Remark',
        ],
      }),
    };
  },
  methods: {
    handleSelectionChange() {},
  },
  apollo: {
    getAllSupplier: {
      query: GetAllSupplier,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllSupplier } = data;
          this.items = getAllSupplier;
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
