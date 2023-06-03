import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./stores";
import { registerGlobalComponents } from "@/utils/import";
import BaseButton from "@/components/bases/BaseButton.vue";
import BaseTextfield from "@/components/bases/BaseTextfield.vue";
import BaseDropdown from "@/components/bases/BaseDropdown.vue";
import BaseCombobox from "@/components/bases/BaseCombobox.vue";
import BaseLoading from "@/components/bases/BaseLoading.vue";
import BaseToastMessage from "@/components/bases/BaseToastMessage.vue";
import BaseDialog from "@/components/bases/BaseDialog.vue";
import BasePaging from "@/components/bases/BasePaging.vue";
const app = createApp(App);
app.component("b-button", BaseButton);
app.component("b-textfield", BaseTextfield);
app.component("b-dropdown", BaseDropdown);
app.component("b-combobox", BaseCombobox);
app.component("b-loading", BaseLoading);
app.component("b-toast-message", BaseToastMessage);
app.component("b-dialog", BaseDialog);
app.component("b-paging", BasePaging);
registerGlobalComponents(app);
app.use(router);
app.use(store);
app.mount("#app");
