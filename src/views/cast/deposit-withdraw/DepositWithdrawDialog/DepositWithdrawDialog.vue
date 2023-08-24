<template lang="">
  <b-dialog
    :type="dialog.type"
    :title="dialog.title"
    :content="dialog.content"
    :on-close-all="onCloseAll"
    :on-close="onClose"
    :on-accept="onAccept" />
</template>
<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { DialogAction, ErrCode } from "@/enums";

const store = useStore();
const dialog = computed(() => store.state.global.dialog);

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
const onAccept = async () => {
  switch (dialog.value.action) {
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
      store.dispatch("deletePayment");
      break;
    case DialogAction.confirmDeleteMulti:
      store.dispatch("getDialog", {});
      // store.dispatch("deleteMultiEmployee");
      break;
    case DialogAction.confirmChangeCode:
      store.dispatch("getDialog", {
        action: DialogAction.confirmChangeCode,
      });
      break;
    case DialogAction.confirmRemoveAllAccountings:
      store.dispatch("getDialog", {
        action: DialogAction.confirmRemoveAllAccountings,
      });
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
  // store.dispatch("getEmployeeDetail");
};
</script>
<style lang=""></style>
