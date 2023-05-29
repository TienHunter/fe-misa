<template>
  <div class="sidebar" :class="{ 'sidebar--shrink': isSidebarShrink }">
    <div v-if="!isSidebarShrink" class="logo-container">
      <a href="#" class="menu-container icon icon--option"> </a>
      <a href="#" class="logo">
        <img
          class="logo-icon"
          src="@/assets/images/Logo_Module_TiengViet_White.66947422.svg"
          alt="" />
      </a>
    </div>
    <div
      v-else
      class="logo-container justify-center"
      @click="toggleSdibarShrink">
      <div class="icon icon--three-stripes"></div>
    </div>
    <div class="menu-bar">
      <div class="menu-item-list flex flex-col">
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--general"></div>
          </div>
          <div class="menu-item__title" title="Tổng quan">Tổng quan</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--cash"></div>
          </div>
          <div class="menu-item__title" title="Tiền mặt">Tiền mặt</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--deposits"></div>
          </div>
          <div class="menu-item__title" title="Tiền gửi">Tiền gửi</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--purchase"></div>
          </div>
          <div class="menu-item__title" title="Mua hàng">Mua hàng</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--sell"></div>
          </div>
          <div class="menu-item__title" title="Bán hàng">Bán hàng</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--billManagement"></div>
          </div>
          <div class="menu-item__title" title="Quản lý hóa đơn">
            Quản lý hóa đơn
          </div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--warehouse"></div>
          </div>
          <div class="menu-item__title" title="Kho">Kho</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--tools"></div>
          </div>
          <div class="menu-item__title" title="Công cụ dụng cụ">
            Công cụ dụng cụ
          </div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--fixedAssets"></div>
          </div>
          <div class="menu-item__title" title="Tài sản cố định">
            Tài sản cố định
          </div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--tax"></div>
          </div>
          <div class="menu-item__title" title="Thuế">Thuế</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--price"></div>
          </div>
          <div class="menu-item__title" title="Giá thành">Giá thành</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--synthetic"></div>
          </div>
          <div class="menu-item__title" title="Tổng hợp">Tổng hợp</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--budget"></div>
          </div>
          <div class="menu-item__title" title="Ngân sách">Ngân sách</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--report"></div>
          </div>
          <div class="menu-item__title" title="Báo cáo">Báo cáo</div>
        </a>
        <a class="menu-item flex flex-none justify-start items-center">
          <div class="menu-item__icon">
            <div class="icon icon--financialAnalysis"></div>
          </div>
          <div class="menu-item__title" title="Phân tích tài chính">
            Phân tích tài chính
          </div>
        </a>
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
@import url("./sidebar.css");
</style>
