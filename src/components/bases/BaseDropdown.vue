<template lang="">
  <div class="dropdown-wrapper">
    <label class="w-auto">
      {{ label }}
      <span v-show="required && label" class="text-red">(*)</span>
      <div
        class="dropdown-container flex items-center"
        :class="{ 'mt-2': label, 'border--focus': isShowDropdown }">
        <input
          type="text"
          class="input m-0 flex-1 border-radius-none"
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
        @click="onClickSelectItem(item)">
        {{ item?.text }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
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
    itemSelected: {},
    titleDropdownList: {
      type: String,
      default: "",
    },
    direct: {
      type: String,
      default: "down",
    },
  },
  emits: ["onClickSelectItem"],
  setup(props, ctx) {
    const valueInput = ref(props.titleDropdownList);
    const isShowDropdown = ref(false);
    const toggleDrodown = () => {
      isShowDropdown.value = !isShowDropdown.value;
    };
    onMounted(() => {
      if (props.itemSelected) {
        const foundItem = props.data.find(
          (obj) => obj.value === props.itemSelected
        );
        if (foundItem) {
          valueInput.value = foundItem.text;
        }
      }
    });
    const onClickSelectItem = (item) => {
      // add text cho input
      valueInput.value = item.text;
      // emit event
      ctx.emit("onClickSelectItem", item);

      // đóng dropdown
      toggleDrodown();
    };
    return {
      valueInput,
      isShowDropdown,
      onClickSelectItem,
      toggleDrodown,
    };
  },
};
</script>
<style lang=""></style>
