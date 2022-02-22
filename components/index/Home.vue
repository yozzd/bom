<template>
  <div>
    <div v-for="(v,i) in items" :key="v.id">
      {{ i+1 }} {{ v.ltNo }}
    </div>
  </div>
</template>

<script>
import GetLt from '../../apollo/bom/bom.query';

export default {
  data() {
    return {
      items: [],
      errors: [],
    };
  },
  apollo: {
    getLt: {
      query: GetLt,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getLt } = data;
          this.items = getLt;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
