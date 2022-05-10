<template>
  <div>
    <el-dialog
      title="Search By Modules"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="60%"
    >
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
          label="Modules"
          prop="module"
        >
          <el-select
            v-model="form.module"
            filterable
          >
            <el-option
              v-for="item in woModules"
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
            @click="handleSearchByModules"
          >
            Search
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-if="searchModules.length"
        :data="searchModules"
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
          @click="handleSaveByModules"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllWoModules } from '../../../apollo/bom/query';
// import { GetOneMPR } from '../../../apollo/mpr/query';
// import { AddMprByModules } from '../../../apollo/mpr/mutation';
// import { GetSearchModules } from '../../../apollo/bom/query';

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
      searchModules: [],
      multipleSelection: [],
      loadingSave: false,
      visible: false,
      woAll: [],
      woModules: [],
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
      this.woModules = modules;
    },
    handleSearchByModules() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loadingSearch = true;

          // const { data: { getSearchModules } } = await this.$apollo.query({
          //   query: GetSearchModules,
          //   variables: { key: this.form.keyword },
          //   prefetch: false,
          //   error({ graphQLErrors, networkError }) {
          //     this.errors = graphQLErrors || networkError.result.errors;
          //   },
          // });
          // this.searchModules = getSearchModules;

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
      this.searchModules = [];
      this.multipleSelection = [];
      this.errors = [];
      this.$emit('close', false);
    },
    async handleSaveByModules() {
      try {
        this.loadingSave = false;

        // await this.$apollo.mutate({
        //   mutation: AddMprByModules,
        //   variables: {
        //     input: this.multipleSelection,
        //   },
        //   update: async (store, { data: { addMprByModules } }) => {
        //     const cdata = store.readQuery({
        //       query: GetOneMPR,
        //       variables: {
        //         id: parseInt(this.$route.params.id, 10),
        //       },
        //     });

        //     const itm = [...cdata.getOneMPR.items];
        //     cdata.getOneMPR.items = [...itm, ...addMprByModules];

        //     this.$emit('update', cdata.getOneMPR.items);

        //     store.writeQuery({
        //       query: GetOneMPR,
        //       variables: {
        //         id: parseInt(this.$route.params.id, 10),
        //       },
        //       data: cdata,
        //     });
        //   },
        // });

        // this.$message({
        //   type: 'success',
        //   message: 'Data has been saved successfully',
        //   onClose: setTimeout(() => {
        //     this.handleCancel();
        //     this.loading = false;
        //   }, 1000),
        // });

        return true;
      } catch ({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
        return false;
      }
    },
  },
};
</script>
