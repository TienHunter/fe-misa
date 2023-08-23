divdiv
<template>
  <div
    ref="supplierDetailRef"
    class="popup-wrapper outline-none"
    :tabindex="0"
    @keydown.stop="">
    <div class="popup-container flex flex-col">
      <div class="popup__header flex items-center">
        <div class="popup-header__title">
          {{
            popupStatus?.type === PopupType.create
              ? "Thêm nhà cung cấp"
              : "Sửa nhà cung cấp"
          }}
        </div>
        <div class="popup-header__options flex items-center">
          <label
            class="flex flex-row items-center m-0 w-auto font-regular mr-6">
            <input
              v-model="supplierInfo.SupplierType"
              :value="SupplierType.organization"
              type="radio"
              class="m-0 mr-2"
              name="radio-supplier"
              @keydown.tab.stop="" />
            Tổ chức
          </label>
          <label class="flex flex-row items-center m-0 w-auto font-regular">
            <input
              v-model="supplierInfo.SupplierType"
              :value="SupplierType.individual"
              type="radio"
              class="m-0 mr-2"
              name="radio-supplier"
              @keydown.tab.stop="" />
            Cá nhân
          </label>
          <label
            class="checkbox-wrapper w-auto flex flex-row items-center pointer m-0 ml-25">
            <input
              class="input-checkbox m-0 mr-2"
              type="checkbox"
              :checked="supplierInfo.IsCustomer === 1"
              @click="
                supplierInfo.IsCustomer === 1
                  ? (supplierInfo.IsCustomer = 0)
                  : (supplierInfo.IsCustomer = 1)
              " />
            <span> Là khách hàng </span>
          </label>
        </div>
        <div class="popup-header__actions flex items-center ml-auto">
          <div class="popup-header-actions__question mr-2">
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
      <form id="supplierForm" action="" class="popup__body flex-1">
        <div class="form-content flex flex-col gap-24-0">
          <div class="form-content__top flex flex-row gap-0-24">
            <div class="form-content-top__left flex flex-col w-1/2">
              <div class="flex gap-0-8 pb-2">
                <template
                  v-if="
                    supplierInfo?.SupplierType === SupplierType.organization
                  ">
                  <div class="w-2/5">
                    <b-textfield
                      :ref="errRefs.TaxCode"
                      v-model="supplierInfo.TaxCode"
                      label="Mã số thuế"
                      :max-length="MaxLength.code"
                      :err-msg="errsValidator?.TaxCode?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator.TaxCode;
                        }
                      "
                      @keydown="handleFocusLastOrganization" />
                  </div>
                  <div class="w-3/5">
                    <b-textfield
                      :ref="errRefs.SupplierCode"
                      v-model="supplierInfo.SupplierCode"
                      required
                      label="Mã nhà cung cấp"
                      :max-length="MaxLength.code"
                      :err-msg="errsValidator?.SupplierCode?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator.SupplierCode;
                        }
                      " />
                  </div>
                </template>
                <template v-else>
                  <div class="w-3/5">
                    <b-textfield
                      :ref="errRefs.SupplierCode"
                      v-model="supplierInfo.SupplierCode"
                      required
                      label="Mã nhà cung cấp"
                      :max-length="MaxLength.code"
                      :err-msg="errsValidator?.SupplierCode?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator.SupplierCode;
                        }
                      "
                      @keydown="handleFocusLastIndivial" />
                  </div>
                  <div class="w-2/5">
                    <b-textfield
                      :ref="errRefs.TaxCode"
                      v-model="supplierInfo.TaxCode"
                      label="Mã số thuế"
                      :max-length="MaxLength.code"
                      :err-msg="errsValidator?.TaxCode?.join('') ?? ''"
                      @empty-err-msg="
                        () => {
                          delete errsValidator.TaxCode;
                        }
                      " />
                  </div>
                </template>
              </div>
              <div class="w-full pb-2">
                <b-textfield
                  v-if="supplierInfo?.SupplierType === 1"
                  :ref="errRefs.SupplierName"
                  v-model="supplierInfo.SupplierName"
                  required
                  label="Tên nhà cung cấp"
                  :max-length="MaxLength.name"
                  :err-msg="errsValidator?.SupplierName?.join('') ?? ''"
                  @empty-err-msg="
                    () => {
                      delete errsValidator.SupplierName;
                    }
                  " />

                <label
                  v-if="supplierInfo?.SupplierType === 2"
                  class="flex flex-col justify-center">
                  <span class="pb-2"
                    >Tên nhà cung cấp <span class="text-red">(*)</span></span
                  >
                  <div class="flex items-center justify-start w-full">
                    <div class="w-2/5 pr-2">
                      <b-combobox
                        :data-list="vocatives"
                        field-select="id"
                        field-show="value"
                        place-holder="Xưng hộ"
                        :id-selected="supplierInfo.ContractInfor.Vocative"
                        @on-click-id-selected="
                          (id) => (supplierInfo.ContractInfor.Vocative = id)
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-3/5">
                      <b-textfield
                        :ref="errRefs.SupplierName"
                        v-model="supplierInfo.SupplierName"
                        :max-length="MaxLength.name"
                        :err-msg="errsValidator?.SupplierName?.join('') ?? ''"
                        @empty-err-msg="
                          () => {
                            delete errsValidator.SupplierName;
                          }
                        " />
                    </div>
                  </div>
                </label>
              </div>
              <div class="w-full">
                <label class="w-full" @keydown.tab.stop="">
                  Địa chỉ
                  <textarea
                    :ref="errRefs.Address"
                    v-model="supplierInfo.Address"
                    maxlength="500"
                    class="textarea"
                    rows="2"
                    :err-msg="errsValidator?.Address?.join('') ?? ''"
                    @empty-err-msg="
                      () => {
                        delete errsValidator.Address;
                      }
                    "
                    @keydown.tab.stop=""></textarea>
                </label>
              </div>
            </div>
            <div class="form-content-top__right flex flex-col w-1/2">
              <div
                v-if="supplierInfo?.SupplierType === 1"
                class="flex items-center gap-0-8 pb-2 w-full">
                <div class="w-2/5">
                  <b-textfield
                    :ref="errRefs.PhoneNumber"
                    v-model="supplierInfo.PhoneNumber"
                    label="Điện thoại"
                    :err-msg="errsValidator?.PhoneNumber?.join('') ?? ''"
                    @empty-err-msg="
                      () => {
                        delete errsValidator.PhoneNumber;
                      }
                    " />
                </div>

                <div class="w-3/5">
                  <b-textfield
                    :ref="errRefs.Website"
                    v-model="supplierInfo.Website"
                    label="Website" />
                </div>
              </div>
              <div class="w-full pb-2">
                <BaseComboboxMulChoice
                  add
                  label="Nhóm nhà cung cấp"
                  :fields="fieldsGroupSuppliers"
                  :field-select="fieldSelectGroupSuppliers"
                  :field-show="fieldShowGroupSuppliers"
                  :data-list="dataGroupSuppliers"
                  :ids-selected="supplierInfo.GroupSuppliersId"
                  @on-click-ids-selected="
                    (idsSelected) =>
                      (supplierInfo.GroupSuppliersId = [...idsSelected])
                  "
                  @keydown.tab.stop="" />
              </div>
              <div class="w-full">
                <BaseComboboxV1
                  label="Nhân viên mua hàng"
                  add
                  :max-length="MaxLength.default"
                  is-reload-scroll
                  is-reload
                  :fields="fieldsEmployee"
                  :field-select="fieldSelectEmployee"
                  :field-show="fieldShowEmployee"
                  :data-list="dataEmployees"
                  :id-selected="supplierInfo.EmployeeId"
                  :value-selected="employeeSelected"
                  @load-data-lazy="
                    (searchEmployee) => loadDataEmployeeLazy(searchEmployee)
                  "
                  @load-data-filter="
                    (searchEmployee) => loadDataEmployeeFilter(searchEmployee)
                  "
                  @on-click-id-selected="(id) => (supplierInfo.EmployeeId = id)"
                  @add-value-selected="(e) => (employeeSelected = { ...e })"
                  @keydown.tab.stop="" />
              </div>
            </div>
          </div>
          <div class="form-content__bottom">
            <div class="content-bottom__nav">
              <ul
                class="m-0 pl-0 w-full h-full flex items-end position-relative">
                <li
                  class="tabs-li flex"
                  :class="{
                    'active-item': tabContent === tabsContentValue.contractInfo,
                  }"
                  @click="
                    () => onClickTabContent(tabsContentValue.contractInfo)
                  ">
                  <div class="tabs-btn">
                    <div class="text-center no-wrap">Thông tin liên hệ</div>
                  </div>
                </li>
                <li
                  class="tabs-li flex"
                  :class="{
                    'active-item': tabContent === tabsContentValue.termPayment,
                  }"
                  @click="
                    () => onClickTabContent(tabsContentValue.termPayment)
                  ">
                  <div class="tabs-btn">
                    <div class="text-center no-wrap">Điều khoản thanh toán</div>
                  </div>
                </li>
                <li
                  class="tabs-li flex"
                  :class="{
                    'active-item': tabContent === tabsContentValue.banksAccount,
                  }"
                  @click="
                    () => onClickTabContent(tabsContentValue.banksAccount)
                  ">
                  <div class="tabs-btn">
                    <div class="text-center no-wrap">Tài khoản ngân hàng</div>
                  </div>
                </li>
                <li
                  class="tabs-li flex"
                  :class="{
                    'active-item': tabContent === tabsContentValue.otherAddress,
                  }"
                  @click="
                    () => onClickTabContent(tabsContentValue.otherAddress)
                  ">
                  <div class="tabs-btn">
                    <div class="text-center no-wrap">Địa chỉ khác</div>
                  </div>
                </li>
                <li
                  class="tabs-li flex"
                  :class="{
                    'active-item': tabContent === tabsContentValue.note,
                  }"
                  @click="() => onClickTabContent(tabsContentValue.note)">
                  <div class="tabs-btn">
                    <div class="text-center no-wrap">Ghi chú</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="content-bottom__body w-full block position-relative">
              <div class="position-relative w-full block tabs--content">
                <div
                  v-show="tabContent === tabsContentValue.contractInfo"
                  class="tab-content flex">
                  <div class="w-1/2 pr-6">
                    <div
                      v-show="
                        supplierInfo.SupplierType === SupplierType.organization
                      "
                      class="w-full pb-2 flex flex-col justify-center">
                      <label class="pb-2">Người liên hệ</label>
                      <div class="flex items-center justify-center pb-2">
                        <div class="w-2/5 pr-2">
                          <b-combobox
                            :data-list="vocatives"
                            field-select="id"
                            field-show="value"
                            place-holder="Xưng hộ"
                            :id-selected="supplierInfo.ContractInfor.Vocative"
                            @on-click-id-selected="
                              (id) => (supplierInfo.ContractInfor.Vocative = id)
                            "
                            @keydown.tab.stop="" />
                        </div>
                        <div class="w-3/5">
                          <b-textfield
                            v-model="supplierInfo.ContractInfor.Fullname"
                            place-holder="Họ và tên" />
                        </div>
                      </div>
                      <div class="w-full pb-2">
                        <b-textfield
                          :ref="errRefs.Email"
                          v-model="supplierInfo.ContractInfor.Email"
                          place-holder="Email"
                          :err-msg="errsValidator?.Email?.join('') ?? ''"
                          @empty-err-msg="
                            () => {
                              delete errsValidator.Email;
                            }
                          " />
                      </div>
                      <div class="w-1/2 pb-2">
                        <b-textfield
                          :ref="errRefs.MobilePhoneNumber"
                          v-model="supplierInfo.ContractInfor.PhoneNumber"
                          place-holder="Số điện thoại"
                          :err-msg="
                            errsValidator?.MobilePhoneNumber?.join('') ?? ''
                          "
                          @empty-err-msg="
                            () => {
                              delete errsValidator.MobilePhoneNumber;
                            }
                          " />
                      </div>
                    </div>
                    <div
                      v-if="
                        supplierInfo.SupplierType === SupplierType.individual
                      "
                      class="w-full pb-2 flex flex-col justify-center">
                      <label class="pb-2">Thông tin liên hệ</label>

                      <div class="w-full pb-2">
                        <b-textfield
                          :ref="errRefs.Email"
                          v-model="supplierInfo.ContractInfor.Email"
                          place-holder="Email"
                          :err-msg="errsValidator?.Email?.join('') ?? ''"
                          @empty-err-msg="
                            () => {
                              delete errsValidator.Email;
                            }
                          " />
                      </div>
                      <div class="w-full pb-2 flex items-center justify-start">
                        <div class="w-1/2">
                          <b-textfield
                            :ref="errRefs.MobilePhoneNumber"
                            v-model="supplierInfo.ContractInfor.PhoneNumber"
                            place-holder="Điện thoại di động"
                            :err-msg="
                              errsValidator?.MobilePhoneNumber?.join('') ?? ''
                            "
                            @empty-err-msg="
                              () => {
                                delete errsValidator.MobilePhoneNumber;
                              }
                            " />
                        </div>
                      </div>
                      <div class="w-full pb-2 flex items-center justify-start">
                        <div class="w-1/2">
                          <b-textfield
                            :ref="errRefs.PhoneNumber"
                            v-model="supplierInfo.PhoneNumber"
                            place-holder="Điện thoại cố định"
                            :err-msg="
                              errsValidator?.PhoneNumber?.join('') ?? ''
                            "
                            @empty-err-msg="
                              () => {
                                delete errsValidator.PhoneNumber;
                              }
                            " />
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="
                        supplierInfo.SupplierType === SupplierType.individual ||
                        (supplierInfo?.SupplierType ===
                          SupplierType.organization &&
                          supplierInfo?.IsCustomer === 1)
                      "
                      class="w-full">
                      <b-textfield
                        v-model="supplierInfo.ContractInfor.LegalRepresentative"
                        label="Đại diện theo PL"
                        title-label="Đại diện theo pháp luật"
                        place-holder="Đại diện theo PL" />
                    </div>
                  </div>
                  <div class="w-1/2">
                    <div
                      v-if="
                        supplierInfo?.SupplierType ===
                          SupplierType.organization &&
                        supplierInfo?.IsCustomer === 0
                      "
                      class="w-full">
                      <b-textfield
                        v-model="supplierInfo.ContractInfor.LegalRepresentative"
                        label="Đại diện theo PL"
                        title-label="Đại diện theo pháp luật"
                        place-holder="Đại diện theo PL" />
                    </div>
                    <div
                      v-if="
                        supplierInfo?.SupplierType ===
                          SupplierType.organization &&
                        supplierInfo?.IsCustomer === 1
                      "
                      class="w-full">
                      <div class="w-full pb-2">
                        <label class="pb-2">Người nhận hóa đơn điện tử</label>
                        <b-textfield
                          v-model="
                            supplierInfo.ContractInfor.FullnameReceiverBill
                          "
                          label=""
                          place-holder="Họ và tên" />
                      </div>
                      <div class="w-full pb-2">
                        <b-textfield
                          v-model="supplierInfo.ContractInfor.EmailReceiverBill"
                          place-holder='Email (Ngăn cách nhiều Email bằng dấu ";"")' />
                      </div>
                      <div class="w-1/2">
                        <b-textfield
                          :ref="errRefs.PhoneNumberReceiverBill"
                          v-model="
                            supplierInfo.ContractInfor.PhoneNumberReceiverBill
                          "
                          place-holder="Số điện thoại"
                          :err-msg="
                            errsValidator?.PhoneNumberReceiverBill?.join('') ??
                            ''
                          "
                          @empty-err-msg="
                            () => {
                              delete errsValidator.PhoneNumberReceiverBill;
                            }
                          " />
                      </div>
                    </div>
                    <div
                      v-if="
                        supplierInfo?.SupplierType === SupplierType.individual
                      "
                      class="w-full">
                      <div class="w-1/2 pb-2">
                        <label
                          class="pb-2"
                          title="Thông tin chứng minh nhân dân, thẻ căn cước"
                          >Thông tin CMND/Thẻ căn cước</label
                        >
                        <b-textfield
                          :ref="errRefs.IdentityNumber"
                          v-model="supplierInfo.ContractInfor.IdentityNumber"
                          place-holder="Số CMND/Thẻ căn cước"
                          :err-msg="
                            errsValidator?.IdentityNumber?.join('') ?? ''
                          "
                          @empty-err-msg="
                            () => {
                              delete errsValidator.IdentityNumber;
                            }
                          " />
                      </div>
                      <div class="w-1/2 pb-2">
                        <b-textfield
                          :ref="errRefs.IdentityDate"
                          v-model="supplierInfo.ContractInfor.IdentityDate"
                          input-type="date"
                          place-holder="Ngày cấp"
                          :err-msg="errsValidator?.IdentityDate?.join('') ?? ''"
                          @empty-err-msg="
                            () => {
                              delete errsValidator.IdentityDate;
                            }
                          " />
                      </div>
                      <div class="w-full">
                        <b-textfield
                          v-model="supplierInfo.ContractInfor.IdentityPlace"
                          place-holder="Nơi cấp" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-show="tabContent === tabsContentValue.termPayment"
                  class="tab-content tab-term-of-payment">
                  <div class="flex pb-2">
                    <div class="w-input pr-3">
                      <BaseComboboxV1
                        label="Điều khoản thanh toán"
                        add
                        :max-length="MaxLength.default"
                        is-reload-scroll
                        is-reload
                        :fields="filedsTermPayment"
                        :field-select="fieldSelectTermPayment"
                        :field-show="fieldShowTermPayment"
                        :data-list="dataTermPayments"
                        :id-selected="supplierInfo.TermPaymentId"
                        :value-selected="termPaymentSelected"
                        @load-data-lazy="
                          (termPaymentSearch) =>
                            loadDataTermPaymentLazy(termPaymentSearch)
                        "
                        @load-data-filter="
                          (termPaymentSearch) =>
                            loadDataTermPaymentFilter(termPaymentSearch)
                        "
                        @on-click-id-selected="
                          (id) => (supplierInfo.TermPaymentId = id)
                        "
                        @add-value-selected="
                          (itemSelected) => hanldeAddTermPaymentId(itemSelected)
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-input pr-3">
                      <NumberInput
                        v-model="supplierInfo.DueTime"
                        :max-length="MaxLength.number"
                        :max-value="999999"
                        label="Số ngày được nợ" />
                    </div>
                    <div class="w-input pr-3">
                      <NumberInput
                        v-model="supplierInfo.MaxAccountOfDebt"
                        :max-length="MaxLength.number"
                        :max-value="999999999999"
                        label="Số nợ tối đa" />
                    </div>
                  </div>
                  <div class="flex pb-2">
                    <div
                      v-show="supplierInfo.IsCustomer === 1"
                      class="w-input pr-3">
                      <BaseComboboxV1
                        label="Tài khoản công nợ phải thu"
                        :max-length="MaxLength.default"
                        :fields="fieldsAccount"
                        :field-select="fieldSelectAccount"
                        :field-show="fieldShowAccount"
                        :data-list="dataAccountReceivable"
                        :value-selected="accountReceivableSelected"
                        @load-data-filter="
                          (keySearch) => loadDataAccountReceivable(keySearch)
                        "
                        @on-click-id-selected="
                          (id) => (supplierInfo.AccountReceivableId = id)
                        "
                        @add-value-selected="
                          (e) => (accountReceivableSelected = { ...e })
                        "
                        @keydown.tab.stop="" />
                    </div>
                    <div class="w-input pr-3">
                      <BaseComboboxV1
                        label="Tài khoản công nợ phải trả"
                        :max-length="MaxLength.default"
                        :fields="fieldsAccount"
                        :field-select="fieldSelectAccount"
                        :field-show="fieldShowAccount"
                        :data-list="dataAccountPayable"
                        :id-selected="supplierInfo.AccountPayableId"
                        :value-selected="accountPayableSelected"
                        @load-data-filter="
                          (keySearch) => loadDataAccountPayable(keySearch)
                        "
                        @on-click-id-selected="
                          (id) => (supplierInfo.AccountPayableId = id)
                        "
                        @add-value-selected="
                          (item) => (accountPayableSelected = { ...item })
                        "
                        @keydown.tab.stop="" />
                    </div>
                  </div>
                </div>
                <div
                  v-if="tabContent === tabsContentValue.banksAccount"
                  class="tab-content">
                  <div class="grid-mode-control">
                    <div class="h-full w-full position-relative">
                      <div style="min-height: 0px; overflow: auto">
                        <table>
                          <thead>
                            <tr>
                              <th
                                style="
                                  min-width: 150px;
                                  width: 150px;
                                  top: 0px;
                                ">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3"
                                    >Số tài khoản</span
                                  >
                                </div>
                              </th>
                              <th
                                style="
                                  min-width: 200px;
                                  width: 200px;
                                  top: 0px;
                                ">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3"
                                    >Tên tài khoản</span
                                  >
                                </div>
                              </th>
                              <th
                                style="
                                  min-width: 180px;
                                  width: 180px;
                                  top: 0px;
                                ">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3"
                                    >Chi nhánh</span
                                  >
                                </div>
                              </th>
                              <th style="min-width: 200px; top: 0px">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3"
                                    >Tỉnh/TP của ngân hàng</span
                                  >
                                </div>
                              </th>
                              <th
                                style="
                                  min-width: 40px;
                                  width: 40px;
                                  max-width: 40px;
                                  top: 0px;
                                "></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(bank, index) in supplierInfo.BanksAccount"
                              :key="index"
                              :class="{
                                'tr--checked': indexFocusBankAccount === index,
                              }"
                              @click="indexFocusBankAccount = index">
                              <td class="px-3">
                                <div class="flex items-center">
                                  <textarea
                                    v-if="indexFocusBankAccount === index"
                                    v-model="bank.BankAccountNumber"
                                    v-auto-focus
                                    rows="1"
                                    class="td-textarea" />
                                  <div v-else class="flex items-center">
                                    {{ bank.BankAccountNumber }}
                                  </div>
                                </div>
                              </td>
                              <td class="px-3">
                                <div class="flex items-center">
                                  <textarea
                                    v-show="indexFocusBankAccount === index"
                                    v-model="bank.BankName"
                                    rows="1"
                                    class="td-textarea" />
                                  <div
                                    v-show="indexFocusBankAccount !== index"
                                    class="flex items-center">
                                    {{ bank.BankName }}
                                  </div>
                                </div>
                              </td>
                              <td class="px-3">
                                <div class="flex items-center">
                                  <textarea
                                    v-show="indexFocusBankAccount === index"
                                    v-model="bank.BankBranch"
                                    rows="1"
                                    class="td-textarea" />
                                  <div
                                    v-show="indexFocusBankAccount !== index"
                                    class="flex items-center">
                                    {{ bank.BankBranch }}
                                  </div>
                                </div>
                              </td>
                              <td class="px-3">
                                <div class="flex items-center">
                                  <textarea
                                    v-show="indexFocusBankAccount === index"
                                    v-model="bank.BankCity"
                                    rows="1"
                                    class="td-textarea" />
                                  <div
                                    v-show="indexFocusBankAccount !== index"
                                    class="flex items-center">
                                    {{ bank.BankCity }}
                                  </div>
                                </div>
                              </td>
                              <td class="px-3" title="Xóa">
                                <div
                                  class="flex items-center justify-center pointer"
                                  @click.stop="() => onClickRemoveBank(index)">
                                  <div class="icon-v1 icon-v1--bin"></div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="grid-control-item">
                    <div class="pt-3">
                      <b-button
                        size="mini"
                        type="secondary"
                        title="Thêm dòng"
                        @click="onClickAddRowBank" />
                      <b-button
                        size="mini"
                        type="secondary"
                        title="Xóa hết dòng"
                        @click="onClickRemoveAllBank" />
                    </div>
                  </div>
                </div>
                <div
                  v-show="tabContent === tabsContentValue.otherAddress"
                  class="tab-content flex">
                  <div class="w-1/2 pr-6">
                    <div class="w-full">
                      <label class="pb-2 no-pointer">Vị trí địa lý</label>
                      <div class="flex pb-2">
                        <div class="w-1/2 pr-3">
                          <b-combobox
                            place-holder="Đất nước"
                            :max-length="MaxLength.default"
                            :data-list="dataContries"
                            field-select="LocationId"
                            field-show="LocationName"
                            :id-selected="supplierInfo.CountryId"
                            @on-click-id-selected="
                              (id) => handleChangeCountry(id)
                            "
                            @keydown.tab.stop="" />
                        </div>
                        <div class="w-1/2">
                          <b-combobox
                            place-holder="Tỉnh/thành phố"
                            :max-length="MaxLength.default"
                            :data-list="dataCities"
                            field-select="LocationId"
                            field-show="LocationName"
                            :id-selected="supplierInfo.CityId"
                            @on-click-id-selected="(id) => handleChangeCity(id)"
                            @keydown.tab.stop="" />
                        </div>
                      </div>
                      <div class="flex pb-2">
                        <div class="w-1/2 pr-3">
                          <b-combobox
                            place-holder="Quận/huyện"
                            :max-length="MaxLength.default"
                            :data-list="dataDistricts"
                            field-select="LocationId"
                            field-show="LocationName"
                            :id-selected="supplierInfo.DistrictId"
                            @on-click-id-selected="
                              (id) => handleChangeDistrict(id)
                            "
                            @keydown.tab.stop="" />
                        </div>
                        <div class="w-1/2">
                          <b-combobox
                            place-holder="Xã/phường"
                            :max-length="MaxLength.default"
                            :data-list="dataWards"
                            field-select="LocationId"
                            field-show="LocationName"
                            :id-selected="supplierInfo.WardId"
                            @on-click-id-selected="
                              (id) => (supplierInfo.WardId = id)
                            "
                            @keydown.tab.stop="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-1/2">
                    <div class="top-grid">
                      <label class="no-pointer w-auto no-wrap"
                        >Địa chỉ giao hàng</label
                      >
                      <label class="flex items-center pl-5">
                        <input
                          type="checkbox"
                          class="mr-2"
                          :checked="supplierInfo.IsSameSupplierAddress === 1"
                          @click="handleToggleSameSupplierAddress" />
                        Giống địa chỉ nhà cung cấp
                      </label>
                    </div>
                    <div class="grid-model-control grid-address">
                      <div class="h-full w-full position-relative">
                        <div
                          class="h-full"
                          style="min-height: 0px; overflow: auto">
                          <table>
                            <tbody>
                              <tr
                                v-for="(
                                  ad, index
                                ) in supplierInfo.DeliverAddress"
                                :key="index"
                                @click="indexFocusDeliverAddress = index">
                                <td class="px-3">
                                  <div class="flex items-center">
                                    <textarea
                                      v-if="indexFocusDeliverAddress === index"
                                      :value="ad"
                                      rows="1"
                                      class="td-textarea"
                                      @input="
                                        updateAddress(
                                          index,
                                          $event.target.value
                                        )
                                      " />
                                    <div v-else class="flex items-center">
                                      {{ ad }}
                                    </div>
                                  </div>
                                </td>
                                <td class="px-3 pointer" title="Xóa">
                                  <div
                                    class="flex items-center justify-center"
                                    @click="
                                      () => onClickRemoveDeliverAddress(index)
                                    ">
                                    <div class="icon-v1 icon-v1--bin"></div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div class="grid-control-item">
                      <div class="pt-3">
                        <b-button
                          size="mini"
                          type="secondary"
                          title="Thêm dòng"
                          @click="onClickAddRowDeliverAddress" />
                        <b-button
                          size="mini"
                          type="secondary"
                          title="Xóa hết dòng"
                          @click="onClickRemoveAllDeliverAddress" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-show="tabContent === tabsContentValue.note"
                  class="tab-content description">
                  <div class="w-full h-full flex flex-col">
                    <label class="pb-1 no-pointer">Ghi chú</label>
                    <textarea
                      v-model="supplierInfo.Note"
                      maxlength="500"
                      class="textarea flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div
        class="popup__footer flex-row-reverse flex justify-between items-center p-4">
        <div class="popup-footer__right flex justify-center gap-0-8">
          <b-button
            ref="btnStore"
            class="btn--sub"
            title="Cất"
            type="secondary"
            size="mini"
            @keydown.enter="storeSupplier"
            @click="storeSupplier" />
          <b-button
            ref="btnStoreAndAdd"
            class="btn--pri"
            title="Cất và thêm"
            type="primary"
            size="mini"
            @keydown.enter="storeSupplier"
            @click="storeSupplier" />
        </div>
        <div class="popup-footer__left">
          <b-button
            ref="btnCancelRef"
            class="btn--sub"
            title="Hủy"
            type="secondary"
            size="mini"
            @keydown.enter="onClosePopup"
            @keydown="handleFocusFirst"
            @click="onClosePopup" />
        </div>
      </div>
    </div>
    <!-- <div ref="tmpTablIndex" :tabindex=" 1"></div> -->
  </div>
</template>
<script setup>
import {
  PopupType,
  MaxLength,
  SupplierType,
  TypeStore,
  DialogType,
  DialogAction,
  Vocative,
  AccountFeature,
  UserObject,
} from "@/enums";
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRef,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import BaseComboboxV1 from "@/components/bases/BaseComboboxV1.vue";
import BaseComboboxMulChoice from "@/components/bases/BaseComboboxMulChoice.vue";
import groupSupplierService from "@/api/services/groupSupplierService";
import employeeService from "@/api/services/employeeService";
import NumberInput from "@/components/bases/NumberInput.vue";

import { DialogContent, DialogTitle, ErrValidator } from "@/resources";
import supplier from "@/stores/supplier";
import {
  containsOnlyNumber,
  isValidEmail,
  removeEmptyFields,
  isValidDate,
} from "@/utils/helper";
import termPaymentService from "@/api/services/termPaymentService";
import accountService from "@/api/services/accountService";
import locationService from "@/api/services/locationService";
//------------ start state---------
const store = useStore();
const popupStatus = computed(() => store.state.global.popupStatus);
const supplierDetail = computed(() => store.state.supplier.supplierDetail);
const dialog = computed(() => store.state.global.dialog);
const supplierInfo = ref({});
// const dueTime = ref("");
const maxAccountOfDebt = ref("");
const errRefs = toRefs(
  reactive({
    TaxCode: null,
    SupplierCode: null,
    SupplierName: null,
    PhoneNumber: null,
    Email: null,
    MobilePhoneNumber: null,
    IdentityNumber: null,
    IdentityDate: null,
    PhoneNumberReceiverBill: null,
  })
);
const btnCancelRef = ref(null);
const errsValidate = computed(() => store.state.global.errsValidate);
const errsValidator = reactive(errsValidate.value);

const tabContent = ref(1);
const tabsContentValue = {
  contractInfo: 1,
  termPayment: 2,
  banksAccount: 3,
  otherAddress: 4,
  note: 5,
};
const dataGroupSuppliers = ref([]);
const fieldsGroupSuppliers = [
  {
    name: "GroupSupplierCode",
    label: "Mã nhóm KH, NCC",
    minWidth: 120,
    maxWidth: 160,
    title: "Mã nhóm khách hàng, nhà cung cấp",
  },
  {
    name: "GroupSupplierName",
    label: "Tên nhóm KH, NCC",
    minWidth: 200,
    maxWidth: 240,
    title: "Tên nhóm khách hàng, nhà cung cấp",
  },
];
const fieldSelectGroupSuppliers = "GroupSupplierId";
const fieldShowGroupSuppliers = "GroupSupplierCode";

const dataEmployees = ref([]);
const fieldsEmployee = [
  {
    name: "EmployeeCode",
    label: "Mã nhân viên",
    minWidth: 120,
    maxWidth: 160,
  },
  {
    name: "FullName",
    label: "Tên nhân viên",
    minWidth: 200,
    maxWidth: 240,
  },
];
const fieldSelectEmployee = "EmployeeId";
const fieldShowEmployee = "FullName";
const employeeSelected = ref({});
const pageEmployeeIndex = ref(0);

const dataTermPayments = ref([]);
const filedsTermPayment = [
  {
    name: "TermPaymentCode",
    label: "Mã điều khoản thanh toán",
    minWidth: 200,
    maxWidth: 240,
  },
  {
    name: "TermPaymentName",
    label: "Tên điều khoản thanh toán",
    minWidth: 200,
    maxWidth: 240,
  },
];
const fieldSelectTermPayment = "TermPaymentId";
const fieldShowTermPayment = "TermPaymentName";
const termPaymentSelected = ref({});
const pageTermPaymentIndex = ref(0);

const fieldsAccount = [
  {
    name: "AccountCode",
    label: "Số tài khoản",
    minWidth: 140,
    maxWidth: 160,
  },
  {
    name: "AccountName",
    label: "Tên tài khoản",
    minWidth: 200,
    maxWidth: 240,
  },
];
const fieldSelectAccount = "AccountId";
const fieldShowAccount = "AccountCode";
const dataAccountPayable = ref([]);
const accountPayableSelected = ref({});

const dataAccountReceivable = ref([]);

const accountReceivableSelected = ref({});

// location

const dataContries = ref([]);
const dataCities = ref([]);
const dataDistricts = ref([]);
const dataWards = ref([]);

//--
const indexFocusBankAccount = ref(0);
const indexFocusDeliverAddress = ref(0);
const vocatives = ref([...Vocative]);
//---
//----------- end state --------------

//---start lifecycle----
onBeforeMount(async () => {
  // fetch api groupsupliers
  try {
    let res = await groupSupplierService.getAll();
    if (res?.length > 0) {
      dataGroupSuppliers.value = [...res];
    }
  } catch (error) {
    console.log(error);
    dataGroupSuppliers.value = [];
  }

  // call employee by id
  if (supplierInfo?.value?.EmployeeId) {
    try {
      let res = await employeeService.getById(supplierInfo.value.EmployeeId);
      if (res) {
        employeeSelected.value = { ...res };
      }
    } catch (error) {
      console.log(error);
      employeeSelected.value = {};
    }
  }

  // call dieu khoan thanh toan theo id
  if (supplierInfo?.value?.TermPaymentId) {
    try {
      let termPayment = await termPaymentService.getById(
        supplierInfo.value.TermPaymentId
      );
      if (termPayment) {
        termPaymentSelected.value = { ...termPayment };
      }
    } catch (error) {
      console.log(error);
      termPaymentSelected.value = {};
    }
  }

  // tai khoan no theo id
  if (supplierInfo?.value?.AccountPayableId) {
    try {
      let accountPayable = await accountService.getById(
        supplierInfo.value.AccountPayableId
      );

      if (accountPayable) {
        accountPayableSelected.value = { ...accountPayable };
      }
    } catch (error) {
      console.log(error);
      accountPayableSelected.value = {};
    }
  }

  // tai khoan du theo id
  if (supplierInfo?.value?.AccountReceivableId) {
    try {
      let acoountReceivable = await accountService.getById(
        supplierInfo.value.AccountReceivableId
      );
      if (acoountReceivable) {
        accountReceivableSelected.value = { ...acoountReceivable };
      }
    } catch (error) {
      console.log(error);
      accountReceivableSelected.value = {};
    }
  }

  //call danh sach quoc gia
  try {
    let res = await locationService.getAllLocationByParentId();
    if (res?.length >= 0) {
      dataContries.value = [...res];
    }
  } catch (error) {
    console.log(error);
    dataContries.value = [];
  }

  if (supplierInfo?.value?.CountryId) {
    try {
      let res = await locationService.getAllLocationByParentId(
        supplierInfo.value.CountryId
      );
      if (res?.length >= 0) {
        dataCities.value = [...res];
      }
    } catch (error) {
      console.log(error);
      dataCities.value = [];
    }
  }
  if (supplierInfo?.value?.CityId) {
    try {
      let res = await locationService.getAllLocationByParentId(
        supplierInfo.value.CityId
      );
      if (res?.length >= 0) {
        dataDistricts.value = [...res];
      }
    } catch (error) {
      console.log(error);
      dataDistricts.value = [];
    }
  }
  if (supplierInfo?.value?.DistrictId) {
    try {
      let res = await locationService.getAllLocationByParentId(
        supplierInfo.value.DistrictId
      );
      if (res?.length >= 0) {
        dataWards.value = [...res];
      }
    } catch (error) {
      console.log(error);
      dataWards.value = [];
    }
  }
});
onMounted(() => {});
onBeforeUnmount(() => {});
// watchEffect(() => {
//   maxAccountOfDebt.value = Number(
//     supplierInfo?.value?.MaxAccountOfDebt ?? 0
//   ).toLocaleString();
// });

// watch(maxAccountOfDebt, () => {
//   supplierInfo.value.MaxAccountOfDebt = parseFloat(
//     maxAccountOfDebt.value.replace(/\./g, "")
//   );
// });

watchEffect(() => {
  supplierInfo.value = { ...supplierDetail.value };
});
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
      if (firstErr?.value) {
        nextTick(() => {
          firstErr.value.focus();
        });
      }
    }
  } else if (
    newValue.action === DialogAction.confirmCreate &&
    oldValue.action === DialogAction.confirmCreate
  ) {
    // storeAccount();
  } else if (
    newValue.action === DialogAction.confirmUpdate &&
    oldValue.action === DialogAction.confirmUpdate
  ) {
    // storeAccount();
  }
});

watchEffect(() => {
  if (supplierInfo?.value?.SupplierType === SupplierType.organization) {
    nextTick(() => {
      console.log(errRefs.TaxCode.value);
      if (errRefs.TaxCode.value) errRefs.TaxCode.value.focus();
    });
  } else {
    nextTick(() => {
      console.log(errRefs.SupplierCode.value);
      if (errRefs.SupplierCode.value) errRefs.SupplierCode.value.focus();
    });
  }
});

//---end lifecycle---

//--start methods----

// Truy cập vào ref dựa trên tên chuỗi
const accessRef = (refName) => {
  return errRefs[refName] ? errRefs[refName] : null;
};
const handleFocusLastOrganization = (e) => {
  if (e.shiftKey && e.key === "Tab") {
    e.preventDefault();

    btnCancelRef.value.focus();
  }
};
const handleFocusLastIndivial = (e) => {
  if (e.shiftKey && e.key === "Tab") {
    e.preventDefault();

    btnCancelRef.value.focus();
  }
};
const handleFocusFirst = (e) => {
  if (!e.shiftKey && e.key === "Tab") {
    e.preventDefault();
    if (supplierInfo.value?.SupplierType === SupplierType.individual) {
      errRefs.SupplierName.value.focus();
    } else {
      errRefs.TaxCode.value.focus();
    }
  }
};
/**
 * Mô tả: lazy load khi scroll employee
 * created by : vdtien
 * created date: 24-07-2023
 * @param {type} param -
 * @returns
 */
const loadDataEmployeeLazy = async (searchEmployee) => {
  try {
    // tang offset
    pageEmployeeIndex.value += 1;
    // call danh sach tai khoan tong hop
    let res = await employeeService.getList({
      keySearch: searchEmployee,
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

const loadDataEmployeeFilter = async (searchEmployee) => {
  try {
    // tang offset
    pageEmployeeIndex.value = 1;
    // call danh sach tai khoan tong hop
    let res = await employeeService.getList({
      keySearch: searchEmployee,
      pageSize: 10,
      pageNumber: pageEmployeeIndex.value,
    });

    if (res?.Data) {
      dataEmployees.value = [...res?.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

/**
 * Mô tả: termpayment
 * created by : vdtien
 * created date: 30-07-2023
 * @param {type} param -
 * @returns
 */
const loadDataTermPaymentLazy = async (termPaymentSearch) => {
  try {
    // tang offset
    pageTermPaymentIndex.value += 1;
    // call danh sach tai khoan tong hop
    let res = await termPaymentService.getList({
      keySearch: termPaymentSearch,
      pageSize: 10,
      pageNumber: pageTermPaymentIndex.value,
    });

    if (res?.Data?.length > 0) {
      dataTermPayments.value = [...dataTermPayments.value, ...res.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

const loadDataTermPaymentFilter = async (termPaymentSearch) => {
  try {
    // tang offset
    pageTermPaymentIndex.value = 1;
    // call danh sach tai khoan tong hop
    let res = await termPaymentService.getList({
      keySearch: termPaymentSearch,
      pageSize: 10,
      pageNumber: pageTermPaymentIndex.value,
    });

    if (res?.Data?.length >= 0) {
      dataTermPayments.value = [...res?.Data];
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};
const hanldeAddTermPaymentId = (termPayment) => {
  termPaymentSelected.value = { ...termPayment };
  // bind vao truong due time
  if (typeof termPayment === "object" && Object.keys(termPayment).length > 0) {
    supplierInfo.value.DueTime = termPayment?.DueTime ?? 0;
  }
};

const loadDataAccountPayable = async () => {
  try {
    let res = await accountService.getAllAccountQuery(
      [AccountFeature.debt, AccountFeature.combine],
      [UserObject.all, UserObject.supplier]
    );

    if (res?.length >= 0) {
      dataAccountPayable.value = [...res];
    }
  } catch (error) {
    console.log(error);
  }
};

const loadDataAccountReceivable = async () => {
  try {
    let res = await accountService.getAllAccountQuery(
      [AccountFeature.redundant, AccountFeature.combine],
      [UserObject.all, UserObject.supplier]
    );

    if (res?.length >= 0) {
      dataAccountReceivable.value = [...res];
    }
  } catch (error) {
    console.log(error);
  }
};

const handleChangeCountry = async (id) => {
  supplierInfo.value.CountryId = id;
  if (supplierInfo.value.CountryId) {
    supplierInfo.value.CityId = null;
    dataCities.value = [];
    supplierInfo.value.DistrictId = null;
    dataDistricts.value = [];
    supplierInfo.value.WardId = null;
    dataWards.value = [];
    // call danh sach cities
    try {
      let res = await locationService.getAllLocationByParentId(
        supplierInfo.value.CountryId
      );
      if (res?.length >= 0) {
        dataCities.value = [...res];
      }
    } catch (error) {
      console.log(error);
      dataCities.value = [];
    }
  }
};
const handleChangeCity = async (id) => {
  supplierInfo.value.CityId = id;
  if (supplierInfo.value.CityId) {
    supplierInfo.value.DistrictId = null;
    dataDistricts.value = [];
    supplierInfo.value.WardId = null;
    dataWards.value = [];
    // call danh sach cities
    try {
      let res = await locationService.getAllLocationByParentId(
        supplierInfo.value.CityId
      );
      if (res?.length >= 0) {
        dataDistricts.value = [...res];
      }
    } catch (error) {
      console.log(error);
      dataDistricts.value = [];
    }
  }
};
const handleChangeDistrict = async (id) => {
  supplierInfo.value.DistrictId = id;
  if (supplierInfo.value.DistrictId) {
    supplierInfo.value.WardId = null;
    dataWards.value = [];
    // call danh sach cities
    try {
      let res = await locationService.getAllLocationByParentId(
        supplierInfo.value.DistrictId
      );
      if (res?.length >= 0) {
        dataWards.value = [...res];
      }
    } catch (error) {
      console.log(error);
      dataWards.value = [];
    }
  }
};

const updateAddress = (index, value) => {
  if (supplierInfo?.value?.DeliverAddress?.length >= index) {
    supplierInfo.value.DeliverAddress[index] = value;
  }
};
const handleToggleSameSupplierAddress = () => {
  if (supplierInfo?.value?.IsSameSupplierAddress) {
    supplierInfo.value.IsSameSupplierAddress = 0;
  } else {
    supplierInfo.value.IsSameSupplierAddress = 1;
  }
  if (
    supplierInfo.value?.DeliverAddress?.length >= 0 &&
    supplierInfo.value.IsSameSupplierAddress === 1
  ) {
    supplierInfo.value.DeliverAddress = [];
    supplierInfo.value.DeliverAddress.push(supplierInfo.value?.Address ?? "");
  }
};
const onClickRemoveDeliverAddress = (index) => {
  if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
    supplierInfo.value.DeliverAddress.splice(index, 1);
    indexFocusDeliverAddress.value =
      supplierInfo.value.DeliverAddress.length - 1;
  }
};
const onClickAddRowDeliverAddress = () => {
  if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
    supplierInfo.value.DeliverAddress.push("");
    indexFocusDeliverAddress.value =
      supplierInfo.value.DeliverAddress.length - 1;
  }
};
const onClickRemoveAllDeliverAddress = () => {
  if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
    supplierInfo.value.DeliverAddress = [];
  }
};
const onClickTabContent = (index) => {
  tabContent.value = index;
};
const onClickRemoveBank = (index) => {
  if (supplierInfo?.value?.BanksAccount?.length > 0) {
    supplierInfo.value.BanksAccount.splice(index, 1);
    indexFocusBankAccount.value = supplierInfo.value.BanksAccount.length - 1;
  }
};
const onClickAddRowBank = () => {
  if (supplierInfo?.value?.BanksAccount?.length >= 0) {
    const lastEl =
      supplierInfo.value.BanksAccount[
        supplierInfo.value.BanksAccount.length - 1
      ];
    const _lastEl = removeEmptyFields({ ...lastEl });
    if (Object.keys(_lastEl).length > 0) {
      supplierInfo.value.BanksAccount.push({});
      indexFocusBankAccount.value = supplierInfo.value.BanksAccount.length - 1;
    }
  } else supplierInfo.value.BanksAccount = [{}];
};
const onClickRemoveAllBank = () => {
  if (supplierInfo?.value?.BanksAccount?.length >= 0) {
    supplierInfo.value.BanksAccount = [];
  }
};

const onClosePopup = () => {
  // kiểm tra có sự thay đổi không
  supplierInfo.value = removeEmptyFields(supplierInfo.value);
  if (
    JSON.stringify(supplierInfo.value) !== JSON.stringify(supplierDetail.value)
  ) {
    if (popupStatus.value.type === PopupType.create) {
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.info,
        title: DialogTitle.store,
        content: [DialogContent.confirmStore],
        action: DialogAction.confirmCreate,
      });
    } else if (popupStatus.value.type === PopupType.update) {
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.info,
        title: DialogTitle.store,
        content: [DialogContent.confirmStore],
        action: DialogAction.confirmUpdate,
      });
    } else {
      store.dispatch("getPopupStatus", {
        isShowPopup: false,
        type: "",
      });
      store.dispatch("getEmployeeDetail");
    }
  } else {
    store.dispatch("getPopupStatus", {
      isShowPopup: false,
      type: "",
    });
    store.dispatch("getEmployeeDetail");
  }
};

const validateSupplier = () => {
  // xóa lỗi trước đó
  // Xóa tất cả các trường của reactive object
  Object.keys(errsValidator).forEach((key) => {
    delete errsValidator[key];
  });
  // store.dispatch("getErrsValidate", {});

  // check mã nhà cung cấp trống
  const isSupplierCodeEmpty = !supplierInfo?.value?.SupplierCode?.trim();
  if (isSupplierCodeEmpty) {
    errsValidator.SupplierCode = [
      ...(errsValidator?.SupplierCode ?? []),
      ErrValidator.fieldEmplty("Mã nhà cung cấp"),
    ];
  }

  // check tên nhà cung cấp trống
  const isSupplierNameEmpty = !(supplierInfo?.value?.SupplierName ?? "").trim();
  if (isSupplierNameEmpty) {
    errsValidator.SupplierName = [
      ...(errsValidator?.SupplierName ?? []),
      ErrValidator.fieldEmplty("Tên nhà cung cấp"),
    ];
  }

  if (supplierInfo?.value?.SupplierType === SupplierType.organization) {
    // check điện thoại chỉ chứa số
    const isPhoneNumberNotEmpty = (
      supplierInfo.value?.PhoneNumber ?? ""
    ).trim();
    if (isPhoneNumberNotEmpty) {
      if (!containsOnlyNumber(supplierInfo.value.PhoneNumber)) {
        errsValidator.PhoneNumber = [
          ...(errsValidator?.PhoneNumber ?? []),
          ErrValidator.containsOnlyNumber("Số điện thoại cố định"),
        ];
      }
    }
    // check email đúng định dạng
    const isEmailNotEmpty = (
      supplierInfo.value?.ContractInfor?.Email ?? ""
    ).trim();
    if (isEmailNotEmpty) {
      if (!isValidEmail(supplierInfo.value.ContractInfor.Email)) {
        errsValidator.Email = [
          ...(errsValidator?.Email ?? []),
          ErrValidator.email,
        ];
      }
    }

    // check số điện thoại di động đúng định dạng
    const isMobilePhoneNumberNotEmpty = (
      supplierInfo.value?.ContractInfor?.PhoneNumber ?? ""
    ).trim();
    if (isMobilePhoneNumberNotEmpty) {
      if (!containsOnlyNumber(supplierInfo.value.ContractInfor.PhoneNumber)) {
        errsValidator.MobilePhoneNumber = [
          ...(errsValidator?.MobilePhoneNumber ?? []),
          ErrValidator.containsOnlyNumber("Số điện thoại di động"),
        ];
      }
    }

    if (supplierInfo?.value?.IsCustomer) {
      // số điện thoại người nhận hóa đơn

      const isPhoneNumberReceiverBillNotEmpty = (
        supplierInfo.value?.ContractInfor?.PhoneNumber ?? ""
      ).trim();
      if (isPhoneNumberReceiverBillNotEmpty) {
        if (
          !containsOnlyNumber(
            supplierInfo.value.ContractInfor.PhoneNumberReceiverBill
          )
        ) {
          errsValidator.PhoneNumberReceiverBill = [
            ...(errsValidator?.PhoneNumberReceiverBill ?? []),
            ErrValidator.containsOnlyNumber("Số điện thoại người nhận hóa đơn"),
          ];
        }
      }
    }
  } else if (supplierInfo?.value?.SupplierType === SupplierType.individual) {
    // check email đúng định dạng
    const isEmailNotEmpty = (
      supplierInfo.value?.ContractInfor?.Email ?? ""
    ).trim();
    if (isEmailNotEmpty) {
      if (!isValidEmail(supplierInfo.value.ContractInfor.Email)) {
        errsValidator.Email = [
          ...(errsValidator?.Email ?? []),
          ErrValidator.email,
        ];
      }
    }

    // check điện thoại chỉ chứa số
    const isPhoneNumberNotEmpty = (
      supplierInfo.value?.PhoneNumber ?? ""
    ).trim();
    if (isPhoneNumberNotEmpty) {
      if (!containsOnlyNumber(supplierInfo.value.PhoneNumber)) {
        errsValidator.PhoneNumber = [
          ...(errsValidator?.PhoneNumber ?? []),
          ErrValidator.containsOnlyNumber("Số điện thoại cố định"),
        ];
      }
    }

    // check số điện thoại di động đúng định dạng
    const isMobilePhoneNumberNotEmpty = (
      supplierInfo.value?.ContractInfor?.PhoneNumber ?? ""
    ).trim();
    if (isMobilePhoneNumberNotEmpty) {
      if (!containsOnlyNumber(supplierInfo.value.ContractInfor.PhoneNumber)) {
        errsValidator.MobilePhoneNumber = [
          ...(errsValidator?.MobilePhoneNumber ?? []),
          ErrValidator.containsOnlyNumber("Số điện thoại di động"),
        ];
      }
    }

    // số căn cước chỉ chứa số
    const isIdentityNumberNotEmpty = (
      supplierInfo.value?.ContractInfor?.IdentityNumber ?? ""
    ).trim();
    if (isIdentityNumberNotEmpty) {
      if (
        !containsOnlyNumber(supplierInfo.value.ContractInfor.IdentityNumber)
      ) {
        errsValidator.IdentityNumber = [
          ...(errsValidator?.IdentityNumber ?? []),
          ErrValidator.containsOnlyNumber("Số chứng minh nhân dân"),
        ];
      }
    }

    // check ngày cấp không lớn hơn ngày hiện tại
    const isIdentityDateNotEmpty = (
      supplierInfo.value?.ContractInfor?.IdentityDate ?? ""
    ).trim();
    if (isIdentityDateNotEmpty) {
      if (!isValidDate) {
        errsValidator.IdentityDate = [
          ...(errsValidator?.IdentityDate ?? []),
          ErrValidator.malformed("Ngày cấp"),
        ];
      } else {
        let currentDate = new Date().getTime();
        let dof = Date.parse(supplierInfo.value.ContractInfor.IdentityDate);
        if (dof > currentDate) {
          errsValidator.IdentityDate = [
            ...(errsValidator?.IdentityDate ?? []),
            ErrValidator.identityDateRelease,
          ];
        }
      }
    }
  }

  // Kiểm tra xem reactive object có rỗng hay không
  const isEmpty = Object.keys(errsValidator).length === 0;
  if (isEmpty) {
    return true;
  } else {
    const errMsgArray = Object.values(errsValidator).flat();
    // console.log(errMsgArray);
    store.dispatch("getErrsValidate", { ...errsValidator });
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

const storeSupplier = () => {
  console.log("something");
  let isValid = validateSupplier();
  if (isValid && popupStatus.value.type === PopupType.create) {
    // lưu thông tin nhân viên
    store.dispatch("createSupplier", {
      supplier: supplierInfo.value,
      typeStore: TypeStore.store,
    });
  } else if (isValid && popupStatus.value.type === PopupType.update) {
    // sửa thông tin nhân viên
    store.dispatch("updateSupplier", {
      supplier: supplierInfo.value,
      typeStore: TypeStore.store,
    });
  }
  // có lỗi thì không làm gì cả
};
//---end methods----
</script>
<style scoped>
@import url("./SupplierDetail.css");
.description .textarea {
  min-height: 160px;
  margin-top: 0;
}
</style>
