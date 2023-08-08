<template>
  <div ref="comboboxRef" class="combobox position-relative">
    <label class="combobox-wrapper block m-0 w-full">
      {{ label }}
      <span v-show="isRequired" class="text-red">(*)</span>

      <div
        class="combobox-container flex items-center"
        :class="{
          'mt-2': label,
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
          @keydown="handleKeyDown" />
        <div v-show="props.add" class="icon-wrapper btn-add">
          <div class="icon-v1 icon-v1--plus-green-small"></div>
        </div>
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
      style="z-index: 100">
      <!-- :style="{
        top: positionCombobox.bottom + 'px',
        left: positionCombobox.left + 'px',
        minWidth: positionCombobox.width + 'px',
      }" -->
      <div ref="listDataRef" class="combobox-list-container">
        <table>
          <thead>
            <tr>
              <th
                v-for="(field, indexField) in props.fields"
                :key="indexField"
                :style="{
                  minWidth: `${field?.minWidth}px`,
                  maxWidth: `${field?.maxWidth}px`,
                }"
                :title="field?.title">
                <span>{{ field?.text }}</span>
              </th>
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
                  'combobox-item--selected':
                    idSelected === item[props.fieldSelect],
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
                  :title="item[field.name]">
                  <span
                    v-if="field.name === props.fieldShow"
                    :style="{ 'padding-left': `${24 * item?.Grade ?? 0}px` }">
                    {{ item[field.name] }}</span
                  >
                  <span v-else>{{ item[field.name] }}</span>
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
    default: -1,
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
  idSelected: {
    // field selected
    type: String,
    default: "",
  },
  textSelect: {
    type: String,
    default: "",
  },
  valueSelected: {
    type: Object,
    default: new Object(),
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
  "onClickIdSelected",
  "emptyErrMsg",
  "addValueSelected",
  "loadDataLazy",
  "loadDataFilter",
]);
//---end emits--------

//-------start state-----------
const inputRef = ref(null);
const comboboxRef = ref(null);
const listDataRef = ref(null);
const listDataWrapperRef = ref(null);
const isShowCombobox = ref(false);
const isLoading = ref(true);
const searchValue = ref("");
const debounceSearch = useDebounce(searchValue, 500);
const isOutsideCombobox = useClickOutside(comboboxRef);
const positionCombobox = ref({});
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
// console.log(props.fieldShow, debounceSearch.value);
//----------end state

//-------lifecycle

onBeforeMount(() => {
  isLoading.value = true;
  emit("loadDataFilter");
});

onMounted(() => {
  // console.log(comboboxRef.value.getBoundingClientRect());
  // positionCombobox.value.bottom =
  //   comboboxRef.value.getBoundingClientRect().bottom + 8;
  // positionCombobox.value.left = comboboxRef.value.getBoundingClientRect().left;
  // positionCombobox.value.width =
  //   comboboxRef.value.getBoundingClientRect().width;
  // console.log(props.fieldShow, props.valueSelected);
  itemRefs.value = dataListFilter.value.map(() => ref(null));
  if (props.isReloadScroll) {
    listDataWrapperRef.value.addEventListener("scroll", handleScrollList);
  }

  // if (props.idSelected !== "") {
  //   const foundItem = props.dataList.find(
  //     (obj) => obj[props.fieldSelect] === props.idSelected
  //   );

  //   if (foundItem) {
  //     itemSelected.value = { ...foundItem };
  //     searchValue.value = foundItem?.[props.fieldShow] ?? "";
  //   } else {
  //     searchValue.value = props?.valueSelected?.[props.fieldShow] ?? "";
  //   }
  // }
});

onBeforeUpdate(() => {});

onBeforeUnmount(() => {
  listDataWrapperRef.value.removeEventListener("scroll", handleScrollList);
});

//kiểm tra sự thay đổi của debounceSearch
watch(debounceSearch, () => {
  if (props.isReload && !isLoading.value) {
    // emit ra cha để call api
    isLoading.value = true;
    // console.log("emit");
    listDataWrapperRef.value.scrollTop = 0;
    emit("loadDataFilter", debounceSearch.value);
  } else if (props.isReload === false && !isLoading.value) {
    // filter ở client

    dataListFilter.value = props.dataList.filter((item) =>
      removeDiacritics(`${item[props.fieldShow]}`.toLowerCase()).includes(
        removeDiacritics(debounceSearch.value.toLowerCase())
      )
    );
  }
  selectedIndex.value = -1;
});
watchEffect(() => {
  itemSelected.value = { ...props?.valueSelected };
});
watchEffect(() => {
  searchValue.value = props?.valueSelected?.[props.fieldShow] ?? "";
});
// cập nhật dataList
watchEffect(() => {
  if (isOutsideCombobox.value === true) {
    isShowCombobox.value = false;
  }
});
watchEffect(() => {
  dataListFilter.value = [...props.dataList];
  isLoading.value = false;
});
// watchEffect(() => {
//   searchValue.value = props?.valueSelected?.[props.fieldShow] ?? "";
// });

watch(isShowCombobox, () => {
  if (itemSelected.value && Object.keys(itemSelected.value).length > 0) {
    selectedIndex.value = dataListFilter.value.findIndex(
      (obj) => obj[props.fieldSelect] === itemSelected.value[props.fieldSelect]
    );
    if (selectedIndex.value > -1 && itemRefs.value[selectedIndex.value]) {
      listDataWrapperRef.value.scrollTop = selectedIndex.value * 30;
      handleScrollList();
    }
  } else {
    // listDataWrapperRef.value.scrollTop = 0;
  }
});

watchEffect(() => {
  itemRefs.value = dataListFilter.value.map(() => ref(null));
});
//kiểm tra sự thay đổi của idSelected
// watch(props.idSelected, () => {});

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
  itemSelected.value = item;
  searchValue.value = item?.[props?.fieldShow] ?? "";
  isLoading.value = true;
  // emit idSelected ra cho component cha
  emit("onClickIdSelected", item[props.fieldSelect]);
  // emit("addValueSelected", item);
  emit("emptyErrMsg");

  // console.log(item);
  // đóng combox-list
  isShowCombobox.value = false;
  selectedIndex.value = -1; //
};

// bắt sự kiện khi change input
const handleChangeInput = (e) => {
  // if(e.key === "ArrowUp" ||e.key === "ArrowDown" )
  isShowCombobox.value = true;
  searchValue.value = e.target.value;
  emit("onClickIdSelected", "");
  // emit("addValueSelected", null);
  isLoading.value = false;
  itemSelected.value = {};
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
      listDataWrapperRef.value.scrollTop -= 30;
    } else if (selectedIndex.value === 0) {
      selectedIndex.value = dataListFilter.value.length - 1;
      listDataWrapperRef.value.scrollTop =
        listDataWrapperRef.value.scrollHeight -
        listDataWrapperRef.value.clientHeight;
    }
  } else if (e.key === "ArrowDown") {
    console.log(e);
    e.preventDefault();
    isShowCombobox.value = true;
    if (selectedIndex.value < dataListFilter.value.length - 1) {
      selectedIndex.value++;
      if (selectedIndex.value > 3) {
        listDataWrapperRef.value.scrollTop += 30;
      }
    } else if (selectedIndex.value === dataListFilter.value.length - 1) {
      selectedIndex.value = 0;
      listDataWrapperRef.value.scrollTop = 0;
    }
    // scrollDow();
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
          searchValue.value = itemSelected?.value?.[props.fieldShow] ?? "";
        } else {
        }

        isShowCombobox.value = !isShowCombobox.value;
      }
    } else {
      isShowCombobox.value = !isShowCombobox.value;
    }
  } else if (e.key === "Tab") {
    // tìm value input theo idSelected trước đó
    // nếu không chọn thì trả về item selected trước đó
    // if (itemSelected.value[props.fieldShow]) {
    //   searchValue.value = itemSelected.value[props.fieldShow];
    // }
    isShowCombobox.value = false;
    selectedIndex.value = -1;
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
  z-index: 2;
  overflow: auto;
  padding: 2px 1px;
}
tr:hover > td {
  background-color: unset;
}
.btn-add {
  border-right: 1px solid #babec5;
}
</style>
