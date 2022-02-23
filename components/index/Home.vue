<template>
  <div class="flex flex-col space-y-4">
    <div>
      <el-select v-model="status" placeholder="Select" @change="handleChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div>
      <el-table
        v-loading="$apollo.loading"
        :data="items"
        :element-loading-text="'Loading...'"
        element-loading-spinner="el-icon-loading"
        max-height="500"
        size="small"
        border
      >
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="ltNo" label="LT No." width="300"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import GetLT from '../../apollo/bom/bom.query';

export default {
  data() {
    return {
      items: [],
      errors: [],
      status: 0,
      options: [{
        value: 0,
        label: 'Running',
      }, {
        value: 2,
        label: 'Validasi Approval',
      }, {
        value: 3,
        label: 'Temporary',
      }, {
        value: 1,
        label: 'Close',
      }],
    };
  },
  methods: {
    handleChange(v) {
      this.status = v;
    },
  },
  apollo: {
    getLT: {
      query: GetLT,
      variables() {
        return {
          status: this.status,
        };
      },
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
