<template>
  <div
    v-if="type === ButtonType.primary"
    ref="btn"
    class="btn btn--primary"
    :class="{ 'is-round': round, [`btn--${size}`]: size !== 'default' }"
    :tabindex="tabIndex"
    @keydown.tab.stop=""
    @click="onClick">
    {{ title }}
  </div>

  <div
    v-else-if="type === ButtonType.combo"
    ref="btn"
    class="btn--combo"
    @keydown.tab.stop="">
    <div
      class="btn--combo__button flex items-center"
      :class="{ 'is-round': round, [`btn--${size}`]: size }"
      :tabindex="tabIndex"
      @click="onClick">
      <span class="combo-button--text">
        {{ title }}
      </span>
    </div>
    <div
      class="btn--combo__icon flex items-center"
      :class="{ 'is-round': round, [`btn--${size}`]: size }"
      :tabindex="tabIndex">
      <div class="icon-wrapper">
        <div class="icon icon--chevron-left-medium-white"></div>
      </div>
    </div>
  </div>
  <div
    v-else
    ref="btn"
    class="btn btn--secondary"
    :class="{ 'is-round': round, [`btn--${size}`]: size }"
    :tabindex="tabIndex"
    @keydown.tab.stop=""
    @click="onClick">
    {{ title }}
  </div>
  <!-- <div v-if="type === ButtonType.pri">
  
  </div>
  <div
    v-else-if="type === ButtonType.icon"
    class="btn-icon flex items-center justify-center">
    <div class="icon icon--plus"></div>
  </div>
  <div v-else-if="type === ButtonType.combo" class="btn--combobox">
    <div class="btn--combobox__button btn btn--pri">{{ title }}</div>
    <div class="vertical-border"></div>
    <div class="btn--combobox__icon icon-wrapper">
      <div class="icon icon--chevron-left-medium-white"></div>
    </div>
  </div>
  <div v-else-if="type === ButtonType.wIcon" class="btn-w-icon">
    <div class="icon-wrapper">
      <div class="icon icon--warning-medium"></div>
    </div>
    <span class="text">{{ title }}</span>
  </div> -->
</template>
<script>
import { ref } from "vue";
import { ButtonType } from "@/enums";
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
    type: {
      type: String,
      default: "secondary",
      validator: function (value) {
        // Kiểm tra nếu giá trị là một trong các giá trị hợp lệ
        return ["primary", "secondary", "combo"].includes(value);
      },
    },
    size: {
      type: String,
      default: "default",
      validator: function (value) {
        // Kiểm tra nếu giá trị là một trong các giá trị hợp lệ
        return ["medium", "small", "mini"].includes(value);
      },
    },
    round: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const btn = ref(null);

    const focus = () => {
      btn.value.focus();
    };
    return {
      btn,
      focus,
      ButtonType,
    };
  },
};
</script>
<style></style>
