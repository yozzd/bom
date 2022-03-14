<template>
  <IndexHome />
</template>

<script>
export default {
  layout: 'home',
  middleware: ['auth'],
};
</script>
