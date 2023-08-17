<template>
  <label :class="classLabel" :title="titleLabel" @keydown.tab.stop="">
    {{ label }}
    <span v-show="required" class="text-red">(*)</span>
    <input
      ref="inputRef"
      class="input text-right"
      :maxLength="maxLength"
      :title="errMsg"
      :class="[
        {
          'border--red': errMsg,
          'pr-9': classIcon,
          'm-0': !label,
          'text-red': numberValue < 0,
        },
        classInput,
      ]"
      :tabindex="tabIndex"
      :placeholder="placeHolder"
      :value="formattedValue"
      @input="(e) => handleChangeInput(e)"
      @focus="focus"
      @blur="blur" />
    <input
      v-show="!isFocus"
      class="input text-right position-absolute"
      :title="numberValue"
      :class="[
        {
          'border--red': errMsg,
          'pr-9': classIcon,
          'm-0': !label,
          'text-red': numberValue < 0,
        },
        classInput,
      ]"
      style="top: 0; left: 0"
      tabindex="-1"
      :value="formatCurrentShow()"
      readonly
      @click="onClickFocus" />
    <!-- <span :class="{ 'text-red': numberValue < 0 }">
      {{ formatCurrentShow() }}
    </span> -->
    <div v-if="classIcon" class="icon-wrapper">
      <div class="icon" :class="classIcon"></div>
    </div>
    <!-- <div v-if="errMsg" class="errMsg">{{ errMsg }}</div> -->
  </label>
</template>

<script setup>
import { useCurrencyInput } from "vue-currency-input";
import { nextTick, ref, watchEffect } from "vue";
import { formatDecimal } from "@/utils/helper";
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object,
    default: new Object(),
  },
  label: {
    type: String,
    default: "",
  },
  numberFormat: {
    type: Boolean,
    default: false,
  },
  titleLabel: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  errMsg: {
    type: String,
    default: "",
  },
  classLabel: {
    type: String,
    default: "",
  },
  inputType: {
    type: String,
    default: "text",
  },
  classInput: {
    type: String,
    default: "",
  },
  tabIndex: {
    type: Number,
    default: 0,
  },
  placeHolder: {
    type: String,
    default: "",
  },
  classIcon: {
    type: String,
    default: "",
  },
  classErrMsg: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue", "emptyErrMsg"]);
const { inputRef, numberValue, formattedValue } = useCurrencyInput(
  props.options,
  false
);
const isFocus = ref(false);
watchEffect(() => console.log(isFocus.value));
const focus = () => {
  // console.log("h1");
  inputRef.value.focus();
  select();
  isFocus.value = true;
};
const select = () => {
  inputRef.value.select();
};
const blur = () => {
  isFocus.value = false;
  emit("update:modelValue", numberValue.value);
};

const handleChangeInput = (e) => {
  // console.log(e.target.value);
  // console.log(formattedValue.value);

  // blur thì mới emit input ra
  // if (isFocus.value === false) {
  //   console.log("co emit");
  //   emit("update:modelValue", numberValue.value);
  // }
  emit("emptyErrMsg");
};

const formatCurrentShow = () => {
  return formatDecimal(numberValue.value);
};
const onClickFocus = () => {
  isFocus.value = true;
  nextTick(() => {
    focus();
  });
};
</script>
