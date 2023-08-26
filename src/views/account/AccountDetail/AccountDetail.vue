<script setup>
import {
  computed,
  ref,
  reactive,
  toRefs,
  watchEffect,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import {
  DialogAction,
  DialogType,
  ErrCode,
  MaxLength,
  PopupType,
  TypeStore,
} from "@/enums";
import { useStore } from "vuex";
import BaseComboboxV1 from "@/components/bases/BaseComboboxV1.vue";
import accountService from "@/api/services/accountService";
import { AccountCol, DialogTitle, DialogContent, FreeText } from "@/resources";
import { removeEmptyFields } from "@/utils/helper";
import { ErrValidator } from "@/resources";
/**state */
const store = useStore();
const isExpandPopup = ref(false);
const isFullSizePopup = ref(false);
const accountDetailRef = ref(null);
const popupStatus = computed(() => store.state.global.popupStatus);
const accountDetail = computed(() => store.state.account.accountDetail);
const accountInfo = ref({});
const dialog = computed(() => store.state.global.dialog);
const errsValidate = computed(() => store.state.global.errsValidate);
const errRefs = toRefs(
  reactive({
    AccountCode: null,
    AccountName: null,
    AccountFeature: null,
    ParentId: null,
  })
);
const btnCancel = ref(null);
const errsValidator = ref({});
const dataAccountFeature = ref([
  {
    id: 1,
    value: "Dư nợ",
  },
  {
    id: 2,
    value: "Dư có",
  },
  {
    id: 3,
    value: "Lưỡng tính",
  },
  {
    id: 4,
    value: "Không có số dư",
  },
]);
//---start fake data combobox------

const dataAccountSynthetic = ref([]);
const dataAccountPaging = ref([]);

const fields = ref([
  {
    name: "AccountCode",
    label: "Mã tài khoản",
    class: "mw-130 w-130 Mw-130 text-left",
  },
  {
    name: "AccountName",
    label: "Tên tài khoản",
    class: "mw-250 w-250 Mw-250 text-left",
  },
]);
const fieldSelect = ref("AccountId");
const fieldShow = ref("AccountCode");
const pageAccountSynthetic = ref(0);
// let searchAccountSynthetic = ref("");
const valueAccountSynthetic = ref({});
//---end fake data combobox-----
const isExpandDetailTracking = ref(true);
const toggleAttrDetailTracking = ref({
  UserObject: false,
});

const fieldsUserObject = [
  {
    field: "text",
  },
];
const fieldSelectUserObject = "value";
const fieldShowUserObject = "text";
const dataUserObject = [
  {
    value: 1,
    text: "Nhà cung cấp",
  },
  {
    value: 2,
    text: "Khách hàng",
  },
  {
    value: 3,
    text: "Nhân viên",
  },
];

/** start lifesycle */

onBeforeMount(async () => {
  store.dispatch("getErrsValidate", {});

  if (accountDetail.value?.ParentId) {
    try {
      let res = await accountService.getById(accountDetail.value.ParentId);
      // console.log(res);
      if (res && Object.keys(res).length > 0) {
        // searchAccountSynthetic.value = res.AccountCode;
        valueAccountSynthetic.value = { ...res };
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (accountDetail.value?.UserObject) {
    toggleAttrDetailTracking.value.UserObject = true;
  }
});

onMounted(() => {
  // thêm sự kiện keydowns cho document
  accountDetailRef.value.addEventListener("keydown", handleKeyDownDocument);

  errRefs.AccountCode.value.focus();
});

onBeforeUnmount(() => {
  accountDetailRef.value.removeEventListener("keydown", handleKeyDownDocument);
});

watchEffect(() => {
  errsValidator.value = structuredClone(errsValidate.value);
});
watchEffect(() => {
  accountInfo.value = structuredClone(accountDetail.value);
});

// bắt sự thay đổi của dialog
watch(dialog, (newValue, oldValue) => {
  // ???
  // const isEmpty = Object.keys(dialog.value).length === 0;
  if (
    (oldValue.type === DialogType.error &&
      oldValue.action === DialogAction.confirmValidate) ||
    oldValue.errorCode === ErrCode.badRequest
  ) {
    // Lấy phần tử đầu tiên của danh sách
    // console.log(errsValidate.value);
    const firstKey = Object.keys(errsValidate.value)[0];
    // console.log("firstKey:", firstKey);
    if (firstKey) {
      const firstErr = accessRef(firstKey);
      if (firstErr) {
        firstErr.value.focus();
      }
    }
  } else if (
    newValue.action === DialogAction.confirmCreate &&
    oldValue.action === DialogAction.confirmCreate
  ) {
    storeAccount();
  } else if (
    newValue.action === DialogAction.confirmUpdate &&
    oldValue.action === DialogAction.confirmUpdate
  ) {
    storeAccount();
  }
});
/** end lifecycle */

/**------ start methods ------------------*/
// Truy cập vào ref dựa trên tên chuỗi
const accessRef = (refName) => {
  return errRefs[refName] ? errRefs[refName] : null;
};

const handleFocusFirst = (e) => {
  if (!e.shiftKey && e.which == 9) {
    e.preventDefault();
    errRefs.AccountCode.value.focus();
  }
};

/**
 * Mô tả: lazy load khi scroll tai khoan tong hop
 * created by : vdtien
 * created date: 24-07-2023
 * @param {type} param -
 * @returns
 */
const loadDataAccountSyntheticLazy = async (searchAccountSynthetic) => {
  try {
    // tang offset
    pageAccountSynthetic.value += 1;
    // call danh sach tai khoan tong hop
    let res = await accountService.getList({
      keySearch: searchAccountSynthetic,
      pageSize: 10,
      pageNumber: pageAccountSynthetic.value,
    });
    // de quy xep cay

    if (res?.Data?.length > 0) {
      dataAccountSynthetic.value = [...dataAccountSynthetic.value, ...res.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

const loadDataAccountSyntheticFilter = async (searchAccountSynthetic) => {
  try {
    // store.dispatch("toggleLoading");
    // tang offset
    pageAccountSynthetic.value = 1;
    // call danh sach tai khoan tong hop
    let res = await accountService.getList({
      keySearch: searchAccountSynthetic,
      pageSize: 10,
      pageNumber: pageAccountSynthetic.value,
    });
    // de quy xep cay

    if (res?.Data) {
      dataAccountSynthetic.value = [...res?.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
    // store.dispatch("toggleLoading");
  }
};

/**
 * Mô tả: bat su kien keydown cho element wrapper
 * created by : vdtien
 * created date: 20-07-2023
 * @param {type} param -
 * @returns
 */
const handleKeyDownDocument = () => {
  // console.log("key pressed:", event.key);
  if (event.key === "Tab") {
    event.preventDefault();
    errRefs.AccountCode.value.focus();
    // tmpTablIndex.value.focus();
  } else if (event.key === "Escape") {
    onClosePopup();
  } else if (event.ctrlKey && event.keyCode === 83) {
    event.preventDefault();
    storeAccount();
  }
};

/**
 * Mô tả: đóng form
 * created by : vdtien
 * created date: 20-07-2023
 * @param {type} param -
 * @returns
 */
const onClosePopup = () => {
  // accountInfo.value = removeEmptyFields(accountInfo.value);
  if (
    JSON.stringify(accountInfo.value) !== JSON.stringify(accountDetail.value)
  ) {
    if (popupStatus.value.type === PopupType.create) {
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.info,
        title: DialogTitle.store,
        content: [DialogContent.confirmStoreEmployee],
        action: DialogAction.confirmCreate,
      });
    } else if (popupStatus.value.type === PopupType.update) {
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.info,
        title: DialogTitle.store,
        content: [DialogContent.confirmStoreEmployee],
        action: DialogAction.confirmUpdate,
      });
    } else {
      store.dispatch("getPopupStatus", {
        isShowPopup: false,
        type: "",
      });
      store.dispatch("getAccountDetail");
    }
  } else {
    store.dispatch("getPopupStatus", {
      isShowPopup: false,
      type: "",
    });
    store.dispatch("getAccountDetail");
  }
};

/**
 * validate các field xem có lỗi hay không
 * Author:vdtien(22/7/2023)
 */
const validatorAccount = () => {
  // xóa lỗi trước đó
  // Xóa tất cả các trường của reactive object
  Object.keys(errsValidator.value).forEach((key) => {
    delete errsValidator.value[key];
  });
  store.dispatch("getErrsValidate", {});

  // Kiểm tra các trường

  // Mã không được để trống
  let isAccountCodeEmpty = !accountInfo.value?.AccountCode?.trim();

  if (isAccountCodeEmpty) {
    errsValidator.value.AccountCode = [
      ...(errsValidator.value?.AccountCode ?? []),
      ErrValidator.fieldEmplty(AccountCol.AccountCode.text),
    ];
  } else {
    if (accountInfo?.value?.AccountCode?.length < 3) {
      errsValidator.value.AccountCode = [
        ...(errsValidator.value?.AccountCode ?? []),
        DialogContent.accountGreaterEqual3Characters,
      ];
    } else if (accountInfo?.value?.AccountCode?.length > 3) {
      if (!accountInfo.value?.ParentId) {
        errsValidator.value.ParentId = [
          ...(errsValidator.value?.ParentId ?? []),
          DialogContent.accountNeedParent,
        ];
      } else {
        if (
          !accountInfo.value.AccountCode.startsWith(
            valueAccountSynthetic.value.AccountCode
          )
        ) {
          errsValidator.value.AccountCode = [
            ...(errsValidator.value?.AccountCode ?? []),
            ErrValidator.accountDetailIsPrefixaccountSynthetic,
          ];
        }
      }
    }
  }
  // Tên không được để trống
  let isAccountNameEmpty = !accountInfo.value?.AccountName?.trim();

  if (isAccountNameEmpty) {
    errsValidator.value.AccountName = [
      ...(errsValidator.value?.AccountName ?? []),
      ErrValidator.fieldNotEmpty(FreeText.accountName),
    ];
  }

  // tính chất tài khoản không được để trống
  let isAccountFeatureEmpty =
    !accountInfo.value?.AccountFeature ||
    isNaN(accountInfo.value?.AccountFeature);

  if (isAccountFeatureEmpty) {
    errsValidator.value.AccountFeature = [
      ...(errsValidator.value?.AccountFeature ?? []),
      ErrValidator.fieldNotEmpty(FreeText.accountFeature),
    ];
  }

  // Kiểm tra xem reactive object có rỗng hay không
  const isEmpty = Object.keys(errsValidator.value).length === 0;
  if (isEmpty) {
    // console.log("isEmpty", isEmpty);
    return true;
  } else {
    const errMsgArray = Object.values(errsValidator.value).flat();
    // console.log(errMsgArray);
    store.dispatch("getErrsValidate", { ...errsValidator.value });
    store.dispatch("getDialog", {
      isShow: true,
      type: DialogType.error,
      title: DialogTitle.inValidInput,
      content: Object.values(errMsgArray),
      action: DialogAction.confirmValidate,
    });
  }
  return false;
};
/**
 * Mô tả: xử lý hành động bấm cất
 * created by : vdtien
 * created date: 22-07-2023
 * @param {type} param -
 * @returns
 */
const storeAccount = () => {
  let isValid = validatorAccount();

  if (isValid && popupStatus.value.type === PopupType.create) {
    // lưu thông tin nhân viên
    store.dispatch("createAccount", {
      account: accountInfo.value,
      typeStore: TypeStore.store,
    });
  } else if (isValid && popupStatus.value.type === PopupType.update) {
    // sửa thông tin nhân viên
    store.dispatch("updateAccount", {
      account: accountInfo.value,
      typeStore: TypeStore.store,
    });
  }
  // có lỗi thì không làm gì cả
};
/**
 * Mô tả: xử lý hành động bấm cất và thêm
 * created by : vdtien
 * created date: 22-07-2023
 * @param {type} param -
 * @returns
 */
const storeAndAddAccount = () => {
  let isValid = validatorAccount();
  if (isValid && popupStatus.value.type === PopupType.create) {
    // lưu thông tin nhân viên
    store.dispatch("createAccount", {
      account: accountInfo.value,
      typeStore: TypeStore.storeAndAdd,
    });
  } else if (isValid && popupStatus.value.type === PopupType.update) {
    // sửa thông tin nhân viên
    store.dispatch("updateAccount", {
      account: accountInfo.value,
      typeStore: TypeStore.storeAndAdd,
    });
  }
  // có lỗi thì không làm gì cả
};

/**
 * Mô tả: chọn thông tin kèm theo của tài khoản
 * created by : vdtien
 * created date: 24-08-2023
 * @param {type} param -
 * @returns
 */
const onClickSelectAttrDetailTracking = (fieldName, item) => {
  accountInfo.value[fieldName] = item[fieldSelectUserObject];
};

/**
 * Mô tả: toggle disable drop chọn thông tin kèm theo
 * created by : vdtien
 * created date: 24-08-2023
 * @param {type} param -
 * @returns
 */
const onClickToggleArrDetailTracking = (fieldName, defalutValue) => {
  toggleAttrDetailTracking.value[fieldName] =
    !toggleAttrDetailTracking.value[fieldName];
  if (toggleAttrDetailTracking.value[fieldName] === true) {
    accountInfo.value[fieldName] = defalutValue;
  } else {
    delete accountInfo.value[fieldName];
  }
};
/** ------ end methods -----------------*/
</script>
<template>
  <div
    ref="accountDetailRef"
    class="popup-wrapper outline-none"
    :tabindex="0"
    @keydown.stop="">
    <div
      class="popup-container flex flex-col"
      :class="{ 'fullsize-popup': isFullSizePopup }">
      <div class="popup__header flex items-center">
        <div class="popup-header__title">
          {{
            popupStatus?.type === PopupType.create
              ? FreeText.addAccount
              : FreeText.editAccount
          }}
        </div>
        <div class="popup-header__actions flex items-center ml-auto">
          <div class="popup-header-actions__question pr-2">
            <div class="icon-wrapper" title="HELP">
              <div class="icon icon--question"></div>
            </div>
          </div>
          <div
            ref="btnClose"
            class="popup-header-actions__close"
            :title="FreeText.editAccount"
            @keydown.enter="onClosePopup"
            @click="onClosePopup"
            @keydown.tab.stop="">
            <div class="icon-wrapper">
              <div class="icon icon--close"></div>
            </div>
          </div>
        </div>
      </div>
      <form id="accountForm" action="" class="popup__body flex-1 pr-2">
        <div class="form-content flex flex-col gap-24-0">
          <div class="form-content__top flex flex-col gap-16-0">
            <div class="w-full flex gap-0-8 justify-start">
              <b-textfield
                :ref="errRefs.AccountCode"
                v-model="accountInfo.AccountCode"
                :tab-index="1"
                required
                :label="FreeText.accountCode"
                :max-length="MaxLength.code"
                class-label="w-1/4"
                :err-msg="errsValidator?.AccountCode?.join('') ?? ''"
                @empty-err-msg="
                  () => {
                    delete errsValidator.AccountCode;
                  }
                "
                @keydown.shift.tab.stop.prevent="() => btnCancel.focus()" />
            </div>
            <div class="w-full flex gap-0-8 justify-start">
              <b-textfield
                :ref="errRefs.AccountName"
                v-model="accountInfo.AccountName"
                :tab-index="2"
                required
                :label="FreeText.accountName"
                :max-length="MaxLength.name"
                class-label="w-1/2"
                :err-msg="errsValidator?.AccountName?.join('') ?? ''"
                @empty-err-msg="
                  () => {
                    delete errsValidator.AccountName;
                  }
                " />
              <b-textfield
                v-model="accountInfo.AccountNameEnglish"
                :tab-index="3"
                :label="FreeText.nameEnglish"
                :max-length="MaxLength.name"
                class-label="w-1/2"
                @keydown.tab.stop="" />
            </div>
            <div class="w-full flex justify-start gap-0-8">
              <div class="flex justify-start gap-0-8 w-1/2">
                <BaseComboboxV1
                  :ref="errRefs.ParentId"
                  class="w-1/2"
                  tree
                  :label="FreeText.accountSynthetic"
                  :tab-index="4"
                  :max-length="MaxLength.default"
                  is-reload-scroll
                  is-reload
                  :fields="fields"
                  :field-select="fieldSelect"
                  :field-show="fieldShow"
                  :data-list="dataAccountSynthetic"
                  :id-selected="accountInfo.ParentId"
                  :value-selected="valueAccountSynthetic"
                  :err-msg="errsValidator?.ParentId?.join('') ?? ''"
                  @load-data-lazy="
                    (searchAccountSynthetic) =>
                      loadDataAccountSyntheticLazy(searchAccountSynthetic)
                  "
                  @load-data-filter="
                    (searchAccountSynthetic) =>
                      loadDataAccountSyntheticFilter(searchAccountSynthetic)
                  "
                  @on-click-id-selected="(id) => (accountInfo.ParentId = id)"
                  @add-value-selected="(item) => (valueAccountSynthetic = item)"
                  @empty-err-msg="
                    () => {
                      delete errsValidator.ParentId;
                    }
                  "
                  @keydown.tab.stop="" />
                <b-combobox
                  :ref="errRefs.AccountFeature"
                  :tab-index="5"
                  is-required
                  class="w-1/2"
                  class-list="mh-fit"
                  :label="FreeText.accountSynthetic"
                  :max-length="MaxLength.default"
                  :place-holder="FreeText.selectFeature"
                  :data-list="dataAccountFeature"
                  field-select="id"
                  field-show="value"
                  :id-selected="accountInfo.AccountFeature"
                  :err-msg="errsValidator?.AccountFeature?.join('') ?? ''"
                  @on-click-id-selected="
                    (id) => (accountInfo.AccountFeature = id)
                  "
                  @empty-err-msg="
                    () => {
                      delete errsValidator.AccountFeature;
                    }
                  "
                  @keydown.tab.stop="" />
              </div>
            </div>
            <div class="w-full flex justify-start">
              <label class="w-full" @keydown.tab.stop="">
                Diễn giải
                <textarea
                  v-model="accountInfo.Explain"
                  tabindex="6"
                  class="textarea"
                  maxlength="500"
                  rows="2"
                  @keydown.tab.stop=""></textarea>
              </label>
            </div>
            <div class="w-full flex justify-start">
              <label
                class="checkbox-wrapper w-auto flex flex-row items-center pointer m-0">
                <input
                  class="input-checkbox m-0 mr-1"
                  type="checkbox"
                  :tabindex="7"
                  @keydown.tab.stop="" />
                <span> Có hạch toán kinh tế </span>
              </label>
            </div>
          </div>
          <div class="form-content__bottom flex flex-col gap-16-0">
            <div class="form-content-bottom__header pointer">
              <div
                class="flex items-center justify-start"
                @click="isExpandDetailTracking = !isExpandDetailTracking">
                <div class="flex items-center justify-center w-4 h-4">
                  <div
                    class="icon icon-down-medium transition"
                    :class="{
                      'animatation-showMoreDetail': !isExpandDetailTracking,
                    }"></div>
                </div>
                <span class="title-showMoreDetail">{{
                  FreeText.detailTracking
                }}</span>
              </div>
            </div>
            <div
              v-show="isExpandDetailTracking"
              class="form-content-bottom__body transition flex flex-1 flex-col gap-8-0 px-3"
              :class="{ 'hidden-detail-tracking': !isExpandDetailTracking }">
              <div class="w-full flex items-center">
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input
                        class="input-checkbox m-0 mr-1"
                        type="checkbox"
                        :tabindex="8"
                        :checked="toggleAttrDetailTracking?.UserObject"
                        @click="
                          () => onClickToggleArrDetailTracking('UserObject', 2)
                        "
                        @keydown.tab.stop="" />
                      <span class="font-regular"> {{ FreeText.object }} </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :tabindex="9"
                      :disabled="!toggleAttrDetailTracking?.UserObject"
                      :data="dataUserObject"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      :id-selected="accountInfo?.UserObject ?? 0"
                      @on-click-id-select="
                        (id) => (accountInfo.UserObject = id)
                      "
                      @keydown.tab.stop="" />
                  </div>
                </div>
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular">
                        {{ FreeText.bankAccount }}</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <div class="w-full flex items-center">
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular">
                        {{ FreeText.objectTHCP }}
                      </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Công trình </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
              </div>

              <div class="w-full flex items-center">
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Đơn đặt hàng </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Hợp đồng bán </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
              </div>

              <div class="w-full flex items-center">
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Hợp đồng mua </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Khoản mục CP </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
              </div>

              <div class="w-full flex items-center">
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Đơn vị </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Mã thống kế </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disabled="true"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      @keydown.tab.stop="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="popup__footer flex items-center justify-between">
        <div class="popup-bottom__left">
          <b-button
            ref="btnCancel"
            :tabindex="12"
            type="secondary"
            size="mini"
            :title="FreeText.cancel"
            :tab-index="20"
            @keydown.enter="onClosePopup"
            @keydown="handleFocusFirst"
            @click="onClosePopup" />
        </div>
        <div class="popup-bottom__right flex justify-center gap-0-8">
          <b-button
            ref="btnStore"
            :tabindex="10"
            type="secondary"
            size="mini"
            :title="FreeText.store"
            :tab-index="18"
            @keydown.enter="storeAccount"
            @click="storeAccount" />
          <b-button
            ref="btnStoreAndAdd"
            :tabindex="11"
            type="primary"
            size="mini"
            :title="FreeText.storeAdd"
            :tab-index="19"
            @keydown.enter="storeAndAddAccount"
            @click="storeAndAddAccount" />
        </div>
      </div>

      <div
        class="resize-popup pointer"
        @click="isFullSizePopup = !isFullSizePopup">
        <div
          class="icon-v1 icon-v1-resize-popup"
          :class="{ 'route-icon-180': isFullSizePopup }"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.popup-container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: auto;
  /* width: 50%; */
  min-width: 50%;
  max-height: 100%;
  border-radius: var(--border-radius);
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  transition: all linear 0.2s;
}
.fullsize-popup {
  max-width: calc(100vw - 6px);
  width: calc(100vw - 6px) !important;
  height: 100%;
  transition: all linear 0.2s;
}
.resize-popup {
  position: absolute;
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
}
.route-icon-180 {
  rotate: 180deg;
}
.textarea {
  resize: none;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  font-family: inherit;
  display: block;
  padding: 9px;
  color: #000;
  width: 100%;
  outline: unset;
  margin-top: 4px;
}

.textarea:focus {
  border: 1px solid #50b83c;
  outline: none;
}
.animatation-showMoreDetail {
  transform: rotate(-90deg);
  transition: all linear 0.3s;
}
.transition {
  transition: all linear 0.3s;
}
.form-content-bottom__header:hover {
  color: #50b83c;
}
.form-content-bottom__header .title-showMoreDetail {
  font-size: 1rem;
}
/* .form-content-bottom__header .title-showMoreDetail:hover {
  color: #50b83c;
} */
.form-content-bottom__body {
  opacity: 1;
  animation: show-detail-tracking 0.3s linear forwards;
}
.hidden-detail-tracking {
  animation: hidden-detail-tracking 0.3s linear forwards;
}
@keyframes show-detail-tracking {
  from {
    max-height: 0px;
    opacity: 0;
  }
  to {
    opacity: 1;
    max-height: fit-content;
  }
}
@keyframes hidden-detail-tracking {
  from {
    opacity: 1;
  }
  to {
    max-height: 0px;
    opacity: 0;
  }
}
</style>
