<template>
  <div
    class="bg-white mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
    <div v-if="rooms" class="pb-10">
      <div class="flex items-center justify-center sm:justify-start rounded-md">
        <button
          @click="showAllRooms"
          type="button"
          class="inline-flex items-center text-2xl font-bold sm:py-2 sm:px-4 sm:text-sm sm:font-medium sm:text-gray-900 sm:bg-white sm:rounded-l-md sm:border sm:border-gray-200 sm:hover:bg-gray-100 sm:hover:text-blue-700"
          :class="{
            'z-10 sm:ring-2 sm:ring-blue-700 text-blue-700 sm:text-blue-700':
              showAll,
          }">
          <span class="mr-6 ml-6 sm:ml-0 sm:mr-0">All</span>
        </button>
        <button
          @click="advActive"
          type="button"
          class="inline-flex items-center text-2xl font-bold sm:py-2 sm:px-4 sm:text-sm sm:font-medium sm:text-gray-900 sm:bg-white sm:border sm:border-gray-200 sm:hover:bg-gray-100 sm:hover:text-blue-700"
          :class="{
            'z-10 sm:ring-2 sm:ring-blue-700 text-blue-700 sm:text-blue-700':
              advFilter,
          }">
          <svg
            aria-hidden="true"
            class="w-8 h-8 mr-6 ml-6 sm:ml-0 sm:mr-2 sm:w-4 sm:h-4 fill-current"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
          </svg>
          <span class="hidden sm:block">Advanced Filters</span>
        </button>
        <button
          @click="favActive"
          type="button"
          class="inline-flex items-center text-2xl font-bold sm:py-2 sm:px-4 sm:text-sm sm:font-medium sm:text-gray-900 sm:bg-white sm:border sm:border-gray-200 sm:hover:bg-gray-100 sm:hover:text-blue-700"
          :class="{
            'z-10 sm:ring-2 sm:ring-blue-700 text-blue-700 sm:text-blue-700':
              favFilter,
          }">
          <font-awesome-icon
            icon="fa-solid fa-star"
            class="mr-6 ml-6 sm:ml-0 sm:mr-2" />
          <span class="hidden sm:block">Favourites</span>
        </button>
        <button
          @click="popActive"
          type="button"
          class="inline-flex items-center text-2xl font-bold sm:py-2 sm:px-4 sm:text-sm sm:font-medium sm:text-gray-900 sm:bg-white sm:rounded-r-md sm:border sm:border-gray-200 sm:hover:bg-gray-100 sm:hover:text-blue-700"
          :class="{
            'z-10 sm:ring-2 sm:ring-blue-700 text-blue-700 sm:text-blue-700':
              popFilter,
          }">
          <font-awesome-icon
            icon="fa-solid fa-fire"
            class="mr-6 ml-6 sm:ml-0 sm:mr-2" />
          <span class="hidden sm:block"> Most popular </span>
        </button>
      </div>

      <RoomsListFilter
        v-if="advFilter"
        @filterRooms="filterRooms"
        @roomsLoading="loadedRooms = null"
        class="mt-6" />
    </div>

    <div v-else class="skeleton w-2/6 h-10"></div>

    <div v-if="loadedRooms">
      <RoomsListView
        v-if="loadedRooms.length"
        :rooms="loadedRooms"
        :edit="false">
        <template v-slot:title>{{ listTitle }}</template>
      </RoomsListView>
      <h2
        v-else
        class="text-2xl font-bold tracking-tight text-gray-900 text-center py-52">
        No rooms available...
      </h2>
    </div>

    <RoomsListViewSkeleton v-else />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import RoomsListView from "./rooms/RoomsListView.vue";
import RoomsListFilter from "./rooms/RoomsListFilter.vue";
import RoomsListViewSkeleton from "./skeletons/RoomsListViewSkeleton.vue";

const emit = defineEmits(["fetchError"]);

const store = useStore();

const rooms = ref(null);

let roomsOriginal = null;

onMounted(async () => {
  await store
    .dispatch("fetchAllRooms")
    .then((res) => {
      roomsOriginal = res.data.filter((room) => {
        return !store.state.user.banned_from.some((el) => el == room._id);
      });
      rooms.value = res.data.filter((room) => {
        return !store.state.user.banned_from.some((el) => el == room._id);
      });
      loadedRooms.value = roomsOriginal;
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
});

//Filter functionnality

const loadedRooms = ref(null);

const listTitle = ref("Available Rooms");

const showAll = ref(true);

const showAllRooms = () => {
  if (!showAll.value) {
    loadedRooms.value = null;
    rooms.value = roomsOriginal;
    popFilter.value = advFilter.value = favFilter.value = false;
    showAll.value = true;
    listTitle.value = "Available Rooms";
    loadedRooms.value = rooms.value;
  }
};

///Favourites

const favFilter = ref(false);

const favActive = () => {
  if (!favFilter.value) {
    loadedRooms.value = null;
    rooms.value = roomsOriginal;
    popFilter.value = advFilter.value = showAll.value = false;
    favFilter.value = true;
    listTitle.value = "Favourites";
    loadedRooms.value = rooms.value.filter((el) =>
      store.state.user.favourites.includes(el._id.toString())
    ); //Do it with axios
  }
};

///Popular

const popFilter = ref(false);

const popActive = () => {
  if (!popFilter.value) {
    loadedRooms.value = null;
    rooms.value = roomsOriginal;
    favFilter.value = advFilter.value = showAll.value = false;
    popFilter.value = true;
    listTitle.value = "Most Popular";
    loadedRooms.value = rooms.value.filter((el) => el.users.length > 1); //Do it with axios
  }
};

///Advanced

const advFilter = ref(false);

const advActive = () => {
  if (!advFilter.value) {
    rooms.value = roomsOriginal;
    favFilter.value = popFilter.value = showAll.value = false;
    advFilter.value = true;
  }
};

const filterRooms = (roomLang, roomCat, roomSearch) => {
  loadedRooms.value = null;
  loadedRooms.value = roomsOriginal.filter((el) => {
    return (
      containsTerm(el, roomSearch) &&
      el.language.includes(roomLang) &&
      el.category.includes(roomCat)
    );
  });
  listTitle.value = "Filtered Results";
};

const containsTerm = (elem, term) => {
  return (
    elem.title.toLowerCase().includes(term.toLowerCase()) ||
    elem.language.toLowerCase().includes(term.toLowerCase()) ||
    elem.category.toLowerCase().includes(term.toLowerCase()) ||
    elem.description.toLowerCase().includes(term.toLowerCase())
  );
};
</script>
