export const PUB_LAYOUT = "default";

export const ButtonType = {
  pri: "PRIMARY",
  sub: "SUB",
  link: "LINK",
  icon: "ICON",
  combo: "COMBO",
  wIcon: "W_ICON",
};
export const PopupType = {
  create: "CREATE",
  update: "UPDATE",
};
export const ToastType = {
  info: "INFO",
  success: "SUCCESS",
  warning: "WARNING",
  error: "ERROR",
};
export const DialogType = {
  info: "INFO",
  warning: "WARNING",
  error: "ERROR",
};
export const DialogAction = {
  confirmDelete: "CONFIRM_DELETE",
  confirmUpdate: "CONFIRM_UPDATE",
  confirmCreate: "CONFIRM_CREATE",
};
// employee
export const EmployeeCol = {
  checkbox: {
    text: "",
  },
  employeeCode: {
    text: "Mã nhân viên",
  },
  employeeName: {
    text: "Tên nhân viên",
  },
  gender: {
    text: "Giới tính",
  },
  dateOfBirth: {
    text: "Ngày sinh",
  },
  positionNam: {
    text: "Chức danh",
  },
  departmentName: {
    text: "Bộ phận",
  },
  identityNumber: {
    text: "Số CMNN",
    title: "Số chứng minh nhân dân",
  },
  identityDateRelease: {
    text: "Ngày cấp",
  },
  identityPlaceRelease: {
    text: "Nơi cấp",
  },
  address: {
    text: "Địa chỉ",
  },
  phoneNumber: {
    text: "ĐT cố định",
    title: "Điện thoại cố định",
  },
  mobilePhoneNumber: {
    text: "ĐT di động",
    title: "Điện thoại di động",
  },
  email: {
    text: "Email",
  },
  bankAccount: {
    text: "STK ngân hàng",
    title: "Số tài khoản ngân hàng",
  },
  bankName: {
    text: "Tên ngân hàng",
  },
  bankBranchName: {
    text: "Tên chi nhánh",
  },
  action: {
    text: "Chức năng",
  },
};

export const ErrValidator = {
  employeeCodeEmppty: "Mã không được để trống",
  employeeNameEmpty: "Tên không được để trống",
  departmentEmpty: "Đơn vị không được để trống",
  dateOfBirth: "Ngày sinh không lớn hơn ngày hiện tại",
  identityDateRelease: "Ngày cấp không lớn hơn ngày hiện tại",
  email: "Email không đúng định dạng",
};
export const StatusCode = {
  success: 200,
  notFound: 404,
  badRequest: 400,
};
