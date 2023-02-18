<template>
  <notification-view />
  <div v-if="$store.state.user">
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
            v-for="(value, index) in errorProfile"
            :key="index"
            class="mt-1 text-sm text-red-600">
            {{ value }}
          </p>
        </div>
      </div>
      <div class="mt-5 md:col-span-2 md:mt-0">
        <form @submit.prevent="submit">
          <div class="shadow sm:overflow-hidden sm:rounded-md">
            <div class="px-4 py-3 text-left md:text-right sm:px-6">
              <ClipLoader
                v-if="loadingProfile"
                class="inline-flex justify-center px-4"
                :color="'#312e81'" />
              <AlertsModal
                v-else
                @closeModal="openModal = false"
                :open="openModal"
                :loading="loadingModal"
                @activateMethod="desactivateAccount">
                <template #confirm>
                  <button
                    @click="openModal = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Desactivate account
                  </button>
                </template>
                <template #titles> Deactivate account </template>
                <template #message>
                  Are you sure you want to deactivate your account? All of your
                  data will be permanently removed. This action cannot be
                  undone.
                </template>
                <template #method> Desactivate </template>
              </AlertsModal>
            </div>
            <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3 sm:col-span-2">
                  <label
                    for="nickname"
                    class="block text-sm font-medium text-gray-700"
                    >Nickname*
                  </label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <input
                      v-model="formProfile.nickname"
                      type="text"
                      name="nickname"
                      id="nickname"
                      :class="[
                        errorProfile.nickname.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="block w-full flex-1 rounded-none rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="www.example.com" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                  >About
                </label>
                <div class="mt-1">
                  <textarea
                    v-model="formProfile.description"
                    id="description"
                    name="description"
                    rows="3"
                    :class="[
                      errorProfile.description.length
                        ? 'border-red-500 ring-red-500'
                        : 'border-gray-300',
                    ]"
                    class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="you@example.com" />
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4">
                  Profile picture
                </label>
                <div class="mt-1 flex items-center">
                  <span
                    class="inline-block h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                    <img
                      class="h-full w-full text-gray-300 object-cover"
                      fill="currentColor"
                      :src="imgSrc"
                      referrerpolicy="no-referrer" />
                  </span>

                  <label for="file-upload">
                    <span
                      class="cursor-pointer ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >Change
                    </span>
                    <input
                      id="file-upload"
                      name="file"
                      type="file"
                      class="sr-only"
                      @change="uploadImage" />
                  </label>

                  <label
                    v-if="
                      fileUploaded || imgSrc !== apiUrl + '/profiledefault.jpg'
                    "
                    for="file-upload">
                    <span
                      @click="removeImage"
                      class="cursor-pointer ml-5 rounded-md border border-red-300 bg-red-500 py-2 px-3 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >Remove
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div
              class="flex flex-row-reverse bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                v-if="!loadingProfile"
                type="submit"
                @click="saveProfile"
                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Save
              </button>
              <!-- <button
                  v-if="!loadingProfile"
                  type="submit"
                  @click="saveProfile"
                  class="inline-flex justify-center rounded-md border border-indigo-600 bg-white mr-2 py-2 px-4 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <font-awesome-icon
                    icon="fa-solid fa-lock"
                    class="mr-2 pt-1" />Update password
                </button> -->
              <ClipLoader
                v-if="loadingProfile"
                class="inline-flex justify-center px-4"
                :color="'#312e81'" />
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>

    <div class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Personal Information
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Your personal information will not be shared publicly.
            </p>
          </div>
          <div class="px-4 sm:px-0">
            <p
              v-for="(value, index) in errorInfo"
              :key="index"
              class="mt-1 text-sm text-red-600">
              {{ value }}
            </p>
          </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
          <form @submit.prevent="submit">
            <div class="overflow-hidden shadow sm:rounded-md">
              <div class="bg-white px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="first-name"
                      class="block text-sm font-medium text-gray-700"
                      >First name</label
                    >
                    <input
                      v-model="formInfo.first_name"
                      type="text"
                      name="first-name"
                      id="first-name"
                      autocomplete="first-name"
                      :class="[
                        errorInfo.first_name.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="last-name"
                      class="block text-sm font-medium text-gray-700"
                      >Last name</label
                    >
                    <input
                      v-model="formInfo.last_name"
                      type="text"
                      name="last-name"
                      id="last-name"
                      autocomplete="last-name"
                      :class="[
                        errorInfo.last_name.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>

                  <div class="col-span-6 sm:col-span-4">
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700"
                      >Email address</label
                    >
                    <input
                      v-model="formInfo.email"
                      type="email"
                      name="email"
                      id="email"
                      autocomplete="email"
                      class="mt-1 block w-full rounded-md bg-indigo-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="country"
                      class="block text-sm font-medium text-gray-700"
                      >Country</label
                    >
                    <select
                      v-model="formInfo.country"
                      id="country"
                      name="country"
                      autocomplete="country-name"
                      class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option v-for="country in countries" :key="country.Code">
                        {{ country.Name }}
                      </option>
                    </select>
                  </div>

                  <div class="col-span-6">
                    <label
                      for="street-address"
                      class="block text-sm font-medium text-gray-700"
                      >Street address</label
                    >
                    <input
                      v-model="formInfo.address"
                      type="text"
                      name="street-address"
                      id="street-address"
                      autocomplete="street-address"
                      :class="[
                        errorInfo.address.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>

                  <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      for="city"
                      class="block text-sm font-medium text-gray-700"
                      >City</label
                    >
                    <input
                      v-model="formInfo.city"
                      type="text"
                      name="city"
                      id="city"
                      autocomplete="address-level2"
                      :class="[
                        errorInfo.city.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>

                  <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      for="region"
                      class="block text-sm font-medium text-gray-700"
                      >State / Province</label
                    >
                    <input
                      v-model="formInfo.state"
                      type="text"
                      name="region"
                      id="region"
                      autocomplete="address-level1"
                      :class="[
                        errorInfo.state.length
                          ? 'border-red-500 ring-red-500'
                          : 'border-gray-300',
                      ]"
                      class="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                </div>
              </div>
              <div
                class="flex flex-row-reverse bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  @click="saveInfo"
                  type="submit"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Save
                </button>
                <ClipLoader
                  v-if="loadingInfo"
                  class="inline-flex justify-center px-4"
                  :color="'#312e81'" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <ProfileGeneralSkeleton v-else />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { notify } from "notiwind";
import countrieslist from "../lists/countrieslist.json";
import ProfileGeneralSkeleton from "../skeletons/ProfileGeneralSkeleton.vue";

const props = defineProps({
  socket: Object,
});

const emit = defineEmits(["reRender", "fetchError"]);

const store = useStore();

const apiUrl = process.env.VUE_APP_API_ENDPOINT;

const loadingModal = ref(false);
const loadingProfile = ref(false);
const loadingInfo = ref(false);

onMounted(() => {
  if (store.state.profileUpdated) {
    notify(
      {
        group: "generic",
        title: "Success",
        text: "Your account was successfully updated!",
      },
      4000
    ); // 4s
    store.commit("updateProfileStatus");
  }
  Object.keys(store.state.user)
    .filter((key) => key in formProfile.value)
    .forEach((key) => (formProfile.value[key] = store.state.user[key]));
  Object.keys(store.state.user)
    .filter((key) => key in formInfo.value)
    .forEach((key) => (formInfo.value[key] = store.state.user[key]));
  imgSrc.value = store.state.user.profile_img;
});

//Profile image handling

const fileUploaded = ref(false);

const avatar = ref(null);

const imgSrc = ref(store.state.user.profile_img);

const avatarRemoved = ref(false);

const uploadImage = (e) => {
  errorProfile.value.profile_img = "";
  formData.value.delete("file");
  avatar.value = e.target.files[0];
  if (!avatar.value.type.includes("image")) {
    errorProfile.value.profile_img = "This image format is not supported";
    notify(
      {
        group: "error",
        title: "Failed",
        text: errorProfile.value.profile_img,
      },
      4000
    ); // 4s
  } else if (avatar.value.size > 819200) {
    errorProfile.value.profile_img = "Image size should be < 800KB";
    notify(
      {
        group: "error",
        title: "Failed",
        text: errorProfile.value.profile_img,
      },
      4000
    ); // 4s
  } else {
    imgSrc.value = URL.createObjectURL(avatar.value);
    fileUploaded.value = true;
    avatarRemoved.value = false;
  }
};

const removeImage = () => {
  avatarRemoved.value = true;
  imgSrc.value = apiUrl + "/profiledefault.jpg";
  fileUploaded.value = false;
  formData.value.delete("file");
  errorProfile.value.profile_img = "";
  avatar.value = null;
};

//Forms Handling

const countries = ref(countrieslist);

const formData = ref(new FormData());

const formProfile = ref({
  nickname: "",
  description: "",
});

const formInfo = ref({
  first_name: "",
  last_name: "",
  email: "",
  country: "",
  address: "",
  city: "",
  state: "",
});

const errorProfile = ref({
  nickname: "",
  description: "",
  profile_img: "",
});

const errorInfo = ref({
  first_name: "",
  last_name: "",
  country: "",
  address: "",
  city: "",
  state: "",
});

const saveProfile = async () => {
  if (!errorProfile.value.profile_img.length) {
    loadingProfile.value = true;
    Object.keys(errorProfile.value).forEach((key) => {
      errorProfile.value[key] = "";
    });

    for (const key in formProfile.value) {
      formData.value.append(key, formProfile.value[key]);
    }

    formData.value.append("avatarRemoved", avatarRemoved.value);

    if (avatar.value) {
      formData.value.append("file", avatar.value);
    }

    await store
      .dispatch("editProfile", { formData: formData.value })
      .then(async () => {
        await store.dispatch("fetchUser");
        props.socket.emit("change socket info", store.state.user);
        fileUploaded.value = false;
        store.commit("updateProfileStatus");
        emit("reRender");
        loadingProfile.value = false;
      })
      .catch((err) => {
        errorProfile.value = Object.assign(
          errorProfile.value,
          err.response.data.errors
        );
        for (const key in formProfile.value) {
          formData.value.delete(key);
        }
        formData.value.delete("file");
        loadingProfile.value = false;
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

const saveInfo = async () => {
  Object.keys(errorInfo.value).forEach((key) => {
    errorInfo.value[key] = "";
  });
  loadingInfo.value = true;
  await store
    .dispatch("editInfo", { formInfo: formInfo.value })
    .then(async (res) => {
      await store.dispatch("fetchUser");
      loadingInfo.value = false;
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
      loadingInfo.value = false;
      errorInfo.value = Object.assign(
        errorInfo.value,
        err.response.data.errors
      );
      notify(
        {
          group: "error",
          title: "Failed",
          text: "There are errors in the form!",
        },
        4000
      ); // 4s
    });
};

//Desactivate account Modal handling

const openModal = ref(false);

const desactivateAccount = async () => {
  loadingModal.value = true;
  await store
    .dispatch("desactivateAccount")
    .then(() => {
      window.location.href = "/";
      loadingModal.value = false;
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
};
</script>
