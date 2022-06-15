<template>
  <IndexHome />
</template>

<script>
export default {
  layout: 'home',
  middleware: ['auth'],
  head() {
    return {
      title: 'MRP System - HOME',
    };
  },
};
</script>
