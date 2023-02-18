<template>
  <notification-view />
  <div class="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
    <div v-if="coverLink">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Profile</h3>
            <p class="mt-1 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
          <div class="px-4 py-4 sm:px-0">
            <p
              v-for="(value, index) in roomFormErr"
              :key="index"
              class="mt-1 text-sm text-red-600">
              {{ value }}
            </p>
          </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
          <form action="#" method="POST">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
              <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div class="grid grid-cols-3 gap-6">
                  <div class="col-span-3 sm:col-span-2">
                    <label
                      for="title"
                      class="block text-sm font-medium text-gray-700"
                      >Title</label
                    >
                    <div class="mt-1 flex rounded-md shadow-sm">
                      <input
                        v-model="roomForm.title"
                        type="text"
                        name="title"
                        id="title"
                        :class="[
                          roomFormErr.title.length
                            ? 'border-red-500 ring-red-500'
                            : 'border-gray-300',
                        ]"
                        class="block w-full flex-1 rounded-none rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <div class="mt-1">
                    <textarea
                      v-model="roomForm.description"
                      id="description"
                      name="description"
                      rows="3"
                      :class="[
                        roomFormErr.description.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Brief description for your profile. URLs are hyperlinked.
                  </p>
                </div>

                <div
                  v-if="
                    !dropped ||
                    coverLink ==
                      process.env.VUE_APP_API_ENDPOINT + '/default-banner.jpg'
                  ">
                  <label class="block text-sm font-medium text-gray-700"
                    >Cover photo</label
                  >
                  <div
                    @dragover.prevent="dragOver"
                    @dragleave.prevent="dragLeave"
                    @drop.prevent="drop($event)"
                    :class="[
                      draggedOver ? 'border-indigo-300' : 'border-gray-300',
                      coverHasError ? 'border-red-300' : 'border-gray-300',
                    ]"
                    class="mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6">
                    <div v-if="!coverHasError" class="space-y-1 text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label
                          for="file-upload"
                          class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            @change="uploadImage"
                            class="sr-only" />
                        </label>
                        <p class="pl-1">or drag and drop</p>
                      </div>
                      <p class="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <div v-else class="space-y-1 text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-center text-gray-600">
                        <span
                          @click="removeDrop"
                          class="relative cursor-pointer text-center rounded-md bg-white font-medium text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-500">
                          Cancel upload
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  :style="{
                    backgroundImage: `url(${coverLink})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '10rem',
                  }"
                  class="mt-1 flex justify-center text-center rounded-md border-2 border-dashed">
                  <button
                    class="mt-16 mb-14 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-500 focus:outline-none focus:bg-red-500"
                    @click="removeDrop">
                    Remove
                  </button>
                </div>

                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="category"
                      class="block text-sm font-medium text-gray-700"
                      >Category</label
                    >
                    <select
                      v-model="roomForm.category"
                      id="category"
                      name="category"
                      autocomplete="category-name"
                      :class="[
                        roomFormErr.category.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md border bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option
                        v-for="(cat, index) in categorieslist.industries"
                        :key="index">
                        {{ cat }}
                      </option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="language"
                      class="block text-sm font-medium text-gray-700"
                      >Language</label
                    >
                    <select
                      v-model="roomForm.language"
                      id="language"
                      name="language"
                      autocomplete="language"
                      :class="[
                        roomFormErr.language.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md border bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option
                        v-for="(lang, index) in languageslist"
                        :key="index">
                        {{ lang }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="hidden sm:block" aria-hidden="true">
        <div class="py-5">
          <div class="border-t border-gray-200"></div>
        </div>
      </div>

      <div
        class="flex flex-row-reverse bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button
          v-if="!loading"
          @click="sendForm"
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Update
        </button>
        <ClipLoader
          v-else
          class="inline-flex justify-center px-4"
          :color="'#312e81'" />
      </div>
    </div>
    <EditRoomSkeleton v-else />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import EditRoomSkeleton from "./skeletons/EditRoomSkeleton.vue";
import languageslist from "./lists/languageslist.json";
import categorieslist from "./lists/categorieslist.json";
import { notify } from "notiwind";
import { useStore } from "vuex";

const props = defineProps({
  roomId: String,
});
const emit = defineEmits(["fetchError"]);

const store = useStore();

onMounted(async () => {
  await store
    .dispatch("fetchSingleRoom", { roomId: props.roomId })
    .then((res) => {
      let { title, description, category, language } = res.data;
      Object.assign(roomForm.value, { title, description, category, language });
      coverLink.value = res.data.img;
      dropped.value = true;
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
});
//Cover handling

const draggedOver = ref(false);
const dropped = ref(false);
const cover = ref(null);
const coverLink = ref(null);
const coverHasError = ref(false);
const coverRemoved = ref(false);

const dragOver = () => {
  draggedOver.value = true;
};

const dragLeave = () => {
  draggedOver.value = false;
};

const drop = (e) => {
  roomFormErr.value.cover = "";
  cover.value = e.dataTransfer.files[0];
  if (!cover.value.type.includes("image")) {
    coverHasError.value = true;
    roomFormErr.value.cover = "This image format is not supported";
    notify(
      {
        group: "error",
        title: "Failed",
        text: roomFormErr.value.cover,
      },
      4000
    ); // 4s
  } else if (cover.value.size > 819200) {
    coverHasError.value = true;
    roomFormErr.value.cover = "Image size should be < 800KB";
    notify(
      {
        group: "error",
        title: "Failed",
        text: roomFormErr.value.cover,
      },
      4000
    ); // 4s
  } else {
    coverHasError.value = false;
    coverLink.value = URL.createObjectURL(cover.value);
    dropped.value = true;
    coverRemoved.value = false;
  }
};

const uploadImage = (e) => {
  roomFormErr.value.cover = "";
  coverHasError.value = false;
  formData.value.delete("file");
  cover.value = e.target.files[0];
  if (!cover.value.type.includes("image")) {
    coverHasError.value = true;
    roomFormErr.value.cover = "This image format is not supported";
    notify(
      {
        group: "error",
        title: "Failed",
        text: roomFormErr.value.cover,
      },
      4000
    ); // 4s
  } else if (cover.value.size > 819200) {
    coverHasError.value = true;
    roomFormErr.value.cover = "Image size should be < 800KB";
    notify(
      {
        group: "error",
        title: "Failed",
        text: roomFormErr.value.cover,
      },
      4000
    ); // 4s
  } else {
    coverHasError.value = false;
    coverLink.value = URL.createObjectURL(cover.value);
    dropped.value = true;
    coverRemoved.value = false;
  }
};

const removeDrop = () => {
  coverHasError.value = false;
  dropped.value = false;
  roomFormErr.value.cover = "";
  cover.value = null;
  formData.value.delete("file");
  coverRemoved.value = true;
};

//Form handling

const loading = ref(false);

const formData = ref(new FormData());

const roomForm = ref({
  title: "",
  description: "",
  category: "",
  language: "",
});

const roomFormErr = ref({
  title: "",
  description: "",
  category: "",
  language: "",
  cover: "",
});

const sendForm = async () => {
  if (!roomFormErr.value.cover.length) {
    loading.value = true;
    for (const key in roomFormErr.value) {
      roomFormErr.value[key] = "";
    }
    for (const key in roomForm.value) {
      formData.value.append(key, roomForm.value[key]);
    }
    formData.value.append("coverRemoved", coverRemoved.value);
    if (cover.value) {
      formData.value.append("file", cover.value);
    }
    await store
      .dispatch("editRoom", { roomId: props.roomId, formData: formData.value })
      .then((res) => {
        loading.value = false;
        formData.value.delete("file");
        formData.value.delete("coverRemoved");
        for (const key in roomForm.value) {
          formData.value.delete(key);
        }
        notify(
          {
            group: "generic",
            title: "Success",
            text: res.data,
          },
          4000
        ); // 4s
      })
      .catch((err) => {
        roomFormErr.value = Object.assign(
          roomFormErr.value,
          err.response.data.errors
        );
        formData.value.delete("file");
        formData.value.delete("coverRemoved");
        for (const key in roomForm.value) {
          formData.value.delete(key);
        }
        loading.value = false;
        notify(
          {
            group: "error",
            title: "Failed",
            text: "Something went wrong...",
          },
          4000
        ); // 4s
      });
  }
};
</script>
