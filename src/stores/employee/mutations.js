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
  UPDATE_EMPLOYEE(state, payload) {
    let updatedEmployee = { ...payload };
    const index = state.employeeList.findIndex(
      (emp) => emp.id === updatedEmployee.id
    );
    if (index !== -1) {
      let tmpEmployeeList = [...state.employeeList];
      tmpEmployeeList.splice(index, 1, updatedEmployee);
      state.employeeList = [...tmpEmployeeList];
    }
  },
  DELETE_EMPLOYEE(state, payload) {
    const index = state.employeeList.findIndex((emp) => emp.id === payload);
    console.log(index);
    if (index !== -1) {
      let tmpEmployeeList = [...state.employeeList];
      tmpEmployeeList.splice(index, 1);
      console.log(tmpEmployeeList);
      state.employeeList = [...tmpEmployeeList];
    }
  },

  SET_FILTER_AND_PAGING(state, payload) {
    state.filterAndPaging = { ...payload };
  },
};
export default mutations;
