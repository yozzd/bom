<template>
  <WmrItem />
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'MRP System - WMR',
    };
  },
};
</script>
