<template>
  <div
    class="grid grid-cols-3 gap-y-8 lg:gap-y-0 sm:items-center justify-between py-3 border-b-2 border-gray-200">
    <div
      class="relative col-span-3 lg:col-span-1 justify-self-center lg:justify-self-start flex items-center space-x-4">
      <div class="relative">
        <span class="absolute text-green-500 right-0 bottom-0">
          <svg width="20" height="20">
            <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
          </svg>
        </span>
        <img
          :src="`${$store.state.user.profile_img}?${new Date()}`"
          referrerpolicy="no-referrer"
          alt=""
          class="w-10 sm:w-16 h-10 sm:h-16 rounded-full object-cover" />
      </div>
      <div class="flex flex-col leading-tight">
        <div class="text-2xl mt-1 flex items-center">
          <span
            v-if="$store.state.user"
            class="flex flex-row justify-center items-center text-gray-700 mr-3"
            >{{ $store.state.user.nickname }}
            <p
              v-if="roomData.created_by == $store.state.user._id"
              class="text-xs pl-2 text-red-500">
              (Moderator) <font-awesome-icon icon="fa-regular fa-flag" /></p
          ></span>
        </div>
        <span
          v-if="$store.state.user.description.length"
          class="text-lg text-gray-600"
          >{{ `${$store.state.user.description.slice(0, 20)}...` }}</span
        >
      </div>
    </div>

    <transition mode="out-in">
      <div class="justify-self-center col-span-3 lg:col-span-1">
        <div v-if="isSearching" class="relative w-96">
          <SearchInChat
            :isSearching="isSearching"
            @scrollContainer="(n) => $emit('scrollContainer', n)"
            :messagesContainer="messagesContainer" />
        </div>
        <div v-else class="flex -space-x-2 overflow-hidden">
          <ConnectedSlideover
            :connectedUsers="roomData.users"
            :bannedUsers="roomData.banned_users"
            :key="connectedSlideoverKey"
            :messagesContainer="messagesContainer"
            :roomCreatedBy="roomData.created_by"
            @mention="(data) => $emit('mentionUser', data)"
            @reRender="connectedSlideoverKey += 1"
            @ban="(data) => $emit('banUser', data)"
            @allow="(data) => $emit('allowUser', data)"
            @scrollContainer="(n) => $emit('scrollContainer', n)" />
        </div>
      </div>
    </transition>

    <div
      class="flex items-center col-span-3 lg:col-span-1 justify-self-center lg:justify-self-end space-x-2">
      <router-link
        v-if="roomData.created_by == $store.state.user._id"
        :to="{
          name: 'EditRoom',
          params: {
            roomId,
          },
        }"
        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <font-awesome-icon
          class="text-red-500"
          icon="fa-solid fa-pen-to-square" />
      </router-link>
      <button
        @click="$emit('activateSearch')"
        type="button"
        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg
          v-if="!isSearching"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-6 w-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <font-awesome-icon
          v-else
          class="text-red-600"
          icon="fa-solid fa-xmark" />
      </button>
      <button
        @click="$emit('addFavourite')"
        type="button"
        :class="{
          'text-white bg-red-500 hover:bg-red-300': isFavourite,
          'text-gray-500 hover:bg-gray-300': !isFavourite,
        }"
        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-6 w-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>
      <button
        @click="$emit('mute')"
        type="button"
        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out hover:bg-indigo-300 focus:outline-none">
        <font-awesome-icon
          class="text-indigo-600"
          :icon="
            soundMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'
          " />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ConnectedSlideover from "./ConnectedSlideover.vue";
import SearchInChat from "./SearchInChat.vue";

const connectedSlideoverKey = ref(0);

defineEmits([
  "addFavourite",
  "banUser",
  "allowUser",
  "mentionUser",
  "mute",
  "activateSearch",
  "scrollContainer",
]);
defineProps({
  roomData: Object,
  roomId: String,
  isFavourite: Boolean,
  isSearching: Boolean,
  soundMuted: Boolean,
  messagesContainer: Object,
});
</script>
