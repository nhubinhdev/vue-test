<script setup lang="ts">
  import { useStore } from "vuex";
  import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";

  const store = useStore();

  const STORAGE_KEY = "vue-testtodos";

  const filters = {
    all: (todos: Todo[]) => todos,
    active: (todos: Todo[]) => todos.filter((todo) => !todo.completed),
    completed: (todos: Todo[]) => todos.filter((todo) => todo.completed),
  };

  // state
  const todos = ref<Todo[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );
  const visibility = ref<keyof typeof filters>("all");
  const editedTodo = ref<Todo | null>(null);

  // derived state
  const filteredTodos = computed(() => filters[visibility.value](todos.value));
  const remaining = computed(() => filters.active(todos.value).length);

  // persist state
  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
  });

  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") || [];
    store.commit("setTotalTodos", list?.length);
  });

  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });

  function toggleAll(e: Event) {
    const target = e.target as HTMLInputElement;
    todos.value.forEach((todo) => (todo.completed = target.checked));
  }

  function addTodo(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value.trim();
    if (value) {
      todos.value.push({
        id: Date.now(),
        title: value,
        completed: false,
      });
      target.value = "";

      // update total to-do created in localStorage
      const totalCreated = JSON.parse(
        localStorage.getItem("totalCreated") || "0"
      );
      localStorage.setItem("totalCreated", JSON.stringify(totalCreated + 1));

      // use vuex
      store.commit("increment");
    }
  }

  function removeTodo(todo: Todo) {
    todos.value.splice(todos.value.indexOf(todo), 1);
  }

  let beforeEditCache = "";
  function editTodo(todo: Todo) {
    beforeEditCache = todo.title;
    editedTodo.value = todo;
  }

  function cancelEdit(todo: Todo) {
    editedTodo.value = null;
    todo.title = beforeEditCache;
  }

  function doneEdit(todo: Todo) {
    if (editedTodo.value) {
      editedTodo.value = null;
      todo.title = todo.title.trim();
      if (!todo.title) removeTodo(todo);
    }
  }

  function removeCompleted() {
    todos.value = filters.active(todos.value);
  }

  function onHashChange() {
    const route = window.location.hash.replace(/#\/?/, "");
    if (filters[route as keyof typeof filters]) {
      visibility.value = route as keyof typeof filters;
    } else {
      window.location.hash = "";
      visibility.value = "all";
    }
  }

  interface Todo {
    id: number;
    title: string;
    completed: boolean;
  }
</script>

<template>
  <div class="container">
    <section class="instructions">
      <h1 class="instructions__title">Test Instructions</h1>
      <ol class="instructions__content">
        <li>Make this page responsive (including these instructions).</li>
        <li>
          Create a new (separate) page that tracks the total number of created
          to-do items on this page. The total number of created to-do items
          displayed on the new page must not reset when I clear them on page 1.
          They should be persistent.
        </li>
        <li>
          Fix any of the generic design and formatting errors introduced in this
          document.
        </li>
      </ol>
    </section>

    <section class="todoapp">
      <header class="header">
        <h1>To Do List</h1>
        <input
          class="new-todo"
          autofocus
          placeholder="What needs to be done?"
          @keyup.enter="addTodo"
        />
      </header>
      <section class="main" v-show="todos.length">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          :checked="remaining === 0"
          @change="toggleAll"
        />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <li
            v-for="todo in filteredTodos"
            class="todo"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo === editedTodo }"
          >
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.completed" />
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input
              v-if="todo === editedTodo"
              class="edit"
              type="text"
              v-model="todo.title"
              @vue:mounted="({ el }: any) => el.focus()"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.escape="cancelEdit(todo)"
            />
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todos.length">
        <span class="todo-count">
          <strong>{{ remaining }}</strong>
          <span>{{ remaining === 1 ? " item" : " items" }} left</span>
        </span>
        <ul class="filters">
          <li>
            <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
          </li>
          <li>
            <a href="#/active" :class="{ selected: visibility === 'active' }"
              >Active</a
            >
          </li>
          <li>
            <a
              href="#/completed"
              :class="{ selected: visibility === 'completed' }"
              >Completed</a
            >
          </li>
        </ul>
        <button
          class="clear-completed"
          @click="removeCompleted"
          v-show="todos.length > remaining"
        >
          Clear completed
        </button>
      </footer>
    </section>
  </div>
</template>

<style lang="css" scoped>
  .instructions__title {
    text-align: center;
  }
  .instructions__content {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
</style>
