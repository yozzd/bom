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
        <div class="my-4">
          <el-button
            type="danger"
            :disabled="!multipleSelection.length"
            @click="handleDelete"
          >
            <client-only>
              <v-icon name="ri-delete-bin-2-line" class="remixicons w-4 h-4" />
            </client-only>
            Delete
          </el-button>
        </div>
      </div>

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
                width="130"
                fixed
                class-name="relative group"
              >
                <template slot-scope="scope">
                  <nuxt-link
                    :to="{
                      name: 'wmr-id', params: {
                        id: scope.row.id,
                      }
                    }"
                  >
                    {{ scope.row.no }}
                  </nuxt-link>
                  <div class="hidden group-hover:inline-block absolute top-1 right-0">
                    <el-tooltip effect="dark" content="Open in new tab" placement="top">
                      <a
                        :href="`/wmr/${scope.row.id}`"
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
                    <el-tooltip effect="dark" content="Edit" placement="top">
                      <a
                        v-if="production.includes($auth.$state.user.department)
                          || $auth.$state.user.section===213"
                        @click="showWmrEdit(scope.row)"
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
                label="Requested By"
                :show-overflow-tooltip="true"
                width="100"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.requestedBy }}
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
              <el-table-column label="Authorized By Status" align="center" width="140">
                <template slot-scope="scope">
                  <div
                    v-if="!scope.row.authorizedByApproved
                      && $auth.$state.user.fullname === scope.row.authorizedBy"
                  >
                    <el-tooltip effect="dark" content="Approve?" placement="top">
                      <a @click="approve(scope.row, 'authorized')">
                        <el-tag type="warning" size="mini">
                          Waiting...
                        </el-tag>
                      </a>
                    </el-tooltip>
                  </div>
                  <div
                    v-else-if="scope.row.authorizedByApproved"
                    class="flex space-x-1"
                  >
                    <div v-if="$auth.$state.user.fullname === scope.row.authorizedBy">
                      <el-tooltip effect="dark" content="Disapprove?" placement="top">
                        <a @click="disapprove(scope.row, 'authorized')">
                          <el-tag type="success" size="mini">
                            Approved
                          </el-tag>
                        </a>
                      </el-tooltip>
                    </div>
                    <el-tag v-else type="success" size="mini">
                      Approved
                    </el-tag>
                    <el-popover
                      placement="top"
                      trigger="hover"
                    >
                      <template #default>
                        <div class="text-xs">
                          {{ scope.row.authorizedByTimestamp }}
                        </div>
                      </template>
                      <client-only slot="reference">
                        <v-icon name="ri-time-line" class="remixicons w-4 h-4" />
                      </client-only>
                    </el-popover>
                  </div>
                  <el-tag v-else type="warning" size="mini">
                    Waiting...
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="" min-width="50"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <WmrEdit
      :show="showWmrEditDialog"
      :data="row"
      @close="closeWmrEditDialog"
    />
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import { GetAllWmr } from '../../apollo/wmr/query';
import { ApproveWmr, DisapproveWmr, DeleteWmr } from '../../apollo/wmr/mutation';
import table from '../../mixins/table';
import utils from '../../mixins/utils';

export default {
  mixins: [table, utils],
  data() {
    return {
      loading: false,
      multipleSelection: [],
      showWmrEditDialog: false,
      row: {},
      cachedArr: [],
      errors: [],
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['id', 'no'],
        storeFields: [
          'id', 'no', 'requestedById', 'requestedBy', 'requestedByTimestamp',
          'authorizedById', 'authorizedBy', 'authorizedByTimestamp',
        ],
      }),
    };
  },
  methods: {
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({ id: v.id }));
      this.cachedArr = arr;
    },
    showWmrEdit(row) {
      this.row = row;
      this.showWmrEditDialog = true;
    },
    closeWmrEditDialog(value) {
      this.showWmrEditDialog = value;
    },
    handleDelete() {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteWmr,
          variables: {
            input: this.multipleSelection,
          },
          update: (store, { data: { deleteWmr } }) => {
            const cdata = store.readQuery({
              query: GetAllWmr,
            });

            pullAllBy(cdata.getAllWmr, deleteWmr, 'id');

            store.writeQuery({
              query: GetAllWmr,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteWmr: this.cachedArr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
        this.multipleSelection = [];
      }).catch(() => {});
    },
    approve(row, type) {
      this.$confirm('You are about to approve this WMR, are you sure?', 'Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: ApproveWmr,
          variables: {
            input: { id: row.id, type },
          },
          update: (store, { data: { approveWmr } }) => {
            const cdata = store.readQuery({
              query: GetAllWmr,
            });

            const index = cdata.getAllWmr.findIndex((e) => e.id === row.id);
            cdata.getAllWmr[index] = approveWmr;

            store.writeQuery({
              query: GetAllWmr,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            approveWmr: row,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been approve successfully',
        });
      }).catch(() => {});
    },
    disapprove(row, type) {
      this.$confirm('You are about to disapprove this WMR, are you sure?', 'Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DisapproveWmr,
          variables: {
            input: { id: row.id, type },
          },
          update: (store, { data: { disapproveWmr } }) => {
            const cdata = store.readQuery({
              query: GetAllWmr,
            });

            const index = cdata.getAllWmr.findIndex((e) => e.id === row.id);
            cdata.getAllWmr[index] = disapproveWmr;

            store.writeQuery({
              query: GetAllWmr,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            disapproveWmr: row,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been disapprove successfully',
        });
      }).catch(() => {});
    },
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
