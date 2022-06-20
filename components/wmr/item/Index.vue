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
      <div>
        <index-data-table
          v-if="items.length"
          ref="mtable"
          :data="items"
          class="my-4"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { GetOneWmr } from '../../../apollo/wmr/query';

export default {
  data() {
    return {
      wmr: {},
      items: [],
      errors: [],
    };
  },
  methods: {
    handleSelectionChange() {},
  },
  apollo: {
    getOneWmr: {
      query: GetOneWmr,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneWmr: { items, ...wmr } } = data;
          this.wmr = wmr;
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
