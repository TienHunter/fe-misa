import EmployeesService from "@/api/services/employeeService";
import { DialogType } from "@/constants";
const actions = {
  /**
   *
   * @param {} param0
   * lấy danh sách nhân viên từ api
   *  Author:vdtien(25/5/2023)
   */
  async getEmployeeList({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      const data = await EmployeesService.getAllEmployees();
      commit("SET_EMPLOYEE_LIST", data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * lấy danh sách nhân viên fake vì api bị lỗi
   * Author: vdtien (25/5/2023)
   */
  fakeGetEmployeeList({ commit }, payload) {
    commit("SET_EMPLOYEE_LIST", payload);
  },

  /**
   * Mô tả: thêm mới nhân viên
   * created by : vdtien
   * created date: 29-05-2023
   */
  async createEmployee({ state, commit, dispatch }, employee) {
    try {
      dispatch("toggleLoading");
      // check trùng mã
      let employeeIdFound = await EmployeesService.findEmployeeByEmployeeCode(
        employee.employeeCode
      );
      if (employeeIdFound) {
        dispatch("getDialog", {
          isShow: true,
          type: DialogType.error,
          content: `Mã nhân viên <${employee.employeeCode}> đã tồn tại !`,
        });
        return;
      }

      // thêm mới nếu không trùng mã
      let res = EmployeesService.createEmployee(employee);
      // thêm thành công
      if (res) {
        // add nhân viên mới vào đầu danh sách
        commit("CREATE_EMPLOYEE", employee);
      }
      // thêm thất bại
    } catch (error) {
    } finally {
      dispatch("toggleLoading");
    }
  },

  async updateEmployee({ state, commit, dispatch }, employee) {},

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * lấy trạng thái cho popup
   * Author:vdtien(25/5/2023)
   */
  getPopupStatus({ commit }, payload) {
    commit("SET_POPUP_STATUS", payload);
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * lấy dữ liệu cho employeeDetail
   * Author:vdtien(25/5/2023)
   */
  getEmployeeDetail({ commit }, payload) {
    commit("SET_EMPLOYEE_DETAIL", payload);
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * lấy dữ liệu cho dialog
   */
  getDialog({ commit }, payload) {
    commit("SET_DIALOG", payload);
  },
};

export default actions;
