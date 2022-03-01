<template>
  <div>
    {{ items }}
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../../../mixins/table';
import { GetWO } from '../../../../apollo/bom/bom.query';

export default {
  mixins: [table],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['ltNo'],
        storeFields: ['id', 'ltNo'],
      }),
    };
  },
  apollo: {
    getWO: {
      query: GetWO,
      variables() {
        return {
          idLt: parseInt(this.$route.params.lt, 10),
          status: parseInt(this.$route.params.status, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getWO } = data;
          this.items = getWO;
          this.miniSearch.removeAll();
          this.miniSearch.addAll(this.items);
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
