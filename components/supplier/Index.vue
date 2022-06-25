<template>
  <div>
    Supplier
  </div>
</template>

<script>
import MiniSearch from 'minisearch';
import table from '../../mixins/table';
import outp from '../../mixins/outstanding.po';
import { GetAllSupplier } from '../../apollo/supplier/query';

export default {
  mixins: [table, outp],
  data() {
    return {
      miniSearch: new MiniSearch({
        idField: 'id',
        fields: ['supplierNM', 'Country'],
        storeFields: [
          'suplierID', 'suplierNM', 'ContactPerson', 'Address', 'Country',
          'PostCode', 'OfficePhone', 'Email', 'HomePage', 'Remark',
        ],
      }),
    };
  },
  apollo: {
    getAllSupplier: {
      query: GetAllSupplier,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllSupplier } = data;
          this.items = getAllSupplier;
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
