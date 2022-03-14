<template>
  <div class="navbar">
    <div class="flex items-center">
      <nuxt-link to="/bom/">
        BOM
      </nuxt-link>
      <nuxt-link to="/mpr/">
        MPR
      </nuxt-link>
    </div>
    <div class="flex-1"></div>
    <el-dropdown trigger="click" @command="handleCommand">
      <el-link
        type="primary"
        :underline="false"
      >
        {{ $auth.$state.user.fullname }}
        <outline-chevron-down-icon class="heroicons heroicons-right w-4 h-4" />
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
export default {
  methods: {
    async handleCommand(name) {
      if (name === 'logout') await this.$auth.logout();
      else this.$router.push({ name });
    },
  },
};
</script>
