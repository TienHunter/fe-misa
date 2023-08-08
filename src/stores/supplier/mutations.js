import {
  areAllElementsInArray,
  removeSubArrayElements,
  uniqueElementsArray,
} from "@/utils/helper";

const mutations = {
  SET_SUPPLIER_LIST(state, payload) {
    state.supplierList = [...payload];
  },
  SET_NEW_SUPPLIER_CODE(state, payload) {
    state.supplierDetail = { ...state.supplierDetail, SupplierCode: payload };
  },
  SET_SUPPLIER_DETAIL(state, payload) {
    state.supplierDetail = { ...payload };
  },
  // SET_POPUP_STATUS(state, payload) {
  //   state.popupStatus = { ...payload };
  // },
  CREATE_SUPPLIER(state, payload) {
    let newSupplier = { ...payload };
    state.supplierList.unshift(newSupplier);
  },
  UPDATE_SUPPLIER(state, payload) {
    let updatedSupplier = { ...payload };
    const index = state.supplierList.findIndex(
      (emp) => emp.SupplierId === updatedSupplier.SupplierId
    );
    if (index !== -1) {
      let tmpSupplierList = [...state.supplierList];
      tmpSupplierList.splice(index, 1, updatedSupplier);
      state.supplierList = [...tmpSupplierList];
    }
  },
  /**
   * Mô tả:
   * created by : vdtien
   * created date: 20-07-2023
   * @param {type} param -
   * @returns
   */
  DELETE_SUPPLIER(state, payload) {
    const index = state.supplierList.findIndex(
      (emp) => emp.SupplierId === payload
    );
    // console.log(index);
    if (index !== -1) {
      let tmpSupplierList = [...state.supplierList];
      tmpSupplierList.splice(index, 1);
      // console.log(tmpSupplierList);
      state.supplierList = [...tmpSupplierList];
    }
  },

  // SET_FILTER_AND_PAGING(state, payload) {
  //   state.filterAndPaging = { ...payload };
  // },
  SET_LIST_SUPPLIER_LIST_CHECKED(state, payload) {
    let tmpSupplierIdListChecked = [...state.supplierIdListChecked]; // Giữ nguyên proxy array

    if (!payload) {
      state.supplierIdListChecked = [];
    } else {
      const proxyPayload = new Proxy(payload, {}); // Chuyển đổi payload thành proxy array

      if (areAllElementsInArray(proxyPayload, tmpSupplierIdListChecked)) {
        // console.log("oke");
        let newArr = removeSubArrayElements(
          proxyPayload,
          tmpSupplierIdListChecked
        );
        state.supplierIdListChecked = [...newArr];
      } else {
        const uniqueEls = uniqueElementsArray(
          proxyPayload,
          tmpSupplierIdListChecked
        );
        tmpSupplierIdListChecked.push(...uniqueEls);
        state.supplierIdListChecked = [...tmpSupplierIdListChecked];
      }
    }
  },
};

export default mutations;
