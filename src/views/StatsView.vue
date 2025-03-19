<script setup>
  import { ref, onMounted } from "vue";
  import { useStore } from "vuex";

  const store = useStore();

  const totalCreated = ref(0);

  onMounted(() => {
    totalCreated.value = JSON.parse(
      localStorage.getItem("totalCreated") || "0"
    );
  });
</script>

<template>
  <div class="container statistic">
    <h1 class="statistic__title">Statistics</h1>

    <div class="statistic__content">
      <p>
        Using localStorage, count the number of todos created since the first
        page opened (not lost on reload)
      </p>
      <p>Total todos created: {{ totalCreated }}</p>
    </div>

    <div class="statistic__content">
      <p class="">
        Using Vuex, count the number of todos created since the last page reload
        <br />
        If the page is reloaded, count again from existing todos
      </p>
      <p>Total todos created: {{ store.state.totalTodos }}</p>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .statistic__title {
    text-align: center;
  }
  .statistic__content {
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    border-bottom: 1px solid grey;
  }
</style>
