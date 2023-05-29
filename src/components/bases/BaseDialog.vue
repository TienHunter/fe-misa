<template>
  <div class="dialog-wrapper dialog--warning">
    <!-- notice warning -->
    <div class="dialog-container flex flex-col">
      <div class="dialog__content flex justify-start items-center gap-0-16">
        <div
          class="dialog-content__icon flex items-center justify-center w-12 h-12">
          <div
            class="icon"
            :class="{
              'icon--warning-big': type === DialogType.warning,
              'icon--info-big': type === DialogType.info,
              'icon--error-big': type === DialogType.error,
            }"></div>
        </div>
        <div class="dialog-content__text">
          <ul :style="{ listStyle: 'none' }">
            <li v-for="(item, index) in content" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="dialog__bottom flex items-center mt-6"
        :class="{
          'justify-between':
            type === DialogType.warning || type === DialogType.info,
          'justify-center': type === DialogType.error,
        }">
        <template v-if="type === DialogType.warning">
          <b-button class="btn--sub" title="Không" @click="onClose" />
          <b-button class="btn--pri" title="Có" @click="onAccept" />
        </template>
        <template v-if="type === DialogType.error">
          <b-button class="btn--pri" title="Đóng" @click="onClose" />
        </template>
        <template v-if="type === DialogType.info">
          <div class="popup-botoom__left">
            <b-button class="btn btn--sub" title="Hủy" @click="onCancel" />
          </div>
          <div class="popup-bottom__right flex items-center">
            <b-button class="btn btn--sub" title="Không" @click="onClose" />
            <b-button class="btn btn--pri" title="Có" @click="onAccept" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { DialogType } from "@/constants";

export default {
  props: {
    // isShow: {
    //   type: Boolean,
    //   default: false,
    // },
    type: {
      type: String,
      default: "",
    },
    content: {
      type: Array,
      default: () => [],
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    onAccept: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    return { DialogType };
  },
};
</script>
<style></style>
