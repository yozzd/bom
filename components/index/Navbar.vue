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
        <el-dropdown-menu
          slot="dropdown"
          class="notification"
        >
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
              <div class="text-xs">
                {{ ago(item.requestorTimestamp) }}
              </div>
            </div>
            <div v-else class="flex items-center space-x-4">
              <el-tag size="mini" type="success">
                Approved
              </el-tag>
              <div>Approved MPR with an id {{ item.id }}</div>
              <div
                v-if="$auth.$state.user.section === 213"
                class="text-xs"
              >
                {{ ago(item.managerTimestamp) }}
              </div>
              <div
                v-else-if="$auth.$state.user.section === 211"
                class="text-xs"
              >
                {{ ago(item.whTimestamp) }}
              </div>
              <div
                v-else
                class="text-xs"
              >
                {{ ago(item.bomTimestamp) }}
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <nuxt-link :to="{ name: 'outstanding-po' }">
        OUTSTANDING PO
      </nuxt-link>
      <!--<nuxt-link :to="{ name: 'wmr' }">
        WMR
      </nuxt-link>-->
    </div>
    <div class="flex-1"></div>
    <div class="flex space-x-2">
      <el-dropdown
        v-if="users.includes($auth.$state.user.section)"
        trigger="click"
        @command="handleMaster"
      >
        <el-link
          type="primary"
          :underline="false"
        >
          Master
          <client-only>
            <v-icon name="ri-arrow-down-s-line" class="remixicons w-4 h-4" />
          </client-only>
        </el-link>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="supplier">
            Supplier
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
  </div>
</template>

<script>
import { format, formatDistance } from 'date-fns';
import maxBy from 'lodash/maxBy';
import Cookies from 'js-cookie';
import { GetMprNotifications } from '../../apollo/mpr/query';

export default {
  data() {
    return {
      len: 0,
      mpr: [],
      users: [211, 212, 213, 214, 219],
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
    handleMaster(name) {
      this.$router.push({ name });
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
    ago(v) {
      return formatDistance(new Date(v), new Date(), { addSuffix: true });
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
          if (this.len) {
            this.mpr.push(...getMprNotifications);
          }
        }
      },
      error({ graphQLErrors, networkError }) {
        this.errors = graphQLErrors || networkError.result.errors;
      },
    },
  },
};
</script>
