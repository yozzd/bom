<template>
  <div>
    <el-dialog
      title="Edit"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="50%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
        class="grid grid-cols-5"
      >
        <div class="col-span-3 col-start-2 grid grid-cols-2 gap-x-4">
          <el-form-item
            label="PO Issue"
            prop="poIssue"
          >
            <el-date-picker
              v-model="form.poIssue"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Approval Date"
            prop="approvalDate"
          >
            <el-date-picker
              v-model="form.approvalDate"
              type="date"
              value-format="yyyy-MM-dd"
              :disabled="$auth.$state.user.section !== 219"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Zone">
            <el-select v-model="form.poZone" filterable>
              <el-option
                v-for="item in zones"
                :key="item.zone"
                :label="item.zone"
                :value="item.zone"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Po No."
            prop="poNo"
          >
            <el-input v-model="form.poNo"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleUpdate('form')"
        >
          Update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetZones } from '../../apollo/outstandingPo/query';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        poIssue: '',
        approvalDate: '',
        poZone: '',
        poNo: '',
      },
      rules: {
        poIssue: [{ required: true, message: 'This field is required' }],
      },
      zones: [],
    };
  },
  watch: {
    data(value) {
      this.form = value;
    },
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    handleCancel() {
      this.$emit('close', false);
    },
    handleUpdate(form) {
      console.log(form);
    },
  },
  apollo: {
    getZones: {
      query: GetZones,
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
</script>
