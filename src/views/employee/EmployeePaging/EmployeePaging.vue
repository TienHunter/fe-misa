<template>
  <b-paging
    :data-dropdown="dataDropdown"
    :page-size="filterAndPaging.pageSize"
    :page-number="filterAndPaging.pageNumber"
    :total-records="filterAndPaging.totalRecords"
    :total-pages="totalPages"
    :on-click-prev-page="onClickPrevPage"
    :on-click-next-page="onClickNextPage"
    @on-click-page-number="onClickPageNumber"
    @on-click-page-size="onClickPageSize" />
</template>
<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
export default {
  setup(props) {
    const store = useStore();
    const filterAndPaging = computed(
      () => store.state.employee.filterAndPaging
    );
    console.log(filterAndPaging.value);
    const totalPages = computed(() => {
      if (filterAndPaging.value.pageSize) {
        return Math.ceil(
          filterAndPaging.value.totalRecords / filterAndPaging.value.pageSize
        );
      } else {
        return 1;
      }
    });
    const dataDropdown = ref([
      { text: "10 bản ghi trên một trang", value: 10 },
      { text: "20 bản ghi trên một trang", value: 20 },
      { text: "50 bản ghi trên một trang", value: 50 },
      { text: "100 bản ghi trên một trang", value: 100 },
    ]);
    const onClickPrevPage = () => {
      // nếu đang là trang 1 thì return
      if (filterAndPaging.value.pageNumber === 1) return;

      // nếu không thì lùi trang
      store.dispatch("getFilterAndPaging", {
        ...filterAndPaging.value,
        pageNumber: filterAndPaging.value.pageNumber - 1,
      });
    };

    const onClickNextPage = () => {
      // nếu đang là trang cuối thì return
      if (filterAndPaging.value.pageNumber === totalPages.value) return;

      // nếu không thì lùi trang
      store.dispatch("getFilterAndPaging", {
        ...filterAndPaging.value,
        pageNumber: filterAndPaging.value.pageNumber + 1,
      });
    };
    const onClickPageNumber = (pageNumber) => {
      store.dispatch("getFilterAndPaging", {
        ...filterAndPaging.value,
        pageNumber: pageNumber,
      });
    };
    const onClickPageSize = (pageSize) => {
      store.dispatch("getFilterAndPaging", {
        ...filterAndPaging.value,
        pageSize: pageSize,
        pageNumber: 1,
      });
      console.log(pageSize);
    };
    return {
      filterAndPaging,
      dataDropdown,
      totalPages,
      onClickPrevPage,
      onClickNextPage,
      onClickPageNumber,
      onClickPageSize,
    };
  },
};
</script>
<style></style>
