<template lang="">
  <div class="popup-wrapper outline-none" :tabindex="0" @keydown.stop="">
    <div class="flex flex-col popup-container" style="min-height: 500px">
      <div class="flex items-center popup__header justify-between">
        <div class="popup-header__title">
          {{ dialogDetail?.title ?? "" }}
        </div>
        <div class="flex items-center popup-header__actions">
          <div class="popup-header-actions__question mr-2">
            <div class="icon-wrapper" title="HELP">
              <div class="icon icon--question"></div>
            </div>
          </div>
          <div
            ref="btnClose"
            class="popup-header-actions__close"
            :title="FreeText.closeEsc"
            @click="onClosePopup"
            @keydown.tab.stop="">
            <div class="icon-wrapper">
              <div class="icon icon--close"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 popup__body px-4">
        <div class="result-synthetic">
          <div class="flex items-center gap-0-24 pb-4">
            <div class="flex items-center">
              <span>{{ FreeText.numberOfProcessingDocuments }}</span>
              <span class="pl-1 font-bold">{{
                resultBulkAction?.totalRecordExceute ?? 0
              }}</span>
            </div>
            <div class="flex items-center">
              <span>{{ FreeText.numberOfDocumentsProcessedSuccessfully }}</span>
              <span class="pl-1 font-bold">{{
                resultBulkAction?.totalRecordExcuteSuccess ?? 0
              }}</span>
            </div>
            <div class="flex items-center">
              <span>{{ FreeText.numberOfDocumentsProcessedFailed }}</span>
              <span class="pl-1 font-bold">{{
                resultBulkAction?.totalRecordExcuteFailure ?? 0
              }}</span>
            </div>
          </div>
        </div>
        <div class="toolbars pb-3">
          <div class="w-250">
            <b-textfield
              v-model="searchValue"
              class-input="m-0"
              :place-holder="FreeText.search"
              class-icon="icon icon--search-small" />
          </div>
        </div>
        <div class="table-wrapper">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th
                    v-for="(col, index) in dataCols"
                    :key="index"
                    :class="{
                      [col.class]: true,
                    }"
                    :title="col?.title">
                    <span>{{ col?.label }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- length danh sach lớn hơn 0 -->
                <template v-if="listTmp?.length > 0">
                  <tr
                    v-for="(item, index) in listTmp"
                    :key="item.PaymentId"
                    class="pointer">
                    <td
                      v-for="(col, indexCol) in dataCols"
                      :key="indexCol"
                      :title="converTitle(item?.[col?.name], col?.type)"
                      :class="{
                        [col.class]: true,
                      }">
                      <span
                        v-if="col?.name === 'index'"
                        :class="{ 'col-key': col?.key }"
                        @click="onOpenPopupView(col?.key, item?.PaymentId)">
                        {{ index + 1 }}
                      </span>
                      <span
                        v-else-if="col?.type === TypeCol.date"
                        :class="{ 'col-key': col?.key }"
                        @click="onOpenPopupView(col?.key, item?.PaymentId)">
                        {{ convertToDDMMYYYY(item?.[col?.name]) }}
                      </span>
                      <span
                        v-else-if="col?.type === TypeCol.array"
                        :class="{ 'col-key': col?.key }"
                        @click="onOpenPopupView(col?.key, item?.PaymentId)">
                        <ul>
                          <li
                            v-for="(item1, index1) in item?.[col?.name]"
                            :key="index1">
                            <span>{{ item1 }}</span>
                          </li>
                        </ul>
                      </span>
                      <span
                        v-else
                        :class="{ 'col-key': col?.key }"
                        @click="onOpenPopupView(col?.key, item?.PaymentId)">
                        {{ item?.[col?.name] }}</span
                      >
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td :colspan="dataCols.length" class="font-italic">
                      {{ FreeText.notFoundRecord }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="popup__footer flex justify-end items-center p-4">
        <b-button
          ref="btnStore"
          :title="FreeText.close"
          type="primary"
          size="mini"
          :tab-index="18"
          @click="onClosePopup" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { PopupType, TypeCol } from "@/enums";
import { useDebounce } from "@/hooks";
import { FreeText } from "@/resources";
import {
  convertToDDMMYYYY,
  converTitle,
  removeDiacritics,
} from "@/utils/helper";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";

//========= start state =========

const dataCols = [
  {
    name: "index",
    label: "#",
    class: "mw-32 w-32 Mw-32 text-center",
  },
  {
    name: "AccountingDate",
    label: "Ngày hạch toán",
    class: "mw-150 w-150 Mw-150 text-center",
    type: TypeCol.date,
  },
  {
    name: "PaymentDate",
    label: "Ngày phiếu chi",
    class: "mw-150 w-150 Mw-150 text-center",
    type: TypeCol.date,
  },
  {
    name: "PaymentCode",
    label: "Số phiếu chi",
    class: "mw-150 w-150 Mw-150 text-left",
    key: true,
  },
  {
    name: "ListUesrMsg",
    label: "Nguyên nhân",
    class: "text-left",
    type: TypeCol.array,
  },
];

const store = useStore();
const resultBulkAction = computed(() => store.state.global.resultBulkAction);
const paymentListFailure = computed(
  () => store.state.payment.paymentListFailure
);
const dialogDetail = computed(() => store.state.global.dialogDetail);
const searchValue = ref("");
const listTmp = ref([]);
const debounceSearch = useDebounce(searchValue, 600);

//========= end state =========

//========= start lifecycle =========

onBeforeMount(() => {
  listTmp.value = structuredClone(paymentListFailure.value);
});

//========= end lifecycle =========

//========= start watch =========

watch(debounceSearch, () => {
  console.log("1");
  listTmp.value = paymentListFailure.value.filter((e) =>
    removeDiacritics(e?.PaymentCode ?? "")
      .toLowerCase()
      .includes(removeDiacritics(debounceSearch.value).toLowerCase())
  );
});

//========= end watch =========

//========= start methods =========

/**
 * Mô tả: đóng form thông báo
 * created by : vdtien
 * created date: 23-08-2023
 * @param {type} param -
 * @returns
 */
const onClosePopup = () => {
  store.dispatch("getDialogDetail", {
    show: false,
  });
};

/**
 * Mô tả: mở popup detail theo id
 * created by : vdtien
 * created date: 23-08-2023
 * @param {type} param -
 * @returns
 */
const onOpenPopupView = async (type, id) => {
  if (type) {
    await store.dispatch("getPaymentById", id);

    // mở form detail
    store.dispatch("getPopupStatus", {
      isShowPopup: true,
      type: PopupType.view,
    });
  }
};

//========= end methods =========
</script>
<style scoped>
.col-key {
  color: #0075c0;
}
.col-key:hover {
  text-decoration: underline;
}
ul {
  list-style: none;
}
</style>
