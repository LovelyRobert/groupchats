<template>
  <notification-view />
  <div
    class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2
          class="mx-auto w-auto text-center text-1xl font-bold tracking-tight">
          <span class="text-gray-900">open</span
          ><span class="text-indigo-600">CHAT</span>
        </h2>
        <h2
          class="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Contact us
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          We're always happy to listen and discuss our products, services, or
          partnerships. Let us know what's on your mind!
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="submit" @submit="sendEmail">
        <p
          v-for="(value, key) in formErrors"
          :key="key"
          class="font-medium text-sm text-center text-red-600">
          {{ value.message }}
        </p>

        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="full-name" class="sr-only">Full name</label>
            <input
              v-model="form.name"
              id="full-name"
              name="full-name"
              type="text"
              autocomplete="full-name"
              class="relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              :class="[
                formErrors.name.message.length
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300',
              ]"
              placeholder="Full name*" />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              v-model="form.email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              class="relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              :class="[
                formErrors.email.message.length
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300',
              ]"
              placeholder="Email address*" />
          </div>
        </div>

        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="subject" class="sr-only">Subject</label>
            <input
              v-model="form.subject"
              id="subject"
              name="subject"
              type="subject"
              autocomplete="current-subject"
              class="relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              :class="[
                formErrors.subject.message.length
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300',
              ]"
              placeholder="Subject*" />
          </div>
        </div>

        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="message" class="sr-only">Your message</label>
            <textarea
              v-model="form.message"
              rows="5"
              id="message"
              name="message"
              type="message"
              autocomplete="message"
              class="relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              :class="[
                formErrors.message.message.length
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300',
              ]"
              placeholder="Your message*" />
          </div>
        </div>

        <div>
          <button
            v-if="!loading"
            type="submit"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <PaperAirplaneIcon
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true" />
            </span>
            Send
          </button>
          <a
            v-else
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <ClipLoader class="h-5 w-5" :color="'#fff'" :size="'1.5rem'" />
            </span>
            Send
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { PaperAirplaneIcon } from "@heroicons/vue/solid";
import { notify } from "notiwind";
import { useStore } from "vuex";

const store = useStore();

const loading = ref(false);

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});
const formErrors = ref({
  name: {
    message: "",
    type: "",
  },
  email: {
    message: "",
    type: "",
  },
  subject: {
    message: "",
    type: "",
  },
  message: {
    message: "",
    type: "",
  },
});

const sendEmail = async () => {
  Object.keys(formErrors.value).forEach((key) => {
    formErrors.value[key].message = "";
    formErrors.value[key].type = "";
  });
  loading.value = true;
  await store
    .dispatch("sendContactMessage", { form: form.value })
    .then((res) => {
      loading.value = false;
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
      loading.value = false;
      if (err.response.status == 422) {
        formErrors.value = { ...formErrors.value, ...err.response.data };
      } else {
        notify(
          {
            group: "error",
            title: "Failed",
            text: err.response.data,
          },
          4000
        ); // 4s
      }
    });
};
</script>
