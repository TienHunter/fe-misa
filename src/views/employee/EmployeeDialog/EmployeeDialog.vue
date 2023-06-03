<template>
  <b-dialog
    :type="employeeDialog.type"
    :content="employeeDialog.content"
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
    const onClose = () => {
      store.dispatch("getDialog", {});
    };
    const onAccept = () => {
      switch (employeeDialog.value.action) {
        case DialogAction.confirmCreate:
          break;
        case DialogAction.confirmUpdate:
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
    return { employeeDialog, onClose, onAccept };
  },
};
</script>
<style></style>
