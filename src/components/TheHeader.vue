<script lang="ts" setup></script>

<template>
  <div class="header">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/stats">Statistics</router-link>
    </nav>
  </div>
</template>

<style lang="css" scoped>
  .header {
    background-color: #e7f7fe;
    position: sticky;
    z-index: 9999;
    top: 0;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 0;
  }

  nav a {
    text-decoration: none;
    color: #3abff8;
    font-weight: bold;
    padding: 16px;
  }

  nav a.router-link-exact-active {
    background-color: #3abff8;
    color: white;
  }
</style>
