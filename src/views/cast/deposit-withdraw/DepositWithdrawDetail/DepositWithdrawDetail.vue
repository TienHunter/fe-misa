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
              class="w-input"
              :data="dataReasonList"
              field-select="id"
              field-show="value"
              :item-selected="reasonSelected"
              @on-click-select-item="onClickReason" />
          </div>
        </div>
        <div class="header-detail-buttons flex items-center">
          <div class="guide-tour flex mx-3">
            <div class="icon-wrapper">
              <div class="icon-v1 icon-v1--tour"></div>
            </div>
            <div class="tour-label">Hướng dẫn</div>
          </div>
          <div class="header-detail-btn" title="Tùy chỉnh giao diện">
            <div class="icon wrapper">
              <div class="icon icon--setting"></div>
            </div>
          </div>
          <div class="header-detail-btn" title="Giúp (F1)">
            <div class="icon wrapper">
              <div class="icon icon--question"></div>
            </div>
          </div>
          <div
            class="header-detail-btn"
            title="Đóng (ESC)"
            @click="onClosePopup">
            <div class="icon wrapper">
              <div class="icon icon--close"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup__body flex-1 flex flex-col">
        <div class="w-full bg position-sticky left-0">
          <div class="main-information">
            <div class="flex basic-information pt-0">
              <div class="w-3/4 flex">
                <div class="w-4/5 pr-4">
                  <div class="w-full flex pb-2">
                    <div class="w-3/7 pr-3">
                      <BaseComboboxV1
                        :ref="errRefs.SupplierId"
                        v-auto-focus
                        is-reload-scroll
                        is-reload
                        label="Mã nhà cung cấp"
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
                          }
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-4/7">
                      <b-textfield
                        :ref="errRefs.SupplierName"
                        v-model="paymentInfo.SupplierName"
                        label="Tên nhà cung cấp"
                        :max-length="MaxLength.default" />
                    </div>
                  </div>
                  <div class="w-full flex pb-2">
                    <div class="w-3/7 pr-3">
                      <b-textfield
                        :ref="errRefs.Receiver"
                        v-model="paymentInfo.Receiver"
                        :max-length="MaxLength.default"
                        label="Người nhận" />
                    </div>
                    <div class="w-4/7">
                      <b-textfield
                        v-model="paymentInfo.Address"
                        :max-length="MaxLength.default"
                        label="Địa chỉ" />
                    </div>
                  </div>
                  <div class="w-full flex pb-2">
                    <b-textfield
                      :ref="errRefs.ReasonSpending"
                      v-model="paymentInfo.ReasonSpending"
                      :max-length="MaxLength.default"
                      label="Lý do chi" />
                  </div>
                  <div class="w-full flex pb-2">
                    <div class="w-3/7 pr-3">
                      <BaseComboboxV1
                        :ref="errRefs.EmployeeId"
                        is-reload-scroll
                        is-reload
                        label="Nhân viên"
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
                          (item) => hanldeSelectEmployee(item)
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
                          }
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-4/7 flex items-end">
                      <div class="w-2/5">
                        <NumberInput
                          :ref="errRefs.AttachOriginalDocuments"
                          v-model="paymentInfo.AttachOriginalDocuments"
                          label="Kèm theo"
                          place-holder="Số lượng"
                          class-input="text-right" />
                      </div>
                      <span class="pl-3">chứng từ gốc</span>
                    </div>
                  </div>
                  <div class="w-full flex">
                    <span class="pr-3">Tham chiếu</span>
                    <span class="text-blue">...</span>
                  </div>
                </div>
                <div class="w-1/5 pl-4">
                  <div class="w-full pb-2">
                    <b-textfield
                      :ref="errRefs.AccountingDate"
                      v-model="paymentInfo.AccountingDate"
                      label="Ngày hạch toán"
                      input-type="date" />
                  </div>
                  <div class="w-full pb-2">
                    <b-textfield
                      :ref="errRefs.PaymentDate"
                      v-model="paymentInfo.PaymentDate"
                      label="Ngày phiếu toán"
                      input-type="date" />
                  </div>
                  <div class="w-full">
                    <b-textfield
                      :ref="errRefs.PaymentCode"
                      v-model="paymentInfo.PaymentCode"
                      label="Số phiếu chi" />
                  </div>
                </div>
              </div>
              <div class="w-1/4 sumary-info text-right mt-0">
                <div class="sumary-info-title">Tổng tiền</div>
                <div
                  class="sumary-info-number"
                  :class="{ 'text-red': totalMoney < 0 }">
                  {{ formatDecimal(totalMoney) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full bgw flex-1">
          <div class="detail-information">
            <div class="detail-information-title">
              <span>Hạch toán</span>
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
                      <tr
                        v-for="(accounting, index) in paymentInfo.Accountings"
                        :key="index"
                        :class="{
                          'tr--checked': indexFocusAccouting === index,
                        }"
                        @click="() => onClickAccountingRow(index)">
                        <td
                          v-for="(col, indexCol) in accoutingCols"
                          :key="indexCol"
                          class="px-3"
                          :title="accounting?.[col.name] ?? ''">
                          <span v-if="col.name === '#'">{{ index + 1 }}</span>
                          <div
                            v-else-if="col.name === 'AccountingExplain'"
                            class="flex items-center">
                            <textarea
                              v-if="indexFocusAccouting === index"
                              v-model="accounting[col.name]"
                              rows="1"
                              class="td-textarea" />
                            <div v-else class="flex items-center">
                              {{ accounting[col.name] }}
                            </div>
                          </div>
                          <div
                            v-else-if="col.name === 'AccountDebtCode'"
                            class="flex items-center">
                            <BaseComboboxV1
                              v-if="indexFocusAccouting === index"
                              :ref="AccountsDebtId[index]"
                              :max-length="MaxLength.default"
                              :fields="fieldsAccount"
                              :field-select="fieldSelectAccount"
                              :field-show="fieldShowAccount"
                              :data-list="dataAccountsDebt"
                              :id-selected="accounting.AccountDebtId"
                              :value-selected="accountsDebtSelected[index]"
                              :err-msg="
                                errsValidator?.AccountsDebtId?.length > 0 &&
                                errsValidator?.AccountsDebtId?.[index]?.length >
                                  0
                                  ? errsValidator?.AccountsDebtId?.[index].join(
                                      ''
                                    )
                                  : ''
                              "
                              @on-click-id-selected="
                                (id) => (accounting.AccountDebtId = id)
                              "
                              @add-value-selected="
                                (item) => hanldeAddValueAccountDebt(item, index)
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
                                }
                              "
                              @keydown.tab.stop="" />

                            <div v-else class="flex items-center">
                              {{ accounting?.[col.name] }}
                            </div>
                          </div>
                          <div
                            v-else-if="col.name === 'AccountBalanceCode'"
                            class="flex items-center">
                            <BaseComboboxV1
                              v-if="indexFocusAccouting === index"
                              :ref="errDetailRefs.AccountsBalanceId[index]"
                              :max-length="MaxLength.default"
                              :fields="fieldsAccount"
                              :field-select="fieldSelectAccount"
                              :field-show="fieldShowAccount"
                              :data-list="dataAccountsBalance"
                              :id-selected="accounting.AccountBalanceId"
                              :value-selected="accountsBalanceSelected[index]"
                              :err-msg="
                                errsValidator?.AccountsBalanceId?.length > 0 &&
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
                                    errsValidator?.AccountsBalanceId?.length >=
                                    0
                                  )
                                    errsValidator.AccountsBalanceId[index] = '';
                                }
                              "
                              @keydown.tab.stop="" />

                            <div v-else class="flex items-center">
                              {{ accounting?.[col.name] }}
                            </div>
                          </div>
                          <div v-else-if="col.name === 'Money'">
                            <!-- xu ly nhap tien -->
                            <div class="flex items-center">
                              <CurrencyInput
                                v-if="indexFocusAccouting === index"
                                v-model.lazy="accounting.Money"
                                :options="options" />
                              <div
                                v-else
                                class="flex items-center justify-end w-full">
                                {{ formatDecimal(accounting?.Money ?? 0) }}
                              </div>
                            </div>
                          </div>
                          <div
                            v-else-if="col.name === 'action'"
                            class="flex items-center justify-center pointer"
                            tabindex="0"
                            @click.stop="
                              () => onClickDeleteAccountingRow(index)
                            ">
                            <div class="icon-v1 icon-v1--bin"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th
                          v-for="(col, index) in accoutingCols"
                          :key="index"
                          class="th-foot">
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
                  size="mini"
                  type="secondary"
                  title="Thêm dòng"
                  @click.stop="onClickAddAccountingRow" />
                <b-button
                  size="mini"
                  type="secondary"
                  title="Xóa hết dòng"
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
          <button
            class="btn btn--mini button-footer"
            @click="() => onClickButon()">
            Cất
          </button>
          <b-button
            class="btn--pri"
            title="Cất và thêm"
            type="primary"
            size="mini" />
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
  reactive,
  ref,
  toRefs,
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
} from "@/enums";
import { formatDecimal } from "@/utils/helper";
import supplierService from "@/api/services/supplierService";
import employeeService from "@/api/services/employeeService";
import accountService from "@/api/services/accountService";

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
const errDetailRefs = reactive({
  AccountsDebtId: ref([]),
  AccountsBalanceId: ref([]),
});
const AccountsDebtId = ref([]);
const errsValidator = ref({});
const errsValidate = computed(() => store.state.global.errsValidate);
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
const indexFocusAccouting = ref(0);
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
//========= end state =========

//========= start lifecycle =========
watchEffect(() => {
  errsValidator.value = { ...errsValidate.value };
});
onBeforeMount(async () => {
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
  if (!paymentInfo.value?.Accountings?.length) {
    paymentInfo.value.Accountings = [];
    paymentInfo.value.Accountings.push({
      AccountingExplain: "Chi tiền cho ",
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
watchEffect(() => {
  paymentInfo.value = { ...paymentDetail.value };
});
watchEffect(() => {
  if (paymentInfo.value?.Accountings?.length >= 0) {
    totalMoney.value = 0;
    paymentInfo.value.Accountings.forEach(
      (el) => (totalMoney.value += el?.Money ?? 0)
    );
    console.log("change");
  }
});
watchEffect(() => {
  //   AccountsDebtId
  // AccountsBalanceId
  nextTick(() => {
    // console.log(errRefs);
    console.log(errDetailRefs);
  });
});
watchEffect(() => {
  if (Array.isArray(paymentInfo.value.Accountings)) {
    errDetailRefs.AccountsBalanceId.value = paymentInfo.value.Accountings.map(
      () => ref(null)
    );
    errDetailRefs.AccountsDebtId.value = paymentInfo.value.Accountings.map(() =>
      ref(null)
    );
    AccountsDebtId.value = paymentInfo.value.Accountings.map(() => ref(null));
  }
});
//========= end lifecycle =========

//========= start methods =========

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
    paymentInfo?.value?.ReasonSpending ===
      `Chi tiền cho ${paymentInfo?.value?.SupplierName ?? ""}`
  ) {
    paymentInfo.value.ReasonSpending = `Chi tiền cho ${
      item?.SupplierName ?? ""
    }`;
  }
  paymentInfo.value.SupplierName = item?.SupplierName;

  // nếu nhà cung cấp là cá nhân thì bind cả người nhận
  if (item?.SupplierType === SupplierType.individual) {
    paymentInfo.value.Receiver = item?.SupplierName;
  }

  // bind địa chỉ theo nhà cung cấp
  paymentInfo.value.Address = item?.Address;

  if (isChangeEmployee.value === false) {
    paymentInfo.value.EmployeeId = item?.EmployeeId;
    paymentInfo.value.EmployeeName = item?.EmployeeName;
    employeeSelected.value = {
      EmployeeId: item?.EmployeeId,
      FullName: item?.EmployeeName,
    };
    // cap nhat employeeSelected
  }

  // bind diễn giải trong hạch toán
  if (paymentInfo?.value?.Accountings?.length > 0) {
    for (let index = 0; index < paymentInfo.value.Accountings.length; index++) {
      if (
        paymentInfo.value.Accountings[index]?.AccountingExplain ===
        reasonSpendingPrev
      ) {
        paymentInfo.value.Accountings[index].AccountingExplain =
          paymentInfo?.value?.ReasonSpending ?? "";
      }
    }
  }
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
const hanldeSelectEmployee = () => {};

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
      Money: 0,
    });
  } else {
    const index = paymentInfo.value.Accountings.length - 1;
    const lastEl =
      paymentInfo.value.Accountings[paymentInfo.value.Accountings.length - 1];
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

const onClickDeleteAccountingRow = (index) => {
  if (
    paymentInfo.value?.Accountings?.length > 0 &&
    accountsDebtSelected.value?.length > 0 &&
    accountsBalanceSelected.value?.length > 0
  ) {
    paymentInfo.value.Accountings.splice(index, 1);
    accountsDebtSelected.value.splice(index, 1);
    accountsBalanceSelected.value.splice(index, 1);
    indexFocusAccouting.value = paymentInfo.value.Accountings.length - 1;
  }
};

const onClickDeleteAllAccountingRow = () => {
  paymentInfo.value.Accountings = [];
  accountsDebtSelected.value = [];
  accountsBalanceSelected.value = [];
};

const onClickButon = () => {
  console.log("click button");
};

/**
 * Mô tả: xử lý sự kiên có nhập ô search ở combobox nhưng không chọn
 * created by : vdtien
 * created date: 16-08-2023
 * @param {type} param -
 * @returns
 */
const hanldeAddErrorMsgNotSelectedYet = (state, field, label, index) => {
  if (typeof index === "number" && !isNaN(index) && index >= 0) {
    if (!Array.isArray(errsValidator.value[field])) {
      errsValidator.value[field] = [];
    }
    errsValidator.value[field][index] = [
      `Dữ liệu <${label}> không có trong danh mục.`,
    ];
  } else {
    errsValidator.value[field] = [
      `Dữ liệu <${label}> không có trong danh mục.`,
    ];
  }
};

const isValidateData = () => {
  // xóa các lỗi không có trong errRefs
  Object.keys(errsValidator).forEach((key) => {
    if (!errRefs[key]) delete errsValidator[key];
  });
  if (Object.keys(errsValidator).length !== 0) {
    // errsValidator không rỗng -> còn các lỗi chưa chọn trong combobox
    store.dispatch("getErrsValidate", { ...errsValidator });
    const errMsgArray = Object.values(errsValidator).flat();
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
</style>
