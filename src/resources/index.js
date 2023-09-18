import account from "@/stores/account";

export const ErrValidator = {
  // employee
  employeeCodeEmppty: "Mã không được để trống.",
  employeeCodeForamt: "Mã nhân viên không đúng định dạng [NV-]<Mã số>.",
  maxLength: (field, length) => {
    return `${field} không được vượt quá ${length} ký tự.`;
  },
  containsOnlyNumber: (field) => {
    return `${field} chỉ chứa ký tự số.`;
  },
  employeeNameEmpty: "Tên không được để trống.",
  departmentEmpty: "Đơn vị không được để trống.",
  positionNameMaxLength: "Vị trí không quá 100 ký tự.",
  dateOfBirth: "Ngày sinh không lớn hơn ngày hiện tại.",
  identityNumberMaxLength: "Số chứng minh nhân dân không quá 25 ký tự.",
  identityNumberContainsOnlyNumber: "Số chứng minh nhân dân chỉ chứa số.",
  identityPlaceReleaseMaxLength: "Nơi cấp không quá 255 ký tự.",
  identityDateRelease: "Ngày cấp không lớn hơn ngày hiện tại.",
  addressMaxLength: "Địa chỉ không quá 255 ký tự.",
  mobilePhoneMaxLength: "Số điện thoại di động không quá 50 ký tự.",
  mobilePhoneContainsOnlyNumber: "Số điện thoại di dộng chỉ chứa số.",
  phoneNumberMaxLength: "Số điện thoại không quá 50 ký tự.",
  phoneNumberContainsOnlyNumber: "Số điện thoại chỉ chứa số.",
  email: "Email không đúng định dạng.",

  // account
  fieldEmplty: (fieldName) => `${fieldName} không được để trống.`,
  accountCodeEmpty: "Mã tài khoản không được để trống.",
  accountNameEmpty: "Tên tài khoản không được để trống.",
  accountFeatureEmpty: "Tính chất tài khoản không được để trống.",
  accoutAriseAccounting: "Tài khoản đã phát sinh hạch toán không thể xóa.",

  // general
  codeEmpty: (recordName) => {
    return `Mã ${recordName} không được để trống.`;
  },
  nameEmpty: (recordName) => {
    return `Tên ${recordName} không được để trống.`;
  },
  accountDetailIsPrefixaccountSynthetic:
    "Số tài khoản không hợp lệ. Số tài khoản chi tiết phải bắt đầu bằng số của Tài khoản tổng hợp",

  fieldNotEmpty: (fieldName) => {
    return `${fieldName} không được để trống.`;
  },
  accountingDateMoreEqualPaymentDate: (paymentDate) =>
    `Ngày hạch toán phải lớn hơn hoặc bằng Ngày chứng từ <${paymentDate}>. Xin vui lòng kiểm tra lại.`,
  accountingsNotEmpty: "Bạn phải nhập chứng từ chi tiết.",

  containsOnlyNumber: (fieldName) => {
    return `${fieldName} chỉ chứa ký tự số.`;
  },

  malformed: (fieldName) => {
    return `${fieldName} không đúng định dạng.`;
  },

  dupBankAccountNumber: (bankNumber) => {
    return `Số tài khoản ${bankNumber} đã tồn tại.`;
  },
};

export const DialogTitle = {
  inValidInput: "Dữ liệu không hợp lệ.",
  store: "Cất bản ghi?",
  delete: "Xóa bản ghi?",
  errorServer: "Lỗi máy chủ.",
  notify: "Thông báo.",
  failWrite: "Ghi số không thành công.",
  error: "Lỗi",
};

export const DialogContent = {
  confirmDeleteEmployee: (employeeCode) => {
    return `Bạn có chắc muốn xóa nhân viên <${employeeCode}> này không?`;
  },
  confirmStoreEmployee: "Dữ liệu thay đổi bạn có muốn lưu không?",
  confirmDeleteMultiEmployee: (numberRecords) => {
    return `Bạn có chắc chắn muốn xóa ${numberRecords} nhân viên này không?`;
  },

  // account
  confirmStore: "Dữ liệu thay đổi bạn có muốn lưu không?",
  confirmDeleteAccount: (accountCode) => {
    return `Bạn có chắc muốn xóa tài khoản <${accountCode}> này không?`;
  },
  accountHasChildren:
    "Xóa không thành công. Không thể xóa danh mục cha nếu chưa xóa danh mục con.",
  // supplier
  confirmDeleteSupplier: (supplierCode) => {
    return `Bạn có chắc muốn xóa nhà cung cấp <${supplierCode}> này không?`;
  },
  confirmDeleteMultiSupplier: (numberRecords) => {
    return `Bạn có chắc chắn muốn xóa ${numberRecords} nhà cung cấp này không?`;
  },
  paymentWritten: (paymentCode) => {
    return `Phiếu chi <${paymentCode}> đã ghi sổ không thể xóa.`;
  },
  confirmDeletePayment: (paymentCode) => {
    return `Bạn có chắc chắn muốn xóa ${paymentCode} này không?`;
  },
  // remove all row
  removeAllRow: "Bạn có chắc chắn muốn xóa tất cả dòng đã nhập.",
  accountGreaterEqual3Characters: "Số tài khoản phải có độ dài >= 3 ký tự.",
  accountNeedParent:
    "Số tài khoản có độ dài > 3 ký tự thì phải điền tài khoản tổng hợp",
  useAllAccountChild:
    'Bạn có muốn thiết lập trạng thái "Sử dụng" cho tất cả Tài khoản con không?',
  notUseAccountChild:
    'Tài khoản cha đang ở trạng thái "Ngừng sử dụng". Bạn không thể thiết lập trạng thái "Sử dụng" cho Tài khoản con."',
};

export const ToastContent = {
  createEmployeeSuccess: "Thêm nhân viên mới thành công.",
  updateEmployeeSuccess: (employeeCode) => {
    return `Cập nhật nhân viên <${employeeCode}> thành công.`;
  },
  deleteEmployeeSuccess: (employeeCode) => {
    return `Xóa nhân viên <${employeeCode}> thành công.`;
  },
  deleteMultiEmployeeSuccess: "Xóa nhân viên thành công.",

  // account
  createAccountSuccess: "Thêm tài khoản mới thành công.",
  deleteAccountSuccess: (accountCode) => {
    return `Xóa tài khoản <${accountCode}> thành công.`;
  },
  updateAccountSuccess: (accountCode) => {
    return `Cập nhật tài khoản <${accountCode}> thành công.`;
  },

  // supplier
  createRecordSuccess: (recordName) => {
    return `Thêm ${recordName} mới thành công.`;
  },
  updateRecordSuccess: (recordName, recordCode) => {
    return `Cập ${recordName} <${recordCode}> thành công.`;
  },
  deleteRecordSuccess: (recordName, recordCode) => {
    return `Xóa ${recordName} <${recordCode}> thành công.`;
  },
  deleteMultiRecordSuccess: (recordName) => {
    return `Xóa ${recordName} thành công.`;
  },

  // payment
  writtenPaymentSuccess: "Ghi sổ thành công.",
  unWrittenPaymentSuccess: "Bỏ ghi sổ thành công.",
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
  BankBranch: {
    text: "Tên chi nhánh",
  },
  action: {
    text: "Chức năng",
  },
};
export const SupplierCol = {
  checkbox: {
    text: "",
  },
  SupplierCode: {
    text: "Mã nhà cung cấp",
  },
  SupplierName: {
    text: "Tên nhà cung cấp",
  },
  Address: {
    text: "Địa chỉ",
  },
  MaxAccountOfDebt: {
    text: "Số tiền nợ",
  },
  PhoneNumber: {
    text: "Điện thoại",
  },
  Branch: {
    text: "Chi nhánh",
  },
  action: {
    text: "Chức năng",
  },
};
export const SidebarList = {
  top: {
    general: {
      icon: "icon--general",
      title: "Tổng quan",
      text: "Tổng quan",
    },
    cash: {
      name: "Cast",
      icon: "icon--cash",
      title: "Tiền mặt",
      text: "Tiền mặt",
    },
    deposits: {
      name: "Components",
      icon: "icon--deposits",
      title: "Tiền gửi",
      text: "Tiền gửi",
    },
    purchase: {
      name: "",
      icon: "icon--purchase",
      title: "Mua hàng",
      text: "Mua hàng",
    },
    sell: {
      name: "",
      icon: "icon--sell",
      title: "Bán hàng",
      text: "Bán hàng",
    },
    billManagement: {
      name: "",
      icon: "icon--billManagement",
      title: "Quản lý hóa đơn",
      text: "Quản lý hóa đơn",
    },
    warehouse: {
      name: "",
      icon: "icon--warehouse",
      title: "Kho",
      text: "Kho",
    },
    tools: {
      name: "",
      icon: "icon--tools",
      title: "Công cụ dụng cụ",
      text: "Công cụ dụng cụ",
    },
    fixedAssets: {
      name: "",
      icon: "icon--fixedAssets",
      title: "Tài sản cố định",
      text: "Tài sản cố định",
    },
    tax: {
      name: "",
      icon: "icon--tax",
      title: "Thuế",
      text: "Thuế",
    },
    price: {
      name: "",
      icon: "icon--price",
      title: "Giá thành",
      text: "Giá thành",
    },
    synthetic: {
      name: "",
      icon: "icon--synthetic",
      title: "Tổng hợp",
      text: "Tổng hợp",
    },
    budget: {
      name: "",
      icon: "icon--budget",
      title: "Ngân sách",
      text: "Ngân sách",
    },
    report: {
      name: "",
      icon: "icon--report",
      title: "Báo cáo",
      text: "Báo cáo",
    },
    financialAnalysis: {
      name: "",
      icon: "icon--financialAnalysis",
      title: "Phân tích tài chính",
      text: "Phân tích tài chính",
    },
  },
  bottom: {
    directory: {
      name: "Directory",
      icon: "icon--tools",
      title: "Danh mục",
      text: "Danh mục",
    },
    initialBalance: {
      name: "",
      icon: "icon--fixedAssets",
      title: "Số dư ban đầu",
      text: "Số dư ban đầu",
    },
    knowledge: {
      name: "",
      icon: "icon--tax",
      title: "Kiến thức",
      text: "Kiến thức",
    },
  },
};
export const ButtonTitle = {
  addEmployee: "Thêm mới nhân viên",
  store: "Cất",
  storeAndAdd: "Cất và thêm",
  delete: "Xóa",
  edit: "Sửa",
  duplicate: "Nhân bản",
  cancel: "Hủy",
  multiAction: "Thực hiện hàng loạt",
  prev: "Trước",
  last: "Sau",
  view: "Xem",
  written: "Ghi sổ",
  unWritten: "Bỏ ghi",
};
export const FreeText = {
  employee: "Nhân viên",
  notFoundRecord: "Không tìm thấy bản ghi nào!",
  totalRecords: "Tổng số",
  accountSystem: "Hệ thống tài khoản",
  directory: "Danh mục",
  supplierList: "Danh sách nhà cung cấp",
  directoryAll: "Tất cả danh mục",
  payment: "Phiếu chi",
  documnetCantWrite: "Chứng từ không thực hiện ghi sổ được",
  resultDeleteDocumnet: "Kết quả xóa chứng từ",
  supplier: "Nhà cung cấp",
  resultDeleteSupplier: "Kết quả xóa nhà cung cấp",

  closeEsc: "Đóng (ESC)",

  // account
  accountName: "Tên tài khoản",
  accountFeature: "Tính chất",
  addAccount: "Thêm tài khoản",
  editAccount: "Sửa tài khoản",
  accountCode: "Số tài khoản",
  nameEnglish: "Tên tiếng anh",
  accountSynthetic: "Tài khoản tổng hợp",
  feature: "Tính chất",
  selectFeature: "-- Chọn tính chất --",
  detailTracking: "Theo dõi chi tiết",
  object: "Đối tượng",
  bankAccount: "Tài khoản ngân hàng",
  objectTHCP: "Đối tượng THCP",
  cancel: "Hủy",
  store: "Cất",
  storeAdd: "Cất và thêm",
  allDirectory: "Tất cả danh mục",
  expand: "Mở rộng",
  shrink: "thu gọn",
  reload: "Tải lại",
  exportExcel: "Xuất file",
  add: "Thêm",
  use: "Sử dụng",
  notUse: "Ngưng sử dụng",
  instruct: "Hướng dẫn",
  customizeInterface: "Tùy chỉnh giao diện",
  helpF1: "Giúp (F1)",
  supplierCode: "Mã nhà cung cấp",
  supplierName: "Tên nhà cung cấp",
  receiver: "Người nhận",
  address: "Địa chỉ",
  reasonSpending: "Lý do chi",
  attach: "Kèm theo",
  quantity: "Số lượng",
  originalDocuments: "chứng từ gốc",
  reference: "Tham chiếu",
  accountingDate: "Ngày hạch toán",
  paymentDate: "ngày phiếu chi",
  paymentCode: "Số phiếu chi",
  sumMoney: "Tổng tiền",
  accounting: "Hạch toán",
  addRow: "Thêm dòng",
  deleteAllRow: "Xóa hết dòng",
  storePrint: "Cất và in",
  write: "Ghi sổ",
  edit: "Sửa",
  quickEdit: "Sửa nhanh",
  unWrite: "Bỏ ghi",
  spendingFor: "Chi tiền cho",
  accountDebt: "Tài khoản nợ",
  accountBalance: "Tài khoản có",
  search: "Tìm kiếm",
  pay: "Chi tiền",
  numberOfProcessingDocuments: "Số chứng từ xử lý",
  numberOfDocumentsProcessedSuccessfully: "Số chứng từ xử lý thành công",
  numberOfDocumentsProcessedFailed: "Số chứng từ xử lý không thành công",
  close: "Đóng",
  cashBusiness: "Nghiệp vụ tiền mặt",
  collectionMoney: "Thu tiền",
  fundInventory: "Kiểm kê quỹ",
  customer: "Khách hàng",
  option: "Tùy chọn",
  report: "Báo cáo",
  cashBalanceStatementByDay: "Bảng kê số dư tiền theo ngày",
  cashFlow: "Dòng tiền",
  cashCollectionDiary: "Sổ nhật ký thu tiền",
  detailedAccountingBookOfCashFund: "Sổ kế toán chi tiết quỹ tiền mặt",
  diaryOfSpendingMoney: "Sổ nhật ký chi tiền",
  allReport: "Tất cả báo cáo",
  addSupplier: "Thêm nhà cung cấp",
  editSupplier: "Sửa nhà cung cấp",
  isCustomer: "Là khách hàng",
  taxCode: "Mã số thuế",
  vocative: "Xưng hô",
  phone: "Điện thoại",
  website: "Website",
  groupSupplier: "Nhóm nhà cung cấp",
  employeeBuy: "Nhân viên mua hàng",
  contractInfo: "Thông tin liên hệ",
  termPayment: "Điều khoản thanh toán",
  bankAccount: "Tài khoản ngân hàng",
  addressOther: "Địa chỉ khác",
  note: "Ghi chú",
  contract: "Người liên hệ",
  fullname: "Họ và tên",
  email: "Email",
  mobilePhone: "Điện thoại di động",
  landlinePhone: "Điện thoại cố định",
  bankAccountNumber: "Số tài khoản",
  bankAccountName: "Tên tài khoản",
  branch: "Chi nhánh",
  cityBank: "Tỉnh/ TP của ngân hàng",
  phoneReceiverBill: "Số điện thoại người nhận hóa đơn",
  identityNumber: "Số chứng minh nhân dân",
  identityDate: "Ngày cấp",
  shortLegalRepresentative: "Đại diện cho PL",
  legalRepresentative: "Đại diên theo pháp luật",
  eInvoiceRecipient: "Người nhận hóa đơn điện tử",
};
export const InputPlaceholder = {
  findEmployee: "Tìm kiếm nhân viên...",
  findAccount: "Tìm kiếm theo số, tên tài khoản",
};
export const StatusText = {
  using: "Đang sử dụng",
  stopUsing: "Ngừng sử dụng",
};

export const DefaultErrorMessage =
  "Có lỗi vui lòng liên hệ nhân viên Misa để được hỗ trợ.";
