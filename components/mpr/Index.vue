<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div class="flex flex-col divide-y divide-gray-400 divide-dashed">
      <el-breadcrumb separator="/" class="mb-4">
        <el-breadcrumb-item :to="{ name: 'index' }">
          <outline-home-icon class="heroicons w-15px h-15px" />
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          MPR
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!--<div class="flex space-x-4 items-center">
        <div class="w-48">
          <el-select
            v-model="status"
            placeholder="Select"
            class="el-select__primary"
            @change="handleChange"
          >
            <el-option
              v-for="item in optionsMprStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="flex-1"></div>
      </div>-->
      <div>
        <div class="flex my-4 space-x-8 items-center">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
              <outline-filter-icon class="heroicons w-4 h-4" />
              Filter
              <outline-chevron-down-icon class="heroicons heroicons-right w-4 h-4" />
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
              :disabled="!tableData.length"
            />
          </div>
        </div>
      </div>

      <div v-if="tableData.length" class="my-4 flex flex-col space-y-4">
        <div>
          <el-table
            v-loading="$apollo.loading"
            element-loading-text="Loading..."
            element-loading-spinner="el-icon-loading"
            :data="tableData"
            size="mini"
            border
          >
            <el-table-column type="index" align="center" width="50" fixed></el-table-column>
            <el-table-column prop="id" label="ID" align="center" width="50" fixed></el-table-column>
            <el-table-column
              prop="no"
              label="Number"
              align="center"
              width="60"
              fixed
            ></el-table-column>
            <el-table-column label="WO" width="140" fixed>
              <template slot-scope="scope">
                <div class="flex">
                  <nuxt-link
                    :to="{
                      name: 'bom-wo-idLt-id', params: {
                        idLt: scope.row.wo.idLt, id: scope.row.idWo,
                      }
                    }"
                    :title="scope.row.woNo"
                    class="flex-1 truncate"
                  >
                    {{ scope.row.woNo }}
                  </nuxt-link>
                  <a
                    :href="`/bom/wo/${scope.row.wo.idLt}/${scope.row.idWo}`"
                    title="Open in new tab"
                    target="_blank"
                  >
                    <outline-external-link-icon class="heroicons w-4 h-4" />
                  </a>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="packing"
              label="Packing"
              align="center"
              width="60"
              fixed
            >
              <template slot-scope="scope">
                {{ scope.row.packing ? 'Yes' : 'No' }}
              </template>
            </el-table-column>
            <el-table-column label="Model" width="100" fixed>
              <template slot-scope="scope">
                <p :title="scope.row.model" class="truncate">
                  {{ scope.row.model }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="Product Name" width="180" fixed>
              <template slot-scope="scope">
                <p :title="scope.row.product" class="truncate">
                  {{ scope.row.product }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="Project Name" width="140" fixed>
              <template slot-scope="scope">
                <p :title="scope.row.projectName" class="truncate">
                  {{ scope.row.projectName }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="Unit" align="center" width="50"></el-table-column>
            <el-table-column label="Category" align="center" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.category" type="danger" size="mini">
                  Urgent
                </el-tag>
                <el-tag v-else type="success" size="mini">
                  Standard
                </el-tag>
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
              v-for="item in optionsMprStatus"
              :key="item.value"
              :label="item.label"
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
import mprStatus from '../../mixins/mpr.status';
// import { GetAllMPR } from '../../apollo/mpr/query';

export default {
  mixins: [table, mprStatus],
  data() {
    return {
      status: [],
      showFilterByStatusDialog: false,
      loading: false,
      form: {},
      rules: {
        status: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
      },
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['woNo', 'model', 'product'],
        storeFields: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing',
          'managerApproved', 'whApproved', 'wo',
        ],
      }),
    };
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') this.showFilterByStatus();
    },
    showFilterByStatus() {
      this.showFilterByStatusDialog = true;
    },
    handleFilterByStatus() {},
    // handleChange(v) {
    //   this.status = v;
    // },
  },
  // apollo: {
  //   getAllMPR: {
  //     query: GetAllMPR,
  //     variables() {
  //       return {
  //         status: this.status,
  //       };
  //     },
  //     prefetch: false,
  //     result({ data, loading }) {
  //       if (!loading) {
  //         const { getAllMPR } = data;
  //         this.items = getAllMPR;
  //         this.miniSearch.removeAll();
  //         this.miniSearch.addAll(this.items);
  //       }
  //     },
  //     error({ graphQLErrors, networkError }) {
  //       this.errors = graphQLErrors || networkError.result.errors;
  //     },
  //   },
  // },
};
</script>
