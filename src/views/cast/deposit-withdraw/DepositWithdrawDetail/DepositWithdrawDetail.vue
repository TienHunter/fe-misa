div
<template lang="">
  <div
    ref="depositWithdrawDetail"
    class="popup-wrapper outline-none"
    :tabindex="0"
    @keydown.stop="">
    <div class="flex flex-col w-full h-full">
      <div class="popup__header flex items-center payment__header">
        <div class="flex items-center">
          <div class="pr-3">
            <div class="icon-wrapper">
              <div class="icon-v1 icon-v1--recent-log"></div>
            </div>
          </div>
        </div>
        <div
          class="title"
          :title="`Phiếu chi ${paymentDetail?.PaymentCode ?? ''}`">
          {{ `Phiếu chi ${paymentDetail?.PaymentCode ?? ""}` }}
        </div>
        <div class="header-detail-input">
          <div class="mr-3" style="min-width: 100px; width: 350px">
            <b-dropdown
              :readonly="disableWritten || disableView"
              class="w-input"
              :data="dataReasonList"
              field-select="id"
              field-show="value"
              :id-selected="paymentInfo?.ReasonTypeId ?? 1"
              @on-click-id-select="(id) => (paymentInfo.ReasonTypeId = id)" />
          </div>
        </div>
        <div class="header-detail-buttons flex items-center">
          <div class="guide-tour flex mx-3">
            <div class="icon-wrapper">
              <div class="icon-v1 icon-v1--tour"></div>
            </div>
            <div class="tour-label">{{ FreeText.instruct }}</div>
          </div>
          <div class="header-detail-btn" :title="FreeText.customizeInterface">
            <div class="icon wrapper">
              <div class="icon icon--setting"></div>
            </div>
          </div>
          <div class="header-detail-btn" :title="FreeText.helpF1">
            <div class="icon wrapper">
              <div class="icon icon--question"></div>
            </div>
          </div>
          <div
            class="header-detail-btn"
            :title="FreeText.closeEsc"
            @click="onClosePopup">
            <div class="icon wrapper">
              <div class="icon icon--close"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup__body flex-1 flex flex-col">
        <div class="w-full bg">
          <div class="main-information">
            <div class="flex basic-information pt-0">
              <div class="w-3/4 flex">
                <div class="w-4/5 pr-4">
                  <div class="w-full flex pb-2">
                    <div class="w-3/7 pr-3">
                      <BaseComboboxV1
                        :ref="errRefs.SupplierId"
                        is-reload-scroll
                        is-reload
                        :disabled="disableWritten || disableView"
                        :label="FreeText.supplierCode"
                        :max-length="MaxLength.default"
                        :fields="fieldsSupplier"
                        :field-select="fieldSelectSupplier"
                        :field-show="fieldShowSupplier"
                        :data-list="dataSuppliers"
                        :id-selected="paymentInfo.SupplierId"
                        :value-selected="supplierSelected"
                        :err-msg="errsValidator?.SupplierId?.join('') ?? ''"
                        @load-data-lazy="
                          (keySearch) => loadDataSupplierLazy(keySearch)
                        "
                        @load-data-filter="
                          (keySearch) => loadDataSupplierFilter(keySearch)
                        "
                        @on-click-id-selected="
                          (id) => (paymentInfo.SupplierId = id)
                        "
                        @add-value-selected="
                          (item) => hanldeSelectedSupplier(item)
                        "
                        @not-selected-yet="
                          (state) =>
                            hanldeAddErrorMsgNotSelectedYet(
                              state,
                              'SupplierId',
                              'Mã nhà cung cấp'
                            )
                        "
                        @empty-err-msg="
                          () => {
                            delete errsValidator.SupplierId;
                            flagChangeNotSelectedCombobox = false;
                          }
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-4/7">
                      <b-textfield
                        :ref="errRefs.SupplierName"
                        v-model="paymentInfo.SupplierName"
                        :disabled="disableView"
                        :label="FreeText.supplierName"
                        :max-length="MaxLength.default"
                        :err-msg="errsValidator?.SupplierName?.join('') ?? ''"
                        @empty-err-msg="
                          () => {
                            delete errsValidator?.SupplierName;
                          }
                        " />
                    </div>
                  </div>
                  <div class="w-full flex pb-2">
                    <div class="w-3/7 pr-3">
                      <b-textfield
                        :ref="errRefs.Receiver"
                        v-model="paymentInfo.Receiver"
                        :disabled="disableView"
                        :max-length="MaxLength.default"
                        :label="FreeText.receiver"
                        :err-msg="errsValidator?.Receiver?.join('') ?? ''"
                        @empty-err-msg="
                          () => {
                            delete errsValidator?.Receiver;
                          }
                        " />
                    </div>
                    <div class="w-4/7">
                      <b-textfield
                        v-model="paymentInfo.Address"
                        :max-length="MaxLength.default"
                        :disabled="disableView"
                        :label="FreeText.address"
                        :err-msg="errsValidator?.Address?.join('') ?? ''"
                        @empty-err-msg="
                          () => {
                            delete errsValidator?.Address;
                          }
                        " />
                    </div>
                  </div>
                  <div class="w-full flex pb-2">
                    <b-textfield
                      :ref="errRefs.ReasonSpending"
                      v-model="paymentInfo.ReasonSpending"
                      :disabled="disableView"
                      :max-length="MaxLength.default"
                      :label="FreeText.reasonSpending"
                      :err-msg="errsValidator?.ReasonSpending?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator?.ReasonSpending;
                        }
                      " />
                  </div>
                  <div class="w-full flex pb-2">
                    <div class="w-3/7 pr-3">
                      <BaseComboboxV1
                        :ref="errRefs.EmployeeId"
                        is-reload-scroll
                        is-reload
                        :disabled="disableView"
                        :label="FreeText.employee"
                        :max-length="MaxLength.default"
                        :fields="fieldsEmployee"
                        :field-select="fieldSelectEmployee"
                        :field-show="fieldShowEmployee"
                        :data-list="dataEmployees"
                        :id-selected="paymentInfo.EmployeeId"
                        :value-selected="employeeSelected"
                        :err-msg="errsValidator?.EmployeeId?.join('') ?? ''"
                        @load-data-lazy="
                          (keySearch) => loadDateEmployeesLazy(keySearch)
                        "
                        @load-data-filter="
                          (keySearch) => loadDataEmployeesFilter(keySearch)
                        "
                        @on-click-id-selected="
                          (id) => (paymentInfo.EmployeeId = id)
                        "
                        @add-value-selected="
                          (item) => {
                            employeeSelected = { ...item };
                          }
                        "
                        @not-selected-yet="
                          (state) =>
                            hanldeAddErrorMsgNotSelectedYet(
                              state,
                              'EmployeeId',
                              'Nhân viên'
                            )
                        "
                        @empty-err-msg="
                          () => {
                            delete errsValidator.EmployeeId;
                            flagChangeNotSelectedCombobox = false;
                          }
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-4/7 flex items-end">
                      <div class="w-2/5">
                        <NumberInput
                          :ref="errRefs.AttachOriginalDocuments"
                          v-model="paymentInfo.AttachOriginalDocuments"
                          :disabled="disableView"
                          :max-length="5"
                          :max-value="9999"
                          :label="FreeText.attach"
                          :place-holder="FreeText.quantity"
                          class-input="text-right"
                          :err-msg="
                            errsValidator?.AttachOriginalDocuments?.join('') ??
                            ''
                          "
                          @empty-err-msg="
                            () => {
                              delete errsValidator?.AttachOriginalDocuments;
                            }
                          " />
                      </div>
                      <span class="pl-3">{{ FreeText.originalDocuments }}</span>
                    </div>
                  </div>
                  <div class="w-full flex">
                    <span class="pr-3">{{ FreeText.reference }}</span>
                    <span class="text-blue">...</span>
                  </div>
                </div>
                <div class="w-1/5 pl-4">
                  <div class="w-full pb-2">
                    <b-textfield
                      :ref="errRefs.AccountingDate"
                      v-model="paymentInfo.AccountingDate"
                      :disabled="disableWritten || disableView"
                      :label="FreeText.accountingDate"
                      input-type="date"
                      :err-msg="errsValidator?.AccountingDate?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator?.AccountingDate;
                        }
                      " />
                  </div>
                  <div class="w-full pb-2">
                    <b-textfield
                      :ref="errRefs.PaymentDate"
                      v-model="paymentInfo.PaymentDate"
                      :disabled="disableWritten || disableView"
                      :label="FreeText.paymentDate"
                      input-type="date"
                      :err-msg="errsValidator?.PaymentDate?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator?.PaymentDate;
                        }
                      " />
                  </div>
                  <div class="w-full">
                    <b-textfield
                      :ref="errRefs.PaymentCode"
                      v-model="paymentInfo.PaymentCode"
                      :max-length="MaxLength.code - 2"
                      :disabled="disableWritten || disableView"
                      :label="FreeText.paymentCode"
                      :err-msg="errsValidator?.PaymentCode?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator?.PaymentCode;
                        }
                      " />
                  </div>
                </div>
              </div>
              <div class="w-1/4 sumary-info text-right mt-0">
                <div class="sumary-info-title">{{ FreeText.sumMoney }}</div>
                <div
                  class="sumary-info-number"
                  :class="{ 'text-red': totalMoney < 0 }"
                  :style="{ 'font-size': resizeFontSizeMoney() + 'px' }">
                  {{ formatDecimal(totalMoney) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full bgw flex-1">
          <div class="detail-information">
            <div class="detail-information-title">
              <span>{{ FreeText.accounting }}</span>
            </div>
            <div class="detail-information-body px-5">
              <div class="h-full w-full position-relative">
                <div style="minHeight:0px, overflow:auto">
                  <table>
                    <thead>
                      <tr>
                        <th
                          v-for="(col, index) in accoutingCols"
                          :key="index"
                          :class="{
                            'th-anchor': col?.name === '#',
                            'th-anchor th-anchor--end': col?.name === 'action',
                            [col?.class]: true,
                          }"
                          :title="col?.title">
                          <span>{{ col?.label }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="(accounting, index) in paymentInfo.Accountings"
                        :key="accounting.AccountingId">
                        <tr
                          :class="{
                            'tr--checked': indexFocusAccouting === index,
                          }"
                          @click="indexFocusAccouting = index">
                          <td class="px-3 text-center">
                            <span>{{ index + 1 }}</span>
                          </td>
                          <td class="px-3">
                            <div
                              class="flex items-center"
                              :class="{ 'no-pointer': disableView }">
                              <textarea
                                v-model="accounting.AccountingExplain"
                                rows="1"
                                class="td-textarea"
                                :class="{ 'disable-textarea': disableView }" />
                            </div>
                          </td>
                          <td class="px-3">
                            <div
                              class="flex items-center"
                              :class="{
                                'no-pointer': disableView || disableWritten,
                              }">
                              <BaseComboboxV1
                                :ref="accountsDebtRef[index]"
                                :max-length="MaxLength.default"
                                :fields="fieldsAccount"
                                :field-select="fieldSelectAccount"
                                :field-show="fieldShowAccount"
                                :data-list="dataAccountsDebt"
                                :id-selected="accounting.AccountDebtId"
                                :value-selected="accountsDebtSelected[index]"
                                :err-msg="
                                  errsValidator?.AccountsDebtId?.length > 0 &&
                                  errsValidator?.AccountsDebtId?.[index]
                                    ?.length > 0
                                    ? errsValidator?.AccountsDebtId?.[
                                        index
                                      ].join('')
                                    : ''
                                "
                                @on-click-id-selected="
                                  (id) => (accounting.AccountDebtId = id)
                                "
                                @add-value-selected="
                                  (item) =>
                                    hanldeAddValueAccountDebt(item, index)
                                "
                                @not-selected-yet="
                                  (state) =>
                                    hanldeAddErrorMsgNotSelectedYet(
                                      state,
                                      'AccountsDebtId',
                                      'Tài khoản nợ',
                                      index
                                    )
                                "
                                @empty-err-msg="
                                  () => {
                                    if (
                                      errsValidator?.AccountsDebtId?.length >= 0
                                    )
                                      errsValidator.AccountsDebtId[index] = '';
                                    flagChangeNotSelectedCombobox = false;
                                  }
                                "
                                @keydown.tab.stop="" />
                            </div>
                          </td>
                          <td class="px-3">
                            <div
                              class="flex items-center"
                              :class="{
                                'no-pointer': disableView || disableWritten,
                              }">
                              <BaseComboboxV1
                                :ref="accountsBalanceRef[index]"
                                :max-length="MaxLength.default"
                                :fields="fieldsAccount"
                                :field-select="fieldSelectAccount"
                                :field-show="fieldShowAccount"
                                :data-list="dataAccountsBalance"
                                :id-selected="accounting.AccountBalanceId"
                                :value-selected="accountsBalanceSelected[index]"
                                :err-msg="
                                  errsValidator?.AccountsBalanceId?.length >
                                    0 &&
                                  errsValidator?.AccountsBalanceId?.[index]
                                    ?.length > 0
                                    ? errsValidator?.AccountsBalanceId?.[
                                        index
                                      ].join('')
                                    : ''
                                "
                                @on-click-id-selected="
                                  (id) => (accounting.AccountBalanceId = id)
                                "
                                @add-value-selected="
                                  (item) =>
                                    hanldeAddValueAccountBalance(item, index)
                                "
                                @not-selected-yet="
                                  (state) =>
                                    hanldeAddErrorMsgNotSelectedYet(
                                      state,
                                      'AccountsBalanceId',
                                      'Tài khoản nợ',
                                      index
                                    )
                                "
                                @empty-err-msg="
                                  () => {
                                    if (
                                      errsValidator?.AccountsBalanceId
                                        ?.length >= 0
                                    )
                                      errsValidator.AccountsBalanceId[index] =
                                        '';
                                    flagChangeNotSelectedCombobox = false;
                                  }
                                "
                                @keydown.tab.stop="" />
                            </div>
                          </td>
                          <td class="px-3">
                            <div>
                              <!-- xu ly nhap tien -->
                              <div
                                class="flex items-center"
                                :class="{
                                  'no-pointer': disableView || disableWritten,
                                }">
                                <CurrencyInput
                                  v-model.lazy="accounting.Money"
                                  :disabled="disableWritten || disableView"
                                  :max-length="15"
                                  :options="options" />
                              </div>
                            </div>
                          </td>
                          <td class="px-3">
                            <div
                              class="flex items-center justify-center pointer"
                              :class="{
                                'no-pointer':
                                  indexFocusAccouting !== index ||
                                  disableView ||
                                  disableWritten,
                              }"
                              @click.stop="
                                () => onClickDeleteAccountingRow(index)
                              ">
                              <div class="icon-v1 icon-v1--bin"></div>
                            </div>
                          </td>
                        </tr>
                        <!-- <tr v-else @click="() => onClickAccountingRow(index)">
                          <td class="px-3 text-center">
                            <span>{{ index + 1 }}</span>
                          </td>
                          <td class="px-3">
                            <div class="flex items-center">
                              <div class="flex items-center">
                                {{ accounting?.AccountingExplain ?? "" }}
                              </div>
                            </div>
                          </td>
                          <td class="px-3">
                            <div class="flex items-center">
                              <div class="flex items-center">
                                {{ accounting?.AccountDebtCode ?? "" }}
                              </div>
                            </div>
                          </td>
                          <td class="px-3">
                            <div class="flex items-center">
                              <div class="flex items-center">
                                {{ accounting?.AccountBalanceCode ?? "" }}
                              </div>
                            </div>
                          </td>
                          <td class="px-3">
                            <div>
                    
                              <div class="flex items-center">
                                <div
                                  class="flex items-center justify-end w-full"
                                  :class="{
                                    'text-red': accounting?.Money < 0,
                                  }">
                                  {{ formatDecimal(accounting?.Money ?? 0) }}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="px-3">
                            <div
                              class="flex items-center justify-center no-pointer">
                              <div class="icon-v1 icon-v1--bin"></div>
                            </div>
                          </td>
                        </tr> -->
                      </template>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th
                          v-for="(col, index) in accoutingCols"
                          :key="index"
                          class="th-foot text-right">
                          <span
                            v-if="col.type === TypeCol.money"
                            class="text-right"
                            :class="{ 'text-red': totalMoney < 0 }"
                            >{{ formatDecimal(totalMoney) }}</span
                          >
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div class="detail-information-footer px-5">
              <div class="pt-3">
                <b-button
                  :disabled="disableWritten || disableView"
                  size="mini"
                  type="secondary"
                  :title="FreeText.addRow"
                  @click.stop="onClickAddAccountingRow" />
                <b-button
                  :disabled="disableWritten || disableView"
                  size="mini"
                  type="secondary"
                  :title="FreeText.deleteAllRow"
                  @click.stop="onClickDeleteAllAccountingRow" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="popup__footer flex items-center flex-row-reverse justify-between">
        <div class="right-group-button flex items-center">
          <!-- <b-button class="btn--sub" title="Cất" type="secondary" size="mini" /> -->
          <template v-if="popupStatus.type === PopupType.create">
            <button
              class="btn btn--mini button-footer"
              @click="() => onClickButton(TypeClickButton.create)">
              {{ FreeText.store }}
            </button>
            <b-button
              class="btn--pri"
              :title="FreeText.storePrint"
              type="primary"
              size="mini" />
          </template>
          <template
            v-if="
              popupStatus.type === PopupType.view &&
              paymentInfo.PaymentStatus === PaymentStatus.unWritten
            ">
            <button
              class="btn btn--mini button-footer"
              @click="() => onClickButton(TypeClickButton.edit)">
              Sửa
            </button>
            <b-button
              class="btn--pri"
              :title="FreeText.write"
              type="primary"
              size="mini"
              @click="() => onClickButton(TypeClickButton.write)" />
          </template>
          <template
            v-if="
              popupStatus.type === PopupType.view &&
              paymentInfo.PaymentStatus === PaymentStatus.written
            ">
            <button
              class="btn btn--mini button-footer"
              @click="() => onClickButton(TypeClickButton.quickEdit)">
              {{ FreeText.quickEdit }}
            </button>
            <b-button
              class="btn--pri"
              :title="FreeText.unWrite"
              type="primary"
              size="mini"
              @click="() => onClickButton(TypeClickButton.unWrite)" />
          </template>
          <template v-if="popupStatus.type === PopupType.update">
            <button
              class="btn btn--mini button-footer"
              @click="() => onClickButton(TypeClickButton.update)">
              Cất
            </button>
            <b-button
              class="btn--pri"
              :title="FreeText.storePrint"
              type="primary"
              size="mini"
              @click="() => onClickButton(TypeClickButton.update)" />
          </template>
        </div>
        <div class="left-group-button">
          <button class="btn btn--mini button-footer">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  computed,
  nextTick,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";

import BaseComboboxV1 from "@/components/bases/BaseComboboxV1.vue";
import CurrencyInput from "@/components/bases/CurrencyInput.vue";
import NumberInput from "@/components/bases/NumberInput.vue";
import {
  TypeCol,
  MaxLength,
  SupplierType,
  AccountFeature,
  UserObject,
  DialogType,
  DialogAction,
  TypeClickButton,
  TypeStore,
  PaymentStatus,
  PopupType,
  ErrCode,
} from "@/enums";
import {
  convertToDDMMYYYY,
  formatDecimal,
  removeEmptyFields,
  generateUniqueId,
} from "@/utils/helper";
import supplierService from "@/api/services/supplierService";
import employeeService from "@/api/services/employeeService";
import accountService from "@/api/services/accountService";
import {
  DialogContent,
  DialogTitle,
  ErrValidator,
  FreeText,
} from "@/resources";

//========= start state =========

// options currency USD
const options = {
  currency: "USD",
  currencyDisplay: "hidden",
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: false,
  autoDecimalDigits: false,
  useGrouping: true,
  accountingSign: false,
};
const store = useStore();
const paymentDetail = computed(() => store.state.payment.paymentDetail);
const paymentInfo = ref({});
const dialog = computed(() => store.state.global.dialog);
const popupStatus = computed(() => store.state.global.popupStatus);
const isChangeReasonSpending = ref(false);
const isChangeEmployee = ref(false);
const errRefs = toRefs(
  reactive({
    SupplierId: null,
    SupplierName: null,
    Receiver: null,
    ReasonSpending: null,
    EmployeeId: null,
    AttachOriginalDocuments: null,
    AccountingDate: null,
    PaymentDate: null,
    PaymentCode: null,
  })
);
const accountsDebtRef = ref([]);
const accountsBalanceRef = ref([]);
const errsValidator = ref({
  SupplierId: [],
  SupplierName: [],
  Receiver: [],
  ReasonSpending: [],
  EmployeeId: [],
  AttachOriginalDocuments: [],
  AccountingDate: [],
  PaymentDate: [],
  PaymentCode: [],
  AccountsDebtId: [],
  AccountsBalanceId: [],
});
const errsValidate = computed(() => store.state.global.errsValidate);
const flagChangeNotSelectedCombobox = ref(false);
const accoutingCols = [
  {
    name: "#",
    label: "#",
    class: "mw-32 w-32 Mw-32 text-center",
  },
  {
    name: "AccountingExplain",
    label: "Diễn giải",
    class: "mw-250 text-left",
  },
  {
    name: "AccountDebtCode",
    label: "TK Nợ",
    title: "Tài khoản nợ",
    class: "mw-120 w-120 Mw-120 text-left",
  },
  {
    name: "AccountBalanceCode",
    label: "TK Có",
    title: "Tài khoản có",
    class: "mw-120 w-120 Mw-120 text-left",
  },
  {
    name: "Money",
    label: "Số tiền",
    class: "mw-150 w-150 Mw-150 text-left",
    type: TypeCol.money,
  },
  {
    name: "action",
    class: "mw-32 w-32 Mw-32 text-center",
  },
];
const indexFocusAccouting = ref(-1);
const totalMoney = ref(0);
const dataReasonList = [
  {
    id: 1,
    value: "1.Trả tiền nhà cung cấp (không theo hóa đơn)",
  },
  {
    id: 2,
    value: "2. Tạm ứng cho nhân viên",
  },
  {
    id: 3,
    value: "3. Chi mua ngoài có hóa đơn",
  },
  {
    id: 4,
    value: "4. Trả lương nhân viên",
  },
  {
    id: 5,
    value: "5. Chuyển tiền cho chi nhánh khác",
  },
  {
    id: 6,
    value: "6. Gửi tiền vào ngân hàng",
  },
  {
    id: 7,
    value: "7. Chi khác",
  },
];
const reasonSelected = ref({
  id: 1,
  value: "1.Trả tiền nhà cung cấp (không theo hóa đơn)",
});

// field supplier
const fieldsSupplier = [
  {
    name: "SupplierCode",
    label: "Mã đối tượng",
    class: "mw-120 Mw-120 text-left",
  },
  {
    name: "SupplierName",
    label: "Tên đối tượng",
    class: "mw-350 Mw-350 text-left",
  },
  {
    name: "TaxCode",
    label: "Mã số thuế",
    class: "mw-140 Mw-140 text-left",
  },
  {
    name: "Address",
    label: "Địa chỉ",
    class: "mw-250 Mw-250 text-left",
  },
  ,
  {
    name: "PhoneNumber",
    label: "Điện thoại",
    class: "mw-130 Mw-130 text-left",
  },
];

// employee
const fieldSelectSupplier = "SupplierId";
const fieldShowSupplier = "SupplierCode";
const dataSuppliers = ref([]);
const supplierSelected = ref({});
const pageSupplierIndex = ref(0);

const fieldsEmployee = [
  {
    name: "EmployeeCode",
    label: "Mã nhân viên",
    class: "mw-120 Mw-120 text-left",
  },
  {
    name: "FullName",
    label: "Tên nhân viên",
    class: "mw-200 Mw-200 text-left",
  },
  {
    name: "DepartmentName",
    label: "Đơn vị",
    class: "mw-120 Mw-120 text-left",
  },
  {
    name: "MobilePhoneNumber",
    label: "ĐT di động",
    title: "Điện thoại di động",
    class: "mw-120 Mw-120 text-left",
  },
];
const fieldSelectEmployee = "EmployeeId";
const fieldShowEmployee = "FullName";
const dataEmployees = ref([]);
const employeeSelected = ref({});
const pageEmployeeIndex = ref(0);

// account
const fieldsAccount = [
  {
    name: "AccountCode",
    label: "Số tài khoản",
    class: "mw-120 w-120 Mw-120 text-left",
  },
  {
    name: "AccountName",
    label: "Tên tài khoản",
    class: "mw-250 w-250 Mw-250 text-left",
  },
];
const fieldSelectAccount = "AccountId";
const fieldShowAccount = "AccountCode";
const dataAccountsDebt = ref([]);
const dataAccountsBalance = ref([]);
const accountsDebtSelected = ref([]);
const accountsBalanceSelected = ref([]);

const moneyValue = ref(0);

const disableWritten = ref(false);
const disableView = ref(false);
const sup = ref(null);
//========= end state =========

//========= start lifecycle =========
watchEffect(() => {
  errsValidator.value = structuredClone(errsValidate.value);
});
watchEffect(() => {
  if (paymentInfo.value?.Accountings) {
    accountsDebtRef.value = paymentInfo.value?.Accountings.map(() => ref(null));
    accountsBalanceRef.value = paymentInfo.value?.Accountings.map(() =>
      ref(null)
    );
  }
});
onBeforeMount(async () => {
  // console.log(" before muonte");
  // lấy tất cả danh sách tài khoản nợ
  try {
    let res = await accountService.getAllAccountQuery(
      [AccountFeature.debt, AccountFeature.combine],
      [UserObject.all, UserObject.supplier]
    );

    if (res?.length >= 0) {
      dataAccountsDebt.value = [...res];
    }
  } catch (error) {
    console.log(error);
    dataAccountsDebt.value = [];
  }

  // lấy tất cả danh sách tài khoản dư
  try {
    let res = await accountService.getAllAccountQuery(
      [AccountFeature.redundant, AccountFeature.combine],
      [UserObject.all, UserObject.supplier]
    );

    if (res?.length >= 0) {
      dataAccountsBalance.value = [...res];
    }
  } catch (error) {
    console.log(error);
    dataAccountsBalance.value = [];
  }

  supplierSelected.value = {
    SupplierId: paymentInfo.value?.SupplierId ?? "",
    SupplierCode: paymentInfo.value?.SupplierCode ?? "",
  };
  employeeSelected.value = {
    EmployeeId: paymentInfo.value?.EmployeeId ?? "",
    EmployeeName: paymentInfo.value?.EmployeeName ?? "",
  };

  if (!paymentDetail.value?.Accountings) {
    paymentInfo.value.Accountings = [];
    paymentInfo.value.Accountings.push({
      AccountingExplain: FreeText.spendingFor,
      AccountDebtId: dataAccountsDebt?.value?.[0]?.AccountId,
      AccountDebtCode: dataAccountsDebt?.value?.[0]?.AccountCode,
      AccountBalanceId: dataAccountsBalance?.value?.[0]?.AccountId,
      AccountBalanceCode: dataAccountsBalance?.value?.[0]?.AccountCode,
      Money: 0,
    });
  }

  // them account selected

  paymentInfo.value.Accountings.forEach((element) => {
    accountsDebtSelected.value.push({
      AccountId: element.AccountDebtId,
      AccountCode: element.AccountDebtCode,
    });
    accountsBalanceSelected.value.push({
      AccountId: element.AccountBalanceId,
      AccountCode: element.AccountBalanceCode,
    });
  });
});

onMounted(() => {
  nextTick(() => {
    // console.log(sup.value);
    errRefs.SupplierId.value.focus();
  });
});
watchEffect(() => {
  nextTick(() => console.log(errRefs.Accountings));
});

// watchEffect(() => {
//   err;
// });
watchEffect(() => {
  paymentInfo.value = structuredClone(paymentDetail.value);
});
/**
 * Mô tả: tính lại tổng tiền khi accountings thay dổi
 * created by : vdtien
 * created date: 17-08-2023
 * @param {type} param -
 * @returns
 */
watchEffect(() => {
  if (paymentInfo.value?.Accountings?.length >= 0) {
    totalMoney.value = 0;
    paymentInfo.value.Accountings.forEach(
      (el) => (totalMoney.value += el?.Money ?? 0)
    );
  }
});

watch(dialog, async (newDialog, oldDialog) => {
  if (
    oldDialog.type === DialogType.error &&
    oldDialog.action === DialogAction.confirmValidate
  ) {
    // Lấy phần tử đầu tiên của danh sách
    // console.log(errsValidate.value);
    const firstKey = Object.keys(errsValidator.value)[0];
    // console.log(firstKey);
    // console.log("firstKey:", firstKey);
    if (firstKey) {
      nextTick(() => {
        const firstErr = accessRef(firstKey);
        // console.log(firstErr?.value);
        if (firstErr) firstErr.focus();
      });
    }
  } else if (oldDialog.action === DialogAction.confirmChangeCode) {
    if (newDialog.action === DialogAction.confirmChangeCode) {
      store.dispatch("getErrsValidate", {});
      await store.dispatch("createPayment", {
        payment: paymentInfo.value,
        typeStore: TypeStore.store,
        changeCode: true,
      });
    } else {
      errRefs.PaymentCode.value.focus();
    }
  } else if (
    newDialog.action === DialogAction.confirmRemoveAllAccountings &&
    oldDialog.action === DialogAction.confirmRemoveAllAccountings
  ) {
    paymentInfo.value.Accountings = [];
    accountsDebtSelected.value = [];
    accountsBalanceSelected.value = [];
  }
});

/**
 * Mô tả: bắt sự thay đổi của reason spending
 * created by : vdtien
 * created date: 17-08-2023
 * @param {type} param -
 * @returns
 */
watch(
  () => paymentInfo.value.ReasonSpending,
  (newValue, oldValue) => {
    // bind diễn giải trong hạch toán
    if (paymentInfo?.value?.Accountings?.length > 0) {
      for (
        let index = 0;
        index < paymentInfo.value.Accountings.length;
        index++
      ) {
        if (
          paymentInfo.value.Accountings[index]?.AccountingExplain === oldValue
        ) {
          paymentInfo.value.Accountings[index].AccountingExplain = newValue;
        }
      }
    }
  }
);

/**
 * Mô tả: bắt sự thay đổi của ngày hạch toán
 * created by : vdtien
 * created date: 18-08-2023
 * @param {type} param -
 * @returns
 */
watch(
  () => paymentInfo.value.AccountingDate,
  (newValue, oldValue) => {
    if (oldValue === paymentInfo.value.PaymentDate)
      paymentInfo.value.PaymentDate = newValue;
  }
);

watchEffect(() => {
  if (
    popupStatus.value.type === PopupType.update &&
    paymentInfo.value.PaymentStatus === PaymentStatus.written
  ) {
    disableWritten.value = true;
  } else {
    disableWritten.value = false;
  }
});

watchEffect(() => {
  if (popupStatus.value.type === PopupType.view) disableView.value = true;
  else disableView.value = false;
});
//========= end lifecycle =========

//========= start methods =========

// Truy cập vào ref dựa trên tên chuỗi
const accessRef = (refName) => {
  if (errRefs?.[refName]?.value) {
    return errRefs[refName]?.value;
  } else if (refName === "AccountsDebtId") {
    let index = -1;
    for (let i = 0; i < errsValidator.value?.AccountsDebtId?.length; i++) {
      if (errsValidator.value?.AccountsDebtId) {
        index = i;
        break;
      }
    }
    if (accountsDebtRef.value?.[index]?.value?.[0]) {
      return accountsDebtRef.value?.[index]?.value?.[0];
    }
  } else if (refName === "AccountsBalanceId") {
    let index = -1;
    for (let i = 0; i < errsValidator.value?.AccountsBalanceId?.length; i++) {
      if (errsValidator.value?.AccountsBalanceId) {
        index = i;
        break;
      }
    }
    if (accountsBalanceRef.value?.[index]?.value?.[0]) {
      return accountsBalanceRef.value?.[index]?.value?.[0];
    }
  }
  return null;
};

/**
 * Mô tả: chỉnh fontsize tổng tiền
 * created by : vdtien
 * created date: 24-08-2023
 * @param {type} param -
 * @returns
 */
const resizeFontSizeMoney = () => {
  if (totalMoney.value > 999999999999 || totalMoney.value < -999999999999)
    return 20;
  else if (totalMoney.value > 999999999 || totalMoney.value < -999999999)
    return 28;
  return 36;
};

/**
 * Mô tả: chọn loại phiếu bhi
 * created by : vdtien
 * created date: 15-08-2023
 * @param {type} param -
 * @returns
 */
const onClickReason = (item) => {
  reasonSelected.value = item;
};
/**
 * Mô tả: đóng form detail
 * created by : vdtien
 * created date: 15-08-2023
 * @param {type} param -
 * @returns
 */
const onClosePopup = () => {
  store.dispatch("getPopupStatus", {
    isShowPopup: false,
    type: "",
  });
  store.dispatch("getEmployeeDetail");
};

/**
 * Mô tả: lấy danh sách nhà cung cấp lazy load và thêm vào cuối danh sách
 * created by : vdtien
 * created date: 15-08-2023
 * @param {type} param -
 * @returns
 */
const loadDataSupplierLazy = async (keySearch) => {
  try {
    // tang offset
    pageSupplierIndex.value += 1;
    // call danh sach tai khoan tong hop
    let res = await supplierService.getList({
      keySearch: keySearch,
      pageSize: 10,
      pageNumber: pageSupplierIndex.value,
    });

    if (res?.Data?.length > 0) {
      dataSuppliers.value = [...dataSuppliers.value, ...res.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

/**
 * Mô tả: lấy danh sách nhà cung cấp theo từ khóa tìm kiếm
 * created by : vdtien
 * created date: 15-08-2023
 * @param {type} param -
 * @returns
 */
const loadDataSupplierFilter = async (keySearch) => {
  try {
    // tang offset
    pageSupplierIndex.value = 1;
    // call danh sach tai khoan tong hop
    let res = await supplierService.getList({
      keySearch: keySearch,
      pageSize: 10,
      pageNumber: pageSupplierIndex.value,
    });

    if (res?.Data?.length >= 0) {
      dataSuppliers.value = [...res?.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

/**
 * Mô tả: xử lý các binding khi chọn nhà cung cấp
 * created by : vdtien
 * created date: 16-08-2023
 * @param {type} param -
 * @returns
 */
const hanldeSelectedSupplier = (item) => {
  // kiểm tra lý do chi có nhập tay không
  const reasonSpendingPrev = paymentInfo?.value?.ReasonSpending ?? "";
  if (
    paymentInfo?.value?.ReasonSpending &&
    paymentInfo?.value?.ReasonSpending.startsWith(FreeText.spendingFor)
  ) {
    paymentInfo.value.ReasonSpending = `${FreeText.spendingFor} ${
      item?.SupplierName ?? ""
    }`;
  }
  paymentInfo.value.SupplierName = item?.SupplierName ?? "";

  // nếu nhà cung cấp là cá nhân thì bind cả người nhận
  if (item?.SupplierType === SupplierType.individual) {
    paymentInfo.value.Receiver = item?.SupplierName ?? "";
  }

  // bind địa chỉ theo nhà cung cấp
  paymentInfo.value.Address = item?.Address;

  if (isChangeEmployee.value === false) {
    paymentInfo.value.EmployeeId = item?.EmployeeId;
    paymentInfo.value.EmployeeName = item?.EmployeeName ?? "";
    employeeSelected.value = {
      EmployeeId: item?.EmployeeId,
      FullName: item?.EmployeeName,
    };
    // cap nhat employeeSelected
  }

  supplierSelected.value = structuredClone(item);
};

/**
 * Mô tả: lấy danh sách nhân viên theo lazy load và thêm vào cuối danh sách
 * created by : vdtien
 * created date: 16-08-2023
 * @param {type} param -
 * @returns
 */
const loadDateEmployeesLazy = async (keySearch) => {
  try {
    // tang offset
    pageEmployeeIndex.value += 1;
    // call danh sach tai khoan tong hop
    let res = await employeeService.getList({
      keySearch: keySearch,
      pageSize: 10,
      pageNumber: pageEmployeeIndex.value,
    });

    if (res?.Data?.length > 0) {
      dataEmployees.value = [...dataEmployees.value, ...res.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};
/**
 * Mô tả: load danh sách nhân viên theo từ khóa tìm kiếm
 * created by : vdtien
 * created date: 16-08-2023
 * @param {type} param -
 * @returns
 */
const loadDataEmployeesFilter = async (keySearch) => {
  try {
    // tang offset
    pageEmployeeIndex.value = 1;
    // call danh sach tai khoan tong hop
    let res = await employeeService.getList({
      keySearch: keySearch,
      pageSize: 10,
      pageNumber: pageEmployeeIndex.value,
    });

    if (res?.Data?.length >= 0) {
      dataEmployees.value = [...res?.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

// accounting
const hanldeAddValueAccountBalance = (item, index) => {
  paymentInfo.value.Accountings[index].AccountBalanceCode = item?.AccountCode;
  paymentInfo.value.Accountings[index].AccountBalanceId = item?.AccountId;

  accountsBalanceSelected.value[index].AccountCode = item?.AccountCode;
  accountsBalanceSelected.value[index].AccountId = item?.AccountId;
};
const hanldeAddValueAccountDebt = (item, index) => {
  paymentInfo.value.Accountings[index].AccountDebtCode = item?.AccountCode;
  paymentInfo.value.Accountings[index].AccountDebtId = item?.AccountId;

  accountsDebtSelected.value[index].AccountCode = item?.AccountCode;
  accountsDebtSelected.value[index].AccountId = item?.AccountId;
};

const onClickAccountingRow = (index) => {
  indexFocusAccouting.value = index;
};
/**
 * Mô tả: thêm 1 dòng hạch toán vào danh sách hạch toán
 * created by : vdtien
 * created date: 16-08-2023
 * @param {type} param -
 * @returns
 */
const onClickAddAccountingRow = () => {
  // accountings null hoặc rỗng
  if (!paymentInfo.value?.Accountings?.length) {
    paymentInfo.value.Accountings = [];
    paymentInfo.value.Accountings.push({
      AccountingExplain: paymentInfo.value?.ReasonSpending ?? "",
      AccountDebtId: dataAccountsDebt?.value?.[0]?.AccountId,
      AccountDebtCode: dataAccountsDebt?.value?.[0]?.AccountCode,
      AccountBalanceId: dataAccountsBalance?.value?.[0]?.AccountId,
      AccountBalanceCode: dataAccountsBalance?.value?.[0]?.AccountCode,
      AccountingId: generateUniqueId(),
      Money: 0,
    });
    const tmpARrs = structuredClone(paymentInfo.value.Accountings);
    paymentInfo.value.Accountings = tmpARrs;
  } else {
    const index = paymentInfo.value.Accountings.length - 1;
    const lastEl = {
      ...paymentInfo.value.Accountings[
        paymentInfo.value.Accountings.length - 1
      ],
    };
    lastEl.AccountingId = generateUniqueId();
    paymentInfo.value.Accountings.push({ ...lastEl, Money: 0 });
    if (
      Array.isArray(errsValidator.value.AccountsDebtId) &&
      errsValidator.value.AccountsDebtId[index]
    ) {
      errsValidator.value.AccountsDebtId.push([
        ...errsValidator.value.AccountsDebtId[index],
      ]);
    }
    if (
      Array.isArray(errsValidator.value.AccountsBalanceId) &&
      errsValidator.value.AccountsBalanceId[index]
    ) {
      errsValidator.value.AccountsBalanceId.push([
        ...errsValidator.value.AccountsBalanceId[index],
      ]);
    }
  }
  // thêm tài khoản nợ vào danh sách tài khoản đã chọn
  accountsDebtSelected.value.push({
    AccountId:
      paymentInfo.value.Accountings[paymentInfo.value.Accountings.length - 1]
        .AccountDebtId,
    AccountCode:
      paymentInfo.value.Accountings[paymentInfo.value.Accountings.length - 1]
        .AccountDebtCode,
  });

  accountsBalanceSelected.value.push({
    AccountId:
      paymentInfo.value.Accountings[paymentInfo.value.Accountings.length - 1]
        .AccountBalanceId,
    AccountCode:
      paymentInfo.value.Accountings[paymentInfo.value.Accountings.length - 1]
        .AccountBalanceCode,
  });
  indexFocusAccouting.value = paymentInfo.value.Accountings.length - 1;
};

/**
 * Mô tả: Xóa 1 hạch toán theo chỉ số
 * created by : vdtien
 * created date: 24-08-2023
 * @param {type} param -
 * @returns
 */
const onClickDeleteAccountingRow = (index) => {
  if (
    paymentInfo.value?.Accountings?.length > 0 &&
    accountsDebtSelected.value?.length > 0 &&
    accountsBalanceSelected.value?.length > 0
  ) {
    const tmpArrs = structuredClone(paymentInfo.value.Accountings);
    tmpArrs.splice(index, 1);
    paymentInfo.value.Accountings = tmpArrs;
    accountsDebtSelected.value.splice(index, 1);
    accountsBalanceSelected.value.splice(index, 1);
    indexFocusAccouting.value = paymentInfo.value.Accountings.length - 1;
  }
};

const onClickDeleteAllAccountingRow = () => {
  store.dispatch("getDialog", {
    isShow: true,
    type: DialogType.warning,
    title: DialogTitle.notify,
    content: [DialogContent.removeAllRow],
    action: DialogAction.confirmRemoveAllAccountings,
  });
};

const isValidateData = () => {
  // xóa các lỗi không có trong errRefs
  errsValidator.value = {};
  // check số phiếu chi không để trống
  let isPaymentCodeEmpty = !String(paymentInfo.value?.PaymentCode ?? "").trim();
  // console.log("payment coe", isPaymentCodeEmpty);
  if (isPaymentCodeEmpty) {
    errsValidator.value.PaymentCode = [
      ...(errsValidator.value?.PaymentCode ?? []),
      ErrValidator.fieldNotEmpty(FreeText.PaymentCode),
    ];
  }

  // check thời gian hạch toán và thời gian phiếu chi
  // check null or empty
  let isAccountingDateEmpty = isNaN(
    Date.parse(paymentInfo.value?.AccountingDate)
  );
  if (isAccountingDateEmpty) {
    errsValidator.value.AccountingDate = [
      ...(errsValidator.value?.AccountingDate ?? []),
      ErrValidator.fieldNotEmpty(FreeText.accountingDate),
    ];
  }
  let isPayemntDateEmpty = isNaN(Date.parse(paymentInfo.value?.PaymentDate));
  if (isPayemntDateEmpty) {
    errsValidator.value.PaymentDate = [
      ...(errsValidator.value?.PaymentDate ?? []),
      ErrValidator.fieldNotEmpty(FreeText.paymentDate),
    ];
  }
  // thời gian phiếu chi <= thời gian hạch toán
  if (!isAccountingDateEmpty && !isPayemntDateEmpty) {
    let accountingDate = new Date(paymentInfo.value?.AccountingDate);
    let paymentDate = new Date(paymentInfo.value?.PaymentDate);
    // Đặt thông tin giờ, phút và giây về 0 để bỏ qua chúng trong việc so sánh
    accountingDate.setHours(0, 0, 0, 0);
    paymentDate.setHours(0, 0, 0, 0);

    if (accountingDate < paymentDate) {
      errsValidator.value.AccountingDate = [
        ...(errsValidator.value?.AccountingDate ?? []),
        ErrValidator.accountingDateMoreEqualPaymentDate(
          convertToDDMMYYYY(paymentDate)
        ),
      ];
    }
  }

  // check accountings không để trống
  let isAccountingsEmpty =
    !Array.isArray(paymentInfo.value?.Accountings) ||
    paymentInfo.value?.Accountings.length === 0;
  if (isAccountingsEmpty) {
    errsValidator.value.Accountings = [
      ...(errsValidator.value?.Accountings ?? []),
      ErrValidator.accountingsNotEmpty,
    ];
  }

  // check tài khoản nợ và tài khoản có không để trống
  else {
    let length = paymentInfo.value.Accountings.length;
    for (let index = 0; index < length; index++) {
      const element = paymentInfo.value.Accountings[index];
      if (!element?.AccountDebtId) {
        if (!Array.isArray(errsValidator.value.AccountsDebtId))
          errsValidator.value.AccountsDebtId = [];
        errsValidator.value.AccountsDebtId[index] = [
          ...(errsValidator.value?.AccountsDebtId[index] ?? []),
          ErrValidator.fieldNotEmpty(FreeText.accountDebt),
        ];
      }
      if (!element?.AccountBalanceId) {
        if (!Array.isArray(errsValidator.value.AccountsBalanceId))
          errsValidator.value.AccountsBalanceId = [];
        errsValidator.value.AccountsBalanceId[index] = [
          ...(errsValidator.value?.AccountsBalanceId[index] ?? []),
          ErrValidator.fieldNotEmpty(FreeText.accountBalance),
        ];
      }
    }
  }

  // Kiểm tra xem object có rỗng hay không
  const isEmpty = Object.keys(errsValidator.value).length === 0;
  if (isEmpty) {
    // console.log("isEmpty", isEmpty);
    return true;
  } else {
    let tmpErrs = {
      ...errsValidator.value,
      AccountsDebtId: findFirstTruthyElement(
        errsValidator.value.AccountsDebtId
      ),
      AccountsBalanceId: findFirstTruthyElement(
        errsValidator.value.AccountsBalanceId
      ),
    };
    removeEmptyFields(tmpErrs);
    const errMsgArray = Object.values(tmpErrs).flat();
    store.dispatch("getDialog", {
      isShow: true,
      type: DialogType.error,
      title: DialogTitle.inValidInput,
      content: errMsgArray,
      action: DialogAction.confirmValidate,
    });
    return false;
  }
};
function findFirstTruthyElement(arr) {
  if (Array.isArray(arr)) {
    return arr.find((item) => !!item);
  }
  return "";
}

/**
 * Mô tả: xử lý sự kiện click button
 * created by : vdtien
 * created date: 17-08-2023
 * @param {type} param -
 * @returns
 */
const onClickButton = (type) => {
  // console.log("on click button");
  switch (type) {
    case TypeClickButton.create:
      // validate fe
      if (isValidateData()) {
        // removeEmptyFields(paymentInfo.value);
        store.dispatch("createPayment", {
          payment: paymentInfo.value,
          typeStore: TypeStore.store,
        });
      }
      break;
    case TypeClickButton.createAndAdd:
      // validate fe
      if (isValidateData()) {
        console.log("create and add");
      }
      break;
    case TypeClickButton.update:
      // validate fe
      if (isValidateData()) {
        // removeEmptyFields(paymentInfo.value);
        store.dispatch("updatePayment", {
          payment: paymentInfo.value,
          typeStore: TypeStore.store,
        });
      }
      break;
    case TypeClickButton.edit:
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.update,
      });
      break;
    case TypeClickButton.quickEdit:
      // validate fe
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.update,
      });
      break;
    case TypeClickButton.unWrite:
      store.dispatch("updateStatusPayment", {
        paymentId: paymentInfo.value?.PaymentId,
        status: PaymentStatus.unWritten,
      });
      break;

    case TypeClickButton.write:
      store.dispatch("updateStatusPayment", {
        paymentId: paymentInfo.value?.PaymentId,
        status: PaymentStatus.written,
      });
    default:
      break;
  }
};
//========= end methods =========
</script>
<style scoped>
.payment__header {
  background-color: var(--main-background-color);
}
.payment__header .title {
  font-weight: 700;
  font-size: 24px;
  top: -7px;
  left: 20px;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.payment__header .header-detail-input {
  display: flex;
  display: -webkit-flex;
  justify-content: left;
  align-items: center;
  padding-left: 24px;
  flex: 1;
  min-width: 600px;
}
.payment__header .header-detail-buttom {
  position: relative;
  right: 0;
}
.header-detail-buttons .tour-label {
  white-space: nowrap;
  padding-left: 5px;
  color: #0075c0;
  font-size: 13px;
}
.header-detail-btn {
  padding: 6px 8px;
  cursor: pointer;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.header-detail-btn:hover {
  background-color: #ccc;
}
.main-information {
  padding: 6px 20px 12px;
}
.sumary-info-number {
  font-size: 36px;
  font-weight: 700;
}
.detail-information {
  background: #fff;
  width: 100%;
  position: relative;
  padding-bottom: 8px;
}
.detail-information-title {
  padding: 8px 20px;
}
.detail-information-title span {
  font-weight: 700;
}
.detail-information-body {
  overflow: auto;
  /* max-height: 158px; */
  min-width: 100%;
}
.popup__footer {
  padding: 0 16px;
  position: relative;
  height: 42px;
  width: 100%;
  background-color: #020a01;
}
.button-footer {
  color: #fff;
  background-color: transparent;
  position: relative;
  border: 1px solid #6b6c72;
}
.button-footer:hover {
  border: 1px solid #6b6c72;
  color: #fff;
  background: #2f3034;
}
.button-footer:active {
  background-color: #27282b;
}
.detail-information-footer {
  width: 100%;
  position: sticky;
  bottom: 0;
  background-color: #fff;
}
/* <.disable-textarea {
  background-color: #eff0f2;
}> */
</style>
