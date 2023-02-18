<template>
  <div class="skeleton w-full h-52"></div>

  <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
    <div
      class="grid grid-cols-3 gap-y-8 lg:gap-y-0 sm:items-center justify-between py-3 border-b-2 border-gray-200">
      <div
        class="relative col-span-3 lg:col-span-1 justify-self-center lg:justify-self-start flex items-center space-x-4">
        <div class="relative">
          <span class="absolute text-green-500 right-0 bottom-0">
            <svg width="20" height="20">
              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
            </svg>
          </span>
          <div class="skeleton w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
        </div>
        <div class="flex flex-col leading-tight">
          <div class="text-2xl mt-1 flex items-center">
            <span class="skeleton w-52 h-8 mr-3"></span>
          </div>
        </div>
      </div>
      <div
        class="justify-self-center col-span-3 lg:col-span-1 flex -space-x-2 overflow-hidden">
        <div class="flex items-center">
          <div class="skeleton h-4 w-4 rounded-full pr-1 mr-2" />
          <div class="skeleton w-28 h-4 mr-2" />
          <div
            v-for="(value, index) in Array(5)"
            :key="index"
            class="skeleton h-10 w-10 rounded-full" />
        </div>
      </div>
      <div
        class="flex items-center col-span-3 lg:col-span-1 justify-self-center lg:justify-self-end space-x-2">
        <div
          class="skeleton inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"></div>
        <div
          class="skeleton inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"></div>
        <div
          class="skeleton inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"></div>
      </div>
    </div>
    <div
      id="messages"
      class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      <div class="flex items-end">
        <div
          class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <div
              class="skeleton h-16 w-80 px-4 py-2 rounded-lg inline-block rounded-bl-none"></div>
          </div>
        </div>
        <div class="skeleton w-6 h-6 rounded-full order-1" />
      </div>

      <div class="flex items-end justify-end">
        <div
          class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div>
            <div
              class="skeleton h-16 w-80 px-4 py-2 rounded-lg inline-block rounded-br-none"></div>
          </div>
        </div>
        <div class="skeleton w-6 h-6 rounded-full order-2" />
      </div>

      <div
        v-for="(value, index) in Array(3)"
        :key="index"
        class="flex items-end">
        <div
          class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <div
              class="skeleton h-16 w-80 px-4 py-2 rounded-lg inline-block rounded-bl-none"></div>
          </div>
        </div>
        <div class="skeleton w-6 h-6 rounded-full order-1" />
      </div>

      <div class="flex items-end justify-end">
        <div
          class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div>
            <div
              class="skeleton h-16 w-80 px-4 py-2 rounded-lg inline-block rounded-br-none"></div>
          </div>
        </div>
        <div class="skeleton w-6 h-6 rounded-full order-2" />
      </div>

      <div class="flex items-end">
        <div
          class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <div
              class="skeleton h-16 w-80 px-4 py-2 rounded-lg inline-block rounded-bl-none"></div>
          </div>
        </div>
        <div class="skeleton w-6 h-6 rounded-full order-1" />
      </div>
    </div>
    <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div class="skeleton w-full h-10 pl-12 rounded-md py-3" />
    </div>
  </div>
</template>
