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
          <el-button type="success" @click="showImportDialog = true">
            <client-only>
              <v-icon name="ri-upload-2-line" class="remixicons w-4 h-4" />
            </client-only>
            Import
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
              <el-table-column
                label="LT"
                width="200"
                :show-overflow-tooltip="true"
                class-name="relative group"
              >
                <template slot-scope="scope">
                  <nuxt-link
                    :to="{
                      name: 'bom-lt-id-status', params: { id: scope.row.id, status: statusValue }
                    }"
                  >
                    {{ scope.row.ltNo }}
                    <span v-if="scope.row.stage">[STAGE-{{ scope.row.stage }}]</span>
                  </nuxt-link>
                  <div class="hidden group-hover:inline-block absolute top-1 right-0">
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
                    <el-tooltip effect="dark" content="Delete" placement="top">
                      <a @click="deleteLt(scope.row)">
                        <client-only>
                          <v-icon name="ri-delete-bin-2-line" class="remixicons w-4 h-4" />
                        </client-only>
                      </a>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="customer.name"
                label="Customer"
                width="400"
                :show-overflow-tooltip="true"
              ></el-table-column>
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
      <IndexErrorHandler
        v-if="errors.length"
        :errors="errors"
        class="mb-4"
      />

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

    <el-dialog
      title="Import"
      :visible.sync="showImportDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <IndexErrorHandler
        v-if="errors.length"
        :errors="errors"
        class="mb-4"
      />

      <el-form
        ref="formImport"
        :model="formImport"
        :rules="rulesImport"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="File" prop="file">
          <el-upload
            ref="upload"
            drag
            action=""
            accept=".xls, .xlsx"
            :on-change="handleOnChange"
            :file-list="fileList"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="handleCancel('formImport')"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleImport('formImport')"
        >
          Import
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pullAllBy from 'lodash/pullAllBy';
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import bom from '../../mixins/bom';
import { GetAllLT } from '../../apollo/bom/query';
import { ImportWo, DeleteLt } from '../../apollo/bom/mutation';

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
      showImportDialog: false,
      fileList: [],
      formImport: {
        file: null,
      },
      rulesImport: {
        file: [{ type: 'object', required: true, message: 'This field is required' }],
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
    handleCancel(form) {
      this.showImportDialog = false;
      this.fileList = [];
      this.loading = false;
      this.$refs[form].clearValidate();
    },
    handleOnChange({ raw }) {
      this.formImport.file = raw;
    },
    handleImport(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            await this.$apollo.mutate({
              mutation: ImportWo,
              variables: {
                input: {
                  file: this.formImport.file,
                },
              },
            });

            return true;
          } catch ({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
            return false;
          }
        } else {
          return false;
        }
      });
    },
    deleteLt(row) {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteLt,
          variables: {
            id: parseInt(row.id, 10),
          },
          update: (store, { data: { deleteLt } }) => {
            const cdata = store.readQuery({
              query: GetAllLT,
              variables: { status: this.statusValue },
            });

            if (deleteLt.id) {
              pullAllBy(cdata.getAllLT, [deleteLt], 'id');
            } else {
              pullAllBy(cdata.getAllLT, [row], 'id');
            }
            this.items = {};
            this.items = cdata.getAllLT;

            store.writeQuery({
              query: GetAllLT,
              variables: { status: this.statusValue },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteLt: row,
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
