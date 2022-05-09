import { GetAllWoRunning } from '../apollo/bom/query';

export default {
  data() {
    return {
      status: [
        'Open',
        'Process',
        'Hold',
        'Close',
        'Cancel',
      ],
      visible: false,
      loading: false,
      pStatus: [
        { label: 'Non Project', value: 'NP' },
        { label: 'Project', value: 'P' },
      ],
      pStatusObj: {
        NP: 'Non Project',
        P: 'Project',
      },
      category: [
        { label: 'Standard', value: 0 },
        { label: 'Urgent', value: 1 },
      ],
      rules: {
        wo: [{ required: true, message: 'This field is required', trigger: 'change' }],
        model: [{ required: true, message: 'This field is required' }],
        product: [{ required: true, message: 'This field is required' }],
        unit: [{ required: true, message: 'This field is required' }],
        dor: [{ required: true, message: 'This field is required', trigger: 'change' }],
      },
      woRunning: [],
      woRunningLoading: false,
      errors: [],
    };
  },
  methods: {
    async woRunningRemote(key) {
      if (key) {
        this.woRunningLoading = true;
        const { data: { getAllWoRunning } } = await this.$apollo.query({
          query: GetAllWoRunning,
          variables: { key },
          prefetch: false,
          error({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
          },
        });
        this.woRunning = getAllWoRunning;
        this.woRunningLoading = false;
      } else {
        this.woRunning = [];
      }
    },
  },
};
