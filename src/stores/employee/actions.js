import EmployeesService from "@/api/services/employeeService";
import { DialogType, StatusCode, ToastType } from "@/constants";
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
      const data = await EmployeesService.getAll();
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
      // let idFound = await EmployeesService.findEmployeeByEmployeeCode(
      //   employee.employeeCode
      // );
      // if (idFound) {
      //   dispatch("getDialog", {
      //     isShow: true,
      //     type: DialogType.error,
      //     content: `Mã nhân viên <${employee.employeeCode}> đã tồn tại !`,
      //   });
      //   return;
      // }

      // thêm mới nếu không trùng mã
      let res = await EmployeesService.createEmployee(employee);
      // thêm thành công
      if (res) {
        console.log(res);
        // add nhân viên mới vào đầu danh sách
        commit("CREATE_EMPLOYEE", res);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: "Thêm nhân viên mới thành công",
        });
        dispatch("getPopupStatus");
      }

      // thêm thất bại
    } catch (error) {
      console.log(error);
      // add error vào dialog
    } finally {
      dispatch("toggleLoading");
    }
  },

  async updateEmployee({ state, commit, dispatch }, employee) {
    try {
      dispatch("toggleLoading");
      // check trùng mã
      // let idFound = await EmployeesService.findEmployeeByEmployeeCode(
      //   employee.employeeCode
      // );
      // if (idFound && idFound === employee.id) {
      //   dispatch("getDialog", {
      //     isShow: true,
      //     type: DialogType.error,
      //     content: `Mã nhân viên <${employee.employeeCode}> đã tồn tại !`,
      //   });
      //   return;
      // }

      // call api cập nhật lại nhân viên
      let res = await EmployeesService.updateEmployee(employee);

      //cập nhật thành công
      if (res) {
        commit("UPDATE_EMPLOYEE", res);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: `Cập nhật nhân viên <${employee.employeeCode}> thành công`,
        });
        dispatch("getPopupStatus");
      }
      // lỗi
    } catch (error) {
      console.log(error);
      // add error vào dialog
    } finally {
      dispatch("toggleLoading");
    }
  },

  async deleteEmployee({ state, commit, dispatch }, employee) {
    try {
      dispatch("toggleLoading");
      // console.log(employee);
      // call api xóa nhân viên theo id
      let res = await EmployeesService.deleteEmployee(employee.id);

      //xóa thành công
      if (res) {
        commit("DELETE_EMPLOYEE", employee.id);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: `Xóa nhân viên <${employee.employeeCode}> thành công`,
        });
      }
      dispatch("getEmployeeDetail");
      // lỗi
    } catch (error) {
      console.log(error);
      // add error vào dialog
    } finally {
      dispatch("toggleLoading");
    }
  },

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

  /**
   * Mô tả: set tham số filter and paging
   * created by : vdtien
   * created date: 30-05-2023
   */
  getFilterAndPaging({ state, commit, dispatch }, payload) {
    commit("SET_FILTER_AND_PAGING", payload);

    // call api employeeList
  },
};

export default actions;
