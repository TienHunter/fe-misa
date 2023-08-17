<template lang="">
  <div ref="dropdowContainerRef" class="dropdown-wrapper">
    <label :class="{ 'disable-dropdown': disabled || readonly }">
      {{ label }}
      <span v-show="required && label" class="text-red">(*)</span>
      <div
        class="dropdown-container flex items-center"
        :class="{
          'mt-2': label,
          'border--focus': isShowDropdown,
          disabled: disabled,
          readonly: readonly,
        }"
        @click="toggleDrodown">
        <input
          type="text"
          class="input m-0 flex-1 border-radius-none"
          :class="{}"
          :tabindex="tabindex"
          :style="{ opacity: disabled ? 0 : 1 }"
          :disabled="disabled || readonly"
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
      <div v-show="titleDropdownList" class="dropdown-item dropdown-item-title">
        {{ titleDropdownList }}
      </div>
      <div
        v-for="(item, index) in data"
        :key="index"
        class="dropdown-item"
        :class="{
          'dropdown-item--selected': item?.[fieldShow] === valueInput,
        }"
        @click="() => onClickSelectItem(item)">
        <span>
          {{ item?.[fieldShow] }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watchEffect, watch } from "vue";
import { useClickOutside } from "@/hooks";
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
    tabindex: {
      type: Number,
      default: 0,
    },
    data: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      required: true,
    },
    fieldSelect: {
      type: String,
      required: true,
    },
    fieldShow: {
      type: String,
      required: true,
    },
    itemSelected: {
      type: Object,
      default: () => ({}),
    },
    titleDropdownList: {
      type: String,
      default: "",
    },
    direct: {
      type: String,
      default: "down",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["onClickSelectItem"],
  setup(props, ctx) {
    const valueInput = ref("");
    const isShowDropdown = ref(false);
    const toggleDrodown = () => {
      isShowDropdown.value = !isShowDropdown.value;
    };
    const dropdowContainerRef = ref(false);
    const isOutsideDropdown = useClickOutside(dropdowContainerRef);
    onMounted(() => {
      if (valueInput.value === "") {
        valueInput.value = props.titleDropdownList;
      }
    });
    // watchEffect(() => {
    //   console.log(valueInput.value);
    // });
    watchEffect(() => {
      if (isOutsideDropdown.value === true) {
        isShowDropdown.value = false;
      }
    });

    watchEffect(() => {
      if (props.itemSelected) {
        // console.log("field show", props.fieldShow, props.itemSelected);
        const foundItem = props.data.find(
          (obj) =>
            obj[props?.fieldSelect] ===
            props?.itemSelected?.[props?.fieldSelect]
        );
        if (foundItem) {
          // console.log(foundItem[props?.fieldShow]);
          valueInput.value = foundItem[props?.fieldShow];
        }
        // console.log(props.itemSelected);
      }
    });
    const onClickSelectItem = (item) => {
      // add text cho input
      // valueInput.value = item[props.fieldShow];
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
      dropdowContainerRef,
    };
  },
};
</script>
<style scoped>
.disabled {
  background-color: #eff0f2 !important;
}
.readonly {
  pointer-events: none;
  background-color: #eff0f2;
}
</style>
