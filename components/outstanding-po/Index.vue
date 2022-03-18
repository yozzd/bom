<template>
  <div class="flex flex-col space-y-8">
    <div class="flex">
      <el-button
        type="primary"
        @click="showFilter"
      >
        <outline-filter-icon class="heroicons w-4 h-4" />
        Filter
      </el-button>
    </div>

    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    <el-dialog
      title="Filter"
      :visible.sync="showFilterDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <span>This is a message</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showFilterDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilter('form')"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { GetAllOutstandingPo } from '../../apollo/outstandingPo/query';

export default {
  data() {
    return {
      showFilterDialog: false,
      loading: false,
      items: {},
      errors: [],
    };
  },
  methods: {
    showFilter() {
      this.showFilterDialog = true;
    },
    handleFilter() {},
  },
  // apollo: {
  //   getAllOutstandingPo: {
  //     query: GetAllOutstandingPo,
  //     prefetch: false,
  //     result({ data, loading }) {
  //       if (!loading) {
  //         const { getAllOutstandingPo } = data;
  //         this.items = getAllOutstandingPo;
  //       }
  //     },
  //     error({ graphQLErrors, networkError }) {
  //       this.errors = graphQLErrors || networkError.result.errors;
  //     },
  //   },
  // },
};
</script>
