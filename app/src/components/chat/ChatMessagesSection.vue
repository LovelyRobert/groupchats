<template>
  <!-- History button  -->
  <div v-if="showArrow">
    <ClipLoader
      v-if="historyLoading"
      class="justify-center py-2 px-4"
      :color="'#312e81'" />
    <div v-else @click="$emit('showMore')" class="flex flex-col mb-10">
      <button class="text-indigo-600">
        <font-awesome-icon icon="fa-regular fa-circle-up" />
      </button>
      <p class="text-center text-xs cursor-pointer">Show More</p>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-xs text-gray-600">No more messages to show...</p>
  </div>
  <!-- History messages  -->
  <div v-for="date in historyDates(shownHistory)" :key="date">
    <div class="flex items-end justify-center mb-6">
      <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2">
        <span
          class="px-2 py-1 rounded inline-block text-white rounded-full bg-indigo-600 text-gray-600"
          >{{ date }}</span
        >
      </div>
    </div>

    <transition-group>
      <MessageContent
        :messages="history"
        :date="date"
        @click="(data) => $emit('mentionUser', data)"
        @showImage="(link) => $emit('showImage', link)" />
    </transition-group>
  </div>

  <!-- Realtime messages  -->

  <div class="flex items-end justify-center">
    <hr class="text-center w-1/2 h-0.5 my-2 px-0.5 bg-gray-100 md:my-10" />
  </div>

  <div class="flex items-end justify-center">
    <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2">
      <span
        v-if="
          currentDate !==
            historyDates(shownHistory)[historyDates(shownHistory).length - 1] &&
          messages.length
        "
        class="px-2 py-1 rounded inline-block text-white rounded-full bg-indigo-600 text-gray-600"
        >{{ currentDate }}</span
      >
    </div>
  </div>

  <transition-group>
    <MessageContent
      :messages="messages"
      :date="new Date().toISOString().split('T')[0]"
      @click="(data) => $emit('mentionUser', data)"
      @showImage="(link) => $emit('showImage', link)" />
  </transition-group>

  <!-- Typing notification  -->

  <transition>
    <div v-if="isTyping" class="chat-message">
      <div class="flex items-center justify-center">
        <div
          class="flex flex-col space-y-2 text-xs text-green-600 max-w-xs mx-2 items-center order-last">
          <span class="text-indigo-600">
            {{ typingUser.nickname }} is typing...
          </span>
        </div>
        <img :src="typingUser.profile_img" class="w-6 h-6 rounded-full" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import MessageContent from "./MessageContent";
import { chatHandler } from "../functions/functions.js";
const { historyDates } = chatHandler();

defineProps({
  historyLoading: Boolean,
  showArrow: Boolean,
  isTyping: Boolean,
  history: Array,
  shownHistory: Array,
  messages: Array,
  typingUser: Object,
  currentDate: String,
});

defineEmits(["showMore", "mentionUser", "showImage"]);
</script>
