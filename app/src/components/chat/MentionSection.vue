<template>
  <div
    v-if="mentionedUsers.length"
    class="border-t-2 h-48 border-gray-200 px-2 pt-2 mb-2 sm:mb-2 h-0">
    <div class="flex flex-row">
      <span
        v-for="user in mentionedUsers"
        :key="user.id"
        class="px-2 py-1 mr-2 rounded inline-block text-white text-xs rounded-full bg-indigo-600 text-gray-600">
        @{{ user.nickname }}
        <font-awesome-icon
          @click="$emit('removeMention', user)"
          class="pt-1 cursor-pointer"
          icon="fa-solid fa-xmark" />
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mentionedUsers: Array,
});
defineEmits(["removeMention"]);
</script>
