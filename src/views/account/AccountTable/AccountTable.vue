<template>
  <div ref="tableAccountRef" class="table-wrapper">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th
              v-for="(col, index) in accountCols"
              :key="index"
              :class="{
                'th-anchor th-anchor--end': col?.name === 'action',
                [col?.class]: true,
              }"
              :title="col?.title">
              <span>{{ col?.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="accountsList?.length > 0">
            <template v-for="item in accountsList" :key="item.AccountId">
              <tr v-if="isshowTr(item.ParentId)" class="pointer">
                <td
                  v-for="(col, indexCol) in accountCols"
                  :key="indexCol"
                  :class="{
                    'td-anchor td-anchor--end td-action':
                      col?.name === 'action',
                    'before-last': indexCol === accountCols?.length - 2,
                    'font-bold': item?.IsParent,
                    [col?.class]: true,
                  }"
                  :style="{
                    'z-index':
                      rowSelected === item?.AccountId && col?.name === 'action'
                        ? 1
                        : 0,
                  }"
                  :title="item?.[col?.name]"
                  @dblclick="() => onOpenPopupUpdate(item)">
                  <span
                    v-if="col?.name == 'AccountCode'"
                    class="flex items-center gap-0-8"
                    :style="{ 'padding-left': `${24 * item?.Grade ?? 0}px` }">
                    <div class="w-4 h-4 flex items-center justify-center">
                      <div
                        v-show="item?.IsParent"
                        class="icon"
                        :class="{
                          'icon--plus-square': !item?.showChild,
                          'icon--minus-square': item?.showChild,
                        }"
                        @dblclick.stop=""
                        @click.stop="() => onClickToggleShowChild(item)"></div>
                      <div v-show="!item?.IsParent" class="icon"></div>
                    </div>
                    <span>{{ item[col?.name] }}</span>
                  </span>
                  <span v-else-if="col?.name === 'AccountFeature'">
                    {{ converAccountFeature(item[col?.name]) }}</span
                  >
                  <span v-else-if="col?.name === 'Status'">
                    {{ converStatusField(item[col?.name]) }}
                  </span>

                  <div
                    v-else-if="col?.name === 'action'"
                    class="flex items-center justify-center h-full"
                    @dblclick.stop=""
                    @click.stop="">
                    <a
                      href="#"
                      class="text-blue font-semi-bold h-full flex items-center px-4"
                      @click="() => onOpenPopupUpdate(item)"
                      >{{ ButtonTitle.edit }}</a
                    >

                    <div
                      class="td-action__icon flex items-center"
                      :style="{
                        'z-index': rowSelected === item.AccountId ? 2 : 0,
                      }">
                      <div
                        class="icon-wrapper w-4 h-4"
                        :class="{
                          'border--blue': rowSelected === item.AccountId,
                        }"
                        @click="() => toggleTableAction(item, index)">
                        <div
                          class="icon icon--down-small-blue"
                          style="paddingtop: 1px"></div>
                      </div>

                      <div
                        v-if="rowSelected === item.AccountId"
                        class="dropdown-list td-action-list"
                        :class="{ 'td-action-list--up': btnTableDirectUp }">
                        <div
                          class="dropdown-item td-action-item td-action-item--remove"
                          @click="() => onClickDeleteAccount(item)">
                          {{ ButtonTitle.delete }}
                        </div>
                        <div
                          class="dropdown-item td-action-item"
                          @click="() => onClickCloneRecord(item)">
                          {{ ButtonTitle.duplicate }}
                        </div>
                        <div
                          v-show="item?.Status === 0 || item?.Status === 1"
                          class="dropdown-item td-action-item"
                          @click="() => onClickChangeStatus(item)">
                          {{
                            item?.Status === 0 ? FreeText.use : FreeText.notUse
                          }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="rowSelected"
                      class="overlay"
                      @click="() => toggleTableAction()" />
                  </div>
                  <span v-else> {{ item[col?.name] }}</span>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="accountCols?.length ?? 0" class="font-italic">
                {{ FreeText.notFoundRecord }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import TrTree from "./TrTree.vue";
import { FreeText, ButtonTitle, DialogTitle, DialogContent } from "@/resources";
import { useStore } from "vuex";
import { computed, onBeforeMount, onMounted, ref, watchEffect } from "vue";
import {
  converAccountFeature,
  converStatusField,
  removeEmptyFields,
} from "@/utils/helper";
import {
  DialogAction,
  DialogType,
  PopupType,
  Status,
  TypeUpdate,
} from "@/enums";

const store = useStore();
const accountsList = computed(() => store.state.account.accountsList);
const rowSelected = ref("");
const tableAccountRef = ref(null);
const positionTableBottom = ref(0);
const btnTableDirectUp = ref(false);
const accountCols = [
  {
    name: "AccountCode",
    label: "Số tài khoản",
    class: "mw-130 w-130 Mw-130 text-left",
  },
  {
    name: "AccountName",
    label: "Tên tài khoản",
    class: "mw-250 w-250 Mw-250 text-left",
  },
  {
    name: "AccountFeature",
    label: "Tính chất",
    class: "mw-130 w-130 Mw-130 text-left",
  },
  {
    name: "AccountNameEnglish",
    label: "Tên tiếng anh",
    class: "mw-250 w-250 Mw-250 text-left",
  },
  {
    name: "Explain",
    label: "Diễn giải",
    class: "mw-150 w-150 Mw-150 text-left",
  },
  {
    name: "Status",
    label: "Trạng thái",
    class: "mw-120 w-120 Mw-120 text-left",
  },
  {
    name: "action",
    label: "Chức năng",
    class: "mw-100 w-100 Mw-100 text-center",
  },
];
onBeforeMount(() => {
  // store.dispatch("getAccountsListTree");
});
onMounted(() => {
  positionTableBottom.value =
    tableAccountRef.value.getBoundingClientRect().bottom;
  console.log(positionTableBottom.value);
});

/**
 * toggle more action ở cột chức năng của table
 * Author: vdtien (27/5/2023)
 */
const toggleTableAction = (item) => {
  // console.log(item);
  console.log(event.clientY);
  if (!item) {
    rowSelected.value = "";
    btnTableDirectUp.value = false;
    return;
  }
  if (rowSelected.value !== item.AccountId) {
    rowSelected.value = item.AccountId;
    if (positionTableBottom.value - event.clientY < 100) {
      btnTableDirectUp.value = true;
    } else {
      btnTableDirectUp.value = false;
    }
  } else {
    rowSelected.value = "";
    // btnTableDirectUp.value = false;
  }
};

// kiểm tra điều kiện hiển thị của 1 tr
const isshowTr = (ParentId) => {
  // console.log("run is show");
  // kiem tra cha cos dong mo khong
  let parent = accountsList.value.find((obj) => obj.AccountId === ParentId);
  // console.log(parent?.AccountId);
  if (parent) {
    if (parent?.showChild === true) return isshowTr(parent?.ParentId);
    else {
      return false;
    }
  } else {
    return true;
  }
};

/**
 * Mô tả: mo rong hoac thu gon
 * created by : vdtien
 * created date: 22-07-2023
 * @param {type} param -
 * @returns
 */
const onClickToggleShowChild = async (item) => {
  if (item.showChild === false) {
    // kiem tra xem no co con khong
    const childs = accountsList.value.filter(
      (obj) => obj.ParentId === item.AccountId
    );

    // console.log(child?.AccountId);
    if (childs.length === item.NumberChilds) {
      // neu co con roi thi khong can load api
      store.dispatch("toggleShowChild", item.AccountId);
    } else {
      await store.dispatch("getAccountsListByParentId", item.AccountId);
    }
  } else {
    store.dispatch("toggleShowChild", item.AccountId);
  }
};

/**
 * Mô tả: xoa 1 ban gho
 * created by : vdtien
 * created date: 22-07-2023
 * @param {type} param -
 * @returns
 */
const onClickDeleteAccount = (item) => {
  // console.log(item);
  toggleTableAction(item);
  if (item?.IsParent === 1) {
    store.dispatch("getDialog", {
      isShow: true,
      type: DialogType.error,
      title: DialogTitle.error,
      content: [DialogContent.accountHasChildren],
    });
    return;
  }
  store.dispatch("getAccountDetail", item);
  store.dispatch("getDialog", {
    isShow: true,
    type: DialogType.warning,
    title: DialogTitle.delete,
    content: [`${DialogContent.confirmDeleteAccount(item?.AccountCode)}`],
    action: DialogAction.confirmDelete,
  });
};

/**
 * mở popup cập nhật nhân viên
 * Author:vdtien (28/5/2023)
 */
const onOpenPopupUpdate = (item) => {
  const itemRemoveNull = removeEmptyFields(item);
  store.dispatch("getAccountDetail", itemRemoveNull);
  store.dispatch("getPopupStatus", {
    isShowPopup: true,
    type: PopupType.update,
  });
};

/**
 *
 * @param {*} item
 * nhan ban nhan vien theo nhan vien duoc click
 * Author: vdtien(28/5/2023)
 */
const onClickCloneRecord = async (item) => {
  // console.log(item);
  toggleTableAction(item);
  const itemRemoveNull = removeEmptyFields({ ...item });
  delete itemRemoveNull.AccountId;
  delete itemRemoveNull.ParentId;
  store.dispatch("getAccountDetail", itemRemoveNull);
  store.dispatch("getPopupStatus", {
    isShowPopup: true,
    type: PopupType.create,
  });
};

/**
 * Mô tả: chuyen trang thai su dung
 * created by : vdtien
 * created date: 26-07-2023
 * @param {type} param -
 * @returns
 */
const onClickChangeStatus = (item) => {
  // ngung su dung -> su dung
  toggleTableAction(item);
  if (item?.Status === Status.stopUsing) {
    let parent = accountsList.value.find(
      (acc) => acc.AccountId === item.ParentId
    );
    if (!parent || parent?.Status === Status.using) {
      // tai khoan cha dang su dung
      store.dispatch("getAccountDetail", item);
      if (item?.IsParent === 1) {
        store.dispatch("getDialog", {
          isShow: true,
          type: DialogType.warning,
          title: DialogTitle.notify,
          content: [DialogContent.useAllAccountChild],
          action: DialogAction.confirmUpdateStatus,
        });
      } else {
        store.dispatch("updateAccountStatus", {
          accountId: item?.AccountId,
          status: Status.using,
          type: TypeUpdate.one,
        });
      }
    } else if (parent && parent?.Status === Status.stopUsing) {
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.error,
        title: DialogTitle.notify,
        content: [DialogContent.notUseAccountChild],
      });
    }
  } else if (item?.Status == Status.using) {
    store.dispatch("updateAccountStatus", {
      accountId: item?.AccountId,
      status: Status.stopUsing,
      type: TypeUpdate.all,
    });
  }
};
</script>
<style></style>
