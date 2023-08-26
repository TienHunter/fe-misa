<template>
  <div class="form-process">
    <div class="w-full flex jusitfy-center">
      <div class="process-and-utility-area">
        <div class="process-area">
          <div class="title">{{ FreeText.cashBusiness }}</div>
          <div class="content-area">
            <div class="content position-relative">
              <div class="process-cash h-85"></div>
              <div class="div-face-button hoverable receive">
                <div class="title-button">{{ FreeText.collectionMoney }}</div>
              </div>
              <router-link :to="{ name: 'DepositWidthdrawList', params: {} }">
                <div class="div-face-button hoverable payment">
                  <div class="title-button">{{ FreeText.pay }}</div>
                </div>
              </router-link>
              <div class="div-face-button hoverable audit">
                <div class="title-button">{{ FreeText.fundInventory }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dictionary-area flex w-full">
          <div class="dictionary-item hoverable flex-grow">
            <div class="tooltip-content">
              <div class="dictionary-content">
                <div class="icon-wrapper">
                  <div class="icon-v1 icon-v1--process-customer"></div>
                </div>
                <div class="text-center">{{ FreeText.customer }}</div>
              </div>
            </div>
          </div>
          <div class="dictionary-item hoverable flex-grow">
            <router-link :to="{ name: 'DISupplier', to: {} }">
              <div class="tooltip-content">
                <div class="dictionary-content">
                  <div class="icon-wrapper">
                    <div class="icon-v1 icon-v1--process-provider"></div>
                  </div>
                  <div class="text-center">{{ FreeText.supplier }}</div>
                </div>
              </div>
            </router-link>
          </div>

          <div class="dictionary-item hoverable flex-grow">
            <router-link :to="{ name: 'DIEmployee', params: {} }">
              <div class="tooltip-content">
                <div class="dictionary-content">
                  <div class="icon-wrapper">
                    <div class="icon-v1 icon-v1--process-employee"></div>
                  </div>
                  <div class="text-center">{{ FreeText.employee }}</div>
                </div>
              </div>
            </router-link>
          </div>

          <div class="dictionary-item hoverable flex-grow">
            <div class="tooltip-content">
              <div class="dictionary-content">
                <div class="icon-wrapper">
                  <div class="icon-v1 icon-v1--setting-active"></div>
                </div>
                <div class="text-center">{{ FreeText.option }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="report-area">
        <div class="title">{{ FreeText.report }}</div>
        <div class="favorite-report">
          <ul>
            <li>{{ FreeText.cashBalanceStatementByDay }}</li>
            <li>{{ FreeText.cashFlow }}</li>
            <li>S03a1-DN: {{ FreeText.cashCollectionDiary }}</li>
            <li>{{ FreeText.detailedAccountingBookOfCashFund }}</li>
            <li>S03a2-DN: {{ FreeText.diaryOfSpendingMoney }}</li>
          </ul>
        </div>
        <div class="footer">{{ FreeText.allReport }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { FreeText } from "@/resources";
const route = useRoute();
</script>
<style scoped>
@import url("./CastProcedure.css");
</style>
