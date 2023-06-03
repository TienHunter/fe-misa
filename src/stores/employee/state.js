const state = {
  employeeList: () => [],
  employeeDetail: {},
  popupStatus: {
    isShowPopup: false,
    type: "",
  },
  employeeDialog: {
    isShow: false,
    type: "",
    content: () => [],
    action: "",
  },
  filterAndPaging: {
    keySearch: "",
    pageSize: 10,
    pageNumber: 1,
    totalRecords: 10000,
  },
};

export default state;
