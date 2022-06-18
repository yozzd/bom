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
        <el-table-column
          label="Supplier"
          width="140"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.bomSupplier }}
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
import { GetOneMPR } from '../../../apollo/mpr/query';
import { GetSearchItems } from '../../../apollo/bom/query';
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
        id: v.id,
        isMpr: v.isMpr,
        idMpr: parseInt(this.$route.params.id, 10),
        idWo: parseInt(this.wo.id, 10),
        idModule: parseInt(this.idModule, 10),
      }));
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.searchItems = [];
      this.multipleSelection = [];
      this.errors = [];
      this.$emit('close', false);
    },
    async handleSaveByKeyword() {
      try {
        this.loadingSave = false;

        await this.$apollo.mutate({
          mutation: AddMprItems,
          variables: {
            input: this.multipleSelection,
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
          optimisticResponse: {
            __typename: 'Mutation',
            addMprItems: [{
              __typename: 'MPRITEM',
              id: -1,
              idMaterial: -1,
              bomDescription: '...',
              bomSpecification: '...',
              bomModel: '...',
              bomBrand: '...',
              bomQty: null,
              bomUnit: null,
              bomQtyRqd: null,
              bomQtyBalance: null,
              bomQtyStock: null,
              bomEta: null,
              bomQtyRec: null,
              bomDateRec: null,
              bomCurrSizeC: null,
              bomCurrSizeV: null,
              bomCurrEaC: null,
              bomCurrEaV: null,
              bomUsdEa: null,
              bomUsdUnit: null,
              bomUsdTotal: null,
              materialsProcessed: null,
              yetToPurchase: null,
              bomSupplier: '...',
              bomPoDate: null,
              bomPoNo: null,
              bomRemarks: null,
              priority: null,
              bomEtaStatus: null,
              sr: null,
              isMpr: 1,
              packing: null,
              hold: null,
              cancel: null,
              idHeader: null,
              idMpr: parseInt(this.$route.params.id, 10),
              idModule: parseInt(this.idModule, 10),
              colorClass: null,
              module: {
                __typename: 'WOMODULE',
                id: -1,
                hid: null,
                header: null,
              },
            }],
          },
        });

        this.$message({
          type: 'success',
          message: 'Data has been saved successfully',
          onClose: setTimeout(() => {
            this.handleCancel();
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
