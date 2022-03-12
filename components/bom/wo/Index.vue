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
          <el-table-column label="Material" align="center">
            <el-table-column label="CD" align="center" width="60">
              <template slot-scope="scope">
                {{ scope.row.idMaterial }}
              </template>
            </el-table-column>
            <el-table-column label="Description" width="140">
              <template slot-scope="scope">
                <p :title="scope.row.bomDescription" class="truncate">
                  {{ scope.row.bomDescription }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="Specification" width="140">
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
          </el-table-column>
          <el-table-column label="Qty / Unit" width="80">
            <template slot-scope="scope">
              {{ scope.row.bomQty }} {{ scope.row.bomUnit }}
            </template>
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
