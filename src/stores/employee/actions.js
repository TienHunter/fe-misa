import axios from "@/api/axios";

const actions = {
  async getEmployeeList({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      const res = await axios.get("");
      const data = res?.data ?? [];
      commit("SET_EMPLOYEE_LIST", data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch("toggleLoading");
    }
  },
  fakeGetEmployeeList({ commit }, payload) {
    commit("SET_EMPLOYEE_LIST", payload);
  },

  toggleEmployeeDetail({ commit }) {
    commit("TOGGLE_EMPLOYEE_DETAIL");
  },
};

export default actions;
