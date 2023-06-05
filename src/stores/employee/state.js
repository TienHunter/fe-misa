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
    employeeFilter: "",
    pageSize: 10,
    pageNumber: 1,
  },
  totalRecords: 0,
};

export default state;
