<template>
  <div
    class="bg-white mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
    <!-- Tabs layout -->
    <div class="inline-flex rounded-md pb-10" role="group">
      <router-link
        to="/edit-profile/general"
        class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
        active-class="z-10 ring-2 ring-blue-700 text-blue-700">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" class="mr-2" />
        General
      </router-link>

      <router-link
        to="/edit-profile/rooms"
        class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
        active-class="z-10 ring-2 ring-blue-700 text-blue-700">
        <font-awesome-icon icon="fa-regular fa-comment" class="mr-2" />
        My rooms
      </router-link>
    </div>

    <router-view
      @fetchError="(message) => $emit('fetchError', message)"
      @reRender="componentKey += 1"
      :key="componentKey"
      :socket="socket" />
  </div>
</template>

<script setup>
import { ref } from "vue";

defineEmits(["fetchError"]);
defineProps({
  socket: Object,
});

const componentKey = ref(0);
</script>
