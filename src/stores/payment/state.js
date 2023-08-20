const state = {
  paymentList: [],
  paymentIdListChecked: [],
  paymentDetail: {},
  // totalMoney: 0,

  resultBulkAction: {
    totalPayemntExceute: 0,
    totalPaymentExcuteSuccess: 0,
    totalPaymentExcuteFailure: 0,
  },

  paymentListFailure: [],
  dialogDetail: {
    show: false,
    title: "",
    type: "",
  },
};
export default state;
