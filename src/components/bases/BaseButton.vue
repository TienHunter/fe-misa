<template>
  <div
    v-if="buttonType === ButtonType.pri"
    class="btn btn--pri"
    @click="handleClick">
    {{ title }}
  </div>
  <div
    v-else-if="buttonType === ButtonType.sub"
    class="btn btn--sub"
    @click="handleClick">
    {{ title }}
  </div>
  <div
    v-else-if="buttonType === ButtonType.link"
    class="btn btn--link"
    @click="handleClick">
    {{ title }}
  </div>
  <div
    v-else-if="buttonType === ButtonType.icon"
    class="btn-icon flex items-center justify-center"
    @click="handleClick">
    <div class="icon icon--plus"></div>
  </div>
  <div
    v-else-if="buttonType === ButtonType.combo"
    class="btn-combobox"
    @click="handleClick">
    <div class="btn-combobox__button btn btn--pri">{{ title }}</div>
    <div class="vertical-border"></div>
    <div class="btn-combobox__icon icon-wrapper">
      <div class="icon icon--chevron-left-medium-white"></div>
    </div>
  </div>
  <div
    v-else-if="buttonType === ButtonType.wIcon"
    class="btn-w-icon"
    @click="handleClick">
    <div class="icon-wrapper">
      <div class="icon icon--warning-medium"></div>
    </div>
    <span class="text">{{ title }}</span>
  </div>
</template>
<script>
import { ref } from "vue";
import { ButtonType } from "@/constants";
export default {
  props: {
    classButton: {
      type: String,
      default: "",
    },
    buttonType: {
      type: String,
      default: "PRIMARY",
    },
    title: {
      type: String,
      default: "",
    },

    handleClick: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    // eslint-disable-next-line vue/no-dupe-keys
    return { handleClick: props.handleClick, ButtonType };
  },
};
</script>
<style lang=""></style>
