<template>
  <div class="container-login" bg="3">
    <div class="wrap-login">
      <div class="login-form">
        <div class="login-form-logo"></div>
        <div class="wrap-input Username-wrap validate-input mb-4">
          <input
            v-model="accountInput.Username"
            type="text"
            class="block input"
            :class="{ 'border--red': errsMessage?.Username }"
            maxlength="100"
            placeholder="Số điện thoại/Email" />
          <span class="text-red">{{ errsMessage?.Username ?? "" }}</span>
        </div>
        <div class="wrap-input pass-wrap validate-input pb-4">
          <div class="position-relative">
            <input
              v-model="accountInput.Password"
              :type="toggleShowPassword ? 'text' : 'Password'"
              class="block input"
              :class="{ 'border--red': errsMessage?.Password }"
              maxlength="255"
              placeholder="Mật khẩu" />
            <i
              class="pointer btn-show-pass"
              :class="{ class: toggleShowPassword }"
              @click="toggleShowPassword = !toggleShowPassword"></i>
          </div>
          <span class="text-red">{{ errsMessage?.Password ?? "" }}</span>
        </div>
        <div class="forgot-Password flex pb-4">
          <a class="text-blue pointer">Quên mật khẩu ?</a>
        </div>
        <div class="flex justify-center">
          <b-button title="Đăng nhập" size="medium" @click="handleLogin" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, toRefs, watch, watchEffect } from "vue";
import { useStore } from "vuex";
//========= start state =========

const store = useStore();
const accountInput = reactive({
  Username: "",
  Password: "",
});
const errRefs = toRefs(
  reactive({
    Username: null,
    Password: null,
  })
);
const toggleShowPassword = ref(false);
const errsMessage = ref({
  Username: "",
  Password: "",
});

//========= end state =========

//========= start lifecycle =========

//========= end lifecycle =========

//========= start watch =========

watch(
  () => accountInput.Username,
  () => {
    errsMessage.value.Username = "";
  }
);

watch(
  () => accountInput.Password,
  () => {
    errsMessage.value.Password = "";
  }
);

//========= end watch =========

//========= start methods =========

const isValidate = () => {
  // xóa lỗi cũ
  errsMessage.value = {};
  // check tai khoan khong de trong
  let isUsernameEmpty = !accountInput.Username.trim();
  if (isUsernameEmpty) {
    errsMessage.value.Username = "Tài khoản không để trống.";
  }
  // check mat khau khong de trong
  let isPasswordEmpty = !accountInput.Password.trim();
  if (isPasswordEmpty) {
    errsMessage.value.Password = "Mật khẩu không để trống.";
  }

  if (Object.keys(errsMessage.value).length > 0) {
    return false;
  }
  return true;
};

const handleLogin = () => {
  let isValid = isValidate();
  if (isValid) {
    store.dispatch("login", {
      Username: accountInput.Username,
      Password: accountInput.Password,
    });
  }
};
//========= end methods =========
</script>
<style scoped>
.input {
  height: 40px;
  font-size: 18px;
  line-height: 38px;
  margin-bottom: 4px;
}
</style>
