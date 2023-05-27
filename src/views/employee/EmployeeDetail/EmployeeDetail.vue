<template lang="">
  <div id="employeeDetail" class="popup-wrapper items-center justify-center">
    <div class="popup-container">
      <div class="popup__header flex items-center">
        <div class="popup-header__title">Thêm mới nhân viên</div>
        <div class="popup-header__options flex items-center">
          <label
            for=""
            class="checkbox-wrapper w-auto flex flex-row items-center pointer m-0">
            <input class="input-checkbox m-0 mr-1" type="checkbox" />
            <span> Là khách hàng </span>
          </label>
          <label
            for=""
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
            class="popup-header-actions__close"
            @click="onToggleEmployeeDetail">
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
                <b-textfield required label="Mã" class-label="w-2_5" />
                <b-textfield required label="Tên" class-label="w-3_5" />
              </div>
              <div class="w-full">
                <b-combobox
                  required
                  label="Đơn vị"
                  place-holder="Chọn đơn vị" />
              </div>
              <div class="w-full">
                <b-textfield label="Chức danh" class-label="w-full" />
              </div>
            </div>
            <div class="form-content-top__right flex flex-col gap-16-0 w-1_2">
              <div class="flex gap-0-8">
                <label class="w-2_5 m-0 block">
                  Ngày sinh
                  <input type="date" name="input" />
                </label>

                <label for="" class="w-3_5 m-0 block">
                  Giới tính
                  <div class="flex flex-row gap-0-24 mt-2 h-8">
                    <label class="flex flex-row items-center m-0 w-auto">
                      <input
                        type="radio"
                        class="m-0 mr-1"
                        name="radio-gender" />
                      Nam
                    </label>
                    <label class="flex flex-row items-center m-0 w-auto">
                      <input
                        type="radio"
                        class="m-0 mr-1"
                        name="radio-gender" />
                      Nữ
                    </label>
                    <label class="flex flex-row items-center m-0 w-auto">
                      <input
                        type="radio"
                        class="m-0 mr-1"
                        name="radio-gender" />
                      Khác
                    </label>
                  </div>
                </label>
              </div>
              <div class="flex w-full gap-0-8">
                <b-textfield
                  label="Số CMND"
                  title="Số căn cước công dân"
                  class-label="w-3_5" />
                <label class="w-2_5 m-0 block">
                  Ngày cấp
                  <input type="date" />
                </label>
              </div>
              <div class="w-full">
                <b-textfield label="Nơi cấp" class-label="w-full" />
              </div>
            </div>
          </div>
          <div class="form-content__bottom flex flex-col gap-16-0">
            <div class="w-full">
              <b-textfield label="Địa chỉ" class-label="w-full" />
            </div>

            <div class="w-full flex gap-0-8 justify-start">
              <b-textfield
                label="ĐT di động"
                class-label="w-1_4"
                title="Điện thoại di động" />
              <b-textfield
                label="ĐT cố định"
                class-label="w-1_4"
                title="Điện thoại cố định" />

              <b-textfield label="Email" class-label="w-1_4" />
            </div>
            <div class="w-full flex gap-0-8 justify-start">
              <b-textfield label="Tài khoản ngân hàng" class-label="w-1_4" />
              <b-textfield label="Tên ngân hàng" class-label="w-1_4" />
              <b-textfield label="Chi nhánh" class-label="w-1_4" />
            </div>
          </div>
        </div>
      </form>
      <div class="popup__bottom flex justify-between items-center mt-6">
        <div class="popup-bottom__left">
          <b-button :button-type="ButtonType.sub" title="Hủy" />
        </div>
        <div class="popup-bottom__right flex justify-center gap-0-8">
          <b-button :button-type="ButtonType.sub" title="Cất" />
          <b-button :button-type="ButtonType.pri" title="Cất và thêm" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { ButtonType } from "@/constants";
export default {
  setup(props) {
    const store = useStore();

    const onToggleEmployeeDetail = () => {
      store.dispatch("toggleEmployeeDetail");
    };
    return { ButtonType, onToggleEmployeeDetail };
  },
};
</script>
<style>
@import url(./EmployeeDetail.css);
</style>
