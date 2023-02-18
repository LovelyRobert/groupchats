<template>
  <div v-if="myRooms">
    <RoomsListView
      v-if="myRooms.length"
      @udpateRoomsUI="udpateRooms"
      @fetchError="(message) => $emit('fetchError', message)"
      :rooms="myRooms"
      :edit="true">
      <template v-slot:title>My rooms</template>
    </RoomsListView>
    <h2
      v-else
      class="text-2xl font-bold tracking-tight text-gray-900 text-center py-52">
      No rooms available...
    </h2>
  </div>
  <ProfileRoomsSkeleton v-else />
</template>

<script setup>
import { ref, onMounted } from "vue";
import RoomsListView from "../rooms/RoomsListView.vue";
import ProfileRoomsSkeleton from "../skeletons/ProfileRoomsSkeleton.vue";

import { useStore } from "vuex";

const emit = defineEmits(["fetchError"]);

const store = useStore();

const myRooms = ref(null);

onMounted(async () => {
  await store
    .dispatch("fetchUserRooms")
    .then((res) => {
      myRooms.value = res.data;
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
});

const udpateRooms = (roomId) => {
  myRooms.value = myRooms.value.filter((room) => {
    return room._id !== roomId;
  });
};
</script>
