<template lang="">
  <div class="flex flex-col main-wrapper w-full h-full">
    <div class="content__header flex justify-between items-center pt-6 pb-6">
      <div class="content-header__title">
        <h3 class="font-24">Nhân viên</h3>
      </div>
      <div class="content-header__action">
        <!-- content-header-action__openForm -->
        <b-button
          :class-button="`content-header-action__openForm`"
          :button-type="ButtonType.pri"
          title="Thêm mới nhân viên"
          @click="onToggleEmployeeDetail" />
      </div>
    </div>
    <div class="content__body flex flex-col flex-1">
      <div class="content-body__tools flex justify-between items-center mb-4">
        <div class="content-body-tools__left">
          <div class="batch-actions flex items-center pointer">
            <div class="batch-actions__title" @click="testToast">
              Thực hiện hàng loạt
            </div>
            <div class="batch-actions__icon">
              <div class="icon icon--down-small-black"></div>
            </div>
          </div>
        </div>
        <div class="content-body-tools__right ml-auto flex items-center">
          <b-textfield
            v-model="searchValue"
            class-input="m-0"
            place-holder="Tìm kiếm nhân viên ..."
            class-icon="icon icon--search" />

          <div class="icon-wrapper content-body-tools__refresh">
            <div class="icon icon--refresh"></div>
          </div>
        </div>
      </div>
      <div class="content-body__table flex-1">
        <EmployeeTable />
      </div>
      <div class="content-body__paging">
        <BasePaging />
      </div>
    </div>
  </div>
  <EmployeeDetail v-if="isEmployeeDetail" />
  <b-toast-message v-if="toast?.isShow" />
  <b-loading v-if="isLoading" />
</template>
<script>
import BasePaging from "@/components/bases/BasePaging.vue";
import EmployeeTable from "../EmployeeTable/EmployeeTable.vue";
import EmployeeDetail from "../EmployeeDetail/EmployeeDetail.vue";
import { ButtonType, ToastType } from "@/constants";
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  components: {
    BasePaging,
    EmployeeTable,
    EmployeeDetail,
  },
  setup(props) {
    const store = useStore();
    const searchValue = ref("");
    const employeeList = computed(() => store.state.employee.employeeList);
    const isEmployeeDetail = computed(
      () => store.state.employee.isEmployeeDetail
    );
    const isLoading = computed(() => store.state.global.isLoading);
    const toast = computed(() => store.state.global.toast);
    // onMounted(async () => {
    //   await store.dispatch("getEmployeeList");
    // });
    const testToast = () => {
      store.dispatch("getToast", {
        isShow: true,
        type: ToastType.success,
        content: "Công việc đã xóa",
      });
    };
    const onToggleEmployeeDetail = () => {
      store.dispatch("toggleEmployeeDetail");
    };
    return {
      ButtonType,
      searchValue,
      isLoading,
      toast,
      testToast,
      onToggleEmployeeDetail,
      isEmployeeDetail,
    };
  },
};
</script>
<style>
@import url(./EmployeeList.css);
</style>
