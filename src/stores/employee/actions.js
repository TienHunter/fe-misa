import EmployeesService from "@/api/services/employeeService";
import { DialogType, StatusCode, ToastType } from "@/enums";
const actions = {
  /**
   *
   * @param {} param0
   * lấy danh sách nhân viên từ api
   *  Author:vdtien(25/5/2023)
   */
  async getAllEmployeeList({ state, commit, dispatch }) {
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
   * Mô tả: lấy danh sách nhân viên theo phân trang và filter
   * created by : vdtien
   * created date: 05-06-2023
   * @param {type} param -
   * @returns
   */
  async getEmployeeList({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");

      let res = await EmployeesService.getList(state.filterAndPaging);
      if (res && res.Data) {
        commit("SET_EMPLOYEE_LIST", res.Data);
        commit("SET_TOTAL_RECORDS", res.TotalRecord);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: trả về thôngg tin nhân viên theo id
   * created by : vdtien
   * created date: 04-06-2023
   * @param {string} employeeId - id của nhân viên
   * @returns
   */
  async getEmployeeById({ state, commit, dispatch }, employeeId) {
    try {
      dispatch("toggleLoading");
      const data = await EmployeesService.getRecordById(employeeId);
      if (data) {
        dispatch("getEmployeeDetail", { ...data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: lấy mã nhân viên mới nhất
   * created by : vdtien
   * created date: 04-06-2023
   * @param {type} param -
   * @returns
   */
  async getNewEmployeecode({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      const data = await EmployeesService.getNewEmployeecode();
      if (data) commit("SET_NEW_EMPLOYEE_CODE", data);
      // chuyển employeeCode sang dạng NV-<mã số>
      // if (data) {
      //   let newEmployeeCode = `NV-${data}`;
      //   commit("SET_NEW_EMPLOYEE_CODE", newEmployeeCode);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: thêm mới nhân viên
   * created by : vdtien
   * created date: 29-05-2023
   * @param {object} employee - thông tin nhân viên thêm mới
   * @returns
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
      let res = await EmployeesService.createRecord(employee);
      // thêm thành công
      if (res) {
        console.log(res);
        // add nhân viên mới vào đầu danh sách
        // res đang trả về chỉ là 1 nếu thành công thì không ổn, cần trả về bản ghi mới để lấy id bản ghi
        commit("CREATE_EMPLOYEE", employee);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: "Thêm nhân viên mới thành công",
        });
        dispatch("getPopupStatus");
        dispatch("getEmployeeDetail");
        commit("SET_TOTAL_RECORDS", state.totalRecords + 1);
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
      let employeeId = employee.EmployeeId;
      delete employee.EmployeeId;
      let res = await EmployeesService.updateRecord(employee, employeeId);

      //cập nhật thành công
      if (res) {
        commit("UPDATE_EMPLOYEE", employee);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: `Cập nhật nhân viên <${employee.employeeCode}> thành công`,
        });
        dispatch("getPopupStatus");
        dispatch("getEmployeeDetail");
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
      let res = await EmployeesService.deleteRecord(employee.EmployeeId);

      //xóa thành công
      if (res) {
        commit("DELETE_EMPLOYEE", employee.EmployeeId);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: `Xóa nhân viên <${employee.EmployeeCode}> thành công`,
        });
      }
      dispatch("getEmployeeDetail");
      commit("SET_TOTAL_RECORDS", state.totalRecords + 1);

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
