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
  },
};

export default state;
