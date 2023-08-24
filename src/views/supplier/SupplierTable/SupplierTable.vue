<template>
  <div ref="tableSupplierRef" class="table-wrapper">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th
              v-for="(col, index) in supplierCols"
              :key="index"
              :class="{
                'th-anchor': col?.name === 'checkbox',
                'th-anchor th-anchor--end': col?.name === 'action',
                [col?.class]: true,
              }"
              :title="col?.title">
              <div
                v-if="col?.name === 'checkbox'"
                class="flex items-center justify-center">
                <input
                  v-if="col?.name === 'checkbox'"
                  type="checkbox"
                  :checked="checkAll"
                  @click="onClickCheckAllRecord" />
              </div>

              <span v-else>{{ col?.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="supplierList?.length > 0">
            <tr
              v-for="(item, index) in supplierList"
              :key="item.SupplierId"
              class="pointer"
              :class="{
                'tr--checked': supplierIdListChecked.includes(item.SupplierId),
              }"
              @dblclick="() => onOpenPopupUpdate(item)">
              <td
                v-for="(col, indexCol) in supplierCols"
                :key="indexCol"
                :class="{
                  'td-anchor td-anchor--start': col?.name === 'checkbox',
                  'td-anchor td-anchor--end td-action': col?.name === 'action',

                  'before-last': indexCol === supplierCols.length - 2,
                  [col?.class]: true,
                }"
                :style="{
                  'z-index':
                    rowSelected === item.SupplierId && col?.name === 'action'
                      ? 1
                      : 0,
                }"
                @click="() => onClickCheckRecord([item.SupplierId])">
                <input
                  v-if="col?.name === 'checkbox'"
                  type="checkbox"
                  :checked="supplierIdListChecked.includes(item.SupplierId)"
                  @dblclick.stop=""
                  @click.stop=""
                  @click="() => onClickCheckRecord([item.SupplierId])" />
                <span v-else-if="col?.name === 'Gender'">
                  {{ converGender(item[col?.name]) }}
                </span>
                <span v-else-if="col?.name == 'DateOfBirth'">
                  {{ convertToDDMMYYYY(item[col?.name]) }}
                </span>
                <span v-else-if="col?.name == 'IdentityDateRelease'">
                  {{ convertToDDMMYYYY(item[col?.name]) }}
                </span>
                <span v-else-if="col?.name === 'MaxAccountOfDebt'">
                  {{ formatDecimal(item[col?.name]) }}
                </span>
                <span v-else-if="col?.name !== 'action'">{{
                  item[col?.name]
                }}</span>
                <div
                  v-else
                  class="flex items-center justify-center h-full"
                  @dblclick.stop=""
                  @click.stop="">
                  <a
                    href="#"
                    class="text-blue font-semi-bold h-full flex items-center px-4"
                    @click="() => onOpenPopupUpdate(item)"
                    >{{ ButtonTitle.edit }}</a
                  >

                  <div
                    class="td-action__icon h-full flex items-center"
                    :style="{
                      'z-index':
                        rowSelected === item.SupplierId &&
                        col?.name === 'action'
                          ? 2
                          : 0,
                    }">
                    <div
                      :ref="btnTableRefs[index]"
                      class="icon-wrapper w-4 h-4"
                      :class="{
                        'border--blue': rowSelected === item.SupplierId,
                      }"
                      @click="() => toggleTableAction(item, index)">
                      <div
                        class="icon icon--down-small-blue"
                        style="paddingtop: 1px"></div>
                    </div>

                    <div
                      v-if="rowSelected === item.SupplierId"
                      class="dropdown-list td-action-list"
                      :class="{ 'td-action-list--up': btnTableDirectUp }">
                      <div
                        class="dropdown-item td-action-item td-action-item--remove"
                        @click="() => onClickDeleteSupplier(item)">
                        {{ ButtonTitle.delete }}
                      </div>
                      <div
                        class="dropdown-item td-action-item"
                        @click="() => onClickCloneRecord(item)">
                        {{ ButtonTitle.duplicate }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="rowSelected"
                    class="overlay"
                    @click="() => toggleTableAction()" />
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="supplierCols?.length ?? 1" class="font-italic">
                {{ FreeText.notFoundRecord }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { PopupType, DialogType, DialogAction, TypeCol } from "@/enums";
import {
  DialogTitle,
  SupplierCol,
  ButtonTitle,
  FreeText,
  DialogContent,
} from "@/resources";
import { useStore } from "vuex";
import {
  computed,
  nextTick,
  onBeforeMount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import {
  areAllElementsInArray,
  converGender,
  removeEmptyFields,
  convertToDDMMYYYY,
  formatDecimal,
} from "@/utils/helper";
export default {
  props: {},
  setup(props) {
    //========= start state =========
    const store = useStore();
    const supplierList = computed(() => store.state.supplier.supplierList);
    const supplierIdListChecked = computed(
      () => store.state.supplier.supplierIdListChecked
    );
    const checkAll = ref(false);

    const rowSelected = ref("");
    const tableSupplierRef = ref(null);
    const btnTableRefs = ref([]);
    const btnTableDirectUp = ref(false);
    const supplierCols = [
      {
        name: "checkbox",
        label: "",
        class: "mw-40 w-40 Mw-40 text-center",
      },
      {
        name: "SupplierCode",
        label: "Mã nhà cung cấp",
        class: "mw-130 w-130 Mw-130 text-left",
      },
      {
        name: "SupplierName",
        label: "Tên nhà cung cấp",
        class: "mw-150 w-150 Mw-150 text-left",
      },
      {
        name: "Address",
        label: "Địa chỉ",
        class: "mw-200 w-200 Mw-200 text-left",
      },
      {
        name: "MaxAccountOfDebt",
        label: "Số tiền nợ",
        class: "mw-150 w-150 Mw-150 text-right",
        type: TypeCol.money,
      },
      {
        name: "PhoneNumber",
        label: "Điện thoại",
        class: "mw-130 w-130 Mw-130 text-left",
      },
      {
        name: "action",
        label: "Chức năng",
        class: "mw-100 w-100 Mw-100 text-center",
      },
    ];
    //========= end state =========

    watchEffect(() => {
      let supplierIdList = ref(
        supplierList.value.map((item) => item.SupplierId)
      );
      if (
        areAllElementsInArray(
          supplierIdList.value,
          supplierIdListChecked.value
        ) &&
        supplierIdListChecked.value?.length > 0
      ) {
        checkAll.value = true;
      } else {
        checkAll.value = false;
      }
      // Đánh lại ref khi danh sách items thay đổi
      btnTableRefs.value = supplierList.value.map(() => ref(null));
      // console.log(supplierIdListChecked.value);
    });
    onBeforeMount(() => {});
    onMounted(() => {
      btnTableRefs.value = supplierList.value.map(() => ref(null));
    });

    /**
     * toggle more action ở cột chức năng của table
     * Author: vdtien (27/5/2023)
     */
    const toggleTableAction = (item, index) => {
      // console.log(item);
      if (!item) {
        rowSelected.value = "";
        btnTableDirectUp.value = false;
        return;
      }
      if (rowSelected.value !== item.SupplierId) {
        rowSelected.value = item.SupplierId;
        const tablePositionBottom =
          tableSupplierRef.value.getBoundingClientRect().bottom;
        const btnTableActionPositionBottom =
          btnTableRefs.value[index].value[0].getBoundingClientRect().bottom;
        if (tablePositionBottom - btnTableActionPositionBottom <= 100) {
          btnTableDirectUp.value = true;
        }
      } else {
        rowSelected.value = "";
        btnTableDirectUp.value = false;
      }
      // console.log(rowSelected);
    };
    /**
     * mở popup cập nhật nhân viên
     * Author:vdtien (28/5/2023)
     */
    const onOpenPopupUpdate = (item) => {
      const itemRemoveNull = removeEmptyFields(item);
      store.dispatch("getSupplierDetail", itemRemoveNull);
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.update,
      });
    };

    /**
     *
     * @param {*} item
     * open supplier dialog cảnh báo xóa
     * Author: vdtien(28/5/2023)
     */
    const onClickDeleteSupplier = (item) => {
      if (supplierIdListChecked.value.includes(item.SupplierId)) {
        onClickCheckRecord([item.SupplierId]);
      }
      // console.log(item);
      toggleTableAction(item);
      store.dispatch("getSupplierDetail", item);
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.warning,
        title: DialogTitle.delete,
        content: [`${DialogContent.confirmDeleteSupplier(item?.SupplierCode)}`],
        action: DialogAction.confirmDelete,
      });
    };

    /**
     *
     * @param {*} item
     * check or uncheck list supplier
     * Author: vdtien(28/5/2023)
     */
    const onClickCheckAllRecord = () => {
      let supplierIdList = supplierList.value.map((item) => item.SupplierId);

      store.dispatch("getSupplierIdListCkecked", supplierIdList);
    };

    /**
     *
     * @param {*} item
     * check or uncheck 1 supplier
     * Author: vdtien(28/5/2023)
     */
    const onClickCheckRecord = (itemId) => {
      store.dispatch("getSupplierIdListCkecked", itemId);
    };

    /**
     *
     * @param {*} item
     * nhan ban nhan vien theo nhan vien duoc click
     * Author: vdtien(28/5/2023)
     */
    const onClickCloneRecord = async (item) => {
      // console.log(item);
      toggleTableAction(item);
      const itemRemoveNull = removeEmptyFields({ ...item });
      delete itemRemoveNull.SupplierId;
      store.dispatch("getSupplierDetail", itemRemoveNull);
      await store.dispatch("getNewSuppliercode");
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.create,
      });
    };
    return {
      SupplierCol,
      ButtonTitle,
      FreeText,
      supplierList,
      toggleTableAction,
      rowSelected,
      checkAll,
      onOpenPopupUpdate,
      onClickDeleteSupplier,
      tableSupplierRef,
      btnTableRefs,
      btnTableDirectUp,
      converGender,
      supplierIdListChecked,
      onClickCheckAllRecord,
      onClickCheckRecord,
      convertToDDMMYYYY,
      onClickCloneRecord,
      supplierCols,
      formatDecimal,
      TypeCol,
    };
  },
};
</script>

<style></style>
