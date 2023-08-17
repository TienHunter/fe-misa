<template>
  <div class="cast-container">
    <div class="navigation-tabs position-relative">
      <div class="router-list position-sticky w-full">
        <div class="flex position-relative">
          <ul class="w-full h-full pl-0 position-relative flex">
            <li
              v-for="(tab, index) in tabs"
              :key="index"
              class="tabs-li"
              :class="{ 'active-item': isActiveTab(tab.name) }">
              <div class="suggest-short-key"></div>
              <router-link
                :to="{ name: tab.name, params: {} }"
                class="tabs-btn">
                <div class="tab-label">{{ tab.label }}</div>
              </router-link>
            </li>
          </ul>
          <div class="tab-config"></div>
        </div>
      </div>
      <router-view />
      <!-- .... -->
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";

//-----start state-------
const route = useRoute();

const tabs = [
  {
    name: "CastProcess",
    label: "Quy trình",
  },
  {
    name: "DepositWidthdrawList",
    label: "Thu, chi tiền",
  },
  {
    name: "",
    label: "Kiểm kê",
  },
  {
    name: "",
    label: "Dự báo dòng tiền ",
  },
  {
    name: "",
    label: "Báo cáo",
  },
];

//-----end state---------

//-----start lifecycle-----------

//------end lifecycle---------

//-------start methods----------
const isActiveTab = (name) => {
  return route.matched.some((item) => item.name === name);
  // return route.name === name;
};
//---------end methods----------
</script>
<style scoped>
@import url("./CastContainer.css");
</style>
