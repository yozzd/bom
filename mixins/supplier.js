import GetAllSupplier from '../apollo/supplier/query';

export default {
  data() {
    return {
      supplier: [],
    };
  },
  apollo: {
    getAllSupplier: {
      query: GetAllSupplier,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllSupplier } = data;
          this.supplier = getAllSupplier;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
