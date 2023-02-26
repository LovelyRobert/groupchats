<template>
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
          Create a new account now!
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          {{ " " }}
          <a
            :href="apiUrl + '/auth'"
            class="font-medium text-indigo-600 hover:text-indigo-500"
            ><button
              class="px-6 py-3 mt-4 bg-white border-2 border-gray-500 rounded-md shadow outline-none hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline w-4 h-4 mr-3 text-gray-900 fill-current"
                viewBox="0 0 48 48"
                width="48px"
                height="48px">
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg
              >Sign up with Google
            </button></a
          >
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="submit">
        <p class="font-medium text-sm text-red-600">{{ error.nickname }}</p>
        <p class="font-medium text-sm text-red-600">{{ error.email }}</p>
        <p class="font-medium text-sm text-red-600">{{ error.password }}</p>
        <input type="hidden" name="remember" value="true" />

        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="nickname" class="sr-only">Nickname</label>
            <input
              v-model="form.nickname"
              id="nickname"
              name="nickname"
              type="text"
              autocomplete="nickname"
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Nickname*"
              required />
          </div>
        </div>

        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              v-model="form.email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address*"
              required />
          </div>
          <div class="relative">
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="form.password"
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="password"
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password*"
              required />
            <p
              class="absolute z-10 inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-sm leading-5 text-gray-500"
              @click="showPassword = !showPassword">
              <font-awesome-icon
                :icon="
                  showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'
                " />
            </p>
          </div>
          <div class="relative">
            <label for="confirm-password" class="sr-only"
              >confirm password</label
            >
            <input
              v-model="form.confirmPassword"
              id="confirm-password"
              name="confirm-password"
              :type="showPasswordConfirm ? 'text' : 'password'"
              autocomplete="confirm-password"
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Confirm password*"
              required />
            <p
              class="absolute z-10 inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-sm leading-5 text-gray-500"
              @click="showPasswordConfirm = !showPasswordConfirm">
              <font-awesome-icon
                :icon="
                  showPasswordConfirm
                    ? 'fa-regular fa-eye-slash'
                    : 'fa-regular fa-eye'
                " />
            </p>
          </div>
        </div>

        <div>
          <button
            v-if="!loading"
            @click="signup"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true" />
            </span>
            Sign up
          </button>
          <a
            v-else
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <ClipLoader class="h-5 w-5" :color="'#fff'" :size="'1.5rem'" />
            </span>
            Sign up
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { LockClosedIcon } from "@heroicons/vue/solid";
import { useStore } from "vuex";

const store = useStore();

const apiUrl = process.env.VUE_APP_API_ENDPOINT;

const loading = ref(false);

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const error = ref({
  nickname: "",
  email: "",
  password: "",
});

const form = ref({
  nickname: null,
  email: null,
  password: null,
  confirmPassword: null,
});

const signup = async () => {
  if (form.value.email && form.value.password && form.value.nickname) {
    loading.value = true;
    if (form.value.password !== form.value.confirmPassword) {
      error.value.password = "Passwords does not match.";
      loading.value = false;
    } else {
      error.value.nickname = error.value.email = error.value.password = "";
      await store
        .dispatch("signUp", { form: form.value })
        .then(async () => {
          window.location.href = "/";
        })
        .catch((err) => {
          error.value.nickname = err.response.data.errors.nickname;
          error.value.email = err.response.data.errors.email;
          error.value.password = err.response.data.errors.password;
          loading.value = false;
        });
    }
  }
};
</script>
