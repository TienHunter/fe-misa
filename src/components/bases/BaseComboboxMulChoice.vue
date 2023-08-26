<template>
  <div ref="comboboxRef" class="combobox">
    <label class="combobox-wrapper block m-0 w-full">
      {{ label }}
      <span v-show="isRequired" class="text-red">(*)</span>

      <div
        class="combobox-container flex items-stretch"
        :class="{
          'mt-1': label,
          'border--focus': isShowCombobox,
          'border--red': errMsg,
        }">
        <div class="select-option">
          <div
            v-for="item in itemsSelected"
            :key="item[props.fieldSelect]"
            class="flex items-center justify-center selected-item"
            :title="item[props.fieldShow]">
            <div class="item-text">{{ item[props.fieldShow] }}</div>
            <div
              class="icon-wrapper mr-1 w-4 h-4"
              @click.stop="() => onClickComboboxItem(item)">
              <div class="icon-v1 icon-v1--close-mini"></div>
            </div>
          </div>

          <input
            ref="inputRef"
            type="text"
            class="input combobox-input flex-1 m-0 p-0"
            style="min-width: 120px; height: 24px"
            :title="errMsg"
            :tabindex="tabIndex"
            :placeholder="placeHolder"
            :value="searchValue"
            @input="handleChangeInput"
            @keydown="handleKeyDown"
            @focus="focus"
            @blur="blur" />
        </div>
        <div class="flex items-center">
          <div v-show="props.add" class="icon-wrapper btn-add h-full">
            <div class="icon-v1 icon-v1--plus-green-small"></div>
          </div>
          <div
            class="icon-wrapper combobox-icon h-full"
            :class="{ active: isShowCombobox }"
            @click="toggleCombobox">
            <div class="icon icon--down-small-black"></div>
          </div>
        </div>
      </div>
    </label>
    <div
      v-show="isShowCombobox"
      class="combobox-list-wrapper"
      style="z-index: 2">
      <div ref="listDataRef" class="combobox-list-container">
        <table>
          <thead>
            <tr>
              <th
                v-for="(field, index) in props.fields"
                :key="index"
                :style="{
                  minWidth: `${field?.minWidth}px`,
                  maxWidth: `${field?.maxWidth}px`,
                }"
                :title="field?.title">
                <span>{{ field?.label }}</span>
              </th>
              <th
                :style="{
                  minWidth: '40px',
                  maxWidth: '40px',
                }"></th>
            </tr>
          </thead>
        </table>
      </div>
      <div ref="listDataWrapperRef" class="combobox-list-container tbody">
        <table>
          <tbody>
            <template v-if="dataListFilter?.length > 0">
              <tr
                v-for="(item, index) in dataListFilter"
                :ref="itemRefs[index]"
                :key="index"
                class="combobox-item"
                :class="{
                  'combobox-item--hover': selectedIndex === index,
                }"
                @click="() => onClickComboboxItem(item, index)">
                <td
                  v-for="(field, indexField) in props.fields"
                  :key="indexField"
                  :style="{
                    minWidth: `${field?.minWidth}px`,
                    maxWidth: `${field?.maxWidth}px`,
                  }"
                  :class="{
                    'font-bold': item?.IsParent,
                  }"
                  :title="field?.title">
                  <span
                    v-if="field.name == props.fieldShow"
                    :style="{ 'padding-left': `${24 * item?.Grade ?? 0}px` }">
                    {{ item[field.name] }}</span
                  >
                  <span v-else>{{ item[field.name] }}</span>
                </td>
                <td style="min-width: 40px">
                  <div class="flex items-center justify-center w-full">
                    <div
                      v-show="
                        props.idsSelected.includes(item[props.fieldSelect])
                      "
                      class="icon-v1 icno-v1--check-small"></div>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td :colspan="props?.fields?.length ?? 0" class="font-italic">
                  {{ FreeText.notFoundRecord }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  watchEffect,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
} from "vue";
import { useClickOutside, useDebounce } from "@/hooks";
import { removeDiacritics } from "@/utils/helper";
import { FreeText } from "@/resources";
//---start props-----
const props = defineProps({
  add: {
    type: Boolean,
    default: false,
  },
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
  fields: {
    type: Array,
    default: new Array(),
    required: true,
  },
  fieldSelect: {
    type: String,
    default: "",
    required: true,
  },
  fieldShow: {
    type: String,
    default: "",
    required: true,
  },
  idsSelected: {
    // field selected
    type: Array,
    default: new Array(),
  },
  dataList: {
    type: Array,
    default: () => [],
    required: true,
  },
  direct: {
    type: String,
    default: "show",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },

  errMsg: {
    type: String,
    default: "",
  },
  isReload: {
    type: Boolean,
    default: false,
  },
  isReloadScroll: {
    type: Boolean,
    default: false,
  },
});
//---end props------

// --start emits----
const emit = defineEmits([
  "update:modelValue",
  "onClickIdsSelected",
  "emptyErrMsg",
  "addValueSelected",
  "loadDataLazy",
  "loadDataFilter",
  "loadData",
]);
//---end emits--------

//-------start state-----------
const inputRef = ref(null);
const comboboxRef = ref(null);
const listDataRef = ref(null);
const listDataWrapperRef = ref(null);
const isShowCombobox = ref(false);
const isLoading = ref(false);
const searchValue = ref("");
const debounceSearch = useDebounce(searchValue, 500);
const isOutsideCombobox = useClickOutside(comboboxRef);
// console.log(props.dataList);
const dataListFilter = ref([]);
const itemRefs = ref([]);
const itemsSelected = ref([]);
const selectedIndex = ref(-1);
//----------end state

//-------lifecycle

onBeforeMount(() => {
  isLoading.value = true;
  // emit("loadData");
});

watchEffect(() => {
  itemRefs.value = dataListFilter.value.map(() => ref(null));
  if (props?.idsSelected?.length > 0) {
    const foundItems = props.dataList.filter((obj) =>
      props.idsSelected.includes(obj[props.fieldSelect])
    );
    if (foundItems?.length > 0) {
      itemsSelected.value = [...foundItems];
    }
  }
});

onBeforeUpdate(() => {});

onBeforeUnmount(() => {});
watchEffect(() => {
  if (isOutsideCombobox.value === true) {
    console.log("??");
    isShowCombobox.value = false;
  }
});
//kiểm tra sự thay đổi của debounceSearch
watch(debounceSearch, () => {
  if (props.isReload && !isLoading.value) {
    // emit ra cha để call api
    // isLoading.value = true;
    // listDataWrapperRef.value.scrollTop = 0;
    // emit("loadDataFilter", debounceSearch.value);
  } else {
    // filter ở client

    dataListFilter.value = props.dataList.filter((item) => {
      for (const field of props.fields) {
        let isFound = removeDiacritics(
          `${item[field.name]}`.toLowerCase()
        ).includes(removeDiacritics(debounceSearch.value.toLowerCase()));

        if (isFound === true) return isFound;
      }
      return false;
    });
  }
  selectedIndex.value = -1;
});
// cập nhật dataList
watchEffect(() => {
  dataListFilter.value = props.dataList;
  isLoading.value = false;
});

watchEffect(() => {
  if (selectedIndex.value !== -1)
    if (itemRefs?.value[selectedIndex.value]?.value?.[0])
      itemRefs?.value[selectedIndex.value]?.value[0].scrollIntoView();
});
// ---------end lifecycle

//----------start medthos
// focus input
const handleScrollList = async () => {
  // console.log("scrol...");
  const clientHeight = listDataWrapperRef.value.clientHeight;
  const scrollHeight = listDataWrapperRef.value.scrollHeight;
  const maxScroll = scrollHeight - clientHeight;
  const scrollTop = listDataWrapperRef.value.scrollTop;
  // Khi người dùng cuộn đến cuối trang, tải thêm dữ liệu
  if (
    maxScroll - scrollTop < 48 &&
    clientHeight !== scrollHeight &&
    !isLoading.value
  ) {
    isLoading.value = true;
    emit("loadDataLazy", debounceSearch.value);
  }
};

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
  selectedIndex.value = -1;
};

// chọn item được selected
const onClickComboboxItem = (item) => {
  // itemSelected.value = item;
  isLoading.value = true;
  // emit idSelected ra cho component cha
  const index = itemsSelected.value.findIndex(
    (el) => el[props.fieldSelect] === item[props.fieldSelect]
  );
  if (index === -1) {
    itemsSelected.value.push(item);
  } else {
    itemsSelected.value.splice(index, 1);
  }
  let listId = itemsSelected.value.map((el) => el[props.fieldSelect]);
  emit("onClickIdsSelected", listId);
  emit("emptyErrMsg");
};

// bắt sự kiện khi change input
const handleChangeInput = (e) => {
  // if(e.key === "ArrowUp" ||e.key === "ArrowDown" )

  isShowCombobox.value = true;
  searchValue.value = e.target.value;
  // console.log(searchValue.value);
  isLoading.value = false;
  selectedIndex.value = -1;
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
      listDataWrapperRef.value.scrollTop -= 48;
    } else if (selectedIndex.value === 0) {
      selectedIndex.value = dataListFilter.value.length - 1;
      listDataWrapperRef.value.scrollTop =
        listDataWrapperRef.value.scrollHeight -
        listDataWrapperRef.value.clientHeight;
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    isShowCombobox.value = true;
    if (selectedIndex.value < dataListFilter.value.length - 1) {
      selectedIndex.value++;
      if (selectedIndex.value > 0) {
        listDataWrapperRef.value.scrollTop += 48;
      }
    } else if (selectedIndex.value === dataListFilter.value.length - 1) {
      selectedIndex.value = 0;
      listDataWrapperRef.value.scrollTop = 0;
    }
    // scrollDow();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (isShowCombobox.value === true) {
      // nếu đã di chuyển phím để chọn item
      if (selectedIndex.value !== -1) {
        const itemSelect = dataListFilter.value[selectedIndex.value];
        if (itemSelect) {
          onClickComboboxItem(itemSelect);
        }
      }
    } else {
      isShowCombobox.value = !isShowCombobox.value;
    }
  } else if (e.key === "Tab") {
    searchValue.value = "";
    isShowCombobox.value = false;
    selectedIndex.value = -1;
  } else if (e.key === "Backspace") {
    if (searchValue.value === "") {
      // console.log("run here");
      itemsSelected.value.splice(itemsSelected.value.length - 1, 1);
      let listId = itemsSelected.value.map((el) => el[props.fieldSelect]);
      emit("onClickIdsSelected", listId);
      emit("emptyErrMsg");
    }
  }
};

const blur = () => {
  if (searchValue.value) {
    searchValue.value = "";
  }
};

//-------------end methods
</script>
<style scoped>
/* .combobox-list-wrapper {
  width: unset;
} */
th,
td {
  border: unset !important;
}
/* table {
  max-height: 100px;
} */
.tbody {
  max-height: 160px;

  overflow: auto;
  padding: 2px 1px;
  z-index: 2;
}
tr:hover > td {
  background-color: unset;
}
.selected-item {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #f0f0f0;
  padding: 1px 3px 1px 5px;
  margin: 1px 3px;
  max-width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-text {
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.btn-add {
  border-right: 1px solid #babec5;
}
.select-option {
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  flex-wrap: wrap;
  width: calc(100% - 32px);
  align-items: center;
  padding: 0 0 0 10px;
}
</style>
