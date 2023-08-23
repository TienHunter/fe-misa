<template>
  <div class="form-process">
    <div class="w-full flex jusitfy-center">
      <div class="process-and-utility-area">
        <div class="process-area">
          <div class="title">Nghiệp vụ tiền mặt</div>
          <div class="content-area">
            <div class="content position-relative">
              <div class="process-cash h-85"></div>
              <div class="div-face-button hoverable receive">
                <div class="title-button">Thu tiền</div>
              </div>
              <router-link :to="{ name: 'DepositWidthdrawList', params: {} }">
                <div class="div-face-button hoverable payment">
                  <div class="title-button">Chi tiền</div>
                </div>
              </router-link>
              <div class="div-face-button hoverable audit">
                <div class="title-button">Kiểm kê quỹ</div>
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
                <div class="text-center">Khách hàng</div>
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
                  <div class="text-center">Nhà cung cấp</div>
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
                  <div class="text-center">Nhân viên</div>
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
                <div class="text-center">Tùy chọn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="report-area">
        <div class="title">Báo cáo</div>
        <div class="favorite-report">
          <ul>
            <li>Bảng kê số dư tiền theo ngày</li>
            <li>Dòng tiền</li>
            <li>S03a1-DN: Sổ nhật ký thu tiền</li>
            <li>Sổ kế toán chi tiết quỹ tiền mặt</li>
            <li>S03a2-DN: Sổ nhật ký chi tiền</li>
          </ul>
        </div>
        <div class="footer">Tất cả báo cáo</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
<style scoped>
@import url("./CastProcedure.css");
</style>
