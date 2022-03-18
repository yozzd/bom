<template>
  <div class="flex flex-col space-y-8">
    <div class="flex">
      <el-button
        type="primary"
        @click="showFilter"
      >
        <outline-filter-icon class="heroicons w-4 h-4" />
        Filter
      </el-button>
    </div>

    <IndexErrorHandler
      v-if="errors"
      :errors="errors"
    />

    <el-dialog
      title="Filter"
      :visible.sync="showFilterDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="Filter By Zones">
          <el-radio-group v-model="form.zone">
            <el-radio
              v-for="(v, k) in zones"
              :key="k"
              :label="v"
              class="blk"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="showFilterDialog = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleFilter('form')"
        >
          Filter
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import outp from '../../mixins/outstanding.po.zones';
// import { GetAllOutstandingPo } from '../../apollo/outstandingPo/query';

export default {
  mixins: [outp],
  data() {
    return {
      showFilterDialog: false,
      loading: false,
      form: {},
      items: {},
      errors: [],
    };
  },
  methods: {
    showFilter() {
      this.showFilterDialog = true;
    },
    handleFilter() {
      const zone = parseInt(
        (Object.keys(this.zones).find((key) => this.zones[key] === this.form.zone)
        ), 10,
      ) + 1;
      console.log(zone);
    },
  },
  // apollo: {
  //   getAllOutstandingPo: {
  //     query: GetAllOutstandingPo,
  //     prefetch: false,
  //     result({ data, loading }) {
  //       if (!loading) {
  //         const { getAllOutstandingPo } = data;
  //         this.items = getAllOutstandingPo;
  //       }
  //     },
  //     error({ graphQLErrors, networkError }) {
  //       this.errors = graphQLErrors || networkError.result.errors;
  //     },
  //   },
  // },
};
</script>
