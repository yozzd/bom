<template>
  <div class="flex flex-col space-y-8">
    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    {{ items }}
  </div>
</template>

<script>
import { GetAllMPR } from '../../apollo/mpr/mpr.query';

export default {
  data() {
    return {
      items: {},
    };
  },
  methods: {
  },
  apollo: {
    getAllMPR: {
      query: GetAllMPR,
      variables() {
        return {
          status: this.status,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllMPR } = data;
          this.items = getAllMPR;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
