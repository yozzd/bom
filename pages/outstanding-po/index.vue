<template>
  <OutstandingPo />
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'MRP System - OUTSTANDING PO',
    };
  },
};
</script>
