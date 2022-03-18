<template>
  <div class="flex flex-col space-y-8">
    <div class="flex">
      <el-button type="primary">
        <outline-filter-icon class="heroicons w-4 h-4" />
        Filter
      </el-button>
    </div>

    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />
  </div>
</template>

<script>
// import { GetAllOutstandingPo } from '../../apollo/outstandingPo/query';

export default {
  data() {
    return {
      items: {},
      errors: [],
    };
  },
  methods: {
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
