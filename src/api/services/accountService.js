import axios from "../axios";
import BaseService from "./baseService";

class AccountService extends BaseService {
  endpoint = "Accounts";

  /**
   * Mô tả: lay danh sach account theo parent id
   * created by : vdtien
   * created date: 20-07-2023
   * @param {type} param -
   * @returns
   */
  async getListAccountByParentId(parentId) {
    const res = await axios.get(
      `${this.getEndpoint()}/parent/${parentId}/childrens`
    );
    return res.data;
  }

  /**
   * Mô tả: lay danh sach account theo danh sach parent id
   * created by : vdtien
   * created date: 20-07-2023
   * @param {type} param -
   * @returns
   */
  async getListAccountByListParentId(listParentId) {
    const res = await axios.post(
      `${this.getEndpoint()}/parents/childrens`,
      listParentId
    );
    return res.data;
  }

  /**
   * Mô tả: lay danh dach tai khaon theo phan cap cay
   * created by : vdtien
   * created date: 24-07-2023
   * @param {type} param -
   * @returns
   */
  async getListTreeAccount(params) {
    const res = await axios.get(`${this.getEndpoint()}/filter-tree`, {
      params: {
        ...params,
      },
    });
    return res.data;
  }

  /**
   * Mô tả: export file excel danh sach tai khoan
   * created by : vdtien
   * created date: 30-06-2023
   * @param {type} param -
   * @returns
   */

  async exportExcelAccountList(keySearch) {
    const res = await axios.get(`${this.getEndpoint()}/export-excel`, {
      params: {
        keySearch,
      },
      responseType: "blob",
    });
    return res.data;
  }

  async updateAccountStatus(params) {
    const res = await axios.post(
      `${this.getEndpoint()}/update-status?accountId=${
        params.accountId
      }&status=${params.status}&type=${params.type}`
    );
    return res.data;
  }

  async getAllAccountQuery(listAccountFeature, listUserObject) {
    let query = "";
    if (listAccountFeature?.length >= 0) {
      // Chuyển các giá trị trong danh sách thành chuỗi và URL encode
      const encodedAccountFeatures = listAccountFeature.map((feature) =>
        encodeURIComponent(feature)
      );
      const encodeUserObject = listUserObject.map((userObj) =>
        encodeURIComponent(userObj)
      );
      encodedAccountFeatures.forEach((element) => {
        query += `accountFeatures=${element}&`;
      });
      encodeUserObject.forEach((element) => {
        query += `userObjects=${element}&`;
      });
    }

    // Thêm chuỗi query parameters vào URL
    const res = await axios.get(`${this.getEndpoint()}/filter-query?${query}`);

    return res.data;
  }
}

export default new AccountService();
