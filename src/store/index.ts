import { createStore } from "vuex";

export default createStore({
  state: {
    totalTodos: 0,
  },
  getters: {},
  mutations: {
    increment(state) {
      state.totalTodos++; // increase totalTodos
    },
    setTotalTodos(state, count: number) {
      state.totalTodos = count; // set value
    },
  },
  actions: {},
  modules: {},
});
