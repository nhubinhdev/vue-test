<script lang="ts" setup>
  import TheHeader from "./components/TheHeader.vue";
</script>

<template>
  <div>
    <TheHeader />

    <router-view />
  </div>
</template>

<style lang="css">
  @import "assets/style.css";
</style>
