import paymentService from "@/api/services/paymentService";
import { handleException } from "../global/actions";
import { DialogTitle, FreeText, ToastContent } from "@/resources";
import {
  DialogType,
  PaymentStatus,
  PopupType,
  ToastType,
  TypeBulkUpdate,
  TypeUpdate,
} from "@/enums";
import { convertToYYYYMMDD, removeEmptyFieldsDeep } from "@/utils/helper";
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
      handleException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: lấy phiếu chi theo id
   * created by : vdtien
   * created date: 18-08-2023
   * @param {type} param -
   * @returns
   */
  async getPaymentById({ state, rootState, commit, dispatch }, id) {
    try {
      dispatch("toggleLoading");
      let res = await paymentService.getById(id);
      if (res) {
        dispatch("getPaymentDetail", { ...res });
      }
    } catch (error) {
      console.log(error);
      handleException(dispatch, error);
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
      handleException(dispatch, error);
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
    const { payment, typeStore, changeCode } = payload;
    try {
      dispatch("toggleLoading");
      if (changeCode === true) {
        let newcode = await paymentService.getNewCode();
        if (newcode) payment.PaymentCode = newcode;
      }
      let res = await paymentService.createRecord(payment);
      if (res) {
        commit("CREATE_PAYMENT", structuredClone(res));
        dispatch("getPaymentDetail", structuredClone(res));
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
            content: ToastContent.writtenPaymentSuccess,
          });
        }
        dispatch("getPopupStatus", {
          isShowPopup: false,
        });
        // chuyển trạng thái form sang xem
        dispatch("getPopupStatus", {
          isShowPopup: true,
          type: PopupType.view,
        });
      }
    } catch (error) {
      handleException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: cap nhat 1 phieu chi
   * created by : vdtien
   * created date: 18-08-2023
   * @param {type} param -
   * @returns
   */
  async updatePayment({ state, rootState, commit, dispatch }, payload) {
    const { payment, type } = payload;
    const paymentSend = structuredClone(payment);
    const paymentPrev = { ...state.paymentDetail };
    const accountingsOld = paymentPrev.Accountings;
    const accountingsNew = paymentSend?.Accountings ?? [];
    const changeAccountings = compareArrays(
      accountingsOld,
      accountingsNew,
      "AccountingId"
    );

    paymentSend.Accountings = [...changeAccountings];

    try {
      dispatch("toggleLoading");
      let res = await paymentService.updateRecord(
        paymentSend,
        paymentSend.PaymentId
      );
      if (res) {
        commit("UPDATE_PAYMENT", structuredClone(res));
        dispatch("getPaymentDetail", structuredClone(res));
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
            content: ToastContent.writtenPaymentSuccess,
          });
        }
        dispatch("getPopupStatus", {
          isShowPopup: false,
        });
        // chuyển trạng thái form sang xem
        dispatch("getPopupStatus", {
          isShowPopup: true,
          type: PopupType.view,
        });
      }
    } catch (error) {
      console.log(error);
      handleException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: xóa phiếu chi
   * created by : vdtien
   * created date: 19-08-2023
   * @param {type} param -
   * @returns
   */
  async deletePayment({ state, rootState, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      let res = await paymentService.deleteRecord(
        state.paymentDetail.PaymentId
      );
      if (res) {
        // commit("DELETE_PAYMENT", payload.PaymentId);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: ToastContent.deleteRecordSuccess(
            FreeText.payment,
            state.paymentDetail.PaymentCode
          ),
        });
        let list = await paymentService.getList(
          rootState.global.filterAndPaging
        );
        if (list?.Data?.length >= 0) {
          let computeData = list.Data.map((data) => ({
            ...data,
            Accountings: data?.Accountings?.length > 0 ? data.Accountings : [],
          }));
          commit("SET_PAYMENT_LIST", computeData);
          dispatch("getTotalRecords", list.TotalRecord);
          // commit("SET_TOTAL_RECORDS", res.TotalRecord);
        }
      }
    } catch (error) {
      handleException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: cập nhật trạng thái của payment
   * created by : vdtien
   * created date: 18-08-2023
   * @param {type} param -
   * @returns
   */

  async updateStatusPayment({ state, commit, dispatch }, payload) {
    const { paymentId, status, outForm } = payload;
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
          if (status === PaymentStatus.written)
            dispatch("getToast", {
              isShow: true,
              type: ToastType.success,
              content: ToastContent.writtenPaymentSuccess,
            });
        }
        if (!outForm) {
          // chuyển trạng thái form sang xem
          dispatch("getPopupStatus", {
            isShowPopup: true,
            type: PopupType.view,
          });
        }
      }
    } catch (error) {
      console.log(error);
      handleException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: ghi sổ hoặc bỏ ghi hàng loạt
   * created by : vdtien
   * created date: 20-08-2023
   * @param {type} param -
   * @returns
   */
  async bulkUpdateStatusPayment({ state, commit, dispatch }, payload) {
    try {
      dispatch("toggleLoading");
      let res = await paymentService.bulkUpdateStatusPayment(
        state.paymentIdListChecked,
        payload
      );
      if (res) {
        dispatch("toggleLoading");
        dispatch("getPaymentIdListCkecked");
        await dispatch("getPaymentList");
        switch (payload) {
          case PaymentStatus.unWritten:
            dispatch("getToast", {
              isShow: true,
              type: ToastType.success,
              content: ToastContent.unWrittenPaymentSuccess,
            });
            break;
          case PaymentStatus.written:
            if (
              Array.isArray(res?.ListRecordFailure) &&
              res.ListRecordFailure.length > 0
            ) {
              dispatch("getResultBulkAction", {
                totalRecordExceute: res?.Total ?? 0,
                totalRecordExcuteSuccess: res?.Success ?? 0,
                totalRecordExcuteFailure: res?.Failure ?? 0,
              });
              dispatch("getAllPaymentFailure", res?.ListRecordFailure ?? []);
              dispatch("getDialogDetail", {
                show: true,
                title: FreeText.documnetCantWrite,
              });
            } else {
              dispatch("getToast", {
                isShow: true,
                type: ToastType.success,
                content: ToastContent.writtenPaymentSuccess,
              });
            }
            break;
          default:
            break;
        }
      }
    } catch (error) {
    } finally {
    }
  },

  /**
   * Mô tả: xóa hàng loạt phiếu chi
   * created by : vdtien
   * created date: 19-08-2023
   * @param {type} param -
   * @returns
   */
  async deleteMulPayment({ state, rootState, commit, dispatch }) {
    try {
      // console.log(state.employeeIdListChecked);
      dispatch("toggleLoading");
      let res = await paymentService.deleleRecordMulti(
        state.paymentIdListChecked
      );
      if (res) {
        dispatch("toggleLoading");
        if (res.Total === res.Success) {
          dispatch("getToast", {
            isShow: true,
            type: ToastType.success,
            content: ToastContent.deleteMultiRecordSuccess("Phiếu chi"),
          });
          dispatch("getFilterAndPaging", {
            ...rootState.global.filterAndPaging,
            pageNumber: 1,
          });
          dispatch("getPaymentIdListCkecked");
          dispatch("getPaymentList");
        } else {
          dispatch("getFilterAndPaging", {
            ...rootState.global.filterAndPaging,
            pageNumber: 1,
          });
          dispatch("getPaymentIdListCkecked");
          dispatch("getPaymentList");
          dispatch("getResultBulkAction", {
            totalRecordExceute: res?.Total ?? 0,
            totalRecordExcuteSuccess: res?.Success ?? 0,
            totalRecordExcuteFailure: res?.Failure ?? 0,
          });
          dispatch("getAllPaymentFailure", res?.ListRecordFailure ?? []);
          dispatch("getDialogDetail", {
            show: true,
            title: FreeText.resultDeleteDocumnet,
          });
        }
      }
    } catch (error) {
      dispatch("toggleLoading");
      // add error vào dialog
      handleException(dispatch, error);
    } finally {
    }
  },

  /**
   * Mô tả: xuất excel danh sách phiếu chi theo nhà cung cáp
   * created by : vdtien
   * created date: 22-08-2023
   * @param {type} param -
   * @returns
   */
  async exportExcelPaymentList({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");

      let res = await paymentService.exportExcelPaymentList(
        state?.filterAndPaging?.keySearch ?? ""
      );
      if (res) {
        //https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
        // create file link in browser's memory
        const href = URL.createObjectURL(res);

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `Danh_sach_phieu_chi_${Date.now()}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
    } catch (error) {
      // console.log(error);
      handleException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: gán danh sách record thực hiện không thành công vào store
   * created by : vdtien
   * created date: 20-08-2023
   * @param {type} param -
   * @returns
   */
  getAllPaymentFailure({ state, commit, dispatch }, payload) {
    commit("SET_ALL_PAYMENT_FAILURE", payload);
  },
};

/**
 * Mô tả: thêm StatusAction cho danh sách
 * created by : vdtien
 * created date: 24-08-2023
 * @param {type} param -
 * @returns
 */
function compareArrays(oldArray, newArray, key) {
  const result = [];

  for (const oldItem of oldArray) {
    const newItem = newArray.find((item) => item[key] === oldItem[key]);
    if (newItem) {
      if (JSON.stringify(oldItem) === JSON.stringify(newItem)) {
        result.push({ ...oldItem, StatusAction: TypeBulkUpdate.noChange });
      } else {
        result.push({ ...newItem, StatusAction: TypeBulkUpdate.edit });
      }
    } else {
      result.push({ ...oldItem, StatusAction: TypeBulkUpdate.delete });
    }
  }

  for (const newItem of newArray) {
    const exists = oldArray.some((item) => item[key] === newItem[key]);
    if (!exists) {
      result.push({ ...newItem, StatusAction: TypeBulkUpdate.create });
    }
  }

  return result;
}

// xử lý exception

export default actions;
