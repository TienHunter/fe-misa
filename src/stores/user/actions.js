import UserService from "@/api/services/userService";
import VueCookies from "vue-cookies";
import router from "@/router";
const actions = {
  getUserInfor({ state, commit, dispatch }, payload) {
    commit("SET_USER_INFO", payload);
  },

  async login({ state, rootState, commit, dispatch }, payload) {
    try {
      dispatch("toggleLoading");
      let res = await UserService.login(payload);
      if (res) {
        VueCookies.set("token", res.Token); // Lưu token vào cookies
        dispatch("getUserInfor", res.User);
        dispatch("toggleLoading");
        // redirect
        router.push({ name: "Directory", params: {} });
      }
    } catch (error) {
      dispatch("toggleLoading");
    } finally {
    }
  },
};

export default actions;
