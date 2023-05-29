const global = {
  state: {
    isLoading: false,
    toast: {
      isShow: false,
      type: "",
      content: "",
    },
    isSidebarShrink: false,
  },
  getters: {},
  mutations: {
    TOGGLE_LOADING(state) {
      state.isLoading = !state.isLoading;
    },
    SET_TOAST(state, payload) {
      state.toast = { ...payload };
    },
    TOGGLE_SIDEBAR_SHRINK(state) {
      state.isSidebarShrink = !state.isSidebarShrink;
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
    toggleSidebarShrink({ commit }) {
      commit("TOGGLE_SIDEBAR_SHRINK");
    },
  },
};
export default global;
