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
            title="Đóng - ESC"
            :tabindex="21"
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
              <span>Số nhà cung cấp được xử lý</span>
              <span class="pl-1 font-bold">{{
                resultBulkAction?.totalRecordExceute ?? 0
              }}</span>
            </div>
            <div class="flex items-center">
              <span>Số nhà cung cấp thành công</span>
              <span class="pl-1 font-bold">{{
                resultBulkAction?.totalRecordExcuteSuccess ?? 0
              }}</span>
            </div>
            <div class="flex items-center">
              <span>Số nhà cung cấp không thành công</span>
              <span class="pl-1 font-bold">{{
                resultBulkAction?.totalRecordExcuteFailure ?? 0
              }}</span>
            </div>
          </div>
        </div>
        <div class="toolbars pb-3">
          <div class="w-250">
            <b-textfield
              class-input="m-0"
              place-holder="Nhập từ khóa tìm kiếm"
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
                <template v-if="listSupplierExecuteFailure?.length > 0">
                  <tr
                    v-for="(item, index) in listSupplierExecuteFailure"
                    :key="item.PaymentId"
                    class="pointer">
                    <td
                      v-for="(col, indexCol) in dataCols"
                      :key="indexCol"
                      :title="converTitle(item?.[col?.name], col?.type)"
                      :class="{
                        [col.class]: true,
                      }">
                      <span v-if="col?.name === 'index'">
                        {{ index + 1 }}
                      </span>
                      <span v-else-if="col?.type === TypeCol.date">
                        {{ convertToDDMMYYYY(item?.[col?.name]) }}
                      </span>
                      <span v-else-if="col?.type === TypeCol.array">
                        <ul>
                          <li
                            v-for="(item1, index1) in item?.[col?.name]"
                            :key="index1">
                            <span>{{ item1 }}</span>
                          </li>
                        </ul>
                      </span>
                      <span v-else> {{ item?.[col?.name] }}</span>
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
          title="Đóng"
          type="primary"
          size="mini"
          :tab-index="18"
          @click="onClosePopup" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { TypeCol } from "@/enums";
import { FreeText } from "@/resources";
import { convertToDDMMYYYY, converTitle } from "@/utils/helper";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const dataCols = [
  {
    name: "index",
    label: "#",
    class: "mw-32 w-32 Mw-32 text-center",
  },
  {
    name: "SupplierCode",
    label: "Mã nhà cung cấp",
    class: "mw-150 w-150 Mw-150 text-left",
  },
  {
    name: "SupplierName",
    label: "Tên nhà cung cấp",
    class: "mw-150 w-150 Mw-150 text-left",
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
const listSupplierExecuteFailure = computed(
  () => store.state.supplier.listSupplierExecuteFailure
);
const dialogDetail = computed(() => store.state.global.dialogDetail);

const onClosePopup = () => {
  store.dispatch("getDialogDetail", {
    show: false,
  });
};
</script>
<style lang=""></style>
