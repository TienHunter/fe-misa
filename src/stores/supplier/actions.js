import SuppliersService from "@/api/services/supplierService.js";
import {
  DialogAction,
  DialogType,
  PopupType,
  StatusCode,
  ToastType,
  TypeStore,
} from "@/enums";
import { DialogTitle, ToastContent } from "@/resources";
import { convertToYYYYMMDD, parseJson, stringifyJson } from "@/utils/helper";
const actions = {
  /**
   *
   * @param {} param0
   * lấy danh sách nhân viên từ api
   *  Author:vdtien(25/5/2023)
   */
  async getAllSupplierList({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      const data = await SuppliersService.getAll();
      commit("SET_SUPPLIER_LIST", data);
    } catch (error) {
      console.log(error);
      hanldeException(dispatch, error);
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
  async getSupplierList({ state, rootState, commit, dispatch }) {
    try {
      dispatch("toggleLoading");

      let res = await SuppliersService.getList(
        rootState.global.filterAndPaging
      );
      if (res && res.Data) {
        let computeData = res.Data.map((data) => ({
          ...data,
          GroupSuppliersId:
            data?.GroupSuppliersId?.length > 0 ? data.GroupSuppliersId : [],
          BanksAccount:
            data?.BanksAccount?.length > 0 ? data.BanksAccount : [{}],
          ContractInfor: data?.ContractInfor ? data.ContractInfor : {},
          DeliverAddress:
            data?.DeliverAddress?.length > 0 ? data.DeliverAddress : [],
        }));
        commit("SET_SUPPLIER_LIST", computeData);
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
   * Mô tả: export file excel danh sach nhan vien
   * created by : vdtien
   * created date: 30-06-2023
   * @param {type} param -
   * @returns
   */
  async exportExcelSupplierList({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");

      let res = await SuppliersService.exportExcelSupplierList(
        state?.filterAndPaging?.keySearch ?? ""
      );
      if (res) {
        //https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
        // create file link in browser's memory
        const href = URL.createObjectURL(res);

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `Danh_sach_nhan_vien_${Date.now()}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      }
    } catch (error) {
      // console.log(error);
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: trả về thôngg tin nhân viên theo id
   * created by : vdtien
   * created date: 04-06-2023
   * @param {string} supplierId - id của nhân viên
   * @returns
   */
  async getSupplierById({ state, commit, dispatch }, supplierId) {
    try {
      dispatch("toggleLoading");
      const data = await SuppliersService.getById(supplierId);
      if (data) {
        dispatch("getSupplierDetail", { ...data });
      }
    } catch (error) {
      console.log(error);
      hanldeException(dispatch, error);
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
  async getNewSuppliercode({ state, commit, dispatch }) {
    try {
      dispatch("toggleLoading");
      const data = await SuppliersService.getNewCode();
      if (data) commit("SET_NEW_SUPPLIER_CODE", data);
      // chuyển supplierCode sang dạng NV-<mã số>
      // if (data) {
      //   let newSupplierCode = `NV-${data}`;
      //   commit("SET_NEW_SUPPLIER_CODE", newSupplierCode);
      // }
    } catch (error) {
      console.log(error);
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: thêm mới nhân viên
   * created by : vdtien
   * created date: 29-05-2023
   * @param {object} supplier - thông tin nhân viên thêm mới
   * @returns
   */
  async createSupplier({ state, rootState, commit, dispatch }, payload) {
    const { supplier, typeStore } = payload;
    try {
      dispatch("toggleLoading");

      // thêm mới nếu không trùng mã
      let res = await SuppliersService.createRecord(supplier);
      // thêm thành công
      if (res) {
        console.log(res);
        res = {
          ...res,
          GroupSuppliersId:
            res?.GroupSuppliersId?.length > 0 ? res.GroupSuppliersId : [],
          BanksAccount: res?.BanksAccount?.length > 0 ? res.BanksAccount : [{}],
          ContractInfor: res?.ContractInfor ? res.ContractInfor : {},
          DeliverAddress:
            res?.DeliverAddress?.length > 0 ? res.DeliverAddress : [],
        };
        // add nhân viên mới vào đầu danh sách
        // res đang trả về chỉ là 1 nếu thành công thì không ổn, cần trả về bản ghi mới để lấy id bản ghi

        commit("CREATE_SUPPLIER", res);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: ToastContent.createRecordSuccess("nhà cung cấp"),
        });
        dispatch("getSupplierDetail");
        dispatch("getTotalRecords", rootState.global.totalRecords + 1);
        // commit("SET_TOTAL_RECORDS", state.totalRecords + 1);
        dispatch("getPopupStatus");
        if (typeStore === TypeStore.store) {
        } else if (typeStore === TypeStore.storeAndAdd) {
          const data = await SuppliersService.getNewSuppliercode();
          if (data) commit("SET_NEW_SUPPLIER_CODE", data);
          dispatch("getPopupStatus", {
            isShowPopup: true,
            type: PopupType.create,
          });
        }
      }

      // thêm thất bại
    } catch (error) {
      // console.log(error);
      // add error vào dialog
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: Cap nhat nhan vien
   * created by : vdtien
   * created date: 23-06-2023
   * @param {type} param -
   * @returns
   */
  async updateSupplier({ state, commit, dispatch }, payload) {
    const { supplier, typeStore } = payload;
    try {
      dispatch("toggleLoading");
      // call api cập nhật lại nhân viên
      let supplierId = supplier.SupplierId;
      // delete supplier.SupplierId;
      let res = await SuppliersService.updateRecord(supplier, supplierId);

      //cập nhật thành công
      if (res) {
        commit("UPDATE_SUPPLIER", res);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: ToastContent.updateRecordSuccess(
            "nhà cung cấp",
            supplier.SupplierCode
          ),
        });
        dispatch("getSupplierDetail");
        dispatch("getPopupStatus");
        if (typeStore === TypeStore.store) {
        } else if (typeStore === TypeStore.storeAndAdd) {
          const data = await SuppliersService.getNewSuppliercode();
          if (data) commit("SET_NEW_SUPPLIER_CODE", data);
          dispatch("getPopupStatus", {
            isShowPopup: true,
            type: PopupType.create,
          });
        }
      }
      // lỗi
    } catch (error) {
      console.log(error);
      // add error vào dialog
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  /**
   * Mô tả: Xoa nhan vien theo id
   * created by : vdtien
   * created date: 23-06-2023
   * @param {type} param -
   * @returns
   */
  async deleteSupplier({ state, rootState, commit, dispatch }, supplier) {
    try {
      dispatch("toggleLoading");
      // console.log(supplier);
      // call api xóa nhân viên theo id
      let res = await SuppliersService.deleteRecord(supplier.SupplierId);

      //xóa thành công
      if (res) {
        commit("DELETE_SUPPLIER", supplier.SupplierId);
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: ToastContent.deleteRecordSuccess(
            "Nhà cung cấp",
            supplier.SupplierCode
          ),
        });
      }
      dispatch("getSupplierDetail");
      dispatch("getTotalRecords", rootState.global.totalRecords - 1);
      // commit("SET_TOTAL_RECORDS", state.totalRecords - 1);

      // lỗi
    } catch (error) {
      console.log(error);
      // add error vào dialog
      hanldeException(dispatch, error);
    } finally {
      dispatch("toggleLoading");
    }
  },

  async deleteMultiSupplier({ state, rootState, commit, dispatch }) {
    try {
      // console.log(state.supplierIdListChecked);
      dispatch("toggleLoading");
      let res = await SuppliersService.deleleRecordMulti(
        state.supplierIdListChecked
      );
      if (res) {
        dispatch("toggleLoading");
        dispatch("getToast", {
          isShow: true,
          type: ToastType.success,
          content: ToastContent.deleteMultiRecordSuccess("nhà cung cấp"),
        });
        dispatch("getFilterAndPaging", {
          ...rootState.global.filterAndPaging,
          pageNumber: 1,
        });
        dispatch("getSupplierIdListCkecked");
        dispatch("getSupplierList");
      }
    } catch (error) {
      dispatch("toggleLoading");
      console.log(error);
      // add error vào dialog
      hanldeException(dispatch, error);
    }
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * lấy dữ liệu cho supplierDetail
   * Author:vdtien(25/5/2023)
   */
  getSupplierDetail({ commit }, payload) {
    commit("SET_SUPPLIER_DETAIL", payload);
  },

  getSupplierIdListCkecked({ state, commit, dispatch }, payload) {
    commit("SET_LIST_SUPPLIER_LIST_CHECKED", payload);
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
