export default {
  data() {
    return {
      items: [],
      search: '',
      errors: [],
      miniSearch: null,
      page: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      pagerCount: 5,
    };
  },
  computed: {
    tableData() {
      if (this.search) {
        return this.miniSearch.search(this.search, { prefix: true }).slice(0, this.pageSize);
      }
      return this.items.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    },
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
  },
};
