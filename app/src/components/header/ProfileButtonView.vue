<template>
  <Menu v-if="$store.state.user" as="div" class="relative ml-3">
    <div>
      <MenuButton
        class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-800">
        <span class="sr-only">Open user menu</span>
        <img
          class="h-8 w-8 rounded-full object-cover"
          :src="`${$store.state.user.profile_img}?${new Date()}`"
          referrerpolicy="no-referrer"
          alt="" />
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
        class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <MenuItem>
          <router-link
            to="/edit-profile"
            class="block px-4 py-2 text-sm text-gray-700"
            >Profile
          </router-link>
        </MenuItem>
        <MenuItem>
          <a
            @click="logout"
            class="block cursor-pointer px-4 py-2 text-sm text-red-700"
            >Logout
          </a>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const emit = defineEmits(["fetchError"]);

const store = useStore();

const router = useRouter();

const logout = async () => {
  router.push({ name: "Home" }); //In order to make it disconnet from the room socket first
  await store
    .dispatch("logOut")
    .then(() => {
      window.location.href = "/";
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
};
</script>
