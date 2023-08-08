import axios from "../axios";
import BaseService from "./baseService";

class GroupSupplierService extends BaseService {
  endpoint = "GroupSuppliers";
}

export default new GroupSupplierService();
