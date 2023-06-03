<template lang="">
  <div class="combobox">
    <label class="combobox-wrapper block m-0 w-full">
      {{ labelTitle }}
      <span v-show="isRequired" class="text-red">(*)</span>

      <div
        class="combobox-container flex items-center"
        :class="{
          'mt-2': labelTitle,
          'border--focus': isShowCombobox,
          'border--red': errMsg,
        }">
        <input
          type="text"
          class="input combobox-input flex-1 m-0"
          :tabindex="tabIndex"
          :placeholder="placeHolder"
          :value="modelValue"
          @input="handleChangeInput"
          @keydown="handleKeyDown" />
        <div
          class="icon-wrapper combobox-icon"
          :class="{ active: isShowCombobox }"
          @click="toggleCombobox">
          <div class="icon icon--chevron-down"></div>
        </div>
      </div>
    </label>
    <ul v-if="isShowCombobox" class="combobox-list" style="z-index: 1">
      <li
        v-for="(item, index) in dataList"
        :key="index"
        class="combobox-item"
        :class="{
          'combobox-item--selected': idSelected === item.id,
          'combobox-item--hover': selectedIndex === index,
        }"
        @click="() => onClickComboboxItem(item, index)">
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, watch, computed } from "vue";
export default {
  props: {
    labelTitle: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    tabIndex: {
      type: Number,
      default: -1,
    },
    placeHolder: {
      type: String,
      default: "",
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    direct: {
      type: String,
      default: "show",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    idSelected: {
      type: String,
      default: "",
    },
    errMsg: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "onClickIdSelected", "emptyErrMsg"],

  setup(props, { emit }) {
    const isShowCombobox = ref(false);
    // console.log(props.idSelected);
    const selectedIndex = ref(
      computed(() =>
        props.dataList.findIndex((item) => item.id === props.idSelected)
      ).value
    );
    const toggleCombobox = () => {
      isShowCombobox.value = !isShowCombobox.value;
    };
    const onClickComboboxItem = (item) => {
      // emit value input
      emit("update:modelValue", item.value);
      // emit idSelected ra cho component cha
      emit("onClickIdSelected", item.id);
      emit("emptyErrMsg");

      // console.log(item);
      // đóng combox-list
      isShowCombobox.value = false;
      selectedIndex.value = -1; //
    };
    const handleChangeInput = (e) => {
      // if(e.key === "ArrowUp" ||e.key === "ArrowDown" )
      isShowCombobox.value = true;
      emit("update:modelValue", e.target.value);
      // emit("emptyErrMsg");
    };
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedIndex.value > 0) {
          selectedIndex.value--;
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedIndex.value < props.dataList.length - 1) {
          selectedIndex.value++;
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isShowCombobox.value) {
          // nếu đã di chuyển phím để chọn item
          if (selectedIndex.value != -1) {
            const itemSelected = props.dataList[selectedIndex.value];
            if (itemSelected) {
              onClickComboboxItem(itemSelected);
            }
          } else {
            // tìm value input theo idSelected trước đó
            if (props.idSelected) {
              const itemSelected = props.dataList.find(
                (obj) => obj.id === props.idSelected
              );
              if (itemSelected) {
                // emit value input
                emit("update:modelValue", itemSelected.value);
              }
            }

            isShowCombobox.value = !isShowCombobox.value;
          }
        } else {
          isShowCombobox.value = !isShowCombobox.value;
        }
      } else if (e.key === "Tab") {
        // tìm value input theo idSelected trước đó
        if (props.idSelected) {
          const itemSelected = props.dataList.find(
            (obj) => obj.id === props.idSelected
          );
          if (itemSelected) {
            // emit value input
            emit("update:modelValue", itemSelected.value);
          }
        }
        isShowCombobox.value = false;
      }
    };

    return {
      isShowCombobox,
      selectedIndex,
      toggleCombobox,
      onClickComboboxItem,
      handleChangeInput,
      handleKeyDown,
    };
  },
};
</script>
<style></style>
