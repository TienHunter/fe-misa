<script>
import { PopupType, DialogType, DialogAction } from "@/enums";
import { EmployeeCol } from "@/resources";
import { useStore } from "vuex";
import { computed, onBeforeMount, onMounted, reactive, ref, toRefs } from "vue";
import { converGender, removeEmptyFields } from "@/utils/helper";
export default {
  props: {},
  setup(props) {
    const store = useStore();
    const employeeList = computed(() => store.state.employee.employeeList);
    const rowSelected = ref("");
    const tableEmployeeRef = ref(null);
    const btnTableRefs = ref([]);
    const btnTableDirectUp = ref(false);
    onBeforeMount(() => {
      store.dispatch("getEmployeeList");
    });
    onMounted(() => {
      btnTableRefs.value = btnTableRefs.value.map((ref) => toRefs(ref));
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
      if (rowSelected.value !== item.EmployeeId) {
        rowSelected.value = item.EmployeeId;
        const tablePositionBottom =
          tableEmployeeRef.value.getBoundingClientRect().bottom;
        const btnTableActionPositionBottom =
          btnTableRefs.value[index].getBoundingClientRect().bottom;
        console.log(
          tableEmployeeRef.value.getBoundingClientRect(),
          btnTableRefs.value[index].getBoundingClientRect()
        );
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
      store.dispatch("getPopupStatus", {
        isShowPopup: true,
        type: PopupType.update,
      });
      const itemRemoveNull = removeEmptyFields(item);
      store.dispatch("getEmployeeDetail", itemRemoveNull);
    };

    /**
     *
     * @param {*} item
     * open employee dialog cảnh báo xóa
     * Author: vdtien(28/5/2023)
     */
    const onClickDeleteEmployee = (item) => {
      // console.log(item);
      toggleTableAction(item);
      store.dispatch("getEmployeeDetail", item);
      store.dispatch("getDialog", {
        isShow: true,
        type: DialogType.warning,
        content: [
          `Bạn có chắc chắn muốn xóa nhân viên <${item?.EmployeeCode}> không ?`,
        ],
        action: DialogAction.confirmDelete,
      });
    };
    return {
      EmployeeCol,
      employeeList,
      toggleTableAction,
      rowSelected,
      onOpenPopupUpdate,
      onClickDeleteEmployee,
      tableEmployeeRef,
      btnTableRefs,
      btnTableDirectUp,
      converGender,
    };
  },
};
</script>

<template>
  <div ref="tableEmployeeRef" class="table-wrapper">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th
              v-for="(col, key, index) in EmployeeCol"
              :key="index"
              :class="{
                'th-anchor': key === 'checkbox',
                'th-anchor th-anchor--end': key === 'action',
              }"
              :style="{ minWidth: key === 'checkbox' ? '40px' : '160px' }"
              :title="col?.title">
              <input
                v-if="key === 'checkbox'"
                type="checkbox"
                style="width: 24px; height: 24px" />
              <span v-else>{{ col?.text }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in employeeList"
            :key="item.EmployeeId"
            @dblclick="() => onOpenPopupUpdate(item)">
            <td
              v-for="(col, key, indexCol) in EmployeeCol"
              :key="indexCol"
              :class="{
                'td-anchor td-anchor--start': key === 'checkbox',
                'td-anchor td-anchor--end td-action': key === 'action',
              }"
              :style="{
                'z-index':
                  rowSelected === item.EmployeeId && key === 'action' ? 1 : 0,
              }">
              <input
                v-if="key === 'checkbox'"
                type="checkbox"
                style="width: 24px; height: 24px"
                @dblclick.stop="" />
              <span v-else-if="key === 'Gender'">
                {{ converGender(item[key]) }}
              </span>
              <span v-else-if="key !== 'action'">{{ item[key] }}</span>
              <div
                v-else
                class="flex items-center justify-center h-full"
                @dblclick.stop="">
                <a
                  href="#"
                  class="text-blue font-semi-bold h-full flex items-center px-4"
                  @click="() => onOpenPopupUpdate(item)"
                  >Sửa</a
                >

                <div
                  class="td-action__icon"
                  :style="{
                    'z-index':
                      rowSelected === item.EmployeeId && key === 'action'
                        ? 2
                        : 0,
                  }">
                  <div
                    ref="btnTableRefs"
                    class="icon-wrapper w-8 h-8"
                    :class="{ 'border--blue': rowSelected === item.EmployeeId }"
                    @click="() => toggleTableAction(item, index)">
                    <div class="icon icon--down-small-blue"></div>
                  </div>

                  <div
                    v-if="rowSelected === item.EmployeeId"
                    class="dropdown-list td-action-list"
                    :class="{ 'td-action-list--up': btnTableDirectUp }">
                    <div
                      class="dropdown-item td-action-item td-action-item--remove"
                      @click="() => onClickDeleteEmployee(item)">
                      Xóa
                    </div>
                    <div class="dropdown-item td-action-item">Nhân bản</div>
                  </div>
                </div>
                <div
                  v-if="rowSelected"
                  class="overlay"
                  @click="() => toggleTableAction()"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style></style>
