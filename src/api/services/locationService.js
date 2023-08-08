import axios from "../axios";
import BaseService from "./baseService";

class LocationService extends BaseService {
  endpoint = "Locations";

  async getAllLocationByParentId(parentId) {
    const res = await axios.get(`${this.getEndpoint()}/childrens`, {
      params: {
        parentId,
      },
    });
    return res.data;
  }
}

export default new LocationService();
