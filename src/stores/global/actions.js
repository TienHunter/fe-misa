import { DialogAction, DialogType, ErrCode } from "@/enums";
import { DefaultErrorMessage, DialogTitle } from "@/resources";

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

  /**
   * Mô tả: gán giá trị các biến ở thông báo kết quả thực hiện hàng loạt
   * created by : vdtien
   * created date: 19-08-2023
   * @param {type} param -
   * @returns
   */
  getResultBulkAction({ state, commit, dispatch }, payload) {
    commit("SET_RESULT_BULK_ACTION", payload);
  },

  /**
   * Mô tả: gán thông số cho form thông báo chi tiết
   * created by : vdtien
   * created date: 19-08-2023
   * @param {type} param -
   * @returns
   */
  getDialogDetail({ state, commit, dispatch }, paylaod) {
    commit("SET_DIALOG_DETAIL", paylaod);
  },
};
function handleException(dispatch, ex) {
  console.log(ex);
  let errsMsg = ex?.response?.data?.UserMsg || [ex?.response?.data?.DevMsg];
  if (!Array.isArray(errsMsg) || errsMsg.length === 0) {
    errsMsg = [DefaultErrorMessage];
  }
  dispatch("getErrsValidate", ex?.response?.data?.ErrorsMore ?? {});
  const errorCode = ex?.response?.data?.ErrCode;
  switch (errorCode) {
    case ErrCode.exception:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.errorServer,
        content: [...errsMsg],
      });
      break;
    case ErrCode.duplicateCode:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.inValidInput,
        content: [...errsMsg],
        action: DialogAction.confirmValidate,
      });
      break;
    case ErrCode.invalidData:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.inValidInput,
        content: [...errsMsg],
        action: DialogAction.confirmValidate,
      });
      break;
    case ErrCode.notFound:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.errorServer,
        content: [...errsMsg],
      });
      break;
    case ErrCode.duplicationCodeHasFix:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.warning,
        title: DialogTitle.inValidInput,
        content: [...errsMsg],
        action: DialogAction.confirmChangeCode,
        errorCode: ErrCode.duplicationCodeHasFix,
      });
      break;

    case ErrCode.badRequest:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.notify,
        content: [...errsMsg],
        errorCode: ErrCode.badRequest,
      });
      break;
    default:
      dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.errorServer,
        content: [...errsMsg],
      });
      break;
  }
}
export default actions;
export { handleException };
