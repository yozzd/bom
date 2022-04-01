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
              size="mini"
              border
            >
              <el-table-column type="index" align="center" width="50" fixed></el-table-column>
              <el-table-column
                prop="id"
                label="ID"
                align="center"
                width="50"
                fixed
              ></el-table-column>
              <el-table-column
                label="Number"
                align="center"
                width="100"
                fixed
              >
                <template slot-scope="scope">
                  <div class="flex">
                    <nuxt-link
                      :to="{ name: 'mpr-id', params: { id: scope.row.id } }"
                      class="flex-1 truncate"
                    >
                      {{ scope.row.no }}
                    </nuxt-link>
                    <a
                      :href="`/mpr/${scope.row.id}`"
                      title="Open in new tab"
                      target="_blank"
                    >
                      <outline-external-link-icon class="heroicons w-4 h-4" />
                    </a>
                  </div>
                </template>
              </el-table-column>
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
                  <el-tag v-else type="info" size="mini">
                    Standard
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" width="110">
                <template slot="header">
                  <p title="Date Of Requirement" class="truncate">
                    Date Of Requirement
                  </p>
                </template>
                <template slot-scope="scope">
                  {{ scope.row.dor }}
                </template>
              </el-table-column>
              <el-table-column label="Manager" align="center" width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.managerApproved" class="flex space-x-1">
                    <el-tag type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="left"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.managerTimestamp }}
                        </div>
                      </template>
                      <outline-clock-icon
                        slot="reference"
                        class="heroicons text-gray-400 w-4 h-4"
                      />
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Warehouse" align="center" width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.whApproved" class="flex space-x-1">
                    <el-tag type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="left"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.whTimestamp }}
                        </div>
                      </template>
                      <outline-clock-icon
                        slot="reference"
                        class="heroicons text-gray-400 w-4 h-4"
                      />
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="MRP" align="center" width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.bomApproved" class="flex space-x-1">
                    <el-tag type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="left"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.bomTimestamp }}
                        </div>
                      </template>
                      <outline-clock-icon
                        slot="reference"
                        class="heroicons text-gray-400 w-4 h-4"
                      />
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Requestor" width="180">
                <template slot-scope="scope">
                  <div class="flex">
                    <div :title="scope.row.requestorName" class="flex-1 truncate">
                      {{ scope.row.requestorName }}
                    </div>
                    <el-popover
                      placement="left"
                      trigger="hover"
                      class="inline-block"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.requestorTimestamp }}
                        </div>
                      </template>
                      <outline-clock-icon
                        slot="reference"
                        class="heroicons text-gray-400 w-4 h-4"
                      />
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Attachment" width="140">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.attachmentCheck"
                    :title="scope.row.attachment"
                    class="truncate"
                  >
                    <a
                      :href="`attachment/${scope.row.id}/${scope.row.attachment}`"
                      target="_blank"
                    >{{ scope.row.attachment }}</a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Remarks" align="center" width="70">
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.remark"
                    placement="left"
                    trigger="hover"
                  >
                    <template #default>
                      <div class="text-xs" v-html="scope.row.remark"></div>
                    </template>
                    <outline-chat-icon
                      slot="reference"
                      class="heroicons text-gray-400 w-4 h-4"
                    />
                  </el-popover>
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
import mprStatus from '../../mixins/mpr';
import { GetAllMPR } from '../../apollo/mpr/query';

export default {
  mixins: [table, mprStatus],
  data() {
    return {
      showFilterByStatusDialog: false,
      loading: false,
      form: {},
      header: '',
      rules: {
        status: [
          { required: true, message: 'This field is required', trigger: 'change' },
        ],
      },
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['id', 'no', 'woNo', 'model', 'product'],
        storeFields: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing', 'requestorSection',
          'requestorName', 'requestorTimestamp', 'managerApproved',
          'managerTimestamp', 'whApproved', 'whTimestamp', 'bomApproved',
          'bomTimestamp', 'attachment', 'remark', 'wo',
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
    handleFilterByStatus(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const status = parseInt(
            (Object.keys(this.status).find((key) => this.status[key] === this.form.status)
            ), 10,
          );

          const { data: { getAllMPR } } = await this.$apollo.query({
            query: GetAllMPR,
            variables: { status },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.items = {};
          this.items = getAllMPR;
          this.header = `Status: ${this.form.status}`;

          this.page = 1;
          this.pageSize = 10;

          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);

          this.loading = false;
          this.showFilterByStatusDialog = false;
        }
      });
    },
  },
};
</script>
