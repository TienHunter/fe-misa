import paymentService from "@/api/services/paymentService";
import { hanldeException } from "../global/actions";
import { DialogTitle, ToastContent } from "@/resources";
import { DialogType, PopupType, ToastType } from "@/enums";
import { convertToYYYYMMDD } from "@/utils/helper";
const actions = {
  /**
   * Mô tả: lấy danh sách phiếu chi theo từ khóa và phân trang
   * created by : vdtien
   * created date: 15-08-2023
   * @param {type} param -
   * @returns
   */
  async getPaymentList({ state, rootState, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      let res = await paymentService.getList(rootState.global.filterAndPaging);
      if (res?.Data?.length >= 0) {
        let computeData = res.Data.map((data) => ({
          ...data,
          Accountings: data?.Accountings?.length > 0 ? data.Accountings : [],
        }));
        commit("SET_PAYMENT_LIST", computeData);
        dispatch("getTotalRecords", res.TotalRecord);
        // commit("SET_TOTAL_RECORDS", res.TotalRecord);
      }
    } catch (error) {
      console.log(error);
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: gán danh sách paymentId đã chọn
   * created by : vdtien
   * created date: 15-08-2023
   * @param {type} param -
   * @returns
   */
  getPaymentIdListCkecked({ state, commit, dispatch }, payload) {
    commit("SET_PAYMENT_ID_LIST_CHECKED", payload);
  },

  /**
   * Mô tả: gán thông tin chi tiết 1 phiếu chi
   * created by : vdtien
   * created date: 15-08-2023
   * @param {type} param -
   * @returns
   */
  getPaymentDetail({ state, commit, dispatch }, payload) {
    if (payload?.AccountingDate) {
      payload.AccountingDate = convertToYYYYMMDD(payload.AccountingDate);
    }
    if (payload?.PaymentDate) {
      payload.PaymentDate = convertToYYYYMMDD(payload.PaymentDate);
    }
    commit("SET_PAYMENT_DETAIL", payload);
  },

  /**
   * Mô tả: lấy mã phiếu chi mới
   * created by : vdtien
   * created date: 15-08-2023
   * @param {type} param -
   * @returns
   */
  async getNewPaymentCode({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      const res = await paymentService.getNewCode();
      if (res) {
        commit("SET_NEW_PAYMENT_CODE", res);
      }
    } catch (error) {
      console.log(error);
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: thêm mới 1 phiếu chi
   * created by : vdtien
   * created date: 17-08-2023
   * @param {type} param -
   * @returns
   */
  async createPayment({ state, rootState, commit, dispatch }, payload) {
    const { payment, typeStore } = payload;
    try {
      dispatch("toggleLoading");
      let res = await paymentService.createRecord(payment);
      if (res) {
        commit("CREATE_PAYMENT", res);
        dispatch("getPaymentDetail", {
          ...res,
        });
        dispatch("getTotalRecords", rootState.global.totalRecords + 1);
        // ghi sổ không thành công
        if (res?.ListUesrMsg?.length > 0) {
          // show dialog
          dispatch("getDialog", {
            isShow: true,
            type: DialogType.error,
            title: DialogTitle.failWrite,
            content: [...res.ListUesrMsg],
          });
        } else {
          // show toast
          dispatch("getToast", {
            isShow: true,
            type: ToastType.success,
            content: ToastContent.createPaymentSuccess,
          });
        }
        // chuyển trạng thái form sang xem
        dispatch("getPopupStatus", {
          isShowPopup: true,
          type: PopupType.view,
        });
      }
    } catch (error) {
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  async updateStatusPayment({ state, commit, dispatch }, payload) {
    const { paymentId, status } = payload;
    try {
      dispatch("toggleLoading");
      let res = await paymentService.updateStatusPayment(paymentId, status);
      if (res) {
        commit("UPDATE_PAYMENT", { ...res });
        dispatch("getPaymentDetail", {
          ...res,
        });
        // ghi sổ không thành công
        if (res?.ListUesrMsg?.length > 0) {
          // show dialog
          dispatch("getDialog", {
            isShow: true,
            type: DialogType.error,
            title: DialogTitle.failWrite,
            content: [...res.ListUesrMsg],
          });
        } else {
          // show toast
          dispatch("getToast", {
            isShow: true,
            type: ToastType.success,
            content: ToastContent.createPaymentSuccess,
          });
        }
        // chuyển trạng thái form sang xem
        dispatch("getPopupStatus", {
          isShowPopup: true,
          type: PopupType.view,
        });
      }
    } catch (error) {
      console.log(error);
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },
};

// xử lý exception

export default actions;
