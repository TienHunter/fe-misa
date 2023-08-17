import { createStore } from "vuex";
import employee from "./employee";
import global from "./global";
import account from "./account";
import supplier from "./supplier";
import payment from "./payment";
const store = createStore({
  modules: {
    global,
    employee,
    account,
    supplier,
    payment,
  },
});
export default store;
