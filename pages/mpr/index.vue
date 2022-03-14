<template>
  <Mpr />
</template>

<script>
export default {
  layout: 'layout1',
  middleware: ['auth'],
  head() {
    return {
      title: 'MPR',
    };
  },
};
</script>
