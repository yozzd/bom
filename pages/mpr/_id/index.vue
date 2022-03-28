<template>
  <MprDetail />
</template>

<script>
export default {
  layout: 'layout2',
  middleware: ['auth'],
  head() {
    return {
      title: 'MPR',
    };
  },
};
</script>
