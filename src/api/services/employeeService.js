import axios from "@/api/axios";

class EmployeesService {
  constructor() {}

  async getAllEmployees() {
    try {
      const res = await axios.get("Employees");
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createEmployee(employee) {
    try {
      const res = axios.post("Employees", employee);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async updateEmployee(employee) {
    try {
      const res = axios.put(`Employees/${employee.employeeId}`, employee);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteEmployee(employeeId) {
    try {
      const res = await axios.delete(`Employees/${employeeId}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async findEmployeeByEmployeeCode(employeeCode) {
    try {
      const res = await axios.get(`Employees/employeeCode/${employeeCode}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
export default new EmployeesService();
