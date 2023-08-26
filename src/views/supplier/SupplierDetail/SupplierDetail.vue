<template>
  <div
    ref="supplierDetailRef"
    class="popup-wrapper outline-none"
    :tabindex="0"
    @keydown.stop="handleKeydownWrapper">
    <div class="popup-container flex flex-col">
      <div class="popup__header flex items-center">
        <div class="popup-header__title">
          {{
            popupStatus?.type === PopupType.create
              ? FreeText.addSupplier
              : FreeText.editSupplier
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
            <span> {{ FreeText.isCustomer }} </span>
          </label>
        </div>
        <div class="popup-header__actions flex items-center ml-auto">
          <div class="popup-header-actions__question mr-2">
            <div class="icon-wrapper" :title="FreeText.helpF1">
              <div class="icon icon--question"></div>
            </div>
          </div>
          <div
            ref="btnClose"
            class="popup-header-actions__close"
            :title="FreeText.closeEsc"
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
                      :label="FreeText.taxCode"
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
                      :label="FreeText.supplierCode"
                      :max-length="MaxLength.code - 2"
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
                      :label="FreeText.supplierCode"
                      :max-length="MaxLength.code - 2"
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
                      :label="FreeText.taxCode"
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
                  :label="FreeText.supplierName"
                  :max-length="MaxLength.name"
                  :err-msg="errsValidator?.SupplierName?.join('') ?? ''"
                  @empty-err-msg="
                    () => {
                      delete errsValidator.SupplierName;
                    }
                  " />

                <label
                  v-if="supplierInfo?.SupplierType === SupplierType.individual"
                  class="flex flex-col justify-center">
                  <span class="pb-2"
                    >{{ FreeText.supplierName }}
                    <span class="text-red">(*)</span></span
                  >
                  <div class="flex items-center justify-start w-full">
                    <div class="w-2/5 pr-2">
                      <b-combobox
                        :data-list="vocatives"
                        field-select="id"
                        field-show="value"
                        :place-holder="FreeText.vocative"
                        :max-length="MaxLength.default"
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
                  {{ FreeText.address }}
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
                    :max-length="MaxLength.phoneNumber"
                    :label="FreeText.phone"
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
                    :max-length="MaxLength.default"
                    :label="FreeText.website" />
                </div>
              </div>
              <div class="w-full pb-2">
                <BaseComboboxMulChoice
                  add
                  :label="FreeText.groupSupplier"
                  :fields="fieldsGroupSuppliers"
                  :field-select="fieldSelectGroupSuppliers"
                  :field-show="fieldShowGroupSuppliers"
                  :data-list="dataGroupSuppliers"
                  :max-length="MaxLength.name"
                  :ids-selected="supplierInfo.GroupSuppliersId"
                  @on-click-ids-selected="
                    (idsSelected) =>
                      (supplierInfo.GroupSuppliersId = [...idsSelected])
                  "
                  @keydown.tab.stop="" />
              </div>
              <div class="w-full">
                <BaseComboboxV1
                  :label="FreeText.employeeBuy"
                  add
                  :max-length="MaxLength.name"
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
                    <div class="text-center no-wrap">
                      {{ FreeText.contractInfo }}
                    </div>
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
                    <div class="text-center no-wrap">
                      {{ FreeText.termPayment }}
                    </div>
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
                    <div class="text-center no-wrap">
                      {{ FreeText.bankAccount }}
                    </div>
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
                    <div class="text-center no-wrap">
                      {{ FreeText.addressOther }}
                    </div>
                  </div>
                </li>
                <li
                  class="tabs-li flex"
                  :class="{
                    'active-item': tabContent === tabsContentValue.note,
                  }"
                  @click="() => onClickTabContent(tabsContentValue.note)">
                  <div class="tabs-btn">
                    <div class="text-center no-wrap">{{ FreeText.note }}</div>
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
                      <label class="pb-2">{{ FreeText.contract }}</label>
                      <div class="flex items-center justify-center pb-2">
                        <div class="w-2/5 pr-2">
                          <b-combobox
                            :max-length="MaxLength.name"
                            :data-list="vocatives"
                            field-select="id"
                            field-show="value"
                            :place-holder="FreeText.vocative"
                            :id-selected="supplierInfo.ContractInfor.Vocative"
                            @on-click-id-selected="
                              (id) => (supplierInfo.ContractInfor.Vocative = id)
                            "
                            @keydown.tab.stop="" />
                        </div>
                        <div class="w-3/5">
                          <b-textfield
                            v-model="supplierInfo.ContractInfor.Fullname"
                            :max-length="MaxLength.name"
                            :place-holder="FreeText.fullname" />
                        </div>
                      </div>
                      <div class="w-full pb-2">
                        <b-textfield
                          :ref="errRefs.Email"
                          v-model="supplierInfo.ContractInfor.Email"
                          :max-length="MaxLength.email"
                          :place-holder="FreeText.email"
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
                          :max-length="MaxLength.phoneNumber"
                          :place-holder="FreeText.phone"
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
                      <label class="pb-2">{{ FreeText.contractInfo }}</label>

                      <div class="w-full pb-2">
                        <b-textfield
                          :ref="errRefs.Email"
                          v-model="supplierInfo.ContractInfor.Email"
                          :max-length="MaxLength.email"
                          :place-holder="FreeText.email"
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
                            :max-length="MaxLength.phoneNumber"
                            :place-holder="FreeText.mobilePhone"
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
                            :max-length="MaxLength.phoneNumber"
                            :place-holder="FreeText.landlinePhone"
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
                        :max-length="MaxLength.default"
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
                        :max-length="MaxLength.default"
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
                          :max-length="MaxLength.name"
                          place-holder="Họ và tên" />
                      </div>
                      <div class="w-full pb-2">
                        <b-textfield
                          v-model="supplierInfo.ContractInfor.EmailReceiverBill"
                          :max-length="MaxLength.default"
                          place-holder='Email (Ngăn cách nhiều Email bằng dấu ";"")' />
                      </div>
                      <div class="w-1/2">
                        <b-textfield
                          :ref="errRefs.PhoneNumberReceiverBill"
                          v-model="
                            supplierInfo.ContractInfor.PhoneNumberReceiverBill
                          "
                          :max-length="MaxLength.phoneNumber"
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
                          :max-length="MaxLength.identity"
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
                          :max-length="MaxLength.default"
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
                  v-show="tabContent === tabsContentValue.banksAccount"
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
                                  <span class="flex-1 pr-5 pl-3">{{
                                    FreeText.bankAccountNumber
                                  }}</span>
                                </div>
                              </th>
                              <th
                                style="
                                  min-width: 200px;
                                  width: 200px;
                                  top: 0px;
                                ">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3">{{
                                    FreeText.bankAccountName
                                  }}</span>
                                </div>
                              </th>
                              <th
                                style="
                                  min-width: 180px;
                                  width: 180px;
                                  top: 0px;
                                ">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3">{{
                                    FreeText.branch
                                  }}</span>
                                </div>
                              </th>
                              <th style="min-width: 200px; top: 0px">
                                <div class="flex items-center text-left">
                                  <span class="flex-1 pr-5 pl-3">{{
                                    FreeText.cityBank
                                  }}</span>
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
                                  <b-textfield
                                    :ref="banksRef[index]"
                                    v-model="bank.BankAccountNumber"
                                    :max-length="MaxLength.phoneNumber"
                                    :err-msg="
                                      errsValidator?.BanksAccount?.length > 0 &&
                                      errsValidator?.BanksAccount?.[index]
                                        ?.length > 0
                                        ? errsValidator?.BanksAccount?.[
                                            index
                                          ].join('')
                                        : ''
                                    "
                                    @empty-err-msg="
                                      () => {
                                        if (
                                          errsValidator?.BanksAccount?.length >=
                                          0
                                        )
                                          errsValidator.BanksAccount[index] =
                                            '';
                                      }
                                    " />
                                </div>
                              </td>
                              <td class="px-3">
                                <div class="flex items-center">
                                  <b-textfield
                                    v-model="bank.BankName"
                                    :max-length="MaxLength.default" />
                                </div>
                              </td>
                              <td class="px-3">
                                <div class="flex items-center">
                                  <b-textfield
                                    v-model="bank.BankBranch"
                                    :max-length="MaxLength.default" />
                                </div>
                              </td>
                              <td class="px-3">
                                <div class="flex items-center">
                                  <b-textfield
                                    v-model="bank.BankCity"
                                    :max-length="MaxLength.default" />
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
                        :title="FreeText.addRow"
                        @click="onClickAddRowBank" />
                      <b-button
                        size="mini"
                        type="secondary"
                        :title="FreeText.deleteAllRow"
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
                                      :maxlength="MaxLength.default"
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
            @keydown.enter="storeSupplierAndAdd"
            @click="storeSupplierAndAdd" />
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
  ErrCode,
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

import {
  DialogContent,
  DialogTitle,
  ErrValidator,
  FreeText,
} from "@/resources";
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
const supplierDetailRef = ref(null);
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
const banksRef = ref([]);
const btnCancelRef = ref(null);
const errsValidate = computed(() => store.state.global.errsValidate);
const errsValidator = ref({});

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
    class: "mw-120 w-160 Mw-160",

    title: "Mã nhóm khách hàng, nhà cung cấp",
  },
  {
    name: "GroupSupplierName",
    label: "Tên nhóm KH, NCC",
    class: "mw-240 w-240 Mw-240",

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

    class: "mw-160 w-160 Mw-160",
  },
  {
    name: "FullName",
    label: "Tên nhân viên",
    class: "mw-200 w-200 Mw-200",
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
    class: "mw-200 w-200 Mw-200",
  },
  {
    name: "TermPaymentName",
    label: "Tên điều khoản thanh toán",
    class: "mw-200 w-200 Mw-200",
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
    class: "mw-130 w-130 Mw-130",
  },
  {
    name: "AccountName",
    label: "Tên tài khoản",
    class: "mw-200 w-200 Mw-200",
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

watchEffect(() => {
  errsValidator.value = structuredClone(errsValidate.value);
});

watchEffect(() => {
  supplierInfo.value = { ...structuredClone(supplierDetail.value) };
});
watchEffect(() => {
  if (supplierInfo.value?.BanksAccount?.length) {
    banksRef.value = supplierInfo.value?.BanksAccount.map(() => ref(null));
  }
});
// bắt sự thay đổi của dialog
watch(dialog, (newValue, oldValue) => {
  // ???
  // const isEmpty = Object.keys(dialog.value).length === 0;
  if (
    (oldValue.type === DialogType.error &&
      oldValue.action === DialogAction.confirmValidate) ||
    oldValue.errorCode === ErrCode.badRequest
  ) {
    // Lấy phần tử đầu tiên của danh sách
    // console.log(errsValidate.value);
    const firstKey = Object.keys(errsValidator.value)[0];
    // console.log("firstKey:", firstKey);
    if (firstKey) {
      const firstErr = accessRef(firstKey);
      if (firstErr) {
        nextTick(() => {
          firstErr.focus();
        });
      }
    }
  } else if (
    newValue.action === DialogAction.confirmCreate &&
    oldValue.action === DialogAction.confirmCreate
  ) {
    storeSupplier();
  } else if (
    newValue.action === DialogAction.confirmUpdate &&
    oldValue.action === DialogAction.confirmUpdate
  ) {
    storeSupplier();
  } else if (
    newValue.action === DialogAction.confirmRemoveAllBankAccounts &&
    oldValue.action === DialogAction.confirmRemoveAllBankAccounts
  ) {
    if (supplierInfo?.value?.BanksAccount?.length >= 0) {
      supplierInfo.value.BanksAccount = [];
    }
  } else if (
    newValue.action === DialogAction.confirmRemoveAllDelivery &&
    oldValue.action === DialogAction.confirmRemoveAllDelivery
  ) {
    if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
      supplierInfo.value.DeliverAddress = [];
      supplierInfor.value.IsSameSupplierAddress = 0;
    }
  } else {
    if (supplierInfo.value.SupplierType === SupplierType.organization) {
      errRefs.TaxCode.value.focus();
    } else {
      errRefs.SupplierCode.value.focus();
    }
  }

  // if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
  //   supplierInfo.value.DeliverAddress = [];
  // }
});

watchEffect(() => {
  if (supplierInfo?.value?.SupplierType === SupplierType.organization) {
    nextTick(() => {
      if (errRefs.TaxCode.value) errRefs.TaxCode.value.focus();
    });
  } else {
    nextTick(() => {
      if (errRefs.SupplierCode.value) errRefs.SupplierCode.value.focus();
    });
  }
});
watch(
  () => supplierInfo.value.Address,
  (newValue, oldValue) => {
    if (
      supplierInfo.value.IsSameSupplierAddress &&
      supplierInfo.value?.DeliverAddress?.length > 0
    ) {
      const length = supplierInfo.value.DeliverAddress.length;
      for (let index = 0; index < length; index++) {
        if (supplierInfo.value.DeliverAddress[index] === oldValue) {
          supplierInfo.value.DeliverAddress[index] = newValue;
        }
      }
    }
  }
);

//---end lifecycle---

//--start methods----

/**
 * Mô tả: bắt sự kiện keydowm của popup wrapper
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const handleKeydownWrapper = (e) => {
  // console.log(e.which);
  if (e.which === 27) {
    onClosePopup();
  } else if (e.ctrlKey && (e.which === 115 || e.which === 83)) {
    e.preventDefault();
    storeSupplier();
  }
};

// Truy cập vào ref dựa trên tên chuỗi
const accessRef = (refName) => {
  if (errRefs?.[refName]?.value) {
    return errRefs[refName].value;
  } else if (refName === "BanksAccount") {
    let index = -1;
    for (let i = 0; i < errsValidator.value?.BanksAccount?.length; i++) {
      if (errsValidator.value?.BanksAccount?.[i]?.length) {
        index = i;
        break;
      }
    }
    if (banksRef.value?.[index]?.value?.[0]) {
      tabContent.value = tabsContentValue.banksAccount;
      nextTick(() => {});
      return banksRef.value?.[index]?.value?.[0];
    }
  }
  return null;
};

/**
 * Mô tả: tab index khi là tổ chức
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const handleFocusLastOrganization = (e) => {
  if (e.shiftKey && e.key === "Tab") {
    e.preventDefault();

    btnCancelRef.value.focus();
  }
};

/**
 * Mô tả: tab index khi là cá nhân
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const handleFocusLastIndivial = (e) => {
  if (e.shiftKey && e.key === "Tab") {
    e.preventDefault();

    btnCancelRef.value.focus();
  }
};

/**
 * Mô tả: tabindex từ cuối lên đầu
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: lấy danh sách nhân viên theo từ khóa
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: load điều khoản thanh toán
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: khi chọn điều khoản thanh toán
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const hanldeAddTermPaymentId = (termPayment) => {
  termPaymentSelected.value = { ...termPayment };
  // bind vao truong due time
  if (typeof termPayment === "object" && Object.keys(termPayment).length > 0) {
    supplierInfo.value.DueTime = termPayment?.DueTime ?? 0;
  }
};

/**
 * Mô tả: tài khoản nợ
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: tài khoản có
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: xử lý khi chọn đất nước
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: xử lý khi chọn tỉnh/ thành phố
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: xử lý khi chọn quận huyện
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả:
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const updateAddress = (index, value) => {
  if (supplierInfo?.value?.DeliverAddress?.length >= index) {
    supplierInfo.value.DeliverAddress[index] = value;
  }
};

/**
 * Mô tả: giống địa chỉ giao hàng
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
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

/**
 * Mô tả: xóa 1 địa chỉ giao hàng
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const onClickRemoveDeliverAddress = (index) => {
  if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
    supplierInfo.value.DeliverAddress.splice(index, 1);
    indexFocusDeliverAddress.value =
      supplierInfo.value.DeliverAddress.length - 1;

    if (index == 0) supplierInfo.value.IsSameSupplierAddress = 0;
  }
};

/**
 * Mô tả: thêm địa chỉ giao hàng
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const onClickAddRowDeliverAddress = () => {
  if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
    supplierInfo.value.DeliverAddress.push("");
    indexFocusDeliverAddress.value =
      supplierInfo.value.DeliverAddress.length - 1;
  }
};

/**
 * Mô tả: xóa tất cả địa chỉ giao hàng
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const onClickRemoveAllDeliverAddress = () => {
  store.dispatch("getDialog", {
    isShow: true,
    type: DialogType.warning,
    title: DialogTitle.notify,
    content: [DialogContent.removeAllRow],
    action: DialogAction.confirmRemoveAllDelivery,
  });
  // if (supplierInfo?.value?.DeliverAddress?.length >= 0) {
  //   supplierInfo.value.DeliverAddress = [];
  // }
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
  if (supplierInfo?.value?.BanksAccount?.length > 0) {
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
  store.dispatch("getDialog", {
    isShow: true,
    type: DialogType.warning,
    title: DialogTitle.notify,
    content: [DialogContent.removeAllRow],
    action: DialogAction.confirmRemoveAllBankAccounts,
  });
  // if (supplierInfo?.value?.BanksAccount?.length >= 0) {
  //   supplierInfo.value.BanksAccount = [];
  // }
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

/**
 * Mô tả: validate input nhà cung cấp
 * created by : vdtien
 * created date: 25-08-2023
 * @param {type} param -
 * @returns
 */
const validateSupplier = () => {
  // xóa lỗi trước đó
  // Xóa tất cả các trường của reactive object
  Object.keys(errsValidator.value).forEach((key) => {
    delete errsValidator.value[key];
  });
  // store.dispatch("getErrsValidate", {});

  // check mã nhà cung cấp trống
  const isSupplierCodeEmpty = !supplierInfo?.value?.SupplierCode?.trim();
  if (isSupplierCodeEmpty) {
    errsValidator.value.SupplierCode = [
      ...(errsValidator.value?.SupplierCode ?? []),
      ErrValidator.fieldEmplty(FreeText.supplierCode),
    ];
  }

  // check tên nhà cung cấp trống
  const isSupplierNameEmpty = !(supplierInfo?.value?.SupplierName ?? "").trim();
  if (isSupplierNameEmpty) {
    errsValidator.value.SupplierName = [
      ...(errsValidator.value?.SupplierName ?? []),
      ErrValidator.fieldEmplty(FreeText.supplierName),
    ];
  }

  if (supplierInfo?.value?.SupplierType === SupplierType.organization) {
    // check điện thoại chỉ chứa số
    const isPhoneNumberNotEmpty = (
      supplierInfo.value?.PhoneNumber ?? ""
    ).trim();
    if (isPhoneNumberNotEmpty) {
      if (!containsOnlyNumber(supplierInfo.value.PhoneNumber)) {
        errsValidator.value.PhoneNumber = [
          ...(errsValidator.value?.PhoneNumber ?? []),
          ErrValidator.containsOnlyNumber(FreeText.landlinePhone),
        ];
      }
    }
    // check email đúng định dạng
    const isEmailNotEmpty = (
      supplierInfo.value?.ContractInfor?.Email ?? ""
    ).trim();
    if (isEmailNotEmpty) {
      if (!isValidEmail(supplierInfo.value.ContractInfor.Email)) {
        errsValidator.value.Email = [
          ...(errsValidator.value?.Email ?? []),
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
        errsValidator.value.MobilePhoneNumber = [
          ...(errsValidator.value?.MobilePhoneNumber ?? []),
          ErrValidator.containsOnlyNumber(FreeText.mobilePhone),
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
          errsValidator.value.PhoneNumberReceiverBill = [
            ...(errsValidator.value?.PhoneNumberReceiverBill ?? []),
            ErrValidator.containsOnlyNumber(FreeText.phoneReceiverBill),
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
        errsValidator.value.Email = [
          ...(errsValidator.value?.Email ?? []),
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
        errsValidator.value.PhoneNumber = [
          ...(errsValidator.value?.PhoneNumber ?? []),
          ErrValidator.containsOnlyNumber(FreeText.landlinePhone),
        ];
      }
    }

    // check số điện thoại di động đúng định dạng
    const isMobilePhoneNumberNotEmpty = (
      supplierInfo.value?.ContractInfor?.PhoneNumber ?? ""
    ).trim();
    if (isMobilePhoneNumberNotEmpty) {
      if (!containsOnlyNumber(supplierInfo.value.ContractInfor.PhoneNumber)) {
        errsValidator.value.MobilePhoneNumber = [
          ...(errsValidator.value?.MobilePhoneNumber ?? []),
          ErrValidator.containsOnlyNumber(FreeText.mobilePhone),
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
        errsValidator.value.IdentityNumber = [
          ...(errsValidator.value?.IdentityNumber ?? []),
          ErrValidator.containsOnlyNumber(FreeText.identityNumber),
        ];
      }
    }

    // check ngày cấp không lớn hơn ngày hiện tại
    const isIdentityDateNotEmpty = (
      supplierInfo.value?.ContractInfor?.IdentityDate ?? ""
    ).trim();
    if (isIdentityDateNotEmpty) {
      if (!isValidDate) {
        errsValidator.value.IdentityDate = [
          ...(errsValidator.value?.IdentityDate ?? []),
          ErrValidator.malformed(FreeText.identityDate),
        ];
      } else {
        let currentDate = new Date().getTime();
        let dof = Date.parse(supplierInfo.value.ContractInfor.IdentityDate);
        if (dof > currentDate) {
          errsValidator.value.IdentityDate = [
            ...(errsValidator.value?.IdentityDate ?? []),
            ErrValidator.identityDateRelease,
          ];
        }
      }
    }
  }
  const length = supplierInfo.value?.BanksAccount?.length;
  if (length > 0) {
    const seenNumbers = new Set();
    const duplicateNumbers = [];
    errsValidator.value.BanksAccount = [];
    for (let index = 0; index < length; index++) {
      const element = supplierInfo.value?.BanksAccount?.[index];
      const isBanhAccountNumberNotEmpty = (
        element?.BankAccountNumber ?? ""
      ).trim();
      if (
        isBanhAccountNumberNotEmpty &&
        !containsOnlyNumber(element?.BankAccountNumber)
      ) {
        errsValidator.value.BanksAccount[index] = [
          ...(errsValidator.value?.BanksAccount[index] ?? []),
          ErrValidator.containsOnlyNumber(FreeText.bankAccountNumber),
        ];
      } else if (
        isBanhAccountNumberNotEmpty &&
        containsOnlyNumber(element?.BankAccountNumber)
      ) {
        // check trùng số tài khoản

        if (seenNumbers.has(element.BankAccountNumber)) {
          duplicateNumbers.push(element.BankAccountNumber);
        } else {
          seenNumbers.add(element.BankAccountNumber);
        }
      }
    }

    for (
      let index = 0;
      index < supplierInfo.value.BanksAccount.length;
      index++
    ) {
      const element = supplierInfo.value.BanksAccount[index] ?? "";
      if (duplicateNumbers.includes(element.BankAccountNumber)) {
        errsValidator.value.BanksAccount[index] = [
          ...(errsValidator.value?.BanksAccount[index] ?? []),
          ErrValidator.dupBankAccountNumber(element.BankAccountNumber),
        ];
      }
    }
    if (errsValidator.value.BanksAccount.length === 0) {
      delete errsValidator.value.BanksAccount;
    }
  }

  // Kiểm tra xem reactive object có rỗng hay không
  const isEmpty = Object.keys(errsValidator.value).length === 0;
  if (isEmpty) {
    return true;
  } else {
    // Làm phẳng mảng
    const flatArray = (errsValidator.value.BanksAccount ?? []).flat();

    // Sử dụng Set để loại bỏ phần tử trùng lặp
    const uniqueFlatArray = [...new Set(flatArray)];

    let tmpErrsMsg = uniqueFlatArray.length
      ? {
          ...errsValidator.value,
          BanksAccount: uniqueFlatArray,
        }
      : {
          ...errsValidator.value,
        };

    const errMsgArray = Object.values(tmpErrsMsg).flat();
    // console.log(errMsgArray);
    // store.dispatch("getErrsValidate", { ...errsValidator.value });
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
  // console.log("something");
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

const storeSupplierAndAdd = () => {
  let isValid = validateSupplier();
  if (isValid && popupStatus.value.type === PopupType.create) {
    // lưu thông tin nhân viên
    store.dispatch("createSupplier", {
      supplier: supplierInfo.value,
      typeStore: TypeStore.storeAndAdd,
    });
  } else if (isValid && popupStatus.value.type === PopupType.update) {
    // sửa thông tin nhân viên
    store.dispatch("updateSupplier", {
      supplier: supplierInfo.value,
      typeStore: TypeStore.storeAndAdd,
    });
  }
};

//---end methods----
</script>
<style scoped>
.tabs-li {
  height: 24px;
  margin: 0 1px;
  border: 1px solid #c9ccd2;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
}

.tabs-li.active-item {
  background: #cce4f9;
  height: 28px;
}

.tabs-btn {
  position: relative;
  width: 100%;
  background: 0 0;
  border: 0;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 0;
  font-size: 13px;
  border-radius: unset !important;
  height: 100%;
  margin: 0;
  padding: 0 8px;
  display: flex;
  place-items: center;
}

.tabs-btn:hover {
  color: #2ca01c;
}

.content-bottom__body {
  position: relative;
  display: block;
  overflow: visible;
  border: 1px solid #c9ccd2;
  margin: 0 1px 1px;
  z-index: 1;
  margin-top: -1px;
  min-height: 216px;
  max-height: 216px;
}

.tab-content {
  margin: 11px 8px;
}

.grid-mode-control {
  overflow: auto;
  max-height: 158px;
  min-width: 100%;
}

.td-editor {
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 0 6px;
  border-radius: 2px;
  /* min-height: var(--input-height); */
  position: relative;
  display: flex;
  align-items: center;
}

.td-textarea {
  resize: none;
  height: 27px;
  line-height: 20px;
  font-family: inherit;
  width: 100%;
  padding: 3px 10px;
  border-radius: var(--border-radius);
  border: 1px solid #e6e6e6;
  background-color: #fff;
  outline: unset;
  overflow: hidden;
}

.td-textarea:focus {
  border: 1px solid #50b83c;
  outline: none;
}

.grid-control-item {
  padding: 0;
  width: 100%;
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  background-color: #fff;
}

.top-grid {
  display: flex;
  place-items: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #d3d6db;
  justify-content: flex-start;
}

.grid-address {
  max-height: 125px;
  overflow: auto;
}
.description .textarea {
  min-height: 160px;
  margin-top: 0;
}
</style>
