<template>
  <div>
    <!--<div v-for="(v,i) in items" :key="v.id">
      {{ i+1 }} {{ v.ltNo }} {{ v.wos.length }}
    </div>-->
    {{ items }}
  </div>
</template>

<script>
import GetLT from '../../apollo/bom/bom.query';

export default {
  data() {
    return {
      items: [],
      errors: [],
    };
  },
  apollo: {
    getLT: {
      query: GetLT,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getLT } = data;
          this.items = getLT;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
