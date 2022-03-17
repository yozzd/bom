<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <div class="w-48">
        <el-select
          v-model="status"
          placeholder="Select"
          class="el-select__primary"
          @change="handleChange"
        >
          <el-option
            v-for="item in optionsMprStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="flex-1"></div>
    </div>

    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    {{ items }}
  </div>
</template>

<script>
import mprStatus from '../../mixins/mprStatus';
import { GetAllMPR } from '../../apollo/mpr/mpr.query';

export default {
  mixins: [mprStatus],
  data() {
    return {
      status: 0,
      items: {},
      errors: [],
    };
  },
  methods: {
    handleChange(v) {
      this.status = v;
    },
  },
  apollo: {
    getAllMPR: {
      query: GetAllMPR,
      variables() {
        return {
          status: this.status,
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getAllMPR } = data;
          this.items = getAllMPR;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
