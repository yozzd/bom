<template>
  <div></div>
</template>

<script>
export default {
  middleware: [
    ({ redirect }) => {
      redirect({ name: 'bom' });
    },
  ],
};
</script>
