<template>
  <div class="grid grid-cols-2 gap-4 items-start">
    <nuxt-link :to="{ name: 'bom'}" class="card-button">
      <div>
        01
      </div>
      <div class="text-3xl">
        BOM
      </div>
    </nuxt-link>
    <nuxt-link :to="{ name: 'mpr'}" class="card-button">
      <div>
        02
      </div>
      <div class="text-3xl">
        MPR
      </div>
    </nuxt-link>
    <nuxt-link :to="{ name: 'outstanding-po'}" class="card-button">
      <div>
        03
      </div>
      <div class="text-3xl">
        OUTSTANDING PO
      </div>
    </nuxt-link>
    <nuxt-link :to="{ name: 'wmr'}" class="card-button">
      <div>
        04
      </div>
      <div class="text-3xl">
        WMR
      </div>
    </nuxt-link>
  </div>
</template>
