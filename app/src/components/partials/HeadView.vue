<template>
  <!-- Notification Banner -->

  <transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95">
    <div v-show="showTopBar" class="relative bg-indigo-600 z-10">
      <div class="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-indigo-800 p-2">
              <SpeakerphoneIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 truncate font-medium text-white">
              <span class="md:hidden">We announced openCHAT v1.0.0!</span>
              <span class="hidden md:inline"
                >Big news! We're excited to announce version 1.0.0 of
                openCHAT.</span
              >
            </p>
          </div>
          <div
            class="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <router-link
              to="/about"
              class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50">
              Learn more
            </router-link>
          </div>
          <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              class="-mr-1 flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
              <span class="sr-only">Dismiss</span>
              <XIcon
                @click="showTopBar = false"
                class="h-6 w-6 text-white"
                aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Desktop Menu -->

  <Popover class="relative z-20 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div
        class="flex items-center justify-between border-b-2 border-gray-100 py-6 lg:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <h2 class="text-2xl font-bold tracking-tight">
              <span class="text-gray-900">open</span
              ><span class="text-indigo-600">CHAT</span>
            </h2>
          </router-link>
        </div>

        <div class="flex justify-end items-center lg:hidden">
          <!-- Notifications -->'
          <NotificationsView
            @updateNotifSeen="$emit('updateNotifSeen')"
            @fetchError="(message) => $emit('fetchError', message)"
            :notifications="notifications" />

          <!-- Profile Button -->
          <ProfileButtonView
            @fetchError="(message) => $emit('fetchError', message)" />
          <div class="-my-2 -mr-2 ml-2 lg:hidden">
            <PopoverButton
              class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span class="sr-only">Open menu</span>
              <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
            </PopoverButton>
          </div>
        </div>

        <PopoverGroup
          as="nav"
          class="hidden navigation space-x-10 lg:flex text-gray-500">
          <router-link
            to="/"
            class="text-base font-medium hover:text-indigo-500"
            >Home
          </router-link>
          <router-link
            to="/about"
            class="text-base font-medium hover:text-indigo-500"
            >About
          </router-link>
          <router-link
            to="/chat-rooms"
            class="text-base font-medium hover:text-indigo-500"
            >Chat rooms
          </router-link>
          <router-link
            to="/create-room"
            class="text-base font-medium hover:text-indigo-500"
            >Create room
          </router-link>
          <router-link
            to="/contact"
            class="text-base font-medium hover:text-indigo-500"
            >Contact
          </router-link>
        </PopoverGroup>

        <div
          class="hidden items-center justify-end lg:flex lg:flex-1 lg:w-0 text-gray-500">
          <router-link
            v-if="!$store.state.user"
            to="/login"
            class="whitespace-nowrap text-base font-medium hover:text-indigo-500"
            >Login
          </router-link>

          <router-link
            v-if="!$store.state.user"
            to="/signup"
            class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >Sign up
          </router-link>

          <!-- Notifications -->'

          <NotificationsView
            @updateNotifSeen="$emit('updateNotifSeen')"
            @fetchError="(message) => $emit('fetchError', message)"
            :notifications="notifications" />

          <!-- Profile Button -->
          <ProfileButtonView
            @fetchError="(message) => $emit('fetchError', message)" />
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->

    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <PopoverPanel
        focus
        class="absolute bg-white inset-x-0 top-0 origin-top-right transform p-2 transition z-50 lg:hidden">
        <div
          class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          <div class="px-5 pt-5 pb-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="h-8 w-auto text-2xl font-bold tracking-tight">
                  <span class="text-gray-900">open</span
                  ><span class="text-indigo-600">CHAT</span>
                </h2>
              </div>

              <div class="-mr-2">
                <PopoverButton
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span class="sr-only">Close menu</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
            <div class="mt-6">
              <nav class="grid gap-y-8">
                <a
                  class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <router-link
                    to="/"
                    class="ml-3 text-base font-medium text-indigo-500"
                    >Home</router-link
                  >
                </a>
                <a
                  class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <router-link
                    to="/about"
                    class="ml-3 text-base font-medium text-indigo-500"
                    >About</router-link
                  >
                </a>
                <a
                  class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <router-link
                    to="/chat-rooms"
                    class="ml-3 text-base font-medium text-indigo-500"
                    >Chat rooms</router-link
                  >
                </a>
                <a
                  class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <router-link
                    to="/create-room"
                    class="ml-3 text-base font-medium text-indigo-500"
                    >Create room</router-link
                  >
                </a>
                <a
                  class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <router-link
                    to="/contact"
                    class="ml-3 text-base font-medium text-indigo-500"
                    >Contact</router-link
                  >
                </a>
              </nav>
            </div>
          </div>
          <div v-if="!$store.state.user" class="space-y-6 py-6 px-5">
            <div>
              <router-link
                to="/signup"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                Sign up
              </router-link>
              <p class="mt-6 text-center text-base font-medium text-gray-500">
                Existing user?
                {{ " " }}
                <router-link
                  to="/login"
                  class="text-indigo-600 hover:text-indigo-500">
                  Login
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { SpeakerphoneIcon, XIcon, MenuAlt2Icon } from "@heroicons/vue/outline";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/vue";
import { ref } from "vue";
import NotificationsView from "../header/NotificationsView.vue";
import ProfileButtonView from "../header/ProfileButtonView.vue";

defineEmits(["fetchError", "updateNotifSeen"]);

defineProps({
  notifications: Array,
});

const showTopBar = ref(true);
</script>
