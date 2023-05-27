<template lang="">
  <div class="dropdown-wrapper">
    <label for="" class="w-auto">
      {{ label }}
      <span v-show="required && label" class="text-red">(*)</span>
      <div
        class="dropdown-container flex items-center"
        :class="{ 'mt-2': label, 'border--focus': isShowDropdown }">
        <input
          type="text"
          class="m-0 flex-1 border-radius-none"
          readonly
          :value="valueInput" />
        <div
          class="icon-wrapper"
          :class="{ active: isShowDropdown }"
          @click="toggleDrodown">
          <div class="icon icon--down-small-black"></div>
        </div>
      </div>
    </label>
    <div
      v-if="isShowDropdown"
      class="dropdown-list w-full"
      :class="{ 'dropdown-list--up': direct === 'up' }">
      <div class="dropdown-item dropdown-item-title">
        {{ titleDropdownList }}
      </div>
      <div
        v-for="(item, index) in data"
        :key="index"
        class="dropdown-item"
        :class="item?.text === valueInput ? 'dropdown-item--selected' : ''"
        @click="onClickDropdownIten(item)">
        {{ item?.text }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      defalut: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    titleDropdownList: {
      type: String,
      default: "",
    },
    direct: {
      type: String,
      default: "down",
    },
  },
  emits: [],
  setup(props) {
    const valueInput = ref(props.titleDropdownList);
    const isShowDropdown = ref(false);
    const toggleDrodown = () => {
      isShowDropdown.value = !isShowDropdown.value;
    };
    const onClickDropdownIten = (item) => {
      // add text cho input
      valueInput.value = item.text;
      // add value cho biến toàn cục

      // đóng dropdown
      toggleDrodown();
    };
    return {
      valueInput,
      isShowDropdown,
      onClickDropdownIten,
      toggleDrodown,
    };
  },
};
</script>
<style lang=""></style>
