<template>
  <div>
    <el-dialog
      title="Search By Module"
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
        label-width="120px"
        class="w-1/2"
      >
        <el-form-item
          label="Wo No."
          prop="wo"
        >
          <el-select
            v-model="form.wo"
            value-key="id"
            remote
            :remote-method="woAllRemote"
            :loading="woAllLoading"
            filterable
            @change="handleWoChange"
          >
            <el-option
              v-for="item in woAll"
              :key="item.id"
              :label="item.woNo"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="Module"
          prop="module"
        >
          <el-select
            v-model="form.module"
            filterable
          >
            <el-option
              v-for="item in woModule"
              :key="item.id"
              :label="`${item.hid} ${item.header }`"
              :value="item.id"
            >
              <span>{{ item.hid }} {{ item.header }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loadingSearch"
            @click="handleSearchByModule"
          >
            Search
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="searchModule"
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
          @click="handleSaveByModule"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllWoModules, GetSearchModules } from '../../../apollo/bom/query';
import { GetOneMPR } from '../../../apollo/mpr/query';
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
  },
  data() {
    return {
      form: {},
      rules: {
        wo: [{ required: true, message: 'This field is required', trigger: 'change' }],
      },
      loadingSearch: false,
      searchModule: [],
      multipleSelection: [],
      loadingSave: false,
      visible: false,
      woAll: [],
      woModule: [],
      woAllLoading: false,
      errors: [],
    };
  },
  watch: {
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    async woAllRemote(key) {
      if (key) {
        this.woAllLoading = true;
        const { data: { getAllWoModules } } = await this.$apollo.query({
          query: GetAllWoModules,
          variables: { key },
          prefetch: false,
          error({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
          },
        });
        this.woAll = getAllWoModules;
        this.woAllLoading = false;
      } else {
        this.woAll = [];
      }
    },
    handleWoChange({ modules }) {
      this.woModule = [];
      this.woModule = modules;
    },
    handleSearchByModule() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loadingSearch = true;

          const { data: { getSearchModules } } = await this.$apollo.query({
            query: GetSearchModules,
            variables: { idHeader: parseInt(this.form.module, 10) },
            prefetch: false,
            error({ graphQLErrors, networkError }) {
              this.errors = graphQLErrors || networkError.result.errors;
            },
          });
          this.searchModule = getSearchModules;

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
      }));
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.searchModule = [];
      this.multipleSelection = [];
      this.woAll = [];
      this.woModule = [];
      this.errors = [];
      this.$emit('close', false);
    },
    async handleSaveByModule() {
      try {
        this.loadingSave = true;

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

            const itm = [...cdata.getOneMPR.items];
            cdata.getOneMPR.items = [...itm, ...addMprItems];

            this.$emit('update', { type: 'items', values: cdata.getOneMPR.items });

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
