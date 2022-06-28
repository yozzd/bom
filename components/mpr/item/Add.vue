<template>
  <div>
    <el-dialog
      title="Search By Keyword"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="60%"
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
        :inline="true"
      >
        <el-form-item label="Keyword" prop="keyword">
          <el-input v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loadingSearch"
            @click="handleSearchByKeyword"
          >
            Search
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="searchItems"
        size="mini"
        border
        class="mt-4"
        height="200"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          type="index"
          label="No"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          label="CD"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.MaterialCD }}
          </template>
        </el-table-column>
        <el-table-column
          label="Description"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.MaterialNM }}
          </template>
        </el-table-column>
        <el-table-column
          label="Specification"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.MaterialDesc }}
          </template>
        </el-table-column>
        <el-table-column
          label="Model"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.Model }}
          </template>
        </el-table-column>
        <el-table-column
          label="Brand"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.Brand }}
          </template>
        </el-table-column>
        <el-table-column label="" min-width="50"></el-table-column>
      </el-table>

      <div class="mt-4">
        Selected ({{ cachedArr2.length }}) &bull;
        <a :disabled="!arrSelected.length" @click="handleSelectedDelete">Delete</a>
      </div>
      <el-table
        ref="stable"
        :data="cachedArr2"
        size="mini"
        border
        class="mt-4"
        height="200"
        @selection-change="handleSelected"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          type="index"
          label="No"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          label="CD"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.idMaterial }}
          </template>
        </el-table-column>
        <el-table-column
          label="Description"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomDescription }}
          </template>
        </el-table-column>
        <el-table-column
          label="Specification"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomSpecification }}
          </template>
        </el-table-column>
        <el-table-column
          label="Model"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomModel }}
          </template>
        </el-table-column>
        <el-table-column
          label="Brand"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomBrand }}
          </template>
        </el-table-column>
        <el-table-column label="" min-width="50"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="handleCancel"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loadingSave"
          :disabled="!multipleSelection.length"
          @click="handleSaveByKeyword"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uniqBy from 'lodash/uniqBy';
import pullAllBy from 'lodash/pullAllBy';
import { GetOneMPR } from '../../../apollo/mpr/query';
import { GetSearchItems } from '../../../apollo/material/query';
import { AddMprItems } from '../../../apollo/mpr/mutation';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    wo: {
      type: Object,
      default: () => ({}),
    },
    idModule: {
      type: Number,
      default: 0,
    },

  },
  data() {
    return {
      form: {
        keyword: '',
      },
      rules: {
        keyword: [{ required: true, message: 'This field is required' }],
      },
      loadingSearch: false,
      searchItems: [],
      multipleSelection: [],
      arrSelected: [],
      cachedArr1: [],
      cachedArr2: [],
      loadingSave: false,
      visible: false,
      errors: [],
    };
  },
  watch: {
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    handleSearchByKeyword() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loadingSearch = true;

          const { data: { getSearchItems } } = await this.$apollo.query({
            query: GetSearchItems,
            variables: { key: this.form.keyword },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.searchItems = getSearchItems;
          this.loadingSearch = false;
        }
      });
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map((v) => ({
        bomDescription: v.MaterialNM,
        bomSpecification: v.MaterialDesc,
        bomModel: v.Model,
        bomBrand: v.Brand,
        bomUnit: v.unit,
        idMpr: parseInt(this.$route.params.id, 10),
        idWo: parseInt(this.wo.id, 10),
        idModule: parseInt(this.idModule, 10),
        idMaterial: parseInt(v.MaterialCD, 10),
      }));
      this.cachedArr1.push(...this.multipleSelection);
      this.cachedArr2 = uniqBy(this.cachedArr1, 'idMaterial');
    },
    handleSelected(arr) {
      this.arrSelected = arr;
    },
    handleSelectedDelete() {
      pullAllBy(this.cachedArr2, this.arrSelected, 'idMaterial');
      this.$refs.stable.clearSelection();
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.searchItems = [];
      this.multipleSelection = [];
      this.cachedArr1 = [];
      this.cachedArr2 = [];
      this.arrSelected = [];
      this.errors = [];
      this.$emit('close', false);
    },
    async handleSaveByKeyword() {
      try {
        this.loadingSave = false;

        await this.$apollo.mutate({
          mutation: AddMprItems,
          variables: {
            input: this.cachedArr2,
          },
          update: async (store, { data: { addMprItems } }) => {
            const cdata = store.readQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
            });

            if (this.idModule) {
              const index = cdata.getOneMPR.modules.findIndex((e) => e.id === this.idModule);
              const oitems = [...cdata.getOneMPR.modules[index].items];
              cdata.getOneMPR.modules[index].items = [...oitems, ...addMprItems];
            } else {
              const oitems = [...cdata.getOneMPR.items];
              cdata.getOneMPR.items = [...oitems, ...addMprItems];
            }

            store.writeQuery({
              query: GetOneMPR,
              variables: {
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been saved successfully',
          onClose: setTimeout(() => {
            this.handleCancel();
            this.cachedArr1 = [];
            this.cachedArr2 = [];
            this.arrSelected = [];
            this.loading = false;
          }, 1000),
        });

        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
};
</script>
