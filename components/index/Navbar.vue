<template>
  <div class="navbar">
    <div class="flex items-center">
      <nuxt-link :to="{ name: 'index' }" exact>
        <client-only>
          <v-icon name="ri-home-4-line" class="remixicons w-4 h-4" />
        </client-only>
      </nuxt-link>
      <nuxt-link :to="{ name: 'bom' }">
        BOM
      </nuxt-link>
      <nuxt-link :to="{ name: 'mpr' }">
        <el-badge v-if="len" :value="len" class="item">
          MPR
        </el-badge>
        <span v-else>
          MPR
        </span>
      </nuxt-link>
      <nuxt-link :to="{ name: 'outstanding-po' }">
        OUTSTANDING PO
      </nuxt-link>
    </div>
    <div class="flex-1"></div>
    <el-dropdown trigger="click" @command="handleCommand">
      <el-link
        type="primary"
        :underline="false"
      >
        {{ $auth.$state.user.fullname }}
        <client-only>
          <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
        </client-only>
      </el-link>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">
          Logout
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { GetMprNotifications } from '../../apollo/mpr/query';

export default {
  data() {
    return {
      len: 0,
      errors: [],
    };
  },
  methods: {
    async handleCommand(name) {
      if (name === 'logout') await this.$auth.logout();
      else this.$router.push({ name });
    },
  },
  apollo: {
    getMprNotifications: {
      query: GetMprNotifications,
      variables() {
        return {
          date: format(new Date(), 'yyyy-MM-dd'),
        };
      },
      pollInterval: 15000,
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getMprNotifications } = data;
          this.len = getMprNotifications.length;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
