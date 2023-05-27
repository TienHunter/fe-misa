import { createStore } from "vuex";
import employee from "./employee";
import global from "./global";
const store = createStore({
  modules: {
    global,
    employee,
  },
});
export default store;
