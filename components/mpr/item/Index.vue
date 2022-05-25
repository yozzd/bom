<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors.length"
      :errors="errors"
    />

    <div
      v-loading.fullscreen.lock="$apollo.loading"
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
        <el-breadcrumb-item :to="{ name: 'mpr'}">
          MPR
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          ITEMS
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="flex space-x-4 items-center">
        <div class="flex flex-col space-y-4 w-full my-4">
          <div class="flex space-x-8 items-center">
            <div class="font-bold text-xl">
              MPR No. : {{ mpr.no }}
            </div>
            <div class="flex-1"></div>
            <div>Date Of Requirement: {{ mpr.dor }}</div>
            <div class="flex-1"></div>
            <div>
              <el-popover
                placement="left"
                trigger="hover"
              >
                <template #default>
                  <table class="plain">
                    <tbody>
                      <tr>
                        <td class="w-6 bg-[#e1bee7]"></td>
                        <td class="pl-2">
                          Validated
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#64b5f6]"></td>
                        <td class="pl-2">
                          Stock
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ffccbc]"></td>
                        <td class="pl-2">
                          PO Issued
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#a5d6a7]"></td>
                        <td class="pl-2">
                          Coming
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ffa726]"></td>
                        <td class="pl-2">
                          Draft PO / PR
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#b0bec5]"></td>
                        <td class="pl-2">
                          Hold
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ef5350]"></td>
                        <td class="pl-2">
                          Cancel
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-[#ffffff]"></td>
                        <td class="pl-2">
                          Open
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
                <div slot="reference">
                  <client-only>
                    <v-icon
                      name="ri-information-line"
                      class="remixicons w-4 h-4 text-blue-600"
                    />
                  </client-only>
                </div>
              </el-popover>
            </div>
          </div>
          <table class="plain">
            <tbody>
              <tr>
                <td class="w-32">
                  WO
                </td>
                <td>:</td>
                <td class="w-80">
                  {{ mpr.woNo }}
                </td>
                <td class="w-32">
                  Project Name
                </td>
                <td>:</td>
                <td>{{ mpr.projectName }}</td>
                <td class="w-32">
                  Requestor
                </td>
                <td>:</td>
                <td>{{ mpr.requestorName }}</td>
              </tr>
              <tr>
                <td class="w-32">
                  Model
                </td>
                <td>:</td>
                <td class="w-80">
                  {{ mpr.model }}
                </td>
                <td class="w-32">
                  Product Name
                </td>
                <td>:</td>
                <td>
                  <p :title="mpr.product" class="w-72 truncate">
                    {{ mpr.product }}
                  </p>
                </td>
                <td class="w-32">
                  Product Qty
                </td>
                <td>:</td>
                <td>{{ mpr.unit }}</td>
              </tr>
              <tr>
                <td class="w-32">
                  Category
                </td>
                <td>:</td>
                <td class="w-80">
                  <el-tag v-if="mpr.category" type="danger" size="mini">
                    Urgent
                  </el-tag>
                  <el-tag v-else type="info" size="mini">
                    Standard
                  </el-tag>
                </td>
                <td>
                </td>
                <td></td>
                <td></td>
                <td>
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="flex my-4 space-x-4 items-center">
          <el-button
            type="success"
            @click="showImportDialog = true"
          >
            <client-only>
              <v-icon name="ri-upload-2-line" class="remixicons w-4 h-4" />
            </client-only>
            Import
          </el-button>
          <Dropdown trigger="click" placement="bottom-start" @on-click="handleCommand">
            <VButton type="primary" size="large">
              <client-only>
                <v-icon name="ri-add-line" class="remixicons w-4 h-4" />
              </client-only>
              Add
              <client-only>
                <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
              </client-only>
            </VButton>
            <DropdownMenu slot="list">
              <Dropdown placement="right-start">
                <DropdownItem>
                  Item
                  <client-only>
                    <v-icon name="ri-arrow-right-s-line" class="remixicons w-4 h-4" />
                  </client-only>
                </DropdownItem>
                <DropdownMenu slot="list">
                  <DropdownItem name="a">
                    By Keyword
                  </DropdownItem>
                  <DropdownItem name="b">
                    By Module
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <DropdownItem name="c">
                Module
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <el-button
            type="primary"
            :disabled="!multipleSelection.length"
            @click="showMoveToModuleDialog = true"
          >
            <client-only>
              <v-icon name="ri-arrow-left-right-line" class="remixicons w-4 h-4" />
            </client-only>
            Move
          </el-button>

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

      <div v-if="modules.length">
        <div
          v-for="h in modules"
          :key="h.id"
          class="flex flex-col divide-y divide-gray-400 divide-dashed"
        >
          <div class="flex space-x-4 text-xs font-bold my-4 group">
            <div>{{ h.moduleChar }} {{ h.moduleName }}</div>
            <div class="hidden group-hover:inline-block">
              <el-tooltip effect="dark" content="Add Items" placement="top">
                <a @click="addNewItem(h.id)">
                  <client-only>
                    <v-icon name="ri-add-line" class="remixicons w-3.5 h-3.5" />
                  </client-only>
                </a>
              </el-tooltip>
              <el-tooltip effect="dark" content="Edit Module" placement="top">
                <a @click="editModule(h)">
                  <client-only>
                    <v-icon name="ri-edit-2-line" class="remixicons w-3.5 h-3.5" />
                  </client-only>
                </a>
              </el-tooltip>
              <el-tooltip effect="dark" content="Delete Module" placement="top">
                <a @click="deleteModule(h)">
                  <client-only>
                    <v-icon name="ri-delete-bin-2-line" class="remixicons w-3.5 h-3.5" />
                  </client-only>
                </a>
              </el-tooltip>
            </div>
          </div>
          <index-data-table
            ref="ptable"
            :data="h.items"
            :wo="wo"
            :mpr="mpr"
            from-mpr
            @selection-change="handleSelectionChange"
          />
          <div></div>
        </div>
      </div>
      <index-data-table
        v-if="items.length"
        ref="mtable"
        :data="items"
        :wo="wo"
        :mpr="mpr"
        from-mpr
        class="my-4"
        @selection-change="handleSelectionChange"
      />
      <div></div>
    </div>

    <MprItemAdd
      :show="showKeywordDialog"
      :wo="wo"
      :id-module="idModule"
      @close="closeKeywordDialog"
    />

    <MprModuleAdd
      :show="showModuleDialog"
      :wo="wo"
      @close="closeModuleDialog"
    />

    <MprModuleTitle
      :show="showTitleDialog"
      @close="closeTitleDialog"
    />

    <MprModuleMove
      :show="showMoveToModuleDialog"
      :modules="modules"
      :items="multipleSelection"
      :o-id-module="idModule"
      @close="closeMoveToModuleDialog"
    />

    <MprModuleEdit
      :show="showEditModuleDialog"
      :data="module"
      @close="closeEditModuleDialog"
    />

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
import flatten from 'lodash/flatten';
import { GetOneMPR } from '../../../apollo/mpr/query';
import { DeleteModule, ImportMpr } from '../../../apollo/mpr/mutation';
import { DeleteItem } from '../../../apollo/bom/mutation';

export default {
  data() {
    return {
      errors: [],
      mpr: {},
      wo: {},
      module: {},
      modules: [],
      items: [],
      idModule: 0,
      arrIdModule: [],
      showKeywordDialog: false,
      showModuleDialog: false,
      showTitleDialog: false,
      showMoveToModuleDialog: false,
      showEditModuleDialog: false,
      multipleSelection: [],
      showImportDialog: false,
      loading: false,
      fileList: [],
      formImport: {
        file: null,
      },
      rulesImport: {
        file: [{ type: 'object', required: true, message: 'This field is required' }],
      },
    };
  },
  methods: {
    handleCommand(command) {
      this.idModule = 0;
      if (command === 'a') this.showKeywordDialog = true;
      else if (command === 'b') this.showModuleDialog = true;
      else this.showTitleDialog = true;
    },
    closeKeywordDialog(value) {
      this.showKeywordDialog = value;
    },
    closeModuleDialog(value) {
      this.showModuleDialog = value;
    },
    closeTitleDialog(value) {
      this.showTitleDialog = value;
    },
    closeMoveToModuleDialog(value) {
      this.showMoveToModuleDialog = value;
    },
    closeEditModuleDialog(value) {
      this.showEditModuleDialog = value;
    },
    handleSelectionChange() {
      const t1 = flatten(this.$refs.ptable.map((v) => [...v.$refs.ctable.selection]));
      const t2 = this.$refs.mtable.$refs.ctable.selection;
      this.multipleSelection = [];
      this.multipleSelection = flatten([...t1, ...t2]);
    },
    addNewItem(id) {
      this.idModule = 0;
      this.idModule = id;
      this.showKeywordDialog = true;
    },
    editModule(module) {
      this.module = module;
      this.showEditModuleDialog = true;
    },
    handleDelete() {
      const arr = this.multipleSelection.map((v) => ({
        id: v.id,
        isMpr: v.isMpr,
        idModule: v.idModule,
      }));

      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteItem,
          variables: {
            input: arr,
          },
          update: (store, { data: { deleteItem } }) => {
            const cdata = store.readQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
            });

            deleteItem.map((v) => {
              if (v.idModule) {
                const index = cdata.getOneMPR.modules.findIndex((e) => e.id === v.idModule);
                pullAllBy(cdata.getOneMPR.modules[index].items, [v], 'id');
              } else {
                pullAllBy(cdata.getOneMPR.items, [v], 'id');
              }

              return true;
            });

            store.writeQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteItem: this.multipleSelection,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
        this.multipleSelection = [];
        this.idModule = 0;
      }).catch(() => {});
    },
    deleteModule(selectedModule) {
      this.$confirm('This will permanently delete the data. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        await this.$apollo.mutate({
          mutation: DeleteModule,
          variables: {
            id: parseInt(selectedModule.id, 10),
          },
          update: (store, { data: { deleteModule } }) => {
            const cdata = store.readQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
            });

            if (deleteModule.id) {
              pullAllBy(cdata.getOneMPR.modules, [deleteModule], 'id');
            } else {
              pullAllBy(cdata.getOneMPR.modules, [selectedModule], 'id');
            }

            store.writeQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteModule: selectedModule,
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been delete successfully',
        });
      }).catch(() => {});
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
              mutation: ImportMpr,
              variables: {
                input: {
                  idWo: parseInt(this.mpr.idWo, 10),
                  idMpr: parseInt(this.mpr.id, 10),
                  file: this.formImport.file,
                },
              },
            });

            this.$message({
              type: 'success',
              message: 'Data has been updated successfully',
              onClose: setTimeout(() => {
                this.handleCancel('formImport');
                this.loading = false;
              }, 1000),
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
  },
  apollo: {
    getOneMPR: {
      query: GetOneMPR,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const {
            getOneMPR: {
              wo, modules, items, ...mpr
            },
          } = data;
          this.mpr = mpr;
          this.wo = wo;
          this.modules = modules;
          this.items = items;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
