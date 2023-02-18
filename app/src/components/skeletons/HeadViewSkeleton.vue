<template>
  <div class="relative bg-indigo-600 z-10">
    <div class="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex w-0 flex-1 items-center">
          <div class="skeleton w-10 h-10 flex rounded-lg p-2" />

          <div class="ml-3 w-full">
            <div class="skeleton h-4 w-full sm:w-72 md:hidden" />
            <div class="skeleton hidden h-4 w-96 md:block" />
          </div>
        </div>
        <div
          class="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
          <div
            class="skeleton w-full sm:w-28 h-10 flex items-center justify-center rounded-md px-4 py-2" />
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <div class="-mr-1 flex sm:-mr-2 flex rounded-md p-2">
            <div class="skeleton h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="relative bg-white">
    <div class="mx-auto max-w-7xl px-6">
      <div
        class="flex items-center justify-between border-b-2 border-gray-100 py-6 lg:justify-start lg:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <h2 class="text-2xl font-bold tracking-tight">
            <span class="text-gray-900">open</span
            ><span class="text-indigo-600">CHAT</span>
          </h2>
        </div>
        <div class="-my-2 -mr-2 lg:hidden">
          <div
            class="skeleton w-8 h-8 inline-flex items-center justify-center rounded-md p-2" />
        </div>
        <nav class="hidden space-x-10 lg:flex">
          <span class="skeleton w-20 h-4" />
          <a class="skeleton w-20 h-4" />
          <a class="skeleton w-20 h-4" />
          <a class="skeleton w-20 h-4" />
          <a class="skeleton w-20 h-4" />
        </nav>
        <div
          class="hidden items-center justify-end space-x-4 lg:flex md:flex-1 lg:w-0">
          <a class="skeleton w-20 h-4" />
          <a class="skeleton w-20 h-10" />
        </div>
      </div>
    </div>
  </div>
</template>
