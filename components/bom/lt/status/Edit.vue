<template>
  <div>
    <el-dialog
      title="Edit"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="40%"
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
          <IndexErrorHandler
            v-if="errors.length"
            :errors="errors"
            class="col-span-2 mb-4"
          />

          <el-form-item
            label="Issue"
            prop="issued"
          >
            <el-date-picker
              v-model="form.issued"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="Cat No."
            prop="cat"
          >
            <el-input v-model="form.cat"></el-input>
          </el-form-item>
          <el-form-item
            label="Model"
            prop="model"
            class="col-span-2"
          >
            <el-input
              v-model="form.model"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Product Name"
            prop="product"
            class="col-span-2"
          >
            <el-input
              v-model="form.product"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="PIC"
            prop="pic"
            class="col-span-2"
          >
            <el-select
              v-model="form.pic"
              filterable
            >
              <el-option
                v-for="item in pics"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="RND In-Charge"
            prop="rndic"
            class="col-span-2"
          >
            <el-input v-model="form.rndic"></el-input>
          </el-form-item>
          <el-form-item
            label="Unit"
            prop="unit"
          >
            <el-input v-model="form.unit"></el-input>
          </el-form-item>
          <el-form-item
            label="Budget"
            prop="budget"
          >
            <el-input v-model="form.budget"></el-input>
          </el-form-item>
          <el-form-item
            label="Refer"
            prop="refer"
            class="col-span-2"
          >
            <el-input v-model="form.refer"></el-input>
          </el-form-item>
          <el-form-item
            label="Stage"
            prop="stage"
          >
            <el-select
              v-model="form.stage"
              filterable
            >
              <el-option
                v-for="item in stages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Status"
            prop="status"
          >
            <el-select
              v-model="form.status"
              filterable
            >
              <el-option
                v-for="item in statuses"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
          @click="handleUpdate"
        >
          Update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { UpdateWo } from '../../../../apollo/bom/mutation';

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
      form: {},
      rules: {},
      visible: false,
      loading: false,
      errors: [],
      pics: [
        { label: 'No PIC', value: 0 },
        { label: '[Electronic, HVAC, Mechanical]', value: 8 },
        { label: 'Electronic', value: 1 },
        { label: 'HVAC', value: 2 },
        { label: 'Mechanical', value: 3 },
        { label: 'Information Technology', value: 4 },
        { label: 'Sales Marketing & Support', value: 5 },
        { label: 'Customer Sevice & Installation Training Support', value: 6 },
        { label: 'Ennovation', value: 7 },
        { label: 'General Affair & Human Resource Management', value: 9 },
        { label: 'R & D', value: 10 },
      ],
      stages: [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ],
      statuses: [
        { label: 'Running', value: 0 },
        { label: 'Close', value: 1 },
        { label: 'Validasi Approval', value: 2 },
        { label: 'Temporary', value: 3 },
      ],
    };
  },
  watch: {
    data(value) {
      this.form = { ...value };
    },
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    handleCancel() {
      this.loading = false;
      this.errors = [];
      this.$emit('close', false);
    },
    handleUpdate() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            await this.$apollo.mutate({
              mutation: UpdateWo,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  issued: this.form.issued,
                  cat: this.form.cat,
                  model: this.form.model,
                  product: this.form.product,
                  pic: parseInt(this.form.pic, 10),
                  rndic: this.form.rndic,
                  unit: parseInt(this.form.unit, 10),
                  budget: parseInt(this.form.budget, 10),
                  refer: this.form.refer,
                  stage: parseInt(this.form.stage, 10),
                  status: parseInt(this.form.status, 10),
                },
              },
            });

            this.$message({
              type: 'success',
              message: 'Data has been updated successfully',
              onClose: setTimeout(() => {
                this.handleCancel();
              }, 1000),
            });

            return true;
          } catch ({ graphQLErrors, networkError }) {
            this.errors = graphQLErrors || networkError.result.errors;
            return false;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
