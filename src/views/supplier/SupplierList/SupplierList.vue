<template>
  <div class="flex flex-col main-wrapper w-full h-full">
    <div class="content__header flex justify-between items-center pt-6">
      <div class="content-header__title">
        <h3 class="font-24 mb-3">{{ FreeText.supplierList }}</h3>
        <div class="back-to-general">
          <router-link
            :to="{ name: 'Directory', params: {} }"
            class="text-blue flex items-center gap-0-4 pb-3">
            <div class="icon icon--chevron-left-blue"></div>
            <span>{{ FreeText.directoryAll }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="content__body flex flex-col flex-1 height-body">
      <div class="overview-section">
        <div class="overview mt-0">
          <div class="inner-overview flex items-end">
            <div class="w-1/3 over-viewr">
              <div class="con-ms-tooltip" title="Bấm vào để đọc">
                <div class="h-full">
                  <div class="dued-debit-overview pointer">
                    <div
                      class="dued-debit-overview-data inner-overview-data"
                      style="position: relative">
                      <div
                        class="icon-wrapper-dued-debit flex items-center justify-center">
                        <div class="icon-v1 icon-v1--funnel"></div>
                      </div>
                      <div class="overview-data-number flex">
                        <div class="total-money">0,00</div>
                      </div>
                      <div class="label-overview">Nợ quá hạn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="w-1/3 px-2 over-view">
              <div class="con-ms-tooltip">
                <div class="msTooltipParent"></div>
                <div class="tooltip-content">
                  <div class="total-debit-overview pointer">
                    <div
                      class="total-debit-overview-data inner-overview-data"
                      style="position: relative">
                      <div
                        class="icon-wrapper-dued-debit flex items-center justify-center">
                        <div class="icon-v1 icon-v1--funnel"></div>
                      </div>
                      <div class="overview-data-number flex">
                        <div class="total-money">28.808.490.946,71</div>
                      </div>
                      <div class="label-overview">Tổng nợ phải trả</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="w-1/3">
              <div class="payment-overview">
                <div class="payment-overview-data inner-overview-data">
                  <div class="overview-data-number flex">
                    <div class="total-money">0,00</div>
                  </div>
                  <div class="label-overview">
                    Đã thanh toán (30 ngày gần đây)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider-section">
          <div class="con-ms-tooltip">
            <div class="msTooltipParent">
              <div
                class="ms-tooltip"
                style="
                  left: 0px;
                  top: 0px;
                  position: fixed;
                  display: none;
                "></div>
            </div>
            <div class="tooltip-content">
              <div class="collapse-overview items-center">
                <div
                  class="icon mi-8 icon--down-small-black hide-overview"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-1 master-section">
        <div
          class="content-body__tools flex justify-between items-center py-2 px-3">
          <div class="content-body-tools__left flex items-center">
            <div class="ckeck-all-arrow">
              <div class="icon-wrapper">
                <div class="icon-v1 icon-v1--arrow-check-all"></div>
              </div>
            </div>
            <div
              class="batch-actions flex items-center pointer"
              :class="{ 'no-pointer': supplierIdListChecked?.length === 0 }">
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
                <div class="dropdown-item" @click="onClickDeleteMulti">
                  {{ ButtonTitle.delete }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="content-body-tools__right ml-auto flex items-center gap-0-8">
            <div style="width: 240px">
              <b-textfield
                v-model="supplierSearch"
                class-input="m-0"
                place-holder="Tìm kiến"
                class-icon="icon icon--search-small" />
            </div>
            <div
              class="icon-wrapper content-body-tools__refresh"
              title="Tải lại"
              @click="onClickRefreshPage">
              <div class="icon icon--refresh"></div>
            </div>
            <div
              class="icon-wrapper content-body-tools__export-excel"
              title="Xuất file"
              @click="exportExcelSupplierList">
              <div class="icon icon--excel"></div>
            </div>
            <b-button
              :type="ButtonType.combo"
              :title="'Thêm'"
              round
              size="mini"
              :on-click="onOpenPopupCreate">
            </b-button>
          </div>
        </div>
        <div class="content-body__table flex-1">
          <!-- {{ accountsList }} -->
          <SupplierTable />
        </div>
        <div class="content-body__paging">
          <SupplierPaging />
        </div>
      </div>
    </div>
  </div>
  <SupplierDetail v-if="popupStatus.isShowPopup" />
  <SupplierDialog v-if="dialog?.isShow" />
  <b-toast-message v-if="toast?.isShow" />
  <b-loading v-if="isLoading" />
</template>
<script setup>
import {
  computed,
  ref,
  onBeforeMount,
  onMounted,
  onUpdated,
  watchEffect,
  watch,
} from "vue";
import { useStore } from "vuex";
import {
  ButtonType,
  ToastType,
  PopupType,
  DialogAction,
  DialogType,
  SupplierType,
} from "@/enums";

import { useClickOutside, useDebounce } from "@/hooks";
import {
  DialogTitle,
  ButtonTitle,
  FreeText,
  InputPlaceholder,
  DialogContent,
} from "@/resources";

import SupplierTable from "../../supplier/SupplierTable/SupplierTable.vue";
import SupplierPaging from "../../supplier/SupplierPaging/SupplierPaging.vue";
import SupplierDetail from "../../supplier/SupplierDetail/SupplierDetail.vue";
import SupplierDialog from "../../supplier/SupplierDialog/SupplierDialog.vue";

//---------------start state-----------------
const store = useStore();
const popupStatus = computed(() => store.state.global.popupStatus);
const isLoading = computed(() => store.state.global.isLoading);
const toast = computed(() => store.state.global.toast);
const dialog = computed(() => store.state.global.dialog);
const filterAndPaging = computed(() => store.state.global.filterAndPaging);
const supplierIdListChecked = computed(
  () => store.state.supplier.supplierIdListChecked
);
const supplierSearch = ref("");
const debounceSearch = useDebounce(supplierSearch, 600);
const isShowActionMulti = ref(false);
const actionMultiRef = ref(null);
const isOutsideActionMulti = useClickOutside(actionMultiRef);

//------end state--------

//---start lifecycle----
// kiểm tra sự thay đổi của keySearch tìm kiếm nhân viên
watch(debounceSearch, () => {
  store.dispatch("getFilterAndPaging", {
    ...filterAndPaging.value,
    keySearch: debounceSearch,
    pageNumber: 1,
  });
  store.dispatch("getSupplierIdListCkecked");
  store.dispatch("getSupplierList");
});
watchEffect(() => {
  if (supplierIdListChecked.value?.length === 0) {
    isShowActionMulti.value = false;
  }
});
watchEffect(() => {
  if (isOutsideActionMulti.value === true) {
    isShowActionMulti.value = false;
  }
});

onBeforeMount(async () => {
  store.dispatch("getFilterAndPaging", {
    pageNumber: 1,
    pageSize: 10,
    keySearch: "",
  });
  await store.dispatch("getSupplierList");
});
//-- end lifecycle-----

/**
 * Mô tả: xử lý sự kiện bấm nút thêm mới nhân viên
 * created by : vdtien
 * created date: 05-06-2023
 * @param {type} param -
 * @returns
 */
const onOpenPopupCreate = async () => {
  store.dispatch("getSupplierDetail", {
    SupplierType: SupplierType.organization,
    ContractInfor: {},
    GroupSuppliersId: [],
    BanksAccount: [{}],
    DeliverAddress: [],
  });
  await store.dispatch("getNewSuppliercode");
  // await store.dispatch("getNewSuppliercode");
  store.dispatch("getPopupStatus", {
    isShowPopup: true,
    type: PopupType.create,
  });
};

/**
 * Mô tả: toogle thuc hien hang loat
 * created by : vdtien
 * created date: 24-06-2023
 * @param {type} param -
 * @returns
 */
const toggleActionMulti = () => {
  isShowActionMulti.value = !isShowActionMulti.value;
};

/**
 * Mô tả: click vao xoa nieu
 * created by : vdtien
 * created date: 24-06-2023
 * @param {type} param -
 * @returns
 */
const onClickDeleteMulti = () => {
  toggleActionMulti();
  store.dispatch("getDialog", {
    isShow: true,
    type: DialogType.warning,
    title: DialogTitle.delete,
    content: [
      DialogContent.confirmDeleteMultiSupplier(
        supplierIdListChecked.value?.length ?? 0
      ),
    ],
    action: DialogAction.confirmDeleteMulti,
  });
};

/**
 * Mô tả: click vao refresh
 * created by : vdtien
 * created date: 24-06-2023
 * @param {type} param -
 * @returns
 */
const onClickRefreshPage = () => {
  supplierSearch.value = "";
  store.dispatch("getFilterAndPaging", {
    pageSize: 10,
    pageNumber: 1,
    keySearch: "",
  });
  store.dispatch("getSupplierList");
};

/**
 * Mô tả: export excel danh sach nhan vien theo key search
 * created by : vdtien
 * created date: 30-06-2023
 * @param {type} param -
 * @returns
 */
const exportExcelSupplierList = () => {
  store.dispatch("exportExcelSupplierList");
};

//---------------end method------------------
</script>
<style scoped>
/* @import url("./SupplierList.css"); */
.content__body {
  background-color: transparent;
  padding: 0;
}
.height-body {
  height: calc(100% - 112px);
}
.master-section {
  height: calc(100% - 70px) !important;
  position: relative;
  transition: all 0.1s ease;
  background-color: #fff;
}
.master-section.fullsize {
  height: calc(100% - 20px) !important;
  position: relative;
  transition: all 0.1s ease;
}
.overview .inner-overview .dued-debit-overview {
  background: #fff;
  min-height: var(--overview-height);
  border-left: 5px solid #ff7f2c;
}

.overview .inner-overview .inner-overview-data {
  padding: 4px 10px;
  min-height: var(--overview-height);
  overflow: hidden;
}

.inner-overview-data .icon-wrapper-dued-debit {
  position: absolute;
  right: 8px;
  width: 18px;
  height: 22px;
}

.overview .inner-overview .overview-data-number {
  align-items: baseline;
  font-weight: 700;
}

.overview .inner-overview .label-overview {
  font-size: var(--overview-label-size);
}

.con-ms-tooltip .tooltip-content {
  height: 100%;
}

.overview .inner-overview .total-debit-overview {
  background: #fff;
  min-height: var(--overview-height);
  border-left: 5px solid #b8bcc3;
  height: 100%;
}

.overview .inner-overview .payment-overview {
  background: #fff;
  min-height: var(--overview-height);
  border-left: 5px solid #74cb2f;
  height: unset;
}

.divider-section {
  position: relative;
  width: 100%;
}

.con-ms-tooltip .tooltip-content {
  height: 100%;
}

.divider-section .collapse-overview {
  left: calc(50% - 30px);
  width: 48px;
  height: 13px;
  background: #d4d7dc;
  border: 1px solid #d4d7dc;
  display: flex;
  justify-content: center;
  z-index: 9;
  margin: auto;
}

.divider-section .collapse-overview .icon--down-small-black.hide-overview {
  transform: rotate(180deg);
}
.overview .inner-overview .dued-debit-overview {
  background: #fff;
  min-height: var(--overview-height);
  border-left: 5px solid #ff7f2c;
}

.overview .inner-overview .inner-overview-data {
  padding: 4px 10px;
  min-height: var(--overview-height);
  overflow: hidden;
}

.inner-overview-data .icon-wrapper-dued-debit {
  position: absolute;
  right: 8px;
  width: 18px;
  height: 22px;
}

.overview .inner-overview .overview-data-number {
  align-items: baseline;
  font-weight: 700;
}

.overview .inner-overview .label-overview {
  font-size: var(--overview-label-size);
}

.con-ms-tooltip .tooltip-content {
  height: 100%;
}

.overview .inner-overview .total-debit-overview {
  background: #fff;
  min-height: var(--overview-height);
  border-left: 5px solid #b8bcc3;
  height: 100%;
}

.overview .inner-overview .payment-overview {
  background: #fff;
  min-height: var(--overview-height);
  border-left: 5px solid #74cb2f;
  height: unset;
}

.divider-section {
  position: relative;
  width: 100%;
}

.con-ms-tooltip .tooltip-content {
  height: 100%;
}

.divider-section .collapse-overview {
  left: calc(50% - 30px);
  width: 48px;
  height: 13px;
  background: #d4d7dc;
  border: 1px solid #d4d7dc;
  display: flex;
  justify-content: center;
  z-index: 9;
  margin: auto;
}

.divider-section .collapse-overview .icon--down-small-black.hide-overview {
  transform: rotate(180deg);
}
</style>
