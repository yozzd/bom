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
          WMR
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
                fixed
              ></el-table-column>
              <el-table-column type="index" align="center" width="50" fixed></el-table-column>
              <el-table-column
                label="WMR No."
                :show-overflow-tooltip="true"
                width="100"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.no }}
                </template>
              </el-table-column>
              <el-table-column
                label="WO"
                :show-overflow-tooltip="true"
                width="100"
                class-name="relative group"
                fixed
              >
                <template slot-scope="scope">
                  <nuxt-link
                    :to="{
                      name: 'bom-wo-idLt-id', params: {
                        idLt: scope.row.wo.idLt, id: scope.row.wo.id,
                      }
                    }"
                  >
                    {{ scope.row.wo.woNo }}
                  </nuxt-link>
                  <div class="hidden group-hover:inline-block absolute top-1 right-0">
                    <el-tooltip effect="dark" content="Open in new tab" placement="top">
                      <a
                        :href="`/bom/wo/${scope.row.wo.idLt}/${scope.row.wo.id}`"
                        target="_blank"
                      >
                        <client-only>
                          <v-icon
                            name="ri-external-link-line"
                            class="remixicons w-4 h-4"
                          />
                        </client-only>
                      </a>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Request By"
                :show-overflow-tooltip="true"
                width="100"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.requestBy }}
                </template>
              </el-table-column>
              <el-table-column
                label="Authorized By"
                :show-overflow-tooltip="true"
                width="100"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.authorizedBy }}
                </template>
              </el-table-column>
              <el-table-column label="" min-width="50"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import { GetAllWmr } from '../../apollo/wmr/query';
import table from '../../mixins/table';

export default {
  mixins: [table],
  data() {
    return {
      loading: false,
      multipleSelection: [],
      errors: [],
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['id', 'no'],
        storeFields: [
          'id', 'no', 'requestById', 'requestBy', 'requestByTimestamp',
          'authorizedById', 'authorizedBy', 'authorizedByTimestamp',
        ],
      }),
    };
  },
  methods: {
    handleSelectionChange() {},
  },
  apollo: {
    getAllWmr: {
      query: GetAllWmr,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllWmr } = data;
          this.items = getAllWmr;
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
