<template>
  <div class="deposit-withdraw-list">
    <div class="layout-master-detail">
      <div class="master-detail-section h-full">
        <div class="content-layout flex flex-col h-full">
          <div class="overview position-sticky">
            <div class="inner-overview flex gap-0-16">
              <div class="w-1/3">
                <div class="first-overview">
                  <div class="first-overview-data inner-overview-data">
                    <div class="label-overview">
                      Tổng thu đầu năm đến hiện tại
                    </div>
                    <div class="overview-data-number flex">
                      <div class="con-ms-tooltip">
                        <div class="msTooltipParent">
                          <div
                            class="ms-tooltip"
                            style="
                              left: 0px;
                              top: 0px;
                              position: fixed;
                              display: none;
                            ">
                            Bấm vào để xem chi tiết
                          </div>
                        </div>
                        <div class="tooltip-content">
                          <div class="total-money hyper-link cls-func-pointer">
                            0,00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-1/3">
                <div class="second-overview">
                  <div class="second-overview-data inner-overview-data">
                    <div class="label-overview">
                      Tổng chi đầu năm đến hiện tại
                    </div>
                    <div class="overview-data-number flex">
                      <div class="con-ms-tooltip">
                        <div class="msTooltipParent"></div>
                        <div class="tooltip-content">
                          <div class="total-money hyper-link cls-func-pointer">
                            (11.000,00)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-1/3">
                <div class="rthird-overview">
                  <div class="rthird-overview-data inner-overview-data">
                    <div class="label-overview">Tồn quỹ hiện tại</div>
                    <div class="overview-data-number flex">
                      <div class="con-ms-tooltip">
                        <div class="msTooltipParent"></div>
                        <div class="tooltip-content">
                          <div class="total-money hyper-link cls-func-pointer">
                            1.948.714.501,00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="last-update">
                <span>Số liệu tính đến: </span>
                16h31
              </div>
            </div>
          </div>
          <div class="grid-list-data position-sticky">
            <div class="grid-button-list flex justify-between">
              <div class="flex items-center">
                <div class="ckeck-all-arrow">
                  <div class="icon-wrapper">
                    <div class="icon-v1 icon-v1--arrow-check-all"></div>
                  </div>
                </div>
                <div
                  class="batch-actions flex items-center pointer"
                  :class="{
                    'no-pointer': !(paymentIdListChecked?.length > 1),
                  }">
                  <div
                    ref="actionMultiRef"
                    class="flex items-center px-2 w-full h-full"
                    @click="toggleActionMulti">
                    <div class="batch-actions__title">
                      {{ ButtonTitle.multiAction }}
                    </div>
                    <div class="batch-actions__icon">
                      <div class="icon icon--down-small-black"></div>
                    </div>
                  </div>
                  <div
                    v-show="isShowActionMulti"
                    class="dropdown-list batch-actions__list">
                    <div
                      class="dropdown-item"
                      @click="onClickButton(TypeClickButton.write)">
                      {{ ButtonTitle.written }}
                    </div>
                    <div
                      class="dropdown-item"
                      @click="onClickButton(TypeClickButton.unWrite)">
                      {{ ButtonTitle.unWritten }}
                    </div>
                    <div
                      class="dropdown-item"
                      @click="onClickButton(TypeClickButton.deleteMulti)">
                      {{ ButtonTitle.delete }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-0-8">
                <div style="width: 240px">
                  <b-textfield
                    v-model="searchValue"
                    class-input="m-0"
                    :place-holder="FreeText.search"
                    class-icon="icon icon--search-small" />
                </div>
                <div
                  class="icon-wrapper content-body-tools__refresh"
                  :title="FreeText.reload"
                  @click="onClickRefreshPage">
                  <div class="icon icon--refresh"></div>
                </div>
                <div
                  class="icon-wrapper content-body-tools__export-excel"
                  :title="FreeText.exportExcel"
                  @click="exportExcelPaymentList">
                  <div class="icon icon--excel"></div>
                </div>
                <b-button
                  :type="ButtonType.combo"
                  :title="FreeText.pay"
                  round
                  size="mini"
                  :on-click="onOpenPopupCreate">
                </b-button>
              </div>
            </div>
          </div>

          <div class="content-body__table flex-1">
            <DepositWidthdrawTable />
          </div>
          <div class="content-body__paging">
            <DepositWithdrawPaging />
          </div>
        </div>
      </div>
    </div>
  </div>

  <DepositWithdrawNotice v-if="dialogDetail?.show" />
  <DepositWithdrawDetail v-if="popupStatus?.isShowPopup" />
  <DepositWithdrawDialog v-if="dialog.isShow" />
  <b-toast-message v-if="toast?.isShow" />
  <b-loading v-if="isLoading" />
</template>
<script setup>
import { computed, onBeforeMount, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import { ButtonTitle, FreeText } from "@/resources";
import { ButtonType, PaymentStatus, PopupType, TypeClickButton } from "@/enums";
import { useClickOutside, useDebounce } from "@/hooks";
import DepositWidthdrawTable from "../DepositWithdrawTable/DepositWithdrawTable.vue";
import DepositWithdrawPaging from "../DepositWithdrawPaging/DepositWithdrawPaging.vue";
import DepositWithdrawDetail from "../DepositWithdrawDetail/DepositWithdrawDetail.vue";
import DepositWithdrawDialog from "../DepositWithdrawDialog/DepositWithdrawDialog.vue";
import DepositWithdrawNotice from "../DepositWithdrawNotice/DepositWithdrawNotice.vue";
import { convertToYYYYMMDD } from "@/utils/helper";
//---- start state ----------

const store = useStore();
const isLoading = computed(() => store.state.global.isLoading);
const popupStatus = computed(() => store.state.global.popupStatus);
const dialog = computed(() => store.state.global.dialog);
const toast = computed(() => store.state.global.toast);
const dialogDetail = computed(() => store.state.global.dialogDetail);
const paymentIdListChecked = computed(
  () => store.state.payment.paymentIdListChecked
);
const filterAndPaging = computed(() => store.state.global.filterAndPaging);
const isShowActionMulti = ref(false);
const actionMultiRef = ref(null);
const isOutsideActionMulti = useClickOutside(actionMultiRef);
const searchValue = ref("");
const debounceSearch = useDebounce(searchValue, 600);
//---- end state ----------

//========= start lifecycle =========
onBeforeMount(() => {
  store.dispatch("getFilterAndPaging", {
    pageNumber: 1,
    pageSize: 10,
    keySearch: "",
  });
  store.dispatch("getPaymentList");
});
watch(debounceSearch, () => {
  store.dispatch("getFilterAndPaging", {
    ...filterAndPaging.value,
    keySearch: debounceSearch,
    pageNumber: 1,
  });
  store.dispatch("getPaymentIdListCkecked");
  store.dispatch("getPaymentList");
});
watchEffect(() => {
  if (paymentIdListChecked.value?.length === 0) {
    isShowActionMulti.value = false;
  }
});
watchEffect(() => {
  if (isOutsideActionMulti.value === true) {
    isShowActionMulti.value = false;
  }
});
//========= end lifecycle =========
//========= start methods =========

/**
 * Mô tả: toggle trạng thái của batch action
 * created by : vdtien
 * created date: 19-08-2023
 * @param {type} param -
 * @returns
 */
const toggleActionMulti = () => {
  isShowActionMulti.value = !isShowActionMulti.value;
};
/**
 * Mô tả: mở form thêm mới phiếu chi
 * created by : vdtien
 * created date: 15-08-2023
 * @param {type} param -
 * @returns
 */
const onOpenPopupCreate = async () => {
  // thêm phần tử đầu tiên cho danh sách hạch toán
  store.dispatch("getPaymentDetail", {
    PaymentDate: convertToYYYYMMDD(new Date().toLocaleDateString("en-US")),
    AccountingDate: convertToYYYYMMDD(new Date().toLocaleDateString("en-US")),
    ReasonSpending: FreeText.spendingFor,
    ReasonTypeId: 1,
  });

  // sinh mã phiếu chi mới
  await store.dispatch("getNewPaymentCode");

  // mở form detail với liểu là thêm
  store.dispatch("getPopupStatus", {
    isShowPopup: true,
    type: PopupType.create,
  });
};

/**
 * Mô tả: xử lý sự kiện click button
 * created by : vdtien
 * created date: 19-08-2023
 * @param {type} param -
 * @returns
 */
const onClickButton = (type) => {
  switch (type) {
    case TypeClickButton.deleteMulti:
      store.dispatch("deleteMulPayment");
      break;

    case TypeClickButton.write:
      store.dispatch("bulkUpdateStatusPayment", PaymentStatus.written);
      break;

    case TypeClickButton.unWrite:
      store.dispatch("bulkUpdateStatusPayment", PaymentStatus.unWritten);
      break;

    default:
      break;
  }
};
const onClickRefreshPage = () => {
  searchValue.value = "";
  store.dispatch("getFilterAndPaging", {
    pageSize: 10,
    pageNumber: 1,
    keySearch: "",
  });
  store.dispatch("getPaymentList");
};
/**
 * Mô tả: xuất excel danh sách phiếu chi theo từ khóa tìm kiếm
 * created by : vdtien
 * created date: 22-08-2023
 * @param {type} param -
 * @returns
 */
const exportExcelPaymentList = () => {
  store.dispatch("exportExcelPaymentList");
};
//========= end methods =========
</script>
<style scoped>
/* @import url("./DepositWidthdraw.css"); */

.layout-master-detail {
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 114px);
}

.overview {
  background-color: #fff;
  margin-bottom: 1px;
  margin-top: 0;
  padding-left: 12px;
  padding-top: 13px;
  padding-bottom: 10px;
  padding-right: 13px;
  height: 60px;
}

.overview .inner-overview .inner-overview-data {
  min-height: 0;
  overflow: hidden;
}

.inner-overview-data {
  display: flex;
  align-items: center;
  background-color: #eceef1;
  padding: 0 4px !important;
  -moz-column-gap: 25px;
  column-gap: 25px;
}

.first-overview {
  border-left: 4px solid #00a9f2;
}

.second-overview {
  border-left: 4px solid #ff7f2c;
}

.rthird-overview {
  border-left: 4px solid #74cb2f;
}

.total-money {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.hyper-link {
  color: #0075c0;
  cursor: pointer;
}

.second-overview .hyper-link {
  color: #ed1c24;
}

.label-overview {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.overview-data-number {
  align-items: baseline;
  font-weight: 700;
}

.last-update {
  font-size: 12px;
  color: #757575;
  position: absolute;
  bottom: 0;
  left: 16px;
  background-color: #fff;
  padding: 2px;
  left: unset;
  right: 16px;
}

.grid-list-data {
  background: #fff;
  padding: 8px 12px;
  position: relative;
}

.grid-mode-control {
  background: #fff;
  flex: 1;
  height: 0;
  min-width: 100%;
}
.layout-master-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 114px);
}

.overview {
  background-color: #fff;
  margin-bottom: 1px;
  margin-top: 0;
  padding-left: 12px;
  padding-top: 13px;
  padding-bottom: 10px;
  padding-right: 13px;
  height: 60px;
}

.overview .inner-overview .inner-overview-data {
  min-height: 0;
  overflow: hidden;
}

.inner-overview-data {
  display: flex;
  align-items: center;
  background-color: #eceef1;
  padding: 0 4px !important;
  -moz-column-gap: 25px;
  column-gap: 25px;
}

.first-overview {
  border-left: 4px solid #00a9f2;
}

.second-overview {
  border-left: 4px solid #ff7f2c;
}

.rthird-overview {
  border-left: 4px solid #74cb2f;
}

.total-money {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.hyper-link {
  color: #0075c0;
  cursor: pointer;
}

.second-overview .hyper-link {
  color: #ed1c24;
}

.label-overview {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.overview-data-number {
  align-items: baseline;
  font-weight: 700;
}

.last-update {
  font-size: 12px;
  color: #757575;
  position: absolute;
  bottom: 0;
  left: 16px;
  background-color: #fff;
  padding: 2px;
  left: unset;
  right: 16px;
}

.grid-list-data {
  background: #fff;
  padding: 8px 12px;
  position: relative;
}

.grid-mode-control {
  background: #fff;
  flex: 1;
  height: 0;
  min-width: 100%;
}
</style>
