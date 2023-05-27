const mutations = {
  SET_EMPLOYEE_LIST(state, payload) {
    state.employeeList = [...payload];
  },
  SET_EMPLOYEE_DETAIL(state, payload) {
    state.employeeDetail = { ...payload };
  },
  TOGGLE_EMPLOYEE_DETAIL(state) {
    state.isEmployeeDetail = !state.isEmployeeDetail;
  },
};
export default mutations;
