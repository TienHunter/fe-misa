import { DialogAction, DialogType } from "@/enums";
import { DialogTitle } from "@/resources";

const actions = {
  toggleLoading({ commit }) {
    commit("TOGGLE_LOADING");
  },
  getToast({ commit }, payload) {
    if (payload) commit("SET_TOAST", payload);
    else
      commit("SET_TOAST", {
        isShow: false,
      });
  },
  toggleSidebarShrink({ commit }) {
    commit("TOGGLE_SIDEBAR_SHRINK");
  },
  /**
   * Mô tả: set tham số filter and paging
   * created by : vdtien
   * created date: 30-05-2023
   */
  getFilterAndPaging({ state, commit, dispatch }, payload) {
    commit("SET_FILTER_AND_PAGING", payload);
  },
  getTotalRecords({ state, commit, dispatch }, payload) {
    commit("SET_TOTAL_RECORDS", payload);
  },
  getTotalRoots({ state, commit, dispatch }, payload) {
    commit("SET_TOTAL_PAGES", payload);
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
  getErrsValidate({ state, commit, dispatch }, payload) {
    commit("SET_ERRS_VALIDATE", payload);
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
};
function hanldeException(dispatch, ex) {
  console.log(ex);
  let errsMsg = ex?.response?.data?.UserMsg ?? [];
  if (!Array.isArray(errsMsg)) {
    errsMsg = ["Có lỗi vui lòng liên hệ nhân viên Misa để được hỗ trợ"];
  }
  // check loi validate hoac dupCode
  if (ex?.response?.data?.ErrCode === 2 || ex?.response?.data?.ErrCode === 3) {
    dispatch("getErrsValidate", ex?.response?.data?.ErrorsMore ?? {});
    dispatch("getDialog", {
      isShow: true,
      type: DialogType.error,
      title: DialogTitle.inValidInput,
      content: [...errsMsg],
      action: DialogAction.confirmValidate,
    });
  } else {
    dispatch("getDialog", {
      isShow: true,
      type: DialogType.error,
      title: DialogTitle.errorServer,
      content: [...errsMsg],
    });
  }
}
export default actions;
export { hanldeException };
