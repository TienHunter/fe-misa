const global = {
  state: {
    isLoading: false,
    toast: {
      isShow: false,
      type: "",
      content: "",
    },
  },
  getters: {},
  mutations: {
    TOGGLE_LOADING(state) {
      state.isLoading = !state.isLoading;
    },
    SET_TOAST(state, payload) {
      state.toast = { ...payload };
    },
  },
  actions: {
    toggleLoading({ commit }) {
      commit("TOGGLE_LOADING");
    },
    getToast({ commit }, payload) {
      if (payload) commit("SET_TOAST", payload);
      else
        commit("SET_TOAST", {
          isShow: false,
        });
    },
  },
};
export default global;
