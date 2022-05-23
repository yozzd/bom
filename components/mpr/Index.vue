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
          MPR
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <div class="flex my-4 space-x-4 items-center">
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
          <el-button
            v-if="$auth.$state.user.isManager === 0"
            type="primary"
            :disabled="!tableData.length"
            @click="showAdd"
          >
            <client-only>
              <v-icon name="ri-add-line" class="remixicons w-4 h-4" />
            </client-only>
            Add MPR
          </el-button>
          <el-button
            v-if="$auth.$state.user.isManager === 0"
            type="danger"
            :disabled="!multipleSelection.length"
            @click="handleDelete"
          >
            <client-only>
              <v-icon name="ri-delete-bin-2-line" class="remixicons w-4 h-4" />
            </client-only>
            Delete
          </el-button>
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
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                v-if="$auth.$state.user.isManager === 0"
                type="selection"
                width="40"
                align="center"
                fixed
              ></el-table-column>
              <el-table-column type="index" align="center" width="50" fixed></el-table-column>
              <el-table-column
                prop="id"
                label="ID"
                align="center"
                width="50"
                fixed
              ></el-table-column>
              <el-table-column
                label="Status"
                width="80"
                fixed
              >
                <template slot-scope="scope">
                  {{ pStatusObj[scope.row.status] }}
                </template>
              </el-table-column>
              <el-table-column
                label="Number"
                width="100"
                fixed
                class-name="relative group"
              >
                <template slot-scope="scope">
                  <nuxt-link
                    :to="{ name: 'mpr-id', params: { id: scope.row.id } }"
                  >
                    {{ scope.row.no }}
                  </nuxt-link>
                  <div class="hidden group-hover:inline-block absolute top-1 right-0">
                    <el-tooltip effect="dark" content="Open in new tab" placement="top">
                      <a
                        :href="`/mpr/${scope.row.id}`"
                        target="_blank"
                      >
                        <client-only>
                          <v-icon name="ri-external-link-line" class="remixicons w-4 h-4" />
                        </client-only>
                      </a>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="Edit" placement="top">
                      <a
                        v-if="$auth.$state.user.isManager === 0"
                        @click="showEdit(scope.row)"
                      >
                        <client-only>
                          <v-icon name="ri-edit-2-line" class="remixicons w-4 h-4" />
                        </client-only>
                      </a>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="WO"
                :show-overflow-tooltip="true"
                width="100"
                fixed
                class-name="relative group"
              >
                <template slot-scope="scope">
                  <nuxt-link
                    :to="{
                      name: 'bom-wo-idLt-id', params: {
                        idLt: scope.row.wo.idLt, id: scope.row.idWo,
                      }
                    }"
                  >
                    {{ scope.row.woNo }}
                  </nuxt-link>
                  <div class="hidden group-hover:inline-block absolute top-1 right-0">
                    <el-tooltip effect="dark" content="Open in new tab" placement="top">
                      <a
                        :href="`/bom/wo/${scope.row.wo.idLt}/${scope.row.idWo}`"
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
              <el-table-column
                label="Product Name"
                width="180"
                :show-overflow-tooltip="true"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.product }}
                </template>
              </el-table-column>
              <el-table-column
                label="Project Name"
                width="180"
                :show-overflow-tooltip="true"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.projectName }}
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
                  <div v-if="!scope.row.managerApproved && $auth.$state.user.isManager === 1">
                    <el-tooltip effect="dark" content="Approve?" placement="top">
                      <a @click="approve(scope.row, 'manager')">
                        <el-tag type="warning" size="mini">
                          Waiting
                        </el-tag>
                      </a>
                    </el-tooltip>
                  </div>
                  <div
                    v-else-if="scope.row.managerApproved"
                    class="flex space-x-1"
                  >
                    <el-tag type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="top"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.managerTimestamp }}
                        </div>
                      </template>
                      <client-only slot="reference">
                        <v-icon name="ri-time-line" class="remixicons w-4 h-4" />
                      </client-only>
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Warehouse" align="center" width="100">
                <template slot-scope="scope">
                  <div v-if="!scope.row.whApproved && $auth.$state.user.section === 213">
                    <el-tooltip effect="dark" content="Approve?" placement="top">
                      <a @click="approve(scope.row, 'wh')">
                        <el-tag type="warning" size="mini">
                          Waiting
                        </el-tag>
                      </a>
                    </el-tooltip>
                  </div>
                  <div v-else-if="scope.row.whApproved" class="flex space-x-1">
                    <el-tag type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="top"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.whTimestamp }}
                        </div>
                      </template>
                      <client-only slot="reference">
                        <v-icon name="ri-time-line" class="remixicons w-4 h-4" />
                      </client-only>
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="MRP" align="center" width="100">
                <template slot-scope="scope">
                  <div v-if="!scope.row.bomApproved && $auth.$state.user.section === 211">
                    <el-tooltip effect="dark" content="Approve?" placement="top">
                      <a @click="approve(scope.row, 'bom')">
                        <el-tag type="warning" size="mini">
                          Waiting
                        </el-tag>
                      </a>
                    </el-tooltip>
                  </div>
                  <div v-else-if="scope.row.bomApproved" class="flex space-x-1">
                    <el-tag type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="top"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.bomTimestamp }}
                        </div>
                      </template>
                      <client-only slot="reference">
                        <v-icon name="ri-time-line" class="remixicons w-4 h-4" />
                      </client-only>
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="Requestor"
                :show-overflow-tooltip="true"
                width="140"
                class="relative"
              >
                <template slot-scope="scope">
                  {{ scope.row.requestorName }}
                  <el-popover
                    placement="top"
                    trigger="hover"
                  >
                    <template #default>
                      <div class="text-xs">
                        {{ scope.row.requestorTimestamp }}
                      </div>
                    </template>
                    <client-only slot="reference">
                      <v-icon
                        name="ri-time-line"
                        class="remixicons w-4 h-4 absolute top-1 right-0"
                      />
                    </client-only>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                label="Attachment"
                width="140"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.attachmentCheck"
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
                    placement="top"
                    trigger="hover"
                  >
                    <template #default>
                      <div class="text-xs" v-html="scope.row.remark"></div>
                    </template>
                    <client-only slot="reference">
                      <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
                    </client-only>
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
          @click="handleFilterByStatus"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>

    <MprAdd
      :show="showAddDialog"
      :query="query"
      :variables="variables"
      :sdata="sdata"
      @close="closeAddDialog"
      @update="updateList"
    />

    <MprEdit
      :data="dataEdit"
      :show="showEditDialog"
      :query="query"
      :variables="variables"
      :sdata="sdata"
      @close="closeEditDialog"
      @update="updateList"
    />
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import mprStatus from '../../mixins/mpr';
import { GetAllMPR } from '../../apollo/mpr/query';
import { ApproveMpr, DeleteMpr } from '../../apollo/mpr/mutation';

export default {
  mixins: [table, mprStatus],
  data() {
    return {
      showFilterByStatusDialog: false,
      loading: false,
      form: { status: 'Open' },
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
      query: {},
      variables: {},
      sdata: '',
      showAddDialog: false,
      dataEdit: {},
      showEditDialog: false,
      multipleSelection: [],
      cachedArr: [],
    };
  },
  mounted() {
    this.handleFilterByStatus();
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') this.showFilterByStatus();
    },
    showFilterByStatus() {
      this.showFilterByStatusDialog = true;
    },
    async handleFilterByStatus() {
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

      this.query = GetAllMPR;
      this.variables = { status };
      this.sdata = 'getAllMPR';

      this.page = 1;
      this.pageSize = 10;

      this.miniSearch.removeAll();
      this.miniSearch.addAll(this.items);

      this.loading = false;
      this.showFilterByStatusDialog = false;
    },
    showAdd() {
      this.showAddDialog = true;
    },
    closeAddDialog(value) {
      this.showAddDialog = value;
    },
    showEdit(row) {
      this.dataEdit = row;
      this.showEditDialog = true;
    },
    closeEditDialog(value) {
      this.showEditDialog = value;
    },
    updateList(value) {
      this.items = {};
      this.items = value;
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({ id: v.id }));
      this.cachedArr = arr;
    },
    handleDelete() {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteMpr,
          variables: {
            input: this.multipleSelection,
          },
          update: (store, { data: { deleteMpr } }) => {
            const cdata = store.readQuery({
              query: this.query,
              variables: this.variables,
            });

            pullAllBy(cdata[this.sdata], deleteMpr, 'id');
            this.updateList(cdata[this.sdata]);

            store.writeQuery({
              query: this.query,
              variables: this.variables,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteMpr: this.cachedArr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
      }).catch(() => {});
    },
    approve(mpr, type) {
      this.$confirm('You are about to approve this MPR, are you sure?', 'Approval Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: ApproveMpr,
          variables: {
            input: { id: mpr.id, type },
          },
          update: (store, { data: { approveMpr } }) => {
            const cdata = store.readQuery({
              query: this.query,
              variables: this.variables,
            });

            if (type === 'bom') {
              const index = cdata[this.sdata].findIndex((e) => e.id === mpr.id);
              cdata[this.sdata][index] = approveMpr;
            } else {
              pullAllBy(cdata[this.sdata], [approveMpr], 'id');
            }

            this.updateList(cdata[this.sdata]);

            store.writeQuery({
              query: this.query,
              variables: this.variables,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            approveMpr: mpr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
      }).catch(() => {});
    },
  },
};
</script>
