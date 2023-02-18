<template>
  <div class="relative z-10 bg-indigo-50">
    <div
      class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
      <div class="grid grid-cols-1 justify-items-center lg:justify-items-start">
        <div class="skeleton w-48 sm:w-80 h-6" />

        <div class="skeleton w-52 sm:w-96 h-6 mt-4" />
      </div>
      <div class="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <div
            class="skeleton w-36 h-12 inline-flex items-center justify-center rounded-md" />
        </div>
        <div class="ml-3 inline-flex rounded-md shadow">
          <div
            class="skeleton w-32 h-12 inline-flex items-center justify-center rounded-md" />
        </div>
      </div>
    </div>
  </div>
  <footer class="text-base py-6 bg-indigo-600 text-sm text-gray-100">
    Copyright 2023 openChat. All rights reserved
  </footer>
</template>
