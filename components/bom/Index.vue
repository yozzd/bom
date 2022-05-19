<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div class="flex flex-col divide-y divide-gray-400 divide-dashed">
      <el-breadcrumb separator="/" class="mb-4">
        <el-breadcrumb-item :to="{ name: 'index' }" title="Home">
          <client-only>
            <v-icon name="ri-home-4-line" class="remixicons w-15px h-15px" />
          </client-only>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          BOM
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex my-4 space-x-8 items-center">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              <client-only>
                <v-icon name="ri-filter-line" class="remixicons w-4 h-4" />
              </client-only>
              Filter
              <client-only>
                <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
              </client-only>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                By Status
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="flex-1"></div>
          <div class="w-64">
            <el-input
              v-model="search"
              placeholder="Search"
              clearable
            />
          </div>
        </div>
      </div>

      <div v-if="tableData.length">
        <div class="flex flex-col space-y-4 my-4">
          <div class="font-bold text-xl">
            {{ header }}
          </div>
          <div>
            <el-table
              v-loading="$apollo.loading"
              element-loading-text="Loading..."
              element-loading-spinner="el-icon-loading"
              :data="tableData"
              size="small"
              border
            >
              <el-table-column type="index" align="center" width="50"></el-table-column>
              <el-table-column label="LT" width="200">
                <template slot-scope="scope">
                  <div class="flex group">
                    <nuxt-link
                      :to="{
                        name: 'bom-lt-id-status', params: { id: scope.row.id, status: statusValue }
                      }"
                      :title="scope.row.ltNo"
                      class="flex-1 truncate"
                    >
                      {{ scope.row.ltNo }}
                      <span v-if="scope.row.stage">[STAGE-{{ scope.row.stage }}]</span>
                    </nuxt-link>
                    <div class="hidden group-hover:inline-block">
                      <el-tooltip effect="dark" content="Open in new tab" placement="top">
                        <a
                          :href="`/bom/lt/${scope.row.id}/${statusValue}`"
                          target="_blank"
                        >
                          <client-only>
                            <v-icon name="ri-external-link-line" class="remixicons w-4 h-4" />
                          </client-only>
                    </a>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="customer.name" label="Customer" width="400"></el-table-column>
              <el-table-column label="WO" min-width="50">
                <template slot-scope="scope">
                  {{ scope.row.wos.length }}
                </template>
              </el-table-column>
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
              class="flex justify-end mt-4"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
              <template #default>
                <span class="font-normal">Total {{ tableData.length }}/{{ items.length }}</span>
              </template>
            </el-pagination>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="my-4">
          <el-alert
            title="Please select Filter first!"
            type="info"
            :closable="false"
            class="border border-gray-200"
          >
          </el-alert>
        </div>
      </div>
    </div>

    <el-dialog
      title="Filter By Status"
      :visible.sync="showFilterByStatusDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="(v, k) in status"
              :key="k"
              :label="v"
              class="blk"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showFilterByStatusDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilterByStatus('form')"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import bom from '../../mixins/bom';
import { GetAllLT } from '../../apollo/bom/query';

export default {
  mixins: [table, bom],
  data() {
    return {
      showFilterByStatusDialog: false,
      loading: false,
      statusValue: 0,
      form: { status: 'Running' },
      header: '',
      rules: {
        status: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
      },
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['ltNo', 'customer'],
        storeFields: ['id', 'ltNo', 'customer', 'wos'],
      }),
    };
  },
  mounted() {
    this.handleFetch();
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') this.showFilterByStatus();
    },
    showFilterByStatus() {
      this.showFilterByStatusDialog = true;
    },
    async handleFetch() {
      this.loading = true;
      const status = parseInt(
        (Object.keys(this.status).find((key) => this.status[key] === this.form.status)
        ), 10,
      );
      this.statusValue = status;

      const { data: { getAllLT } } = await this.$apollo.query({
        query: GetAllLT,
        variables: { status },
        prefetch: false,
        error({ graphQLErrors, networkError }) {
          this.errors = graphQLErrors || networkError.result.errors;
        },
      });
      this.items = {};
      this.items = getAllLT;
      this.header = `Status: ${this.form.status}`;

      this.page = 1;
      this.pageSize = 10;

      this.miniSearch.removeAll();
      this.miniSearch.addAll(this.items);

      this.loading = false;
      this.showFilterByStatusDialog = false;
    },
    handleFilterByStatus(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.handleFetch();
        }
      });
    },
  },
};
</script>
