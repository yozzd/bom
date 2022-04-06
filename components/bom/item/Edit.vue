<template>
  <div>
    Edit Item
  </div>
</template>

<script>
import { GetOneITEM } from '../../../apollo/bom/query';

export default {
  apollo: {
    getOneITEM: {
      query: GetOneITEM,
      variables() {
        return {
          id: parseInt(this.$route.params.id, 10),
          isMpr: parseInt(this.$route.params.isMpr, 10),
        };
      },
      prefetch: false,
      result({ data, loading }) {
        if (!loading) {
          const { getOneITEM } = data;
          console.log(getOneITEM);
        }
      },
    },
  },
};
</script>
