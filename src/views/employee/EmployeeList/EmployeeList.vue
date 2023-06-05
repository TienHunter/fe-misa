<template lang="">
  <div class="flex flex-col main-wrapper w-full h-full">
    <div class="content__header flex justify-between items-center pt-6 pb-6">
      <div class="content-header__title">
        <h3 class="font-24">Nhân viên</h3>
      </div>
      <div class="content-header__action">
        <!-- content-header-action__openForm -->
        <b-button
          class="btn--pri content-header-action__openForm"
          title="Thêm mới nhân viên"
          @click="onOpenPopupCreate" />
      </div>
    </div>
    <div class="content__body flex flex-col flex-1">
      <div class="content-body__tools flex justify-between items-center mb-4">
        <div class="content-body-tools__left">
          <div class="batch-actions flex items-center pointer">
            <div class="batch-actions__title">Thực hiện hàng loạt</div>
            <div class="batch-actions__icon">
              <div class="icon icon--down-small-black"></div>
            </div>
          </div>
        </div>
        <div class="content-body-tools__right ml-auto flex items-center">
          <b-textfield
            v-model="employeeSerch"
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
        <EmployeePaging />
      </div>
    </div>
  </div>
  <EmployeeDetail v-if="popupStatus.isShowPopup" />
  <EmployeeDialog v-if="employeeDialog.isShow" />
  <b-toast-message v-if="toast?.isShow" />
  <b-loading v-if="isLoading" />
</template>
<script>
import { computed, ref, onMounted, onUpdated, watchEffect, watch } from "vue";
import { useStore } from "vuex";
import { ButtonType, ToastType, PopupType } from "@/enums";
import EmployeeTable from "../EmployeeTable/EmployeeTable.vue";
import EmployeePaging from "../EmployeePaging/EmployeePaging.vue";
import EmployeeDetail from "../EmployeeDetail/EmployeeDetail.vue";
import EmployeeDialog from "../EmployeeDialog/EmployeeDialog.vue";
import { useDebounce } from "@/hooks";

export default {
  components: {
    EmployeePaging,
    EmployeeTable,
    EmployeeDetail,
    EmployeeDialog,
  },
  setup(props) {
    const store = useStore();
    const popupStatus = computed(() => store.state.employee.popupStatus);
    const isLoading = computed(() => store.state.global.isLoading);
    const toast = computed(() => store.state.global.toast);
    const employeeDialog = computed(() => store.state.employee.employeeDialog);
    const filterAndPaging = computed(
      () => store.state.employee.filterAndPaging
    );
    const employeeSerch = ref("");
    const debounceEmployeeSearch = useDebounce(employeeSerch, 600);

    // watch
    watch(debounceEmployeeSearch, () => {
      console.log("watch effect");
      store.dispatch("getFilterAndPaging", {
        ...filterAndPaging.value,
        employeeFilter: debounceEmployeeSearch,
        pageNumber: 1,
      });
      store.dispatch("getEmployeeList");
    });

    // onMounted(async () => {
    //   await store.dispatch("getEmployeeList");
    // });
    onUpdated(() => {
      // console.log(employeeDialog);
    });
    const onOpenPopupCreate = () => {
      store.dispatch("getEmployeeDetail", {});
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.create,
      });
    };
    return {
      ButtonType,
      employeeSerch,
      isLoading,
      toast,
      onOpenPopupCreate,
      popupStatus,
      employeeDialog,
    };
  },
};
</script>
<style>
@import url(./EmployeeList.css);
</style>
