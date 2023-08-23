const state = {
  isLoading: false,
  toast: {
    isShow: false,
    type: "",
    content: "",
  },
  isSidebarShrink: false,
  dialog: {
    isShow: false,
    type: "",
    title: "",
    content: [],
    action: "",
  },
  filterAndPaging: {
    keySearch: "",
    pageSize: 20,
    pageNumber: 1,
  },
  totalRecords: 0,
  totalRoots: 1,
  // isRoot:false,
  errsValidate: {},
  popupStatus: {
    isShowPopup: false,
    type: "",
  },

  // listExecuteFailure: [],
  resultBulkAction: {
    totalRecordExceute: 0,
    totalRecordExcuteSuccess: 0,
    totalRecordExcuteFailure: 0,
  },
  dialogDetail: {
    show: false,
    title: "",
    type: "",
  },
};
export default state;
