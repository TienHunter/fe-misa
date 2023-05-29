const mutations = {
  SET_EMPLOYEE_LIST(state, payload) {
    state.employeeList = [...payload];
  },
  SET_EMPLOYEE_DETAIL(state, payload) {
    state.employeeDetail = { ...payload };
  },
  SET_POPUP_STATUS(state, payload) {
    state.popupStatus = { ...payload };
  },
  SET_DIALOG(state, payload) {
    state.employeeDialog = { ...payload };
  },
  CREATE_EMPLOYEE(state, payload) {
    let newEmployee = { ...payload };
    state.employeeList.unshift(newEmployee);
  },
};
export default mutations;
