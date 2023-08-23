<template>
  <div ref="tablePaymentRef" class="table-wrapper">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th
              v-for="(col, index) in paymentCols"
              :key="index"
              :class="{
                'th-anchor': col?.key === 'checkbox',
                'th-anchor th-anchor--end': col?.key === 'action',
                [`text-${col?.text ?? 'left'}`]: true,
              }"
              :style="{
                minWidth: `${col?.minWidth ?? 160}px`,
                maxWidth: `${col?.maxWidth ?? 160}px`,
              }"
              :title="col?.title">
              <div
                v-if="col?.key === 'checkbox'"
                class="flex items-center justify-center">
                <input
                  type="checkbox"
                  :checked="checkAll"
                  @click="onClickCheckAllRecord" />
              </div>

              <span v-else>{{ col?.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paymentList?.length > 0">
            <tr
              v-for="(item, index) in paymentList"
              :key="item.PaymentId"
              class="pointer"
              :class="{
                'tr--checked': paymentIdListChecked.includes(item.PaymentId),
              }"
              @dblclick="() => onClickButton(item, TypeClickButton.view)">
              <td
                v-for="(col, indexCol) in paymentCols"
                :key="indexCol"
                :title="converTitle(item[col?.key], col?.type)"
                :class="{
                  'td-anchor td-anchor--start': col?.key === 'checkbox',
                  'td-anchor td-anchor--end td-action': col?.key === 'action',
                  [`text-${col?.text ?? 'left'}`]: true,
                  'before-last': indexCol === paymentCols.length - 2,
                }"
                :style="{
                  'z-index':
                    rowSelected === item.PaymentId && col?.key === 'action'
                      ? 1
                      : 0,
                  color: item?.PaymentStatus === 1 ? '#111' : '#14A200',
                }"
                @click="() => onClickCheckRecord([item.PaymentId])">
                <input
                  v-if="col?.key === 'checkbox'"
                  type="checkbox"
                  :checked="paymentIdListChecked.includes(item.PaymentId)"
                  @dblclick.stop=""
                  @click.stop=""
                  @click="() => onClickCheckRecord([item.PaymentId])" />
                <span
                  v-else-if="col?.key === 'PaymentCode'"
                  class="col-key"
                  @click.stop="onClickButton(item, TypeClickButton.view)">
                  {{ item[col?.key] }}
                </span>
                <span v-else-if="col?.type == TypeCol.date">
                  {{ convertToDDMMYYYY(item[col?.key]) }}
                </span>
                <span
                  v-else-if="col?.type == TypeCol.money"
                  :class="{ 'text-red': item[col?.key] < 0 }">
                  {{ formatDecimal(item[col?.key]) }}
                </span>

                <span v-else-if="col?.key !== 'action'">{{
                  item[col?.key]
                }}</span>
                <div
                  v-else
                  class="flex items-center justify-center h-full"
                  @dblclick.stop=""
                  @click.stop="">
                  <a
                    href="#"
                    class="text-blue font-semi-bold h-full flex items-center px-4"
                    @click="() => onClickButton(item, TypeClickButton.view)"
                    >{{ ButtonTitle.view }}</a
                  >

                  <div
                    class="td-action__icon h-full flex items-center"
                    :style="{
                      'z-index':
                        rowSelected === item.PaymentId && col?.key === 'action'
                          ? 2
                          : 0,
                    }">
                    <div
                      :ref="btnTableRefs[index]"
                      class="icon-wrapper w-4 h-4"
                      :class="{
                        'border--blue': rowSelected === item.PaymentId,
                      }"
                      @click="(e) => toggleTableAction(e, item, index)">
                      <div
                        class="icon icon--down-small-blue"
                        style="paddingtop: 1px"></div>
                    </div>

                    <div
                      v-if="rowSelected === item.PaymentId"
                      class="dropdown-list td-action-list"
                      :class="{ 'td-action-list--up': btnTableDirectUp }">
                      <div
                        v-if="item.PaymentStatus == PaymentStatus.written"
                        class="dropdown-item td-action-item td-action-item--remove"
                        @click="
                          () => onClickButton(item, TypeClickButton.unWrite)
                        ">
                        {{ ButtonTitle.unWritten }}
                      </div>
                      <div
                        v-if="item.PaymentStatus === PaymentStatus.unWritten"
                        class="dropdown-item td-action-item td-action-item--remove"
                        @click="
                          () => onClickButton(item, TypeClickButton.write)
                        ">
                        {{ ButtonTitle.written }}
                      </div>
                      <div
                        v-if="item.PaymentStatus !== 1"
                        class="dropdown-item td-action-item td-action-item--remove"
                        @click="
                          () => onClickButton(item, TypeClickButton.delete)
                        ">
                        {{ ButtonTitle.delete }}
                      </div>
                      <div
                        class="dropdown-item td-action-item"
                        @click="
                          () => onClickButton(item, TypeClickButton.duplicate)
                        ">
                        {{ ButtonTitle.duplicate }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="rowSelected"
                    class="overlay"
                    @click="() => toggleTableAction()" />
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="paymentCols.length" class="font-italic">
                {{ FreeText.notFoundRecord }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <th
              v-for="(col, index) in paymentCols"
              :key="index"
              class="th-foot"
              :class="{
                [`text-${col?.text ?? 'left'}`]: true,
              }">
              <span
                v-if="col.type === TypeCol.money"
                :class="{ 'text-red': totalMoney < 0 }"
                >{{ formatDecimal(totalMoney) }}</span
              >
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeMount, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";

import {
  areAllElementsInArray,
  convertToDDMMYYYY,
  formatDecimal,
  converTitle,
} from "@/utils/helper";
import {
  PaymentStatus,
  PopupType,
  TypeCol,
  TypeClickButton,
  DialogType,
  DialogAction,
} from "@/enums";
import { FreeText, ButtonTitle, DialogTitle, DialogContent } from "@/resources";
import { useDebounce } from "@/hooks";

//======== start state ===========

const store = useStore();
const paymentList = computed(() => store.state.payment.paymentList);
const paymentIdListChecked = computed(
  () => store.state.payment.paymentIdListChecked
);
const totalMoney = computed(() => sumMoney());
const btnTableRefs = ref([]);
const checkAll = ref(false);
const rowSelected = ref("");
const tablePaymentRef = ref(null);
const btnTableDirectUp = ref(false);

//======== end state ==============

//========= start lifecycle =========

watchEffect(() => {
  let paymentIdList = ref(paymentList.value.map((item) => item.PaymentId));
  if (
    areAllElementsInArray(paymentIdList.value, paymentIdListChecked.value) &&
    paymentIdListChecked.value?.length > 0
  ) {
    checkAll.value = true;
  } else {
    checkAll.value = false;
  }
  // Đánh lại ref khi danh sách items thay đổi
  btnTableRefs.value = paymentList.value.map(() => ref(null));
  // console.log(paymentIdListChecked.value);
});

//========= end lifecycle =========
const paymentCols = [
  {
    key: "checkbox",
    label: "",
    minWidth: 40,
    maxWidth: 40,
    text: "center",
  },
  {
    key: "AccountingDate",
    label: "Ngày hạch toán",
    minWidth: 160,
    maxWidth: 160,
    text: "center",
    type: TypeCol.date,
  },
  {
    key: "PaymentDate",
    label: "Ngày phiếu chi",
    minWidth: 160,
    maxWidth: 160,
    text: "center",
    type: TypeCol.date,
  },
  {
    key: "PaymentCode",
    label: "Số chứng từ",
    minWidth: 160,
    maxWidth: 160,
    text: "left",
  },
  {
    key: "ReasonSpending",
    label: "Diễn giải",
    minWidth: 160,
    maxWidth: 200,
    text: "left",
  },
  {
    key: "TotalMoney",
    label: "Số tiền",
    minWidth: 160,
    maxWidth: 160,
    text: "right",
    type: TypeCol.money,
  },
  {
    key: "SupplierName",
    label: "Đối tượng",
    minWidth: 160,
    maxWidth: 160,
    text: "left",
  },
  {
    key: "Address",
    label: "Địa chỉ",
    minWidth: 160,
    maxWidth: 160,
    text: "left",
  },
  {
    key: "action",
    label: "Chức năng",
    minWidth: 120,
    maxWidth: 120,
    text: "center",
  },
];
//========= start methods =========

const onClickCheckRecord = (itemId) => {
  store.dispatch("getPaymentIdListCkecked", itemId);
};

const onClickCheckAllRecord = () => {
  let paymentIdList = paymentList.value.map((item) => item.PaymentId);

  store.dispatch("getPaymentIdListCkecked", paymentIdList);
};
const toggleTableAction = (e, item, index) => {
  // console.log(item);
  if (!item) {
    rowSelected.value = "";
    btnTableDirectUp.value = false;
    return;
  }
  if (rowSelected.value !== item.PaymentId) {
    rowSelected.value = item.PaymentId;
    const tablePositionBottom =
      tablePaymentRef.value.getBoundingClientRect().bottom;
    console.log(e.target.getBoundingClientRect().bottom);
    const btnTableActionPositionBottom =
      e.target.getBoundingClientRect().bottom;
    if (tablePositionBottom - btnTableActionPositionBottom <= 100) {
      btnTableDirectUp.value = true;
    }
  } else {
    rowSelected.value = "";
    btnTableDirectUp.value = false;
  }
  // console.log(rowSelected);
};

const sumMoney = () => {
  let total = 0;
  if (paymentList?.value?.length >= 0) {
    paymentList.value.forEach((payment) => {
      if (
        typeof payment?.TotalMoney === "number" &&
        !isNaN(payment?.TotalMoney)
      )
        total += payment?.TotalMoney;
      else total += 0;
    });
  }

  return total;
};

const onClickButton = async (item, type) => {
  const _item = structuredClone(item);
  rowSelected.value = "";
  switch (type) {
    case TypeClickButton.view:
      await store.dispatch("getPaymentById", _item?.PaymentId);

      // mở form detail
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.view,
      });
      break;
    case TypeClickButton.unWrite:
      store.dispatch("updateStatusPayment", {
        paymentId: _item?.PaymentId,
        status: PaymentStatus.unWritten,
        outForm: true,
      });
      break;
    case TypeClickButton.write:
      store.dispatch("updateStatusPayment", {
        paymentId: _item?.PaymentId,
        status: PaymentStatus.written,
        outForm: true,
      });
      break;
    case TypeClickButton.duplicate:
      _item.PaymentStatus = PaymentStatus.unWritten;
      delete _item.PaymentId;
      if (Array.isArray(_item.Accountings)) {
        const tmp = _item.Accountings.map(
          ({ AccountingId, ...accounting }) => accounting
        );
        _item.Accountings = structuredClone(tmp);
      }
      store.dispatch("getPaymentDetail", _item);
      await store.dispatch("getNewPaymentCode");

      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.create,
      });
      break;
    case TypeClickButton.delete:
      if (_item.PaymentStatus === PaymentStatus.written) {
        store.dispatch("getDialog", {
          isShow: true,
          type: DialogType.error,
          title: DialogTitle.error,
          content: [DialogContent.paymentWritten(_item.PaymentCode)],
        });
        break;
      }
      store.dispatch("getPaymentDetail", _item);
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.warning,
        title: DialogTitle.delete,
        content: [`${DialogContent.confirmDeletePayment(_item?.PaymentCode)}`],
        action: DialogAction.confirmDelete,
      });
      break;
    default:
      break;
  }
};

const onOpenPopupView = async (item) => {
  await store.dispatch("getPaymentById", item.PaymentId);

  // mở form detail
  store.dispatch("getPopupStatus", {
    isShowPopup: true,
    type: PopupType.view,
  });
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
</style>
