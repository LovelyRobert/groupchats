<template>
  <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
    <div class="relative flex-row">
      <span class="absolute inset-y-0 flex items-center">
        <VoiceRecorderButton
          @startRecording="isRecording = true"
          @stopRecording="isRecording = false"
          @recorded="(data) => $emit('getRecord', data)"
          :roomId="roomId"
          :roomOwner="roomOwner"
          :isRecording="isRecording" />
      </span>
      <input
        v-if="!isRecording"
        @click="$emit('startScroll')"
        @focus="$emit('stopScroll')"
        v-model="textMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Write your message!"
        class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
      <div v-else class="center pl-14 py-3 justify-center">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>

      <div
        class="absolute z-20 right-0 bottom-0 items-center inset-y-0 sm:flex">
        <SendPictureButton
          v-if="!showEmojis"
          :isRecording="isRecording"
          :roomId="roomId"
          :roomOwner="roomOwner"
          @imageSaved="
            (data) => {
              $emit('getImage', data);
            }
          " />
        <button
          v-if="!isRecording"
          v-click-out-side="clickOutSideEmojis"
          @click="showEmojis = true"
          type="button"
          class="items-center inline-flex justify-center mr-4 ml-2 rounded-full text-gray-600 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <font-awesome-icon icon="fa-regular fa-face-smile" />
          <transition>
            <EmojiPicker
              v-if="showEmojis"
              :native="true"
              :display-recent="true"
              @select="onSelectEmoji" />
          </transition>
        </button>
        <button
          v-if="!isRecording && !showEmojis"
          @click="sendMessage"
          type="button"
          class="inline-flex items-center justify-center rounded-lg px-3 py-3 sm:px-4 sm:py-3 transition duration-500 ease-in-out text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
          <span class="hidden sm:block sm:font-bold">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-6 w-6 ml-0 sm:ml-2 transform rotate-90">
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import VoiceRecorderButton from "./VoiceRecorderButton.vue";
import SendPictureButton from "./SendPictureButton.vue";
import EmojiPicker from "vue3-emoji-picker"; // import emojis picker compopnent
import "/node_modules/vue3-emoji-picker/dist/style.css"; // import emojis css
import { clickOutSide as vClickOutSide } from "@mahdikhashan/vue3-click-outside";

const props = defineProps({
  roomId: String,
  roomOwner: String,
  socket: Object,
});
const emit = defineEmits([
  "getRecord",
  "getImage",
  "startScroll",
  "stopScroll",
  "sendMessage",
]);

const isRecording = ref(false);

//Send Message
const textMessage = ref("");

const sendMessage = () => {
  emit("sendMessage", textMessage.value);
  textMessage.value = "";
};

//User typing detection
watchEffect((onInvalidate) => {
  if (textMessage.value.length) {
    props.socket.emit("chat:typing", props.roomId);

    onInvalidate(() => {
      if (textMessage.value.length) {
        props.socket.emit("chat:typing:clear:interval", props.roomId);
      }
    });
  }
});

//Add Emojis
const showEmojis = ref(false);

const clickOutSideEmojis = () => {
  showEmojis.value = false;
};

function onSelectEmoji(emoji) {
  textMessage.value = textMessage.value ? textMessage.value + emoji.i : emoji.i;
}
</script>
