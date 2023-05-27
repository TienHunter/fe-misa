<template lang="">
  <div>
    <div class="combobox">
      <label for="" class="combobox-wrapper block m-0 w-full">
        {{ label }}
        <span v-show="required" class="text-red">(*)</span>

        <div
          class="combobox-container flex items-center"
          :class="{ 'mt-2': label, 'border--focus': isShowCombobox }">
          <input
            type="text"
            class="combobox-input flex-1 m-0"
            :placeholder="placeHolder" />
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
          v-for="(iten, index) in dataList"
          :key="index"
          class="combobox-item"
          @click="onClickComboboxItem(item)">
          {{ item.value }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    label: {
      tyoe: String,
      default: "",
    },
    required: {
      tyoe: Boolean,
      default: false,
    },
    placeHolder: {
      type: String,
      default: "",
    },
    direct: {
      type: String,
      default: "show",
    },
  },

  setup(props) {
    const valueInput = ref("");
    const isShowCombobox = ref(false);

    const toggleCombobox = () => {
      isShowCombobox.value = !isShowCombobox.value;
    };
    const onClickComboboxItem = (item) => {
      // add text cho input
      valueInput.value = item.text;
      // add value cho biến toàn cục

      // đóng combox-list
      toggleCombobox();
    };

    return {
      valueInput,
      isShowCombobox,
      toggleCombobox,
      onClickComboboxItem,
    };
  },
};
</script>
<style></style>
