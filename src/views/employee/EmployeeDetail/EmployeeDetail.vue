<template lang="">
  <div id="employeeInfo" class="popup-wrapper items-center justify-center">
    <div class="popup-container">
      <div class="popup__header flex items-center">
        <div class="popup-header__title">
          {{
            popupStatus?.type === PopupType.create
              ? "Thêm mới nhân viên"
              : "Cập nhật nhân viên"
          }}
        </div>
        <div class="popup-header__options flex items-center">
          <label
            class="checkbox-wrapper w-auto flex flex-row items-center pointer m-0">
            <input class="input-checkbox m-0 mr-1" type="checkbox" />
            <span> Là khách hàng </span>
          </label>
          <label
            class="checkbox-wrapper w-auto flex flex-row items-center pointer m-0">
            <input class="input-checkbox m-0 mr-1" type="checkbox" />
            <span> Là nhà cung cấp </span>
          </label>
        </div>
        <div class="popup-header__actions flex items-center ml-auto">
          <div class="popup-header-actions__question">
            <div class="icon-wrapper">
              <div class="icon icon--question"></div>
            </div>
          </div>
          <div
            ref="btnClose"
            class="popup-header-actions__close"
            title="Đóng - ESC"
            tabindex="21"
            @click="onClosePopup"
            @keydown="hanldeFocusFirst">
            <div class="icon-wrapper">
              <div class="icon icon--close"></div>
            </div>
          </div>
        </div>
      </div>
      <form id="employeeForm" action="" class="popup__body">
        <div class="form-content flex flex-col gap-24-0">
          <div class="form-content__top flex flex-row gap-0-24">
            <div class="form-content-top__left flex flex-col gap-16-0 w-1_2">
              <div class="flex gap-0-8">
                <b-textfield
                  ref="employeeCodeInput"
                  v-model="employeeInfo.employeeCode"
                  :tab-index="2"
                  required
                  label="Mã"
                  class-label="w-2_5"
                  :err-msg="errValidator.employeeCode"
                  @empty-err-msg="errValidator.employeeCode = ''"
                  @keydown="hanldeFocusLast" />
                <b-textfield
                  v-model="employeeInfo.employeeName"
                  :tab-index="3"
                  required
                  label="Tên"
                  class-label="w-3_5"
                  :err-msg="errValidator.employeeName"
                  @empty-err-msg="errValidator.employeeName = ''" />
              </div>
              <div class="w-full">
                <b-combobox
                  v-model="departmentSearh"
                  :tab-index="4"
                  is-required
                  label-title="Đơn vị"
                  place-holder="Chọn đơn vị"
                  :err-msg="errValidator.departmentId"
                  :data-list="dataDeaprtment"
                  :id-selected="employeeInfo.departmentId"
                  @on-click-id-selected="
                    (id) => (employeeInfo.departmentId = id)
                  "
                  @empty-err-msg="errValidator.departmentId = ''" />
              </div>
              <div class="w-full">
                <b-textfield
                  v-model="employeeInfo.positionName"
                  :tab-index="5"
                  label="Chức danh"
                  class-label="w-full" />
              </div>
            </div>
            <div class="form-content-top__right flex flex-col gap-16-0 w-1_2">
              <div class="flex items-center gap-0-8">
                <b-textfield
                  v-model="employeeInfo.dateOfBirth"
                  :tab-index="6"
                  input-type="date"
                  label="Ngày sinh"
                  class-label="w-2_5" />

                <label class="w-3_5 m-0 block">
                  Giới tính
                  <div
                    class="flex flex-row gap-0-24 mt-2 h-8"
                    style="position: relative">
                    <label class="flex flex-row items-center m-0 w-auto">
                      <input
                        v-model="employeeInfo.gender"
                        tabindex="7"
                        type="radio"
                        class="m-0 mr-1"
                        value="Nam"
                        name="radio-gender" />
                      Nam
                    </label>

                    <label class="flex flex-row items-center m-0 w-auto">
                      <input
                        v-model="employeeInfo.gender"
                        tabindex="7"
                        type="radio"
                        class="m-0 mr-1"
                        value="Nữ"
                        name="radio-gender" />
                      Nữ
                    </label>

                    <label class="flex flex-row items-center m-0 w-auto">
                      <input
                        v-model="employeeInfo.gender"
                        tabindex="7"
                        type="radio"
                        class="m-0 mr-1"
                        value="Khác"
                        name="radio-gender" />
                      Khác
                    </label>
                  </div>
                </label>
              </div>
              <div class="flex w-full gap-0-8">
                <b-textfield
                  v-model="employeeInfo.identityNumber"
                  :tab-index="8"
                  label="Số CMND"
                  title="Số căn cước công dân"
                  class-label="w-3_5" />
                <b-textfield
                  v-model="employeeInfo.identityDateRelease"
                  :tab-index="9"
                  input-type="date"
                  label="Ngày cấp"
                  class-label="w-2_5" />
              </div>
              <div class="w-full">
                <b-textfield
                  v-model="employeeInfo.identityPlaceRelease"
                  :tab-index="10"
                  label="Nơi cấp"
                  class-label="w-full" />
              </div>
            </div>
          </div>
          <div class="form-content__bottom flex flex-col gap-16-0">
            <div class="w-full">
              <b-textfield
                v-model="employeeInfo.address"
                :tab-index="11"
                label="Địa chỉ"
                class-label="w-full" />
            </div>

            <div class="w-full flex gap-0-8 justify-start">
              <b-textfield
                v-model="employeeInfo.phoneNumber"
                :tab-index="12"
                label="ĐT di động"
                class-label="w-1_4"
                title="Điện thoại di động" />
              <b-textfield
                v-model="employeeInfo.mobilePhoneNumber"
                :tab-index="13"
                label="ĐT cố định"
                class-label="w-1_4"
                title="Điện thoại cố định" />

              <b-textfield
                v-model="employeeInfo.email"
                :tab-index="14"
                label="Email"
                class-label="w-1_4" />
            </div>
            <div class="w-full flex gap-0-8 justify-start">
              <b-textfield
                v-model="employeeInfo.bankAccount"
                :tab-index="15"
                label="Tài khoản ngân hàng"
                class-label="w-1_4" />
              <b-textfield
                v-model="employeeInfo.bankName"
                :tab-index="16"
                label="Tên ngân hàng"
                class-label="w-1_4" />
              <b-textfield
                v-model="employeeInfo.bankBranchName"
                :tab-index="17"
                label="Chi nhánh"
                class-label="w-1_4" />
            </div>
          </div>
        </div>
      </form>
      <div class="popup__bottom flex justify-between items-center mt-6">
        <div class="popup-bottom__left">
          <b-button
            ref="btnCancel"
            class="btn--sub"
            title="Hủy"
            :tab-index="20" />
        </div>
        <div class="popup-bottom__right flex justify-center gap-0-8">
          <b-button
            ref="btnStore"
            class="btn--sub"
            title="Cất"
            :tab-index="18"
            @click="storeEmployee" />
          <b-button
            ref="btnStoreAndAdd"
            class="btn--pri"
            title="Cất và thêm"
            :tab-index="19" />
        </div>
      </div>
    </div>
    <div ref="tmpTablIndex" tabindex="22"></div>
  </div>
</template>
<script>
import { computed, onMounted, onUpdated, reactive, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { ButtonType, PopupType, ErrValidator, DialogType } from "@/constants";
export default {
  setup(props) {
    const store = useStore();
    const popupStatus = computed(() => store.state.employee.popupStatus);
    // console.log(popupStatus);
    const employeeDetail = computed(() => store.state.employee.employeeDetail);
    const employeeInfo = ref({ ...employeeDetail.value });

    const departmentSearh = computed(() => {
      if (employeeInfo.value.departmentId) {
        const foundElement = dataDeaprtment.find(
          (item) => item.id === employeeInfo.value.departmentId
        );
        if (foundElement) {
          return foundElement.value;
        } else {
          return "";
        }
      }
      return "";
    });
    const dataDeaprtment = reactive([
      {
        id: "1",
        value: "Phòng hành chính",
      },
      {
        id: "2",
        value: "Phòng công nghệ",
      },
      {
        id: "3",
        value: "Phòng nhân sự",
      },
      {
        id: "4",
        value: "Phòng sản xuất",
      },
      {
        id: "5",
        value: "Phòng chill",
      },
    ]);
    const employeeCodeInput = ref(null);
    const btnClose = ref(null);
    const btnCancel = ref(null);
    const btnStore = ref(null);
    const btnStoreAndAdd = ref(null);
    const tmpTablIndex = ref(null);
    const errValidator = reactive({});
    onMounted(() => {
      // employeeInfo.value.DepartmentId = "2";
      employeeCodeInput.value.$el.focus();
    });

    onUpdated(() => {
      // console.log(departmentSearh.value);
      console.log(employeeInfo.value);
    });
    /**
     * Đóng popup
     * Author: vdtien (28/5/2023)
     */
    const onClosePopup = () => {
      store.dispatch("getPopupStatus", {
        isShowPopup: false,
        type: "",
      });
    };

    /**
     *
     * @param {*} e
     * shift tab quay lại btnClose
     * Author: vdtien (28/5/2023)
     */
    const hanldeFocusLast = (e) => {
      // e.preventDefault();
      if (e.shiftKey && e.which == 9) {
        tmpTablIndex.value.focus();
      }
    };
    /**
     *
     * @param {*} e
     * tab nhảy về ô employeeCode
     * shift tab nhảy về btnCancel
     * Author: vdtien (28/5/2023)
     */
    const hanldeFocusFirst = (e) => {
      e.preventDefault();
      if (!e.shiftKey && e.which == 9) {
        employeeCodeInput.value.$el.focus();
      }
      if (e.shiftKey && e.which == 9) {
        btnCancel.value.$el.nextElementSibling.focus();
      }
    };

    /**
     * validate các field xem có lỗi hay không
     * Author:vdtien(28/5/2023)
     */
    const validatorEmployee = () => {
      // xóa lỗi trước đó
      // Xóa tất cả các trường của reactive object
      Object.keys(errValidator).forEach((key) => {
        delete errValidator[key];
      });

      // Kiểm tra các trường

      // Mã không được để trống
      let isEmployeeCodeEmpty =
        !employeeInfo.value.employeeCode ||
        (employeeInfo.value.employeeCode &&
          !employeeInfo.value.employeeCode.trim());
      if (isEmployeeCodeEmpty) {
        errValidator.employeeCode = ErrValidator.employeeCodeEmppty;
      }

      // Tên không được để trống
      let isEmployeeNameEmpty =
        !employeeInfo.value.employeeName ||
        (employeeInfo.value.employeeName &&
          !employeeInfo.value.employeeName.trim());

      if (isEmployeeNameEmpty) {
        console.log(employeeInfo.value.employeeName);
        errValidator.employeeName = ErrValidator.employeeNameEmpty;
        console.log("check empty");
      }

      // Đơn vị không được để trống
      let isDepartmentEmpty =
        !employeeInfo.value.departmentId ||
        (employeeInfo.value.departmentId &&
          !employeeInfo.value.departmentId.trim());
      if (isDepartmentEmpty) {
        errValidator.departmentId = ErrValidator.departmentEmpty;
      }

      // Ngày sinh không lớn hơn ngày hiện tại
      if (employeeInfo.value.dateOfBirth) {
        let currentDate = new Date().getTime();
        let dof = Date.parse(employeeInfo.value.dateOfBirth);
        if (dof > currentDate) {
          errValidator.dateOfBirth = ErrValidator.dateOfBirth;
        }
      }

      // Ngày cấp không lớn hơn ngày hiện tại
      if (employeeInfo.value.identityDateRelease) {
        let currentDate = new Date().getTime();
        let dof = Date.parse(employeeInfo.value.identityDateRelease);
        if (dof > currentDate) {
          errValidator.identityDateRelease = ErrValidator.identityDateRelease;
        }
      }

      // Email đúng định dạng
      if (employeeInfo.value.email && employeeInfo.value.email.trim()) {
        let emailFormat =
          /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9-]+)((\.[a-zA-Z0-9-]{2,3})+)$/;
        if (!employeeInfo.value.email.match(emailFormat)) {
          errValidator.email = ErrValidator.email;
        }
      }
      // Kiểm tra xem reactive object có rỗng hay không
      const isEmpty = Object.keys(errValidator).length === 0;
      if (isEmpty) {
        console.log("isEmpty", isEmpty);
        return true;
      } else {
        store.dispatch("getDialog", {
          isShow: true,
          type: DialogType.error,
          content: [...Object.values(errValidator)],
        });
      }
      return false;
    };

    const storeEmployee = () => {
      let isValid = validatorEmployee();
      if (isValid && popupStatus.value.type === PopupType.create) {
        // lưu thông tin nhân viên
      } else if (isValid && popupStatus.value.type === PopupType.update) {
        // sửa thông tin nhân viên
      }
      // có lỗi thì không làm gì cả
    };
    return {
      ButtonType,
      onClosePopup,
      PopupType,
      popupStatus,
      employeeInfo,
      dataDeaprtment,
      departmentSearh,
      employeeCodeInput,
      btnClose,
      btnCancel,
      btnStore,
      btnStoreAndAdd,
      tmpTablIndex,
      hanldeFocusLast,
      hanldeFocusFirst,
      errValidator,
      storeEmployee,
    };
  },
};
</script>
<style>
@import url(./EmployeeDetail.css);
</style>
