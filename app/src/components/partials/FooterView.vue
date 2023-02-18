<template>
  <div class="relative z-10 bg-indigo-50">
    <div
      class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
      <h2
        class="text-3xl text-center lg:text-left font-bold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">{{
          $store.state.user ? "Ready to dive in?" : "Have an account yet?"
        }}</span>
        <span class="block text-indigo-600">{{
          $store.state.user
            ? "Create your first room now."
            : "Signup now and enjoy chating for free."
        }}</span>
      </h2>
      <div class="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <router-link
            :to="$store.state.user ? '/create-room' : '/signup'"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
            {{ $store.state.user ? "Get started" : "Sign up" }}
          </router-link>
        </div>
        <div class="ml-3 inline-flex rounded-md shadow">
          <router-link
            :to="$store.state.user ? '/chat-rooms' : '/login'"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50">
            {{ $store.state.user ? "Discover" : "Login" }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <footer class="text-base py-6 bg-indigo-600 text-sm text-gray-100">
    Copyright 2023 openChat. All rights reserved
  </footer>
</template>
