<template>
  <Supplier />
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'MRP System - Supplier',
    };
  },
};
</script>
