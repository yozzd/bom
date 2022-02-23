<template>
  <div class="navbar">
    <div class="flex space-x-8 items-center">
      <nuxt-link to="/">
        Bom
      </nuxt-link>
      <nuxt-link to="/mpr/">
        Mpr
      </nuxt-link>
    </div>
    <div class="flex-1"></div>
    <el-dropdown trigger="click" @command="handleCommand">
      <el-link
        type="primary"
        :underline="false"
      >
        {{ $auth.$state.user.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
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
