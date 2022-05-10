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
        :inline="true"
      >
        <el-form-item label="Keyword" prop="keyword">
          <el-input v-model="form.keyword"></el-input>
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
        keyword: [{ required: true, message: 'This field is required' }],
      },
      loadingSearch: false,
      searchModules: [],
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
