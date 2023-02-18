<template>
  <div v-if="rooms.length">
    <h2
      class="text-2xl font-bold text-center sm:text-left tracking-tight text-gray-900">
      <slot name="title"></slot>
    </h2>
    <div
      class="mt-6 grid justify-items-stretch grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      <div v-for="room in rooms" :key="room.id" class="group">
        <div>
          <router-link
            :to="{
              name: 'RoomChat',
              params: {
                roomId: room._id,
              },
            }"
            class="min-h-80 w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:h-80">
            <img
              :src="room.img"
              alt="roomAlt"
              class="h-72 sm:h-48 lg:h-48 w-full object-cover object-center" />
          </router-link>
          <div class="mt-4 flex justify-between">
            <div>
              <h3 class="text-sm font-bold text-gray-700">
                <div>
                  <span aria-hidden="true" class="inset-0" />
                  {{ room.title }}
                </div>
              </h3>

              <div class="flex mt-2 text-xs text-gray-500 items-center">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-indigo-100 text-indigo-800 mr-2">
                  {{ room.language }}
                </span>
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-orange-100 text-orange-800">
                  {{ room.category }}
                </span>
              </div>

              <p class="mt-1 text-sm text-gray-500">
                {{
                  showDescription == room._id
                    ? room.description
                    : room.description.length <= 25
                    ? room.description
                    : room.description.slice(0, 25) + "..."
                }}
                <span v-if="room.description.length > 25">
                  <span
                    v-if="showDescription !== room._id"
                    @click="showDescription = room._id"
                    class="text-indigo-500 text-xs cursor-pointer underline font-medium">
                    Show more
                  </span>
                  <span
                    v-else
                    @click="showDescription = null"
                    class="text-indigo-500 text-xs cursor-pointer underline font-medium">
                    Show less
                  </span>
                </span>
              </p>

              <div v-if="!edit" class="flex -space-x-2 pt-1 overflow-hidden">
                <span
                  class="inline-block pr-2 text-sm font-medium text-gray-900"
                  >{{ room.users.length }} Connected</span
                >
                <div
                  v-for="connected in firstFive(room.users)"
                  :key="connected.id"
                  class="inline-block cursor-pointer pl-1">
                  <img
                    referrerpolicy="no-referrer"
                    class="h-5 w-5 rounded-full object-cover ring-2 ring-white"
                    :src="connected.profile_img"
                    alt="" />
                </div>

                <p
                  v-if="room.users.length > 5"
                  class="inline-block pl-2 cursor-pointer">
                  ...
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- edit layout -->
        <div v-if="edit" class="flex space-x-2 pt-2 overflow-hidden">
          <router-link
            :to="{
              name: 'EditRoom',
              params: {
                roomId: room._id,
              },
            }">
            <font-awesome-icon
              class="cursor-pointer text-indigo-500 mt-1"
              icon="fa-solid fa-pen-to-square" />
          </router-link>
          <AlertsModal
            @closeModal="openModal = ''"
            :open="openModal == room._id"
            :loading="loadingModal"
            @activateMethod="removeRoom(room._id)">
            <template #confirm>
              <font-awesome-icon
                @click="openModal = room._id"
                class="cursor-pointer text-red-500"
                icon="fa-solid fa-trash" />
            </template>
            <template #titles> Delete room </template>
            <template #message>
              Are you sure you want to remove the
              <span class="font-bold">{{ room.title }}</span> room?. All of Its
              data will be permanently removed. This action cannot be undone.
            </template>
            <template #method> Delete </template>
          </AlertsModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { notify } from "notiwind";
import { useStore } from "vuex";

defineProps({ rooms: Array, edit: Boolean });
const emit = defineEmits(["udpateRoomsUI", "fetchError"]);
const store = useStore();
const openModal = ref("");
const loadingModal = ref(false);

const firstFive = (users) => {
  return users.slice(0, 5);
};

const showDescription = ref(null);

const removeRoom = async (roomId) => {
  loadingModal.value = true;
  await store
    .dispatch("removeRoom", { roomId })
    .then(() => {
      emit("udpateRoomsUI", roomId);
      openModal.value = "";
      loadingModal.value = false;
      notify(
        {
          group: "generic",
          title: "Success",
          text: "Your room was successfully deleted!",
        },
        4000
      ); // 4s
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
};
</script>
