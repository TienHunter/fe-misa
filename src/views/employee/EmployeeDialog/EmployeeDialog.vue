<template>
  <b-dialog
    :type="employeeDialog.type"
    :content="employeeDialog.content"
    :on-close-all="onCloseAll"
    :on-close="onClose"
    :on-accept="onAccept" />
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { DialogAction } from "../../../constants";

export default {
  setup(props) {
    const store = useStore();
    const employeeDialog = computed(() => store.state.employee.employeeDialog);
    const employeeDetail = computed(() => store.state.employee.employeeDetail);
    // console.log(employeeDetail.value);

    /**
     * Mô tả: Đóng dialog và popup
     * created by : vdtien
     * created date: 04-06-2023
     * @param {type} param -
     * @returns
     */
    const onClose = () => {
      store.dispatch("getDialog", {});
    };

    /**
     * Mô tả: thực hiện create or update
     * created by : vdtien
     * created date: 04-06-2023
     * @param {type} param -
     * @returns
     */
    const onAccept = () => {
      switch (employeeDialog.value.action) {
        case DialogAction.confirmCreate:
          store.dispatch("getDialog", {
            action: DialogAction.confirmCreate,
          });
          break;
        case DialogAction.confirmUpdate:
          store.dispatch("getDialog", {
            action: DialogAction.confirmUpdate,
          });
          break;
        case DialogAction.confirmDelete:
          store.dispatch("getDialog", {});
          store.dispatch("deleteEmployee", employeeDetail.value);
          break;
        default:
          store.dispatch("getDialog", {});
          break;
      }
    };

    /**
     * Mô tả: đóng dialog
     * created by : vdtien
     * created date: 04-06-2023
     * @param {type} param -
     * @returns
     */
    const onCloseAll = () => {
      store.dispatch("getDialog", {});
      store.dispatch("getPopupStatus");
      store.dispatch("getEmployeeDetail");
    };
    return { employeeDialog, onClose, onAccept, onCloseAll, employeeDetail };
  },
};
</script>
<style></style>
