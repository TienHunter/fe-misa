import { createStore } from "vuex";
import employee from "./employee";
import global from "./global";
import account from "./account";
import supplier from "./supplier";
const store = createStore({
  modules: {
    global,
    employee,
    account,
    supplier,
  },
});
export default store;
