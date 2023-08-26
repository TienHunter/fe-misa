<template lang="">
  <div ref="comboboxRef" class="combobox">
    <label class="combobox-wrapper block m-0 w-full">
      {{ label }}
      <span v-show="isRequired" class="text-red">(*)</span>

      <div
        class="combobox-container flex items-center"
        :class="{
          'mt-1': label,
          'border--focus': isShowCombobox,
          'border--red': errMsg,
        }">
        <input
          ref="inputRef"
          type="text"
          class="input combobox-input flex-1 m-0"
          :title="errMsg"
          :tabindex="tabIndex"
          :placeholder="placeHolder"
          :value="searchValue"
          @input="handleChangeInput"
          @keydown="handleKeyDown"
          @focus="focus" />
        <div
          class="icon-wrapper combobox-icon"
          :class="{ active: isShowCombobox }"
          @click="toggleCombobox">
          <div class="icon icon--down-small-black"></div>
        </div>
      </div>
    </label>
    <div
      v-show="isShowCombobox"
      class="combobox-list-wrapper"
      style="z-index: 11; min-width: 100%"
      @scroll.stop="">
      <ul
        ref="listDataWrapperRef"
        class="combobox-list"
        :class="classList"
        @scroll.stop="">
        <template v-if="dataListFilter?.length > 0">
          <li
            v-for="(item, index) in dataListFilter"
            :ref="itemRefs[index]"
            :key="index"
            class="combobox-item"
            :class="{
              'combobox-item--selected': idSelected === item[fieldSelect],
              'combobox-item--hover': selectedIndex === index,
            }"
            @click="() => onClickComboboxItem(item, index)">
            {{ item[fieldShow] }}
          </li>
        </template>
        <template v-else>
          <li class="combobox-item">Không tìm thấy dữ liệu</li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import {
  ref,
  watch,
  computed,
  onMounted,
  watchEffect,
  onBeforeMount,
  onBeforeUpdate,
} from "vue";
import { useClickOutside, useDebounce } from "@/hooks";
import { removeDiacritics } from "@/utils/helper";
import { onBeforeRouteUpdate } from "vue-router";
export default {
  props: {
    label: {
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
    dataList: {
      type: Array,
      default: () => [],
    },
    fieldSelect: {
      type: String,
      required: true,
    },
    fieldShow: {
      type: String,
      required: true,
    },
    direct: {
      type: String,
      default: "show",
    },
    classList: {
      type: String,
      default: "",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    idSelected: {
      type: [String, Number],
      default: null,
    },
    errMsg: {
      type: String,
      default: "",
    },
    isReload: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:modelValue",
    "onClickIdSelected",
    "emptyErrMsg",
    "addValueSelected",
  ],

  setup(props, { emit }) {
    const inputRef = ref(null);
    const comboboxRef = ref(null);
    const listDataWrapperRef = ref(null);
    const isShowCombobox = ref(false);
    const positionCombobox = ref({});
    const searchValue = ref("");
    const debounceSearch = useDebounce(searchValue, 500);
    const isOutsideCombobox = useClickOutside(comboboxRef);
    // console.log(props.dataList);
    const dataListFilter = ref([]);
    const itemRefs = ref([]);
    const itemSelected = ref({});
    const selectedIndex = ref(
      computed(() =>
        props.dataList.findIndex(
          (item) => item[props.fieldSelect] === props.idSelected
        )
      )?.value ?? -1
    );
    const isLoading = ref(true);

    onMounted(() => {
      itemRefs.value = dataListFilter.value.map(() => ref(null));
      positionCombobox.value.bottom =
        comboboxRef.value.getBoundingClientRect().bottom + 8;
      positionCombobox.value.left =
        comboboxRef.value.getBoundingClientRect().left;
      positionCombobox.value.width =
        comboboxRef.value.getBoundingClientRect().width;
      // console.log(listDataWrapperRef.value);
    });

    //kiểm tra sự thay đổi của debounceSearch
    watch(debounceSearch, () => {
      if (!isLoading.value === true) {
        isLoading.value = false;
        if (props.isReload) {
          // emit ra cha để call api
        } else {
          // filter ở client

          dataListFilter.value = props.dataList.filter((item) =>
            removeDiacritics(
              (item?.[props.fieldShow] ?? "").toLowerCase()
            ).includes(
              removeDiacritics(debounceSearch?.value ?? "").toLowerCase()
            )
          );
        }
      }

      selectedIndex.value = -1;
    });
    // cập nhật dataList
    watchEffect(() => {
      dataListFilter.value = [...props.dataList];
    });

    watchEffect(() => {
      selectedIndex.value = -1;
      itemRefs.value = dataListFilter.value.map(() => ref(null));
    });
    //kiểm tra sự thay đổi của idSelected
    watchEffect(() => {
      const foundItem = props.dataList.find(
        (obj) => obj?.[props.fieldSelect] === props?.idSelected
      );
      const index = props.dataList.findIndex(
        (obj) => obj?.[props.fieldSelect] === props?.idSelected
      );
      if (index !== -1 && foundItem) {
        itemSelected.value = { ...foundItem };
        searchValue.value = foundItem[props.fieldShow];
        selectedIndex.value = index;
      } else {
        searchValue.value = "";
        selectedIndex.value = -1;
      }
    });

    watchEffect(() => {
      if (isShowCombobox.value === true) {
        if (props.idSelected) {
          const index = dataListFilter.value.findIndex(
            (el) => el[props.fieldSelect] === props.idSelected
          );
          if (index !== -1) {
            selectedIndex.value = index;
          }
        }
      }
    });
    // watchEffect(() => {
    //   if (selectedIndex.value != -1) {
    //     listDataWrapperRef.value.scroll = selectedIndex.value * 30 - 2;
    //     // if (itemRefs?.value[selectedIndex.value]?.value) {
    //     //   itemRefs.value[selectedIndex.value].value[0].scrollIntoView();
    //     // }
    //   }
    // });
    watch(isShowCombobox, () => {
      if (itemSelected.value && Object.keys(itemSelected.value).length > 0) {
        selectedIndex.value = dataListFilter.value.findIndex(
          (obj) =>
            obj[props.fieldSelect] === itemSelected.value[props.fieldSelect]
        );
        if (selectedIndex.value > -1 && itemRefs.value[selectedIndex.value]) {
          listDataWrapperRef.value.scrollTop = selectedIndex.value * 30;
        }
      }
    });

    watchEffect(() => {
      if (isOutsideCombobox.value === true) {
        isShowCombobox.value = false;
      }
    });

    // focus input
    const focus = () => {
      inputRef.value.focus();
      select();
    };
    const select = () => {
      inputRef.value.select();
    };
    // ẩn hiện combolist khi click chuột
    const toggleCombobox = () => {
      isShowCombobox.value = !isShowCombobox.value;
      if (isShowCombobox.value === false) {
        selectedIndex.value = -1;
      }
    };

    // chọn item được selected
    const onClickComboboxItem = (item) => {
      itemSelected.value = item;
      searchValue.value = item[props.fieldShow];
      isLoading.value = true;
      if (item[props.fieldSelect] !== props.idSelected) {
        emit("onClickIdSelected", item[props.fieldSelect]);
        emit("addValueSelected", item[props.fieldShow]);
        emit("emptyErrMsg");
      }

      isShowCombobox.value = false;
      selectedIndex.value = -1; //
    };

    // bắt sự kiện khi change input
    const handleChangeInput = (e) => {
      // if(e.key === "ArrowUp" ||e.key === "ArrowDown" )
      isLoading.value = false;
      isShowCombobox.value = true;
      searchValue.value = e.target.value;
      itemSelected.value = {};
      emit("onClickIdSelected", "");
      // emit("update:modelValue", e.target.value);
      emit("emptyErrMsg");
    };

    // bắt sự kiện lên xuống enter tab
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        isShowCombobox.value = true;

        if (selectedIndex.value > 0) {
          selectedIndex.value--;
        } else if (selectedIndex.value === 0) {
          selectedIndex.value = dataListFilter.value.length - 1;
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        isShowCombobox.value = true;

        if (selectedIndex.value < dataListFilter.value.length - 1) {
          selectedIndex.value++;
        } else if (selectedIndex.value === dataListFilter.value.length - 1) {
          selectedIndex.value = 0;
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isShowCombobox.value) {
          // nếu đã di chuyển phím để chọn item
          if (selectedIndex.value != -1) {
            const itemSelect = dataListFilter.value[selectedIndex.value];
            if (itemSelect) {
              onClickComboboxItem(itemSelect);
            }
          } else {
            // nếu không chọn thì trả về item selected trước đó nếu có
            if (itemSelected.value) {
              searchValue.value = itemSelected.value.value;
            } else {
              searchValue.value = "";
            }

            isShowCombobox.value = !isShowCombobox.value;
          }
        } else {
          isShowCombobox.value = !isShowCombobox.value;
        }
      } else if (e.key === "Tab") {
        // tìm value input theo idSelected trước đó
        // nếu không chọn thì trả về item selected trước đó
        if (itemSelected.value.value) {
          searchValue.value = itemSelected.value.value;
        }
        isShowCombobox.value = false;
        selectedIndex.value = -1;
      }
    };

    return {
      inputRef,
      listDataWrapperRef,
      isShowCombobox,
      selectedIndex,
      toggleCombobox,
      onClickComboboxItem,
      handleChangeInput,
      handleKeyDown,
      dataListFilter,
      searchValue,
      debounceSearch,
      itemSelected,
      itemRefs,
      comboboxRef,
      focus,
      select,
      positionCombobox,
    };
  },
};
</script>
<style></style>
