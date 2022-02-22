<template>
  <div class="flex flex-col justify-center items-center bg-gray-100 h-screen">
    <i class="el-icon-warning-outline text-9xl mb-8"></i>
    <h1 class="text-xl">
      Blocked Access!
    </h1>
    <p>You have no authority to access this page!</p>
    <p>
      Back to <nuxt-link :to="{ name: 'index-home' }">
        Home
      </nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Blocked Access!',
    };
  },
};
</script>
