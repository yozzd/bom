<template>
  <div class="min-h-screen grid grid-cols-5 items-center">
    <div></div>
    <div></div>
    <div class="flex flex-col space-y-4">
      <div class="text-2xl text-center font-bold">
        BOM
      </div>

      <IndexErrorHandler
        v-if="errors"
        :errors="errors"
      />

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
        class="w-full"
        @submit.native.prevent="submitForm('form')"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <div class="mt-12">
          <el-button type="primary" native-type="submit" class="w-full">
            Login
          </el-button>
        </div>
      </el-form>
    </div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'This field is required', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'This field is required', trigger: 'blur' },
        ],
      },
      errors: [],
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            await this.$auth.login({
              username: this.form.username,
              password: this.form.password,
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
