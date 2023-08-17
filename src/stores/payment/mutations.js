import {
  areAllElementsInArray,
  removeSubArrayElements,
  uniqueElementsArray,
} from "@/utils/helper";

const mutations = {
  SET_PAYMENT_LIST(state, payload) {
    state.paymentList = [...payload];
  },
  SET_PAYMENT_ID_LIST_CHECKED(state, payload) {
    let tmpPaymentIdListChecked = [...state.paymentIdListChecked]; // Giữ nguyên proxy array

    if (!payload) {
      state.paymentIdListChecked = [];
    } else {
      const proxyPayload = new Proxy(payload, {}); // Chuyển đổi payload thành proxy array

      if (areAllElementsInArray(proxyPayload, tmpPaymentIdListChecked)) {
        // console.log("oke");
        let newArr = removeSubArrayElements(
          proxyPayload,
          tmpPaymentIdListChecked
        );
        state.paymentIdListChecked = [...newArr];
      } else {
        const uniqueEls = uniqueElementsArray(
          proxyPayload,
          tmpPaymentIdListChecked
        );
        tmpPaymentIdListChecked.push(...uniqueEls);
        state.paymentIdListChecked = [...tmpPaymentIdListChecked];
      }
    }
  },
  SET_PAYMENT_DETAIL(state, payload) {
    state.paymentDetail = { ...payload };
  },
  SET_NEW_PAYMENT_CODE(state, payload) {
    state.paymentDetail = { ...state.paymentDetail, PaymentCode: payload };
  },
  CREATE_PAYMENT(state, payload) {
    let newPayment = { ...payload };
    state.paymentList.unshift(newPayment);
  },

  UPDATE_PAYMENT(state, payload) {
    let updatePayment = { ...payload };
    const index = state.paymentList.findIndex(
      (emp) => emp.PaymentId === updatePayment.PaymentId
    );
    if (index !== -1) {
      let tmpPaymentList = [...state.paymentList];
      tmpPaymentList.splice(index, 1, updatePayment);
      state.paymentList = [...tmpPaymentList];
    }
  },
};
export default mutations;
