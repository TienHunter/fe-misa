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
          @input="(e) => handleChangeInput(e)" />
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
        :class="{ 'combobox-item--selected': idSelected === item.id }"
        @click="() => onClickComboboxItem(item)">
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script>
import { ref } from "vue";
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
    console.log(props.dataList);
    const toggleCombobox = () => {
      isShowCombobox.value = !isShowCombobox.value;
    };
    const onClickComboboxItem = (item) => {
      // emit value input
      emit("update:modelValue", item.value);
      // emit idSelected ra cho component cha
      emit("onClickIdSelected", item.id);

      console.log(item);
      // đóng combox-list
      toggleCombobox();
    };
    const handleChangeInput = (e) => {
      emit("update:modelValue", e.target.value);
      emit("emptyErrMsg");
    };
    return {
      isShowCombobox,
      toggleCombobox,
      onClickComboboxItem,
      handleChangeInput,
    };
  },
};
</script>
<style></style>
