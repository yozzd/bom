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
        <div class="flex my-4 space-x-4 items-center">
          <el-button
            v-if="mrp.includes($auth.$state.user.section)"
            type="primary"
            @click="showAdd"
          >
            <client-only>
              <v-icon name="ri-add-line" class="remixicons w-4 h-4" />
            </client-only>
            Add
          </el-button>
          <el-button
            v-if="mrp.includes($auth.$state.user.section)"
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
            />
          </div>
        </div>
      </div>
      <div>
        <div class="flex flex-col space-y-4 my-4">
          <div>
            <el-table
              :data="tableData"
              size="mini"
              border
              stripe
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="40"
                align="center"
              ></el-table-column>
              <el-table-column type="index" align="center" width="50"></el-table-column>
              <el-table-column
                label="Supplier Name"
                :show-overflow-tooltip="true"
                width="240"
              >
                <template slot-scope="scope">
                  {{ scope.row.suplierNM }}
                </template>
              </el-table-column>
              <el-table-column
                label="Contact Person"
                prop="ContactPerson"
                :show-overflow-tooltip="true"
                width="140"
              >
              </el-table-column>
              <el-table-column
                label="Address"
                prop="Address"
                :show-overflow-tooltip="true"
                width="340"
              >
              </el-table-column>
              <el-table-column
                label="Country"
                prop="Country"
                :show-overflow-tooltip="true"
                width="140"
              >
              </el-table-column>
              <el-table-column
                label="Post Code"
                prop="PostCode"
                :show-overflow-tooltip="true"
                width="100"
              >
              </el-table-column>
              <el-table-column
                label="Phone"
                prop="OfficePhone"
                :show-overflow-tooltip="true"
                width="140"
              >
              </el-table-column>
              <el-table-column
                label="Fax. No"
                prop="FaxNo"
                :show-overflow-tooltip="true"
                width="140"
              >
              </el-table-column>
              <el-table-column
                label="Email"
                prop="Email"
                :show-overflow-tooltip="true"
                width="160"
              >
              </el-table-column>
              <el-table-column
                label="Homepage"
                prop="HomePage"
                :show-overflow-tooltip="true"
                width="160"
              >
              </el-table-column>
              <el-table-column
                label="Remark"
                prop="Remark"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div v-html="scope.row.Remark"></div>
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
    </div>

    <SupplierAdd
      :show="showAddDialog"
      @close="closeAddDialog"
    />
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import outp from '../../mixins/outstanding.po';
import utils from '../../mixins/utils';
import { GetAllSupplier } from '../../apollo/supplier/query';
import { DeleteSupplier } from '../../apollo/supplier/mutation';

export default {
  mixins: [table, outp, utils],
  data() {
    return {
      loading: false,
      showAddDialog: false,
      multipleSelection: [],
      cachedArr: [],
      miniSearch: new MiniSearch({
        idField: 'suplierID',
        fields: ['suplierNM', 'Country'],
        storeFields: [
          'suplierID', 'suplierNM', 'ContactPerson', 'Address', 'Country',
          'PostCode', 'OfficePhone', 'FaxNo', 'Email', 'HomePage', 'Remark',
        ],
      }),
    };
  },
  methods: {
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({ suplierID: v.suplierID }));
      this.cachedArr = arr;
    },
    showAdd() {
      this.showAddDialog = true;
    },
    closeAddDialog(value) {
      this.showAddDialog = value;
    },
    handleDelete() {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteSupplier,
          variables: {
            input: this.multipleSelection,
          },
          update: (store, { data: { deleteSupplier } }) => {
            const cdata = store.readQuery({
              query: GetAllSupplier,
            });

            pullAllBy(cdata.getAllSupplier, deleteSupplier, 'suplierID');

            store.writeQuery({
              query: GetAllSupplier,
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteSupplier: this.cachedArr,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
        this.multipleSelection = [];
      }).catch(() => {});
    },
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
