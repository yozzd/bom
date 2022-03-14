<template>
  <OutstandingPo />
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'OUTSTANDING PO',
    };
  },
};
</script>
