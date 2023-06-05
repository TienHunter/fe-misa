import axios from "../axios";
import BaseService from "./baseService";

class EmployeeService extends BaseService {
  endpoint = "Employees";
  async getNewEmployeecode() {
    const res = await axios.get(`${this.getEndpoint()}/NewEmployeeCode`);
    return res.data;
  }
}

export default new EmployeeService();
