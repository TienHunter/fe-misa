<template lang="">
  <label :class="classLabel">
    {{ label }}
    <span v-show="required" class="text-red">(*)</span>
    <input
      class="input"
      :type="inputType"
      :class="[
        `${errMsg ? 'border--red' : ''}`,
        `${classIcon ? 'pr-9' : ''}`,
        classInput,
      ]"
      :tabindex="tabIndex"
      :placeholder="placeHolder"
      :value="modelValue"
      @input="(e) => handleChangeInput(e)" />
    <div v-if="classIcon" class="icon-wrapper">
      <div class="icon" :class="classIcon"></div>
    </div>
    <!-- <div v-if="errMsg" class="errMsg">{{ errMsg }}</div> -->
  </label>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
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
      default: -1,
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
  },
  emits: ["update:modelValue", "emptyErrMsg"],

  setup(props, ctx) {
    const handleChangeInput = (e) => {
      ctx.emit("update:modelValue", e.target.value);
      ctx.emit("emptyErrMsg");
    };
    return {
      handleChangeInput,
    };
  },
};
</script>
<style lang=""></style>
