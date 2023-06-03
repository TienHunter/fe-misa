<template>
  <div class="btn" :tabindex="tabIndex" @keydown.tab.stop="">{{ title }}</div>

  <!-- sử dụng ít nêu không cho tái sử dụng nữa -->
  <!-- <div
    v-else-if="buttonType === ButtonType.icon"
    class="btn-icon flex items-center justify-center">
    <div class="icon icon--plus"></div>
  </div>
  <div v-else-if="buttonType === ButtonType.combo" class="btn-combobox">
    <div class="btn-combobox__button btn btn--pri">{{ title }}</div>
    <div class="vertical-border"></div>
    <div class="btn-combobox__icon icon-wrapper">
      <div class="icon icon--chevron-left-medium-white"></div>
    </div>
  </div>
  <div v-else-if="buttonType === ButtonType.wIcon" class="btn-w-icon">
    <div class="icon-wrapper">
      <div class="icon icon--warning-medium"></div>
    </div>
    <span class="text">{{ title }}</span>
  </div> -->
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {},
};
</script>
<style lang=""></style>
