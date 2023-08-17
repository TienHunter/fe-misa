import paymentService from "@/api/services/paymentService";
import { hanldeException } from "../global/actions";
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
};
export default actions;
