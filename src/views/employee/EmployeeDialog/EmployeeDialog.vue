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

export default {
  setup(props) {
    const store = useStore();
    const employeeDialog = computed(() => store.state.employee.employeeDialog);
    const onClose = () => {
      store.dispatch("getDialog", {});
    };
    const onAccept = () => {
      console.log("accept");
    };
    return { employeeDialog, onClose, onAccept };
  },
};
</script>
<style></style>
