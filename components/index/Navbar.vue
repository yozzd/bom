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
      <el-dropdown
        v-if="mpr.length"
        trigger="click"
        @command="handleToMpr"
        @visible-change="handleVisibleChange"
      >
        <el-link
          type="primary"
          :underline="false"
        >
          <client-only>
            <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
          </client-only>
        </el-link>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in mpr"
            :key="item.id"
            :command="item.id"
          >
            <div v-if="$auth.$state.user.isManager" class="flex items-center space-x-4">
              <el-tag size="mini" type="danger">
                New
              </el-tag>
              <div>Created MPR with an id {{ item.id }}</div>
            </div>
            <div v-else class="flex items-center space-x-4">
              <el-tag size="mini" type="success">
                Approved
              </el-tag>
              <div>Approved MPR with an id {{ item.id }}</div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
import maxBy from 'lodash/maxBy';
import Cookies from 'js-cookie';
import { GetMprNotifications } from '../../apollo/mpr/query';

export default {
  data() {
    return {
      len: 0,
      mpr: [],
      errors: [],
    };
  },
  mounted() {
    if (!Cookies.get('timestamps')) {
      const now = format(new Date(new Date().setHours(0, 1, 0)), 'yyyy-MM-dd HH:mm:ss');
      Cookies.set('timestamps', now, { sameSite: 'strict' });
    }
  },
  methods: {
    async handleCommand(name) {
      if (name === 'logout') await this.$auth.logout();
      else this.$router.push({ name });
    },
    handleVisibleChange(v) {
      this.len = 0;

      if (v && this.$auth.$state.user.isManager) {
        const { requestorTimestamp } = maxBy(this.mpr, 'requestorTimestamp');
        Cookies.set('timestamps', requestorTimestamp, { sameSite: 'strict' });
      } else if (v && this.$auth.$state.user.section === 213) {
        const { managerTimestamp } = maxBy(this.mpr, 'managerTimestamp');
        Cookies.set('timestamps', managerTimestamp, { sameSite: 'strict' });
      } else if (v && this.$auth.$state.user.section === 211) {
        const { whTimestamp } = maxBy(this.mpr, 'whTimestamp');
        Cookies.set('timestamps', whTimestamp, { sameSite: 'strict' });
      } else {
        const { bomTimestamp } = maxBy(this.mpr, 'bomTimestamp');
        Cookies.set('timestamps', bomTimestamp, { sameSite: 'strict' });
      }
    },
    handleToMpr(id) {
      this.$router.push({ name: 'mpr-id', params: { id } });
    },
  },
  apollo: {
    getMprNotifications: {
      query: GetMprNotifications,
      variables() {
        return {
          date: Cookies.get('timestamps'),
        };
      },
      skip() {
        return !Cookies.get('timestamps');
      },
      pollInterval: 120000,
      fetchPolicy: 'no-cache',
      result({ data, loading }) {
        if (!loading) {
          const { getMprNotifications } = data;
          this.len = getMprNotifications.length;
          this.mpr = getMprNotifications;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
