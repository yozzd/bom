<template>
  <div class="grid grid-cols-3">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
      class="col-start-2"
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
      </div>
    </el-form>
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
      },
      rules: {
        bomDescription: [{ required: true, message: 'This field is required' }],
      },
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
          const { getOneITEM } = data;
          this.form = getOneITEM;
        }
      },
    },
  },
};
</script>
