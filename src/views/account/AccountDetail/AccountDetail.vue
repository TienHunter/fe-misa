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
  MaxLength,
  PopupType,
  TypeStore,
} from "@/enums";
import { useStore } from "vuex";
import BaseComboboxV1 from "@/components/bases/BaseComboboxV1.vue";
import accountService from "@/api/services/accountService";
import {
  ErrValidator,
  AccountCol,
  DialogTitle,
  DialogContent,
} from "@/resources";
import { removeEmptyFields } from "@/utils/helper";
/**state */
const store = useStore();
const isExpandPopup = ref(false);
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
  })
);
const btnCancel = ref(null);
const errValidator = reactive({});
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
    minWidth: 120,
    maxWidth: 160,
  },
  {
    name: "AccountName",
    label: "Tên tài khoản",
    minWidth: 200,
    maxWidth: 240,
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
/** -----------------------watch-------------------- */

/** start lifesycle */

onBeforeMount(async () => {
  store.dispatch("getErrsValidate", {});
  if (popupStatus.value.type === PopupType.update) {
    if (accountDetail.value?.ParentId) {
      try {
        let res = await accountService.getById(accountDetail.value.ParentId);
        console.log(res);
        if (res && Object.keys(res).length > 0) {
          // searchAccountSynthetic.value = res.AccountCode;
          valueAccountSynthetic.value = { ...res };
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (
      accountDetail.value?.UserObject !== null ||
      accountDetail.value?.UserObject !== undefined
    ) {
      toggleAttrDetailTracking.value.UserObject = true;
    }
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

watchEffect(() => [(accountInfo.value = { ...accountDetail.value })]);

// bắt sự thay đổi của dialog
watch(dialog, (newValue, oldValue) => {
  // ???
  // const isEmpty = Object.keys(dialog.value).length === 0;
  if (
    oldValue.type === DialogType.error &&
    oldValue.action === DialogAction.confirmValidate
  ) {
    // Lấy phần tử đầu tiên của danh sách
    // console.log(errsValidate.value);
    const firstKey = Object.keys(errsValidate.value)[0];
    // console.log("firstKey:", firstKey);
    if (firstKey) {
      const firstErr = accessRef(firstKey);
      firstErr.value.focus();
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
    store.dispatch("toggleLoading");
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
    store.dispatch("toggleLoading");
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
  accountInfo.value = removeEmptyFields(accountInfo.value);
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
  Object.keys(errValidator).forEach((key) => {
    delete errValidator[key];
  });
  store.dispatch("getErrsValidate", {});

  // Kiểm tra các trường

  // Mã không được để trống
  let isAccountCodeEmpty = !accountInfo.value?.AccountCode?.trim();

  if (isAccountCodeEmpty) {
    errValidator.AccountCode = [
      ...(errValidator?.AccountCode ?? []),
      ErrValidator.fieldEmplty(AccountCol.AccountCode.text),
    ];
  } else {
    if (accountInfo?.value?.AccountCode?.length < 3) {
      errValidator.AccountCode = [
        ...(errValidator?.AccountCode ?? []),
        "Số tài khoản phải có độ dài >= 3 ký tự.",
      ];
    }
  }
  // Tên không được để trống
  let isAccountNameEmpty = !accountInfo.value?.AccountName?.trim();

  if (isAccountNameEmpty) {
    errValidator.AccountName = [
      ...(errValidator?.AccountName ?? []),
      ErrValidator.fieldEmplty(AccountCol.AccountName.text),
    ];
  }

  // tính chất tài khoản không được để trống
  let isAccountFeatureEmpty =
    !accountInfo.value?.AccountFeature ||
    isNaN(accountInfo.value?.AccountFeature);

  if (isAccountFeatureEmpty) {
    errValidator.AccountFeature = [
      ...(errValidator?.AccountFeature ?? []),
      ErrValidator.fieldEmplty(AccountCol.AccountFeature.text),
    ];
  }

  // Kiểm tra xem reactive object có rỗng hay không
  const isEmpty = Object.keys(errValidator).length === 0;
  if (isEmpty) {
    // console.log("isEmpty", isEmpty);
    return true;
  } else {
    const errMsgArray = Object.values(errValidator).flat();
    // console.log(errMsgArray);
    store.dispatch("getErrsValidate", { ...errValidator });
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

const onClickSelectAttrDetailTracking = (fieldName, item) => {
  accountInfo.value[fieldName] = item[fieldSelectUserObject];
};
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
    <div class="popup-container flex flex-col">
      <div class="popup__header flex items-center">
        <div class="popup-header__title">
          {{
            popupStatus?.type === PopupType.create
              ? "Thêm tài khoản"
              : "Sửa tài khoản"
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
            title="Đóng - ESC"
            @keydown.enter="onClosePopup"
            @click="onClosePopup"
            @keydown="hanldeFocusFirst"
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
                label="Số tài khoản"
                :max-length="MaxLength.code"
                class-label="w-1/4"
                :err-msg="errsValidate?.AccountCode?.join('') ?? ''"
                @empty-err-msg="
                  () => {
                    delete errsValidate.AccountCode;
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
                label="Tên tài khoản"
                :max-length="MaxLength.name"
                class-label="w-1/2"
                :err-msg="errsValidate?.AccountName?.join('') ?? ''"
                @empty-err-msg="
                  () => {
                    delete errsValidate.AccountName;
                  }
                " />
              <b-textfield
                v-model="accountInfo.AccountNameEnglish"
                :tab-index="3"
                label="Tên tiếng anh"
                :max-length="MaxLength.name"
                class-label="w-1/2"
                @keydown.tab.stop="" />
            </div>
            <div class="w-full flex justify-start gap-0-8">
              <div class="flex justify-start gap-0-8 w-1/2">
                <BaseComboboxV1
                  class="w-1/2"
                  label="Tài khoản tổng hợp"
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
                  @load-data-lazy="
                    (searchAccountSynthetic) =>
                      loadDataAccountSyntheticLazy(searchAccountSynthetic)
                  "
                  @load-data-filter="
                    (searchAccountSynthetic) =>
                      loadDataAccountSyntheticFilter(searchAccountSynthetic)
                  "
                  @on-click-id-selected="(id) => (accountInfo.ParentId = id)"
                  @keydown.tab.stop="" />
                <b-combobox
                  :ref="errRefs.AccountFeature"
                  :tab-index="5"
                  is-required
                  class="w-1/2"
                  class-list="mh-fit"
                  label="Tính chất"
                  :max-length="MaxLength.default"
                  place-holder="-- Chọn tính chất --"
                  :data-list="dataAccountFeature"
                  field-select="id"
                  field-show="value"
                  :id-selected="accountInfo.AccountFeature"
                  :err-msg="errsValidate?.AccountFeature?.join('') ?? ''"
                  @on-click-id-selected="
                    (id) => (accountInfo.AccountFeature = id)
                  "
                  @empty-err-msg="
                    () => {
                      delete errsValidate.AccountFeature;
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
                <span class="title-showMoreDetail">Theo dõi chi tiết theo</span>
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
                      <span class="font-regular"> Đối tượng </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :tabindex="9"
                      :disable="!toggleAttrDetailTracking?.UserObject"
                      :data="dataUserObject"
                      :fields="fieldsUserObject"
                      :field-select="fieldSelectUserObject"
                      :field-show="fieldShowUserObject"
                      title-dropdown-list="--Chọn đối tượng--"
                      :item-selected="accountInfo.UserObject"
                      @on-click-select-item="
                        (item) =>
                          onClickSelectAttrDetailTracking('UserObject', item)
                      "
                      @keydown.tab.stop="" />
                  </div>
                </div>
                <div class="w-1/2 flex items-center justify-start">
                  <div class="w-5/6 flex items-center justify-start">
                    <label
                      class="checkbox-wrapper w-1/2 flex flex-row items-center pointer m-0 gap-0-8">
                      <input class="input-checkbox m-0 mr-1" type="checkbox" />
                      <span class="font-regular"> Tài khoản ngân hàng </span>
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
                      <span class="font-regular"> Đối tượng THCP </span>
                    </label>
                    <BDropdown
                      class="w-1/2"
                      :disable="true"
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
                      :disable="true"
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
                      :disable="true"
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
                      :disable="true"
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
                      :disable="true"
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
                      :disable="true"
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
                      :disable="true"
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
                      :disable="true"
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
            title="Hủy"
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
            title="Cất"
            :tab-index="18"
            @keydown.enter="storeAccount"
            @click="storeAccount" />
          <b-button
            ref="btnStoreAndAdd"
            :tabindex="11"
            type="primary"
            size="mini"
            title="Cất và thêm"
            :tab-index="19"
            @keydown.enter="storeAndAddAccount"
            @click="storeAndAddAccount" />
        </div>
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
  width: auto;
  min-width: 900px;
  max-height: 100%;
  border-radius: var(--border-radius);
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  transition: all 0.2s;
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
  margin-top: 8px;
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
