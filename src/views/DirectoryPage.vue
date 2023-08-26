<template lang="">
  <div
    v-if="route.name === 'Directory'"
    class="flex flex-col main-wrapper w-full h-full">
    <div class="content__header flex justify-between items-center pt-6 pb-6">
      <div class="content-header__title">
        <h3 class="font-24">{{ FreeText.directory }}</h3>
      </div>
    </div>
    <div class="content__body grid grid-cols-3 gap-24-0 flex-1 p-8">
      <div
        v-for="(directory, indexDirectory) in directoryList"
        :key="indexDirectory"
        class="">
        <div class="font-bold pb-2">{{ directory.title }}</div>
        <div
          v-for="(item, index) in directory.list"
          :key="index"
          class="pb-2"
          :title="item.subTitle">
          <router-link :to="{ name: item.name, param: {} }" class="text-blue">
            {{ item.title }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <router-view />
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { FreeText } from "@/resources";
const route = useRoute();
const directoryList = ref([
  {
    title: "Đối tượng",
    list: [
      {
        title: "Khách hàng",
        subTitle: "Khách hàng",
        // name: "DICustomner",
      },
      {
        title: "Nhà cung cấp",
        subTitle: "Nhà cung cấp",
        name: "DISupplier",
      },
      {
        title: "Nhân viên",
        subTitle: "Nhân viên",
        name: "DIEmployee",
      },
      {
        title: "Nhóm khách hàng, nhà cung cấp",
        subTitle: "Nhóm khách hàng, nhà cung cấp",
        // name: "DICustomnerSupplier",
      },
    ],
  },
  {
    title: "Vật tư, hàng hóa",
    list: [
      {
        title: "Vật tư, hàng hóa",
        subTitle: "Vật tư, hàng hóa",
        // name: "DIMaterialsGoods",
      },
      {
        title: "Kho",
        subTitle: "Kho",
        // name: "DIWarehouse",
      },
      {
        title: "Nhóm vật tư, hàng hóa, dịch vụ",
        subTitle: "Nhóm vật tư, hàng hóa, dịch vụ",
        // name: "DIMaterialsGoodsServices",
      },
      {
        title: "Đơn vị tính",
        subTitle: "Đơn vị tính",
        // name: "DIUnit",
      },
    ],
  },
  {
    title: "Tài khoản",
    list: [
      {
        title: "Hệ thống tài khoản",
        subTitle: "Hệ thống tài khoản",
        name: "DIAccountSystem",
      },
      {
        title: "Tài khoản kết chuyển",
        subTitle: "Tài khoản kết chuyển",
        // name: "DITranferAccount",
      },
      {
        title: "Tài khoản ngầm định",
        subTitle: "Tài khoản ngầm định",
        // name: "DIDefaultAccount",
      },
    ],
  },
  {
    title: "Chi phí",
    list: [
      {
        title: "Đối tượng tập hợp chi phí",
        subTitle: "Đối tượng tập hợp chi phí",
      },
      {
        title: "Khoản mục chi phí",
        subTitle: "Khoản mục chi phí",
      },
      {
        title: "Công trình",
        subTitle: "Công trình",
      },
      {
        title: "Loại công trình",
        subTitle: "Loại công trình",
      },
    ],
  },
  {
    title: "Ngân hàng",
    list: [
      {
        title: "Ngân hàng",
        subTitle: "Ngân hàng",
      },
      {
        title: "Tài khoản ngân hàng",
        subTitle: "Tài khoản ngân hàng",
      },
    ],
  },
  {
    title: "Chi nhánh, phòng ban",
    list: [
      {
        title: "Cơ cấu tổ chức",
        subTitle: "Cơ cấu tổ chức",
      },
    ],
  },
  {
    title: "Tài sản",
    list: [
      {
        title: "Loại công cụ dụng cụ",
        subTitle: "Loại công cụ dụng cụ",
      },
      {
        title: "Loại tài sản cố định",
        subTitle: "Loại tài sản cố định",
      },
    ],
  },
  {
    title: "Thuế",
    list: [
      {
        title: "Biểu thuế tiêu thụ đặc biệt",
        subTitle: "Biểu thuế tiêu thụ đặc biệt",
      },
      {
        title: "Biểu thuế tài nguyên",
        subTitle: "Biểu thuế tài nguyên",
      },
    ],
  },
  {
    title: "Khác",
    list: [
      {
        title: "Điều khoản thanh toán",
        subTitle: "Điều khoản thanh toán",
      },
      {
        title: "Mục thu/chi",
        subTitle: "Mục thu/chi",
      },
      {
        title: "Mã thống kê",
        subTitle: "Mã thống kê",
      },
      {
        title: "Loại tiền",
        subTitle: "Loại tiền",
      },
      {
        title: "Loại chứng từ",
        subTitle: "Loại chứng từ",
      },
    ],
  },
]);
</script>
<style lang=""></style>
