<template>
  <div>
    <el-dialog
      title="Edit Module"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
      width="30%"
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
      >
        <el-form-item label="Title">
          <el-input v-model="form.hid"></el-input>
        </el-form-item>
        <el-form-item label="" prop="header">
          <el-input v-model="form.header"></el-input>
        </el-form-item>
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
import { GetOneWO } from '../../../../apollo/bom/query';
import { UpdateWoModule } from '../../../../apollo/bom/mutation';

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
      rules: {
        header: [{ required: true, message: 'This field is required' }],
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
    data(value) {
      this.form = { ...value };
    },
  },
  methods: {
    handleCancel() {
      this.form = {};
      this.errors = [];
      this.$emit('close', false);
    },
    async handleSave() {
      try {
        this.loading = false;

        await this.$apollo.mutate({
          mutation: UpdateWoModule,
          variables: {
            input: {
              id: parseInt(this.form.id, 10),
              hid: this.form.hid,
              header: this.form.header,
            },
          },
          update: async (store, { data: { updateWoModule } }) => {
            const cdata = store.readQuery({
              query: GetOneWO,
              variables: {
                idLt: parseInt(this.$route.params.idLt, 10),
                id: parseInt(this.$route.params.id, 10),
              },
            });

            const index = cdata.getOneWO.wo.modules.findIndex((e) => e.id === this.form.id);
            cdata.getOneWO.wo.modules[index] = updateWoModule;

            store.writeQuery({
              query: GetOneWO,
              variables: {
                idLt: parseInt(this.$route.params.idLt, 10),
                id: parseInt(this.$route.params.id, 10),
              },
              data: cdata,
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateWoModule: this.form,
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
    },
  },
};
</script>
