const mutations = {
  SET_EMPLOYEE_LIST(state, payload) {
    state.employeeList = [...payload];
  },
  SET_NEW_EMPLOYEE_CODE(state, payload) {
    state.employeeDetail = { ...state.employeeDetail, EmployeeCode: payload };
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
      (emp) => emp.EmployeeId === updatedEmployee.EmployeeId
    );
    if (index !== -1) {
      let tmpEmployeeList = [...state.employeeList];
      tmpEmployeeList.splice(index, 1, updatedEmployee);
      state.employeeList = [...tmpEmployeeList];
    }
  },
  DELETE_EMPLOYEE(state, payload) {
    const index = state.employeeList.findIndex(
      (emp) => emp.EmployeeId === payload
    );
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
  SET_TOTAL_RECORDS(state, payload) {
    state.totalRecords = payload;
  },
};
export default mutations;
