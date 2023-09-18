import instance from "../axios";

const endpoint = "Users";

const UserService = {
  async login(request) {
    const res = await instance.post(`${endpoint}/login`, request);
    return res.data;
  },
};

export default UserService;
