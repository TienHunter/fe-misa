// v-keydown.js

import { directive } from "vue";

const vKeydown = (el, binding) => {
  // Bắt sự kiện keydown
  const handleKeydown = (event) => {
    if (binding.value) {
      binding.value(event);
    }
  };

  // Thêm bộ lắng nghe sự kiện
  el.addEventListener("keydown", handleKeydown);

  // Gỡ bỏ bộ lắng nghe sự kiện khi directive bị gỡ bỏ
  return {
    // Trong hàm unbind, chúng ta gỡ bỏ bộ lắng nghe sự kiện keydown
    unbind() {
      el.removeEventListener("keydown", handleKeydown);
    },
  };
};

export default vKeydown;
