<template>
  <div>
    <el-dialog
      title="Add"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="40%"
    >
      <IndexErrorHandler
        v-if="errors.length"
        :errors="errors"
        class="mb-4"
      />

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        class="grid xl:grid-cols-5"
      >
        <div class="xl:col-span-3 xl:col-start-2">
          <el-form-item
            label="Supplier Name"
            prop="suplierNM"
          >
            <el-input v-model="form.suplierNM"></el-input>
          </el-form-item>
          <el-form-item
            label="Contact Person"
            prop="ContactPerson"
          >
            <el-input v-model="form.ContactPerson"></el-input>
          </el-form-item>
          <el-form-item
            label="Address"
            prop="Address"
          >
            <el-input
              v-model="form.Address"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Country"
            prop="Country"
          >
            <el-input v-model="form.Country"></el-input>
          </el-form-item>
          <el-form-item
            label="Post Code"
            prop="PostCode"
          >
            <el-input v-model="form.PostCode"></el-input>
          </el-form-item>
          <el-form-item
            label="Phone"
            prop="OfficePhone"
          >
            <el-input v-model="form.OfficePhone"></el-input>
          </el-form-item>
          <el-form-item
            label="Fax No."
            prop="FaxNo"
          >
            <el-input v-model="form.FaxNo"></el-input>
          </el-form-item>
          <el-form-item
            label="Email"
            prop="Email"
          >
            <el-input v-model="form.Email"></el-input>
          </el-form-item>
          <el-form-item
            label="Homepage"
            prop="HomePage"
          >
            <el-input v-model="form.HomePage"></el-input>
          </el-form-item>
          <el-form-item
            label="Remark"
            prop="Remark"
          >
            <client-only>
              <IndexEditor v-model="form.Remark" />
            </client-only>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          @click="handleCancel"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllSupplier } from '../../apollo/supplier/query';
import { AddSupplier } from '../../apollo/supplier/mutation';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        suplierNM: '',
        ContactPerson: '',
        Address: '',
        Country: '',
        PostCode: '',
        OfficePhone: '',
        FaxNo: '',
        Email: '',
        HomePage: '',
        Remark: '',
      },
      rules: {
        suplierNM: [{ required: true, message: 'This field is required' }],
      },
      loading: false,
      visible: false,
      errors: [],
    };
  },
  watch: {
    show(value) {
      this.visible = value;
    },
  },
  methods: {
    handleCancel() {
      this.$refs.form.resetFields();
      this.errors = [];
      this.$emit('close', false);
    },
    handleSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;

            await this.$apollo.mutate({
              mutation: AddSupplier,
              variables: {
                input: {
                  suplierNM: this.form.suplierNM,
                  ContactPerson: this.form.ContactPerson,
                  Address: this.form.Address,
                  Country: this.form.Country,
                  PostCode: this.form.PostCode,
                  OfficePhone: this.form.OfficePhone,
                  FaxNo: this.form.FaxNo,
                  Email: this.form.Email,
                  HomePage: this.form.HomePage,
                  Remark: this.form.Remark,
                },
              },
              update: (store, { data: { addSupplier } }) => {
                const cdata = store.readQuery({
                  query: GetAllSupplier,
                });

                cdata.getAllSupplier.push(addSupplier);

                store.writeQuery({
                  query: GetAllSupplier,
                  data: cdata,
                });
              },
            });

            this.$message({
              type: 'success',
              message: 'Data has been saved successfully',
              onClose: setTimeout(() => {
                this.handleCancel();
                this.loading = false;
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
