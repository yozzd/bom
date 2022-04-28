import { GetZones } from '../apollo/outstandingPo/query';
import GetAllSupplier from '../apollo/supplier/query';

export default {
  data() {
    return {
      zones: [],
      categories: [
        'Supplier China, Taiwan, Hongkong',
        'Supplier Singapore',
        'Supplier Misc.',
        'Supplier On-Line',
        'Supplier Local',
      ],
      status: [
        'Cancel',
        'Close',
        'Complete',
        'Paid',
        'Partial',
        'Open / Unpaid',
      ],
      visible: false,
      loading: false,
      rules: {
        poIssue: [{ required: true, message: 'This field is required' }],
        poZone: [{ required: true, message: 'This field is required' }],
        poNo: [{ required: true, message: 'This field is required' }],
        poDescription: [{ required: true, message: 'This field is required' }],
        poSupplier: [{ required: true, message: 'This field is required' }],
      },
      supplier: [],
      supplierLoading: false,
      currency: ['EUR', 'GBP', 'JPY', 'MYR', 'Rp', 'Rupe', 'SGD', 'USD'],
      statusWh: ['', 'Complete', 'Partial'],
      completeStatus: ['', 'Yes', 'No'],
      hseStatus: ['', 'Required', 'Non Required'],
      errors: [],
    };
  },
  methods: {
    async supplierRemote(key) {
      if (key) {
        this.supplierLoading = true;
        const { data: { getAllSupplier } } = await this.$apollo.query({
          query: GetAllSupplier,
          variables: { key },
          prefetch: false,
          error({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
          },
        });
        this.supplier = getAllSupplier;
        this.supplierLoading = false;
      } else {
        this.supplier = [];
      }
    },
  },
  apollo: {
    getZones: {
      query: GetZones,
      variables() {
        return {
          status: this.status,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getZones } = data;
          this.zones = getZones;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
