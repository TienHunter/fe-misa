<template>
  <div class="table-wrapper">
    <table EmployeeId="tbEmployee">
      <thead>
        <tr>
          <th
            v-for="(col, key, index) in EmployeeCol"
            :key="index"
            :class="{
              'th-anchor': key === 'checkbox',
              'th-anchor th-anchor--end': key === 'action',
            }"
            :style="{ minWidth: key === 'checkbox' ? '40px' : '160px' }"
            :title="col?.title">
            <input
              v-if="key === 'checkbox'"
              type="checkbox"
              style="width: 24px; height: 24px" />
            <span v-else>{{ col?.text }}</span>
          </th>
          <!-- <th style="min-width: 40px; width: 40px" class="th-anchor">
            <input type="checkbox" style="width: 24px; height: 24px" />
          </th>
          <th style="min-width: 160px">Mã nhân viên</th>
          <th style="min-width: 160px">Tên nhân viên</th>
          <th style="min-width: 160px">Giới tính</th>
          <th style="min-width: 160px">Ngày sinh</th>
          <th style="min-width: 160px" title="Số chứng minh nhân dân">
            Số CMND
          </th>
          <th style="min-width: 160px">Chức danh</th>
          <th style="min-width: 160px">Tên đơn vị</th>
          <th style="min-width: 160px">Số tài khoản</th>
          <th style="min-width: 160px">Tên ngân hàng</th>
          <th style="min-width: 160px">Chi nhánh ngân hàng</th>

          <th style="min-width: 160px" class="th-anchor th-anchor--end">
            Chức năng
          </th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in employeeList" :key="index">
          <template v-for="(col, key, indexCol) in EmployeeCol" :key="indexCol">
            <td
              :class="{
                'td-anchor td-anchor--start': key === 'checkbox',
                'td-anchor td-anchor--end td-action': key === 'action',
              }">
              <input
                v-if="key === 'checkbox'"
                type="checkbox"
                style="width: 24px; height: 24px" />
              <span v-else-if="key !== 'action'">{{ item[key] }}</span>
              <div v-else class="flex items-center justify-center h-full">
                <a
                  href=""
                  class="text-blue font-semi-bold h-full flex items-center px-4"
                  >Sửa</a
                >

                <div class="td-action__icon">
                  <div class="icon-wrapper w-8 h-8">
                    <div class="icon icon--down-small-blue"></div>
                  </div>
                  <div class="dropdown-list td-action-list">
                    <div
                      class="dropdown-item td-action-item td-action-item--remove">
                      Xóa
                    </div>
                    <div class="dropdown-item td-action-item">Nhân bản</div>
                  </div>
                </div>
              </div>
            </td>
          </template>
        </tr>
        <!-- <tr>
          <td class="td-anchor td-anchor--start">
            <input type="checkbox" style="width: 24px; height: 24px" />
          </td>
          <td>MF1444</td>
          <td>Vũ Đình Tiến</td>
          <td>Nam</td>
          <td>03/10/2001</td>
          <td>123456789</td>
          <td>Fresher</td>
          <td>Customize</td>
          <td>123456789</td>
          <td>ViettinBank</td>
          <td>Hai Bà Trưng</td>
          <td
            EmployeeId="employee1"
            class="td-anchor td-anchor--end td-action td-action--selected">
            <div class="flex items-center justify-center h-full">
              <a
                href=""
                class="text-blue font-semi-bold h-full flex items-center px-4"
                >Sửa</a
              >

              <div class="td-action__icon">
                <div class="icon-wrapper w-8 h-8">
                  <div class="icon icon--down-small-blue"></div>
                </div>
                <div class="dropdown-list td-action-list">
                  <div
                    class="dropdown-item td-action-item td-action-item--remove">
                    Xóa
                  </div>
                  <div class="dropdown-item td-action-item">Nhân bản</div>
                </div>
              </div>
            </div>
          </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>
<script>
import { EmployeeCol } from "@/constants";
import { useStore } from "vuex";
import { computed, onMounted, reactive } from "vue";
export default {
  props: {},
  setup(props) {
    const store = useStore();
    const fakeEmployeeList = reactive([
      {
        EmployeeId: 1,
        employeeCode: "NV-001",
        employeeName: "Nguyễn Văn A",
        gender: "Nam",
        dateOfBirth: "2023-05-09",
        identityNumber: "026201001196",
        positionName: "Trưởng phòng",
        departmentName: "Phòng hành chính",
        bankAccount: "215100298282",
        bankName: "MB Bank",
        bankBranchName: "Cầu Giấy",
        identityDateRelease: null,
        identityPlaceRelease: null,
        email: null,
        phoneNumber: null,
        address: null,
        mobilePhoneNumber: null,
        isCustomer: true,
        isProvider: true,
      },
      {
        EmployeeId: 2,
        employeeCode: "NV-002",
        employeeName: "Nguyễn Văn B",
        departmentName: "Phòng công nghệ",
        gender: "Nam",
        positionName: "Quản Lý",
        dateOfBirth: "2023-05-04",
        identityNumber: "026201001196",
        identityDateRelease: "2023-05-01",
        identityPlaceRelease: "Hà Nội",
        address: "40,Đình Quán",
        phoneNumber: "0363578628",
        mobilePhoneNumber: "0363578628",
        email: "nguyenducthinh0401@gmail.com",
        bankAccount: "123456789",
        bankName: "BIDV",
        bankBranchName: "Cầu Giấy",
        isCustomer: true,
        isProvider: true,
      },
      {
        EmployeeId: 108732,
        employeeCode: "NV-003",
        employeeName: "Nguyễn Văn C",
        departmentName: "Phòng nhân sự",
        gender: "Nam",
        positionName: "Nhân Viên",
        dateOfBirth: "2023-05-03",
        identityNumber: "026201001196",
        identityDateRelease: "2023-05-10",
        identityPlaceRelease: "Hà Nội",
        address: "40 , Đình Quán",
        phoneNumber: "0363578628",
        mobilePhoneNumber: "0363578628",
        email: "nguyenducthinh0401@gmail.com",
        bankAccount: "01928282393992",
        bankName: "BIDV",
        bankBranchName: "Cầu Giấy",
        isCustomer: true,
        isProvider: true,
      },
      {
        EmployeeId: 87945,
        employeeCode: "NV-004",
        employeeName: "Nguyễn Văn D",
        departmentName: "Phòng hành chính",
        gender: "Nam",
        positionName: "Trường Phòng",
        dateOfBirth: "2023-05-16",
        identityNumber: "87738282732838",
        identityDateRelease: "2023-05-08",
        identityPlaceRelease: "Hà Nội",
        address: "Đan Phượng",
        phoneNumber: "727828229322",
        mobilePhoneNumber: "2728288283",
        email: "nguyenvand@gmail.com",
        bankAccount: "929920202933",
        bankName: "BIDV",
        bankBranchName: "Cầu Giấy",
        isCustomer: false,
        isProvider: false,
      },
    ]);
    const employeeList = computed(() => store.state.employee.employeeList);
    onMounted(() => {
      store.dispatch("fakeGetEmployeeList", fakeEmployeeList);
    });
    return {
      EmployeeCol,
      employeeList,
    };
  },
};
</script>
<style></style>
