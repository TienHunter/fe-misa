export const PUB_LAYOUT = "default";
export const ButtonType = {
  primary: "primary",
  second: "secondary",
  combo: "combo",
};
export const PopupType = {
  create: "CREATE",
  update: "UPDATE",
  view: "VIEW",
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
  confirmValidate: "CONFIRM_VALIDATE",
  confirmDeleteMulti: "CONFIRM_DELETE_MULTI",
  confirmUpdateStatus: "CONFIRM_UPDATE_STATUS",
  confirmChangeCode: "CONFIRM_CHANGE_CODE",
};
export const TypeStore = {
  store: "STORE",
  storeAndAdd: "STORE_AND_ADD",
};

export const TypeClickButton = {
  create: "CREATE",
  createAndAdd: "CREATE_AND_ADD",
  createAndPrint: "CREATE_AND_PRINT",
  update: "UPDATE",
  updateAndAdd: "UPDATE_AND_ADD",
  updateAndPrint: "UPDATE_AND_PRINT",
  edit: "EDIT",
  quickEdit: "QUICK_EDIT",
  delete: "DELETE",
  deleteMulti: "DELETE_MULTI",
  duplicate: "DUPLICATE",
  write: "WRITE",
  unWrite: "UN_WRITE",
};
export const Gender = {
  male: 1,
  female: 0,
  other: 2,
};
export const PaymentStatus = {
  unWritten: 0,
  written: 1,
};
export const MaxLength = {
  code: 20,
  name: 100,
  phoneNumber: 50,
  identity: 25,
  default: 255,
  number: 17,
};
export const AccountFeature = {
  // tranh so 0 vi no la faslty
  debt: 1,
  redundant: 2,
  combine: 3,
  noBalance: 4,
};
export const UserObject = {
  all: 0,
  supplier: 1,
  customer: 2,
  employee: 3,
};
export const Status = {
  stopUsing: 0,
  using: 1,
};
export const TypeUpdate = {
  one: 1,
  all: 2,
};
export const TypeBulkUpdate = {
  delete: -1,
  noChange: 0,
  create: 1,
  edit: 2,
};
export const SupplierType = {
  organization: 1,
  individual: 2,
};
export const Vocative = [
  {
    id: "Ông",
    value: "Ông",
  },
  {
    id: "Bà",
    value: "Bà",
  },
  {
    id: "Anh",
    value: "Anh",
  },
  {
    id: "Chị",
    value: "Chị",
  },
  {
    id: "Em",
    value: "Em",
  },
  {
    id: "Mr",
    value: "Mr",
  },
  {
    id: "Ms",
    value: "Ms",
  },
];
export const TypeCol = {
  date: "DATE",
  money: "MONEY",
  number: "NUMBER",
  array: "ARRAY",
};
export const ErrCode = {
  exception: 1,
  duplicateCode: 2,
  invalidData: 3,
  notFound: 4,
  internalException: 5,
  duplicationCodeHasFix: 6,
};
