<template>
  <div class="grid grid-cols-3">
    <div class="flex flex-col space-y-4 col-start-2 mb-20">
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
          <el-form-item
            label="ETA"
            prop="bomEta"
            class="col-span-2"
          >
            <el-date-picker
              v-model="form.bomEta"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="W/H Qty Received"
            prop="bomQtyRec"
          >
            <el-input v-model="form.bomQtyRec"></el-input>
          </el-form-item>
          <el-form-item
            label="W/H Date Received"
            prop="bomDateRec"
          >
            <el-date-picker
              v-model="form.bomDateRec"
              type="date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="PO curr/size"
            prop="bomCurrSizeC"
          >
            <el-select v-model="form.bomCurrSizeC" filterable>
              <el-option
                v-for="item in currency"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Value"
            prop="bomCurrSizeV"
          >
            <el-input v-model="form.bomCurrSizeV"></el-input>
          </el-form-item>
          <el-form-item
            label="PO curr/ea"
            prop="bomCurrEaC"
          >
            <el-select v-model="form.bomCurrEaC" filterable>
              <el-option
                v-for="item in currency"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Value"
            prop="bomCurrEaV"
          >
            <el-input v-model="form.bomCurrEaV"></el-input>
          </el-form-item>
        </div>
        <div class="flex justify-end space-x-8 mt-8">
          <el-button type="text" @click="handleCancel">
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
      </el-form>
    </div>
  </div>
</template>

<script>
import currency from '../../../mixins/currency';
import { GetOneITEM } from '../../../apollo/bom/query';
import { UpdateITEM } from '../../../apollo/bom/mutation';

export default {
  mixins: [currency],
  data() {
    return {
      loading: false,
      form: {
        idMaterial: '',
        bomDescription: '',
        bomSpecification: '',
        bomBrand: '',
        bomModel: '',
        bomQty: '',
        bomUnit: '',
        bomQtyStock: '',
        bomEta: '',
        bomQtyRec: '',
        bomDateRec: '',
        bomCurrSizeC: '',
        bomCurrSizeV: '',
        bomCurrEaC: '',
        bomCurrEaV: '',
      },
      wo: {
        id: 1,
        idLt: 1,
        unit: 1,
      },
      rules: {
        bomDescription: [{ required: true, message: 'This field is required' }],
      },
      errors: [],
    };
  },
  methods: {
    handleCancel() {
      this.errors = [];
      this.$router.push({ name: 'bom-wo-idLt-id', params: { idLt: this.wo.idLt, id: this.wo.id } });
    },
    handleUpdate(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            await this.$apollo.mutate({
              mutation: UpdateITEM,
              variables: {
                input: {
                  id: parseInt(this.form.id, 10),
                  idMaterial: parseInt(this.form.idMaterial, 10),
                  bomDescription: this.form.bomDescription,
                  bomSpecification: this.form.bomSpecification,
                  bomModel: this.form.bomModel,
                  bomBrand: this.form.bomBrand,
                  bomQty: parseFloat(this.form.bomQty),
                  bomUnit: this.form.bomUnit,
                  bomQtyStock: parseFloat(this.form.bomQtyStock),
                  bomEta: this.form.bomEta,
                  bomQtyRec: parseFloat(this.form.bomQtyRec),
                  bomDateRec: this.form.bomDateRec,
                  bomCurrSizeC: this.form.bomCurrSizeC,
                  bomCurrSizeV: parseFloat(this.form.bomCurrSizeV),
                  bomCurrEaC: this.form.bomCurrEaC,
                  bomCurrEaV: parseFloat(this.form.bomCurrEaV),
                  isMpr: parseInt(this.$route.params.isMpr, 10),
                  unit: parseInt(this.wo.unit, 10),
                  euro: parseFloat(this.wo.euro),
                  gbp: parseFloat(this.wo.gbp),
                  myr: parseFloat(this.wo.myr),
                  idr: parseFloat(this.wo.idr),
                  sgd: parseFloat(this.wo.sgd),
                },
              },
            });

            this.$message({
              type: 'success',
              message: 'Data has been updated successfully',
              onClose: setTimeout(() => {
                this.handleCancel();
                this.loading = false;
              }, 3000),
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
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
