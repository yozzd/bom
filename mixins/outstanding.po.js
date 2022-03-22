import { GetZones } from '../apollo/outstandingPo/query';

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
    };
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
