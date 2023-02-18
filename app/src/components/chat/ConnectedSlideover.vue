<template>
  <div class="flex items-center">
    <span class="text-green-500 pr-1">
      <svg width="20" height="20">
        <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
      </svg>
    </span>
    <span class="pr-2 cursor-pointer" @click="open = true"
      >{{ connectedUsers.length }} Connected</span
    >
    <img
      @click="open = true"
      v-for="connected in firstFive(connectedUsers)"
      :key="connected._id"
      referrerpolicy="no-referrer"
      class="cursor-pointer h-10 w-10 rounded-full object-cover ring-2 ring-white"
      :src="connected.profile_img"
      alt="" />
    <p
      @click="open = true"
      v-if="connectedUsers.length > 5"
      class="pl-5 cursor-pointer">
      ...
    </p>
  </div>

  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative" @close="closeSlideover">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden z-30">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full">
              <DialogPanel
                class="pointer-events-auto relative w-screen max-w-md">
                <TransitionChild
                  as="template"
                  enter="ease-in-out duration-500"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-500"
                  leave-from="opacity-100"
                  leave-to="opacity-0">
                  <div
                    class="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      @click="closeSlideover">
                      <span class="sr-only">Close panel</span>
                      <XIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <div
                  v-bind="containerProps"
                  class="flex h-screen flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div class="flex justify-between px-4 sm:px-6">
                    <DialogTitle class="text-lg font-medium text-gray-900">
                      {{ connectedTab ? "Connected users" : "Banned users" }}
                    </DialogTitle>
                    <div class="flex items-center space-x-2">
                      <button
                        type="button"
                        @click="showConnected"
                        :class="[
                          connectedTab
                            ? 'text-indigo-500 bg-indigo-100'
                            : 'text-gray-500',
                        ]"
                        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out focus:outline-none">
                        <font-awesome-icon icon="fa-regular fa-user" />
                      </button>
                      <button
                        type="button"
                        @click="showBanned"
                        :class="[
                          bannedTab
                            ? 'text-indigo-500 bg-indigo-100'
                            : 'text-gray-500',
                        ]"
                        class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out focus:outline-none">
                        <font-awesome-icon icon="fa-solid fa-ban" />
                      </button>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <div
                      v-if="bannedTab && !bannedUsers.length"
                      class="px-4 py-4">
                      <p class="text-sm text-gray-500">No banned users...</p>
                    </div>
                    <div v-bind="wrapperProps">
                      <div
                        v-for="{ index, data } in list"
                        :key="index"
                        class="relative flex items-start space-x-4 px-4 py-4">
                        <div class="relative">
                          <span class="absolute right-0 bottom-0">
                            <svg
                              v-if="connectedTab"
                              width="20"
                              height="20"
                              color="#22c55e">
                              <circle
                                cx="8"
                                cy="8"
                                r="8"
                                fill="currentColor"></circle>
                            </svg>
                            <font-awesome-icon
                              v-if="bannedTab"
                              class="text-red-500"
                              icon="fa-solid fa-ban" />
                          </span>
                          <img
                            :src="data.profile_img"
                            referrerpolicy="no-referrer"
                            alt=""
                            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full object-cover" />
                        </div>

                        <div class="flex flex-col leading-tight">
                          <div class="text-2xl mt-1 flex items-center">
                            <span
                              v-if="$store.state.user"
                              class="flex flex-row justify-center items-center text-gray-700 mr-3">
                              {{ data.nickname }}
                              <p
                                v-if="roomCreatedBy == data._id"
                                class="text-xs pl-2 text-red-500">
                                <span class="hidden sm:inline"
                                  >(Moderator)
                                </span>
                                <font-awesome-icon icon="fa-regular fa-flag" />
                              </p>
                            </span>
                          </div>
                          <span
                            v-if="data.description.length"
                            class="text-lg text-gray-600">
                            {{ `${data.description.slice(0, 20)}...` }}
                          </span>
                        </div>

                        <!-- Tag and ban tab -->

                        <button
                          @click="toggled = data._id"
                          id="dropdownButton"
                          data-dropdown-toggle="dropdown"
                          class="inline-block absolute right-4 z-40 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5"
                          type="button">
                          <span class="sr-only">Open dropdown</span>
                          <svg
                            class="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                          </svg>
                        </button>

                        <transition>
                          <div
                            id="dropdown"
                            v-if="toggled == data._id"
                            class="absolute z-50 right-0 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
                            <div class="relative">
                              <XIcon
                                @click="toggled = ''"
                                class="absolute h-6 w-6 top-4 right-4 cursor-pointer"
                                aria-hidden="true" />
                              <div
                                class="flex flex-col items-center px-10 pt-10 pb-10">
                                <img
                                  class="mb-3 w-24 h-24 rounded-full object-cover shadow-lg"
                                  :src="data.profile_img"
                                  referrerpolicy="no-referrer"
                                  alt="" />
                                <h5
                                  class="mb-1 text-xl font-medium text-gray-900">
                                  {{ data.nickname }}
                                </h5>
                                <span
                                  v-if="data.description.length"
                                  class="text-sm text-gray-500"
                                  >{{ data.description }}
                                </span>
                                <span v-else class="text-sm text-gray-500"
                                  >No description.
                                </span>
                                <div class="flex mt-4 space-x-3 md:mt-6">
                                  <AlertsModal
                                    v-if="
                                      $store.state.user._id == roomCreatedBy &&
                                      data._id !== $store.state.user._id &&
                                      connectedTab
                                    "
                                    @closeModal="openModal = ''"
                                    :open="openModal == data._id"
                                    :loading="loadingModal"
                                    @activateMethod="ban(data)">
                                    <template #confirm>
                                      <button
                                        @click="openModal = data._id"
                                        class="inline-flex items-center cursor-pointer py-2 px-4 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
                                        Ban user
                                      </button>
                                    </template>
                                    <template #titles> User ban </template>
                                    <template #message>
                                      Are you sure you want to ban
                                      <span class="font-bold">{{
                                        data.nickname
                                      }}</span>
                                      from this room?
                                    </template>
                                    <template #method> Confirm </template>
                                  </AlertsModal>
                                  <AlertsModal
                                    v-if="
                                      $store.state.user._id == roomCreatedBy &&
                                      bannedTab
                                    "
                                    @closeModal="openModal = ''"
                                    :open="openModal == data._id"
                                    :loading="loadingModal"
                                    @activateMethod="allow(data)">
                                    <template #confirm>
                                      <button
                                        @click="openModal = data._id"
                                        class="inline-flex items-center cursor-pointer py-2 px-4 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300">
                                        Allow user
                                      </button>
                                    </template>
                                    <template #titles> Allow user </template>
                                    <template #message>
                                      Are you sure you want to allow
                                      <span class="font-bold">{{
                                        data.nickname
                                      }}</span
                                      >?
                                    </template>
                                    <template #method> Confirm </template>
                                  </AlertsModal>

                                  <a
                                    v-if="
                                      data._id !== $store.state.user._id &&
                                      connectedTab
                                    "
                                    @click="mention(data)"
                                    class="inline-flex items-center cursor-pointer py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
                                    >Tag @
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </transition>

                        <!-- End Tab -->
                      </div>
                    </div>

                    <div class="absolute inset-0 px-4 sm:px-6">
                      <div
                        class="h-full border-2 border-dashed border-gray-200"
                        aria-hidden="true" />
                    </div>
                    <!-- /End replace -->
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { onMounted, ref, nextTick, computed } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { useVirtualList } from "@vueuse/core";

const props = defineProps({
  connectedUsers: Array,
  bannedUsers: Array,
  messagesContainer: Object,
  roomCreatedBy: String,
});

const emit = defineEmits(["scrollContainer", "mention", "ban", "reRender"]);

onMounted(async () => {
  await nextTick(); //Await for the DOM to update
  emit("scrollContainer", props.messagesContainer.scrollHeight);
});

//Open/close button handle

const open = ref(false);

const firstFive = (users) => {
  return users.slice(0, 5);
};

const closeSlideover = () => {
  toggled.value = "";
  connectedTab.value = true;
  bannedTab.value = false;
  shownUsers.value = props.connectedUsers;
  open.value = false;
};

//Tabs handle

const connectedTab = ref(true);
const bannedTab = ref(false);

const showConnected = () => {
  bannedTab.value = false;
  connectedTab.value = true;
  shownUsers.value = props.connectedUsers;
};

const showBanned = () => {
  connectedTab.value = false;
  bannedTab.value = true;
  shownUsers.value = props.bannedUsers;
};

//Virtual list handle

const shownUsers = ref(props.connectedUsers);

const listo = computed(() => {
  return shownUsers.value;
});

const { list, containerProps, wrapperProps } = useVirtualList(listo, {
  // Keep `itemHeight` in sync with the item's row.
  itemHeight: 96,
});

//Mention/ban handle

const toggled = ref("");

const mention = (user) => {
  emit("mention", user);
  toggled.value = "";
};

const openModal = ref("");

const ban = (user) => {
  emit("ban", user);
  toggled.value = "";
  openModal.value = "";
  emit("reRender");
};

const allow = (user) => {
  emit("allow", user);
  toggled.value = "";
  openModal.value = "";
  emit("reRender");
};
</script>
