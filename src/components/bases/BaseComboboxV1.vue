<template>
  <div ref="comboboxRef" class="combobox position-relative">
    <label
      class="combobox-wrapper block m-0 w-full"
      :class="{ disabled: disabled }">
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
          :title="errMsg || searchValue"
          :tabindex="tabIndex"
          :placeholder="placeHolder"
          :disabled="disabled"
          :value="searchValue"
          @input="handleChangeInput"
          @keydown="handleKeyDown"
          @focus="focus"
          @blur="blur" />
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
    <Teleport to="body">
      <div
        v-show="isShowCombobox"
        ref="listDataWrapperRef"
        class="combobox-list-wrapper"
        style="z-index: 100"
        :style="{
          top: showBottom ? positionList.top + 'px' : 'unset',
          left: showLeft ? positionList.left + 'px' : 'unset',
          bottom: showBottom ? 'unset' : positionList.bottom + 'px',
          right: showLeft ? 'unset' : positionList.right + 'px',
          minWidth: positionCombobox.width + 'px',
        }">
        <!-- :style="{
        top: positionCombobox.bottom + 'px',
        left: positionCombobox.left + 'px',
        minWidth: positionCombobox.width + 'px',
      }" -->
        <div class="combobox-list-container">
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
                  :class="field?.class ?? ''"
                  :title="field?.title">
                  <span>{{ field?.label }}</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div ref="listDataRef" class="combobox-list-container tbody">
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
                      [field?.class]: true,
                    }"
                    :title="item[field?.name]">
                    <span
                      v-if="field?.name === props.fieldShow"
                      :style="{ 'padding-left': `${24 * item?.Grade ?? 0}px` }">
                      {{ item[field.name] }}</span
                    >
                    <span v-else>{{ item[field?.name] }}</span>
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
    </Teleport>
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
  nextTick,
} from "vue";
import { useClickOutside, useDebounce } from "@/hooks";
import { removeDiacritics } from "@/utils/helper";
import { FreeText } from "@/resources";
//---start props-----
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
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
    default: "down",
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
  "notSelectedYet",
  "addValueSelected",
  "loadDataLazy",
  "loadDataFilter",
]);
//---end emits--------

//-------start state-----------
const inputRef = ref(null);
const comboboxRef = ref(null);
const listDataWrapperRef = ref(null);
const listDataRef = ref(null);
const isShowCombobox = ref(false);
const isLoading = ref(true);
const searchValue = ref("");
const debounceSearch = useDebounce(searchValue, 500);
const isOutsideCombobox = useClickOutside(comboboxRef);
const positionCombobox = ref({});
const positionList = ref({});
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

const showLeft = ref(true);
const showBottom = ref(true);
//----------end state

//-------lifecycle

onBeforeMount(() => {
  isLoading.value = true;
  emit("loadDataFilter");
});

onMounted(() => {
  // console.log(props.fieldShow, props.valueSelected);

  itemRefs.value = dataListFilter.value.map(() => ref(null));
  if (props.isReloadScroll) {
    listDataRef.value.addEventListener("scroll", handleScrollList);
  }
});

onBeforeUpdate(() => {});

onBeforeUnmount(() => {
  listDataRef.value.removeEventListener("scroll", handleScrollList);
});

//kiểm tra sự thay đổi của debounceSearch
watch(debounceSearch, () => {
  if (props.isReload && !isLoading.value) {
    // emit ra cha để call api
    isLoading.value = true;
    // console.log("emit");
    listDataRef.value.scrollTop = 0;
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
  // console.log(typeof itemSelected.value);
});
watchEffect(() => {
  if (
    typeof itemSelected.value === "object" &&
    itemSelected.value &&
    Object.keys(itemSelected.value).length > 0
  ) {
    searchValue.value = itemSelected.value?.[props.fieldShow] ?? "";
  }
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
    if (selectedIndex.value > -1) {
      listDataRef.value.scrollTop = selectedIndex.value * 30;
      handleScrollList();
    }
  } else {
    // listDataRef.value.scrollTop = 0;
  }
});
watchEffect(() => {
  if (isShowCombobox.value || !isShowCombobox.value) {
    nextTick(() => {
      positionCombobox.value.top =
        comboboxRef.value.getBoundingClientRect().top;
      positionCombobox.value.bottom =
        comboboxRef.value.getBoundingClientRect().bottom;
      positionCombobox.value.left =
        comboboxRef.value.getBoundingClientRect().left;
      positionCombobox.value.right =
        comboboxRef.value.getBoundingClientRect().right;
      positionCombobox.value.width =
        comboboxRef.value.getBoundingClientRect().width;

      // Lấy chiều cao và chiều rộng của cửa sổ trình duyệt
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowWidth =
        window.innerWidth || document.documentElement.clientWidth;
      if (
        windowHeight <
        positionCombobox.value.bottom +
          listDataWrapperRef.value.getBoundingClientRect().height
      ) {
        showBottom.value = false;
        positionList.value.bottom =
          windowHeight - positionCombobox.value.top + 4;
      } else {
        showBottom.value = true;
        positionList.value.top = positionCombobox.value.bottom + 4;
      }
      if (
        windowWidth <
        positionCombobox.value.left +
          listDataWrapperRef.value.getBoundingClientRect().width
      ) {
        showLeft.value = false;
        positionList.value.right = windowWidth - positionCombobox.value.right;
      } else {
        showLeft.value = true;
        positionList.value.left = positionCombobox.value.left;
      }
      // console.log(
      //   positionCombobox.value,
      //   listDataWrapperRef.value.getBoundingClientRect(),
      //   windowHeight,
      //   windowWidth
      // );
    });
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
  const clientHeight = listDataRef.value.clientHeight;
  const scrollHeight = listDataRef.value.scrollHeight;
  const maxScroll = scrollHeight - clientHeight;
  const scrollTop = listDataRef.value.scrollTop;
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
const blur = () => {
  if (searchValue.value && !props.idSelected) {
    emit("notSelectedYet", true);
  } else {
  }
  console.log("blur");
};
// ẩn hiện combolist khi click chuột
const toggleCombobox = () => {
  isShowCombobox.value = !isShowCombobox.value;
  // selectedIndex.value = -1;
};

// chọn item được selected
const onClickComboboxItem = (item) => {
  focus();
  itemSelected.value = item;
  searchValue.value = item?.[props?.fieldShow] ?? "";
  isLoading.value = true;
  // emit idSelected ra cho component cha
  emit("onClickIdSelected", item[props.fieldSelect]);
  emit("addValueSelected", item);
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
  emit("addValueSelected", {
    [props.fieldSelect]: "",
    [props.fieldShow]: searchValue.value,
  });
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
      listDataRef.value.scrollTop -= 30;
    } else if (selectedIndex.value === 0) {
      selectedIndex.value = dataListFilter.value.length - 1;
      listDataRef.value.scrollTop =
        listDataRef.value.scrollHeight - listDataRef.value.clientHeight;
    }
  } else if (e.key === "ArrowDown") {
    console.log(e);
    e.preventDefault();
    isShowCombobox.value = true;
    if (selectedIndex.value < dataListFilter.value.length - 1) {
      selectedIndex.value++;
      if (selectedIndex.value > 3) {
        listDataRef.value.scrollTop += 30;
      }
    } else if (selectedIndex.value === dataListFilter.value.length - 1) {
      selectedIndex.value = 0;
      listDataRef.value.scrollTop = 0;
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
      }
      // else {
      //   // nếu không chọn thì trả về item selected trước đó nếu có
      //   if (itemSelected.value) {
      //     searchValue.value = itemSelected?.value?.[props.fieldShow] ?? "";
      //   } else {
      //   }

      //   isShowCombobox.value = !isShowCombobox.value;
      // }
      // } else {
      //   isShowCombobox.value = !isShowCombobox.value;
      // }
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
.combobox-list-wrapper {
  min-width: unset;
}
</style>