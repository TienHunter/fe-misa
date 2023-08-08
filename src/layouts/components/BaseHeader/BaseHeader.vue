<template lang="">
  <div class="flex items-center justify-between header">
    <div class="flex items-center">
      <div
        v-if="!isSidebarShrink"
        class="toggle-sidebar flex justify-center items-center mi-24"
        @click="toggleSdibarShrink">
        <div class="icon icon--three-stripes"></div>
      </div>
      <div class="header-branch pointer flex">
        <div class="header-branch__name" title="CÔNG TY CỔ PHẦN MISA">
          CÔNG TY CỔ PHẦN MISA
        </div>
        <a href="#" class="flex items-center">
          <div class="icon icon--chevron-down mx-2-5"></div>
        </a>
      </div>

      <div
        class="flex items-center justify-center header-current-db"
        title="test_hieu_nang_db">
        <div class="icon-header-current-db"></div>
        <span class="header-current-db-name">test_hieu_nang_db</span>
      </div>
    </div>

    <div class="flex items-center">
      <div class="ms-download mr-6">
        <div class="pointer header-icon mx-3">
          <div
            class="icon-v1 icon-v1--dowload-right rotate-270"
            title="Tải excel"></div>
        </div>
      </div>

      <div style="width: 200px">
        <b-textfield
          class-label="mw-200 mr-6"
          place-holder="Nhập từ khóa tìm kiếm"
          class-input="m-0"
          class-icon="icon icon--search-small" />
      </div>

      <div
        class="header__utils flex items-center justify-center pointer"
        title="Thông báo">
        <div class="icon icon--setting"></div>
      </div>
      <div
        class="header__utils flex items-center justify-center pointer"
        title="Thông báo">
        <div class="icon icon--message"></div>
      </div>
      <div
        class="header__utils flex items-center justify-center pointer"
        title="Thông báo">
        <div class="icon icon--question"></div>
      </div>
      <div
        class="header__utils flex items-center justify-center pointer"
        title="Thông báo">
        <div class="icon icon--notify"></div>
      </div>

      <div class="account-info flex items-center">
        <div class="user-ava flex justify-center items-center">
          <div class="icon icon--no-ava"></div>
        </div>
        <div class="user-name">
          <div class="display-user">Vu Dinh Tien</div>
        </div>
        <div
          class="account-info__more flex justify-center items-center pointer">
          <div class="icon icon--chevron-down-small"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup(props) {
    const store = useStore();
    const isSidebarShrink = computed(() => store.state.global.isSidebarShrink);

    return {
      isSidebarShrink,
      toggleSdibarShrink: () => store.dispatch("toggleSidebarShrink"),
    };
  },
};
</script>
<style>
@import url("./header.css");
.mw-200 {
  max-width: 200px;
}
.rotate-90 {
  transform: rotate(-90deg);
}
.rotate-180 {
  transform: rotate(-180deg);
}
.rotate-270 {
  transform: rotate(-270deg);
}
</style>
