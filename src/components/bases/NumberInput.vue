<template lang="">
  <label
    :class="[{ disabled: disabled }, classLabel]"
    :title="titleLabel"
    @keydown.tab.stop="">
    {{ label }}
    <span v-show="required" class="text-red">(*)</span>
    <input
      ref="inputRef"
      class="input text-right"
      :maxlength="maxLength"
      :type="inputType"
      :title="errMsg"
      :class="[
        {
          'border--red': errMsg,
          'pr-9': classIcon,
          'm-0': !label,
        },
        classInput,
      ]"
      :tabindex="tabIndex"
      :placeholder="placeHolder"
      :disabled="disabled"
      :value="inputValue"
      @input="(e) => handleChangeInput(e)"
      @focus="focus" />
    <div v-if="classIcon" class="icon-wrapper">
      <div class="icon" :class="classIcon"></div>
    </div>
    <!-- <div v-if="errMsg" class="errMsg">{{ errMsg }}</div> -->
  </label>
</template>
<script>
import { computed, nextTick, onMounted, ref, watchEffect } from "vue";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
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
    modelValue: {
      type: Number,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 17,
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
    maxValue: {
      type: Number,
      default: Number.MAX_VALUE,
    },
    minValue: {
      type: Number,
      default: Number.MIN_VALUE,
    },
  },
  emits: ["update:modelValue", "emptyErrMsg"],

  setup(props, ctx) {
    const inputRef = ref(null);
    // const inputValue = ref("0");

    // onMounted(() => {
    //   if (typeof props.modelValue === "number" && !isNaN(props.modelValue)) {
    //     inputValue.value = Math.abs(props.modelValue).toLocaleString();
    //   }
    // });
    const inputValue = computed(() => {
      if (typeof props.modelValue === "number" && !isNaN(props.modelValue)) {
        return Math.abs(props.modelValue).toLocaleString();
      }
      return "0";
    });

    const handleChangeInput = (e) => {
      let value = e.target.value;
      // Xóa tất cả các ký tự không phải là số từ giá trị input
      value = value.replace(/[^\d]/g, "");
      // console.log(value);

      // Gán giá trị đã được định dạng lại vào input

      // Định dạng phần ngàn với dấu chấm để ngăn cách hàng nghìn
      let formattedValue = Number(value);
      console.log(formattedValue);
      if (formattedValue < props.minValue) {
        formattedValue = props.minValue;
      }
      if (formattedValue > props.maxValue) {
        formattedValue = props.maxValue;
      }
      // console.log(formattedValue);
      e.target.value = formattedValue.toLocaleString();
      // inputValue.value = formattedValue.toLocaleString();
      ctx.emit("update:modelValue", formattedValue);
      ctx.emit("emptyErrMsg");
    };
    const focus = () => {
      // console.log("h1");
      inputRef.value.focus();
      select();
    };
    const select = () => {
      inputRef.value.select();
    };
    return {
      handleChangeInput,
      inputRef,
      focus,
      select,
      inputValue,
    };
  },
};
</script>
<style lang=""></style>
