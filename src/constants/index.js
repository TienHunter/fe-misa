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
  EmployeeCode: {
    text: "Mã nhân viên",
  },
  FullName: {
    text: "Tên nhân viên",
  },
  Gender: {
    text: "Giới tính",
  },
  DateOfBirth: {
    text: "Ngày sinh",
  },
  PositionName: {
    text: "Chức danh",
  },
  DepartmentName: {
    text: "Bộ phận",
  },
  IdentityNumber: {
    text: "Số CMNN",
    title: "Số chứng minh nhân dân",
  },
  IdentityDateRelease: {
    text: "Ngày cấp",
  },
  IdentityPlaceRelease: {
    text: "Nơi cấp",
  },
  Address: {
    text: "Địa chỉ",
  },
  PhoneNumber: {
    text: "ĐT cố định",
    title: "Điện thoại cố định",
  },
  MobilePhoneNumber: {
    text: "ĐT di động",
    title: "Điện thoại di động",
  },
  Email: {
    text: "Email",
  },
  BankAccount: {
    text: "STK ngân hàng",
    title: "Số tài khoản ngân hàng",
  },
  BankName: {
    text: "Tên ngân hàng",
  },
  BankBranchName: {
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
