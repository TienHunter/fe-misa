const mutations = {
  SET_USER_INFO(state, payload) {
    state.userInfo = { ...payload };
  },
};
export default mutations;
