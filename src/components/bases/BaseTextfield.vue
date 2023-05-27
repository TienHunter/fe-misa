<template lang="">
  <label :class="classLabel">
    {{ label }}
    <span v-show="required" class="text-red">(*)</span>
    <input
      type="text"
      :class="[
        `${errMsg ? 'border--red' : ''}`,
        `${classIcon ? 'pr-9' : ''}`,
        classInput,
      ]"
      :placeholder="placeHolder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)" />
    <div v-if="classIcon" class="icon-wrapper">
      <div class="icon" :class="classIcon"></div>
    </div>
    <div v-if="errMsg" class="errMsg">{{ errMsg }}</div>
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
    classInput: {
      type: String,
      default: "",
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
  emits: ["update:modelValue"],

  setup(props) {
    return {};
  },
};
</script>
<style lang=""></style>
