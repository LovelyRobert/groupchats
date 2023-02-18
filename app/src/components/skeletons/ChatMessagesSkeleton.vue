<template>
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

    <div v-for="(value, index) in Array(3)" :key="index" class="flex items-end">
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
</template>
