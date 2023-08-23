import axios from "../axios";
import BaseService from "./baseService";

class PaymentService extends BaseService {
  endpoint = "Payments";

  async updateStatusPayment(paymentId, status) {
    const res = await axios.put(
      `${this.getEndpoint()}/update-payment-status/${paymentId}`,
      null, // Để phần thân request trống
      {
        params: {
          paymentStatus: status,
        },
      }
    );
    return res.data;
  }

  async bulkUpdateStatusPayment(listPaymentId, status) {
    const res = await axios.put(
      `${this.getEndpoint()}/update-multi-payment-status`,
      listPaymentId,
      {
        params: {
          paymentStatus: status,
        },
      }
    );
    return res.data;
  }

  async exportExcelPaymentList(keySearch) {
    const res = await axios.get(`${this.getEndpoint()}/export-excel`, {
      params: {
        keySearch,
      },
      responseType: "blob",
    });
    return res.data;
  }
}

export default new PaymentService();
