<template>
  <div class="grid grid-cols-3">
    <div class="flex flex-col space-y-4 col-start-2">
      <div class="flex items-center">
        <nuxt-link
          :to="{
            name: 'bom-wo-idLt-id', params: { idLt: wo.idLt, id: wo.id }
          }"
          class="flex-1"
        >
          <outline-arrow-left-icon class="heroicons w-4 h-4" />
          Back
        </nuxt-link>
        <div class="text-xl">
          Edit Item
        </div>
      </div>

      <IndexErrorHandler
        v-if="errors.length"
        :errors="errors"
      />

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <div class="grid grid-cols-2 gap-x-4">
          <el-form-item
            label="Material CD"
            prop="idMaterial"
            class="col-span-2"
          >
            <el-input v-model="form.idMaterial"></el-input>
          </el-form-item>
          <el-form-item
            label="Description"
            prop="bomDescription"
            class="col-span-2"
          >
            <el-input v-model="form.bomDescription" type="textarea"></el-input>
          </el-form-item>
          <el-form-item
            label="Specification"
            prop="bomSpecification"
            class="col-span-2"
          >
            <el-input v-model="form.bomSpecification" type="textarea"></el-input>
          </el-form-item>
          <el-form-item
            label="Brand"
            prop="bomBrand"
          >
            <el-input v-model="form.bomBrand"></el-input>
          </el-form-item>
          <el-form-item
            label="Model"
            prop="bomModel"
          >
            <el-input v-model="form.bomModel"></el-input>
          </el-form-item>
          <el-form-item
            label="Qty"
            prop="bomQty"
          >
            <el-input v-model="form.bomQty"></el-input>
          </el-form-item>
          <el-form-item
            label="Unit"
            prop="bomUnit"
          >
            <el-input v-model="form.bomUnit"></el-input>
          </el-form-item>
          <el-form-item
            label="Stock Qty"
            prop="bomQtyStock"
          >
            <el-input v-model="form.bomQtyStock"></el-input>
          </el-form-item>
          <el-form-item
            label="Requirement"
          >
            {{ form.bomQty * wo.unit }}
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetOneITEM } from '../../../apollo/bom/query';

export default {
  data() {
    return {
      form: {
        idMaterial: '',
        bomDescription: '',
        bomSpecification: '',
        bomBrand: '',
        bomModel: '',
        bomQty: '',
        bomUnit: '',
        bomQtyStock: '',
      },
      wo: {},
      rules: {
        bomDescription: [{ required: true, message: 'This field is required' }],
      },
      errors: [],
    };
  },
  apollo: {
    getOneITEM: {
      query: GetOneITEM,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
          isMpr: parseInt(this.$route.params.isMpr, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneITEM: { wo, ...form } } = data;
          this.form = form;
          this.wo = wo;
        }
      },
    },
  },
};
</script>
