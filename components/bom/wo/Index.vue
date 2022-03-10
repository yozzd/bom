<template>
  <div>
    {{ wo }}<br/>
    {{ headers }}
  </div>
</template>

<script>
import { GetOneWO } from '../../../apollo/bom/bom.query';

export default {
  data() {
    return {
      wo: {},
      headers: {},
    };
  },
  apollo: {
    getOneWO: {
      query: GetOneWO,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneWO: { headers, ...wo } } = data;
          this.wo = wo;
          this.headers = headers;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
