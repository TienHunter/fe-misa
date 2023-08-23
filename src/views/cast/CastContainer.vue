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
/* @import url("./CastContainer.css"); */
.router-list {
  z-index: 3;
  padding-top: 10px;
  background-color: #e4e9e7;
  padding-right: 20px;
  border-bottom: 1px solid #2ca01c;
}

.router-list .tabs-li {
  border-left: none;
  height: 31px;
  display: flex;
  border-bottom: 4px solid transparent;
}

.router-list .tabs-li.active-item {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #f2ebbf;
  border-bottom: 4px solid #2ca01c;
}

.suggest-short-key {
  width: 100%;
  height: 20px;
  position: absolute;
  top: -10px;
}

.tabs-btn {
  margin: 0;
  padding: 4px 20px;
  display: block;
  position: relative;
  width: 100%;
  background: 0 0;
  border: 0;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 0;
  font-size: 13px;
  color: #111;
}

.tabs-btn:hover {
  color: #2ca01c;
}

.active-item .tab-label {
  font-weight: 700;

  text-align: center;
  white-space: nowrap;
}
</style>
