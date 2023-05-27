<template lang="">
  <div class="pagination flex-0">
    <div
      class="pagination-container flex justify-between items-center px-4 py-2 w-full">
      <div class="pagination__left flex items-center justify-center">
        <div class="pagination-left__total-record">
          Tổng số:
          <b class="">123</b>
          bản ghi
        </div>
      </div>
      <div class="pagination__right flex items-center justify-center">
        <div class="record-in-page">
          <b-dropdown
            :data="dataDropdown"
            title-dropdown-list="--Chọn số bản ghi trên một trang--"
            direct="up" />
          <!-- <div class="dropdown-wrapper">
            <label for="" class="w-auto m-0">
              <div class="dropdown-container flex items-center">
                <input
                  type="text"
                  class="m-0 flex-1 border-radius-0"
                  readonly
                  value="20 bản ghi trên một trang" />
                <div
                  class="icon-wrapper flex justify-center items-center pointer">
                  <div class="icon icon--down-small-black"></div>
                </div>
              </div>
            </label>
            <div class="dropdown-list record-in-page-list w-full">
              <div class="dropdown-item record-in-page-item">
                10 bản ghi trên một trang
              </div>
              <div
                class="dropdown-item dropdowm-item--selected record-in-page-item">
                20 bản ghi trên một trang
              </div>
              <div class="dropdown-item record-in-page-item">
                50 bản ghi trên một trang
              </div>
              <div class="dropdown-item record-in-page-item">
                100 bản ghi trên một trang
              </div>
            </div>
          </div> -->
        </div>
        <div class="list-number-page flex items-center">
          <div class="pointer pagination__prev no-click-page mr-3">Trước</div>
          <div class="page-list flex items-center">
            <div class="pointer page-item page-item--current">1</div>
            <div class="pointer page-item">2</div>
            <div class="pointer page-item">3</div>
            <div class="pointer page-item">...</div>
            <div class="pointer page-item">10</div>
          </div>
          <div class="pointer pagination__next ml-3">Sau</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  components: {},
  setup(props) {
    const dataDropdown = ref([
      { text: "10 bản ghi trên một trang", value: 10 },
      { text: "20 bản ghi trên một trang", value: 20 },
      { text: "50 bản ghi trên một trang", value: 50 },
      { text: "100 bản ghi trên một trang", value: 100 },
    ]);
    return {
      dataDropdown,
    };
  },
};
</script>
<style></style>
