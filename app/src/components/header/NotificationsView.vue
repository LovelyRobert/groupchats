<template>
  <div
    v-if="$store.state.user && unseenNotif(notifications).length"
    type="button"
    class="text-white text-xs hover:text-indigo-500 px-2 py-1 rounded-md bg-indigo-500">
    <p>{{ unseenNotif(notifications).length }}</p>
  </div>

  <Menu
    @click="updateNotifs"
    v-if="$store.state.user"
    as="div"
    class="relative">
    <div>
      <MenuButton
        class="rounded-full p-1 text-indigo-400 hover:text-indigo-500 focus:bg-ingigo-500">
        <span class="sr-only">View notifications</span>
        <BellSolid
          v-if="unseenNotif(notifications).length"
          class="h-6 w-6"
          aria-hidden="true" />
        <BellOutline v-else class="h-6 w-6" aria-hidden="true" />
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95">
      <MenuItems
        v-if="notifications.length"
        class="absolute overflow-y-auto h-auto max-h-52 z-50 mt-2 w-64 md:w-72 py-1 right-0 origin-top-right rounded-md bg-white text-gray-700 shadow-lg focus:outline-none scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div class="px-4 pb-2 sm:px-6">
          <h2 class="text-lg font-medium text-gray-900">Notifications</h2>
        </div>
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          :class="{ 'bg-indigo-50': !notification.seen }"
          class="hover:bg-indigo-100 py-4">
          <router-link
            v-if="notification.notification_type == 'mention'"
            :to="`/room/${notification.room_id}`"
            class="cursor-pointer">
            <p class="block px-4 pt-2 sm:px-6 text-sm">
              <font-awesome-icon
                class="text-indigo-500 text-base"
                icon="fa-solid fa-quote-left" />
              Someone mentionned you in
              <span class="text-indigo-400 font-bold"
                >{{
                  new Date(notification.date).toLocaleString().split(",")[0]
                }},
                {{
                  new Date(notification.date)
                    .toLocaleTimeString()
                    .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
                }}
              </span>
              room...
            </p>
            <span class="px-4 sm:px-6 text-xs">{{
              new Date(notification.date).toLocaleString()
            }}</span>
          </router-link>
          <div
            v-if="
              notification.notification_type == 'ban' ||
              notification.notification_type == 'allow'
            ">
            <p class="block px-4 pt-2 sm:px-6 text-sm">
              <font-awesome-icon
                class="text-base"
                :class="[
                  notification.notification_type == 'ban'
                    ? 'text-red-500'
                    : 'text-indigo-500',
                ]"
                :icon="
                  notification.notification_type == 'ban'
                    ? 'fa-solid fa-ban'
                    : 'fa-regular fa-flag'
                " />
              You have been
              {{
                notification.notification_type == "ban" ? "banned" : "allowed"
              }}
              by the moderator
              {{ notification.notification_type == "ban" ? "from" : "in" }}
              <span class="text-indigo-400 font-bold">{{
                notification.room_name
              }}</span>
              room...
            </p>
            <span class="px-4 sm:px-6 text-xs"
              >{{ new Date(notification.date).toLocaleString().split(",")[0] }},
              {{
                new Date(notification.date)
                  .toLocaleTimeString()
                  .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
              }}
            </span>
          </div>
        </div>
      </MenuItems>

      <MenuItems
        v-else
        class="absolute divide-y right-0 z-50 mt-2 w-64 md:w-72 origin-top-right rounded-md bg-white text-gray-700 py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="px-4 pb-2 sm:px-6">
          <h2 class="text-lg font-medium text-gray-900">Notifications</h2>
        </div>
        <div>
          <p class="block px-4 pt-2 sm:px-6 text-sm">
            You have no notification yet...
          </p>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { BellIcon as BellOutline } from "@heroicons/vue/outline";
import { BellIcon as BellSolid } from "@heroicons/vue/solid";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { useStore } from "vuex";

const emit = defineEmits(["fetchError", "updateNotifSeen"]);

const props = defineProps({
  notifications: Array,
});

const store = useStore();

const unseenNotif = (notifs) => {
  return notifs.filter((el) => el.seen == false);
};

const updateNotifs = () => {
  if (unseenNotif(props.notifications).length) {
    store
      .dispatch("updateNotifications")
      .then(() => {
        emit("updateNotifSeen");
      })
      .catch((err) => {
        emit("fetchError", err.message);
      });
  }
};
</script>
