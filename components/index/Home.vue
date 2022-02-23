<template>
  <div>
    <!--<div v-for="(v,i) in items" :key="v.id">
      {{ i+1 }} {{ v.ltNo }} {{ v.wos.length }}
    </div>-->
    <el-select v-model="status" placeholder="Select" @change="handleChange">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
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
