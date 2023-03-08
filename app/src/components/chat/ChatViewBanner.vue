<template>
  <div
    class="w-full bg-cover bg-center"
    :style="{ backgroundImage: `url(${roomData.img})` }"
    style="height: 15rem">
    <div
      class="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
      <div class="text-center">
        <div class="flex mt-2 text-xs text-gray-500 items-center">
          <span
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-indigo-200 text-indigo-800 mr-2"
            >{{ roomData.language }} </span
          ><span
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-orange-200 text-orange-800"
            >{{ roomData.category }}
          </span>
        </div>
        <h1 class="text-white text-3xl font-semibold uppercase sm:text-4xl">
          {{ roomData.title }}
        </h1>
        <router-link to="/chat-rooms"
          ><button
            class="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-500 focus:outline-none focus:bg-red-500">
            LEAVE ROOM
            <font-awesome-icon
              icon="fa-solid fa-arrow-right-from-bracket" /></button
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  roomData: Object,
});
</script>
