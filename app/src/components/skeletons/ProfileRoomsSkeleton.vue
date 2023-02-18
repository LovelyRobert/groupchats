<template>
  <div class="pt-4">
    <div class="skeleton h-6 w-48" />
    <div
      class="mt-6 grid justify-items-stretch grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      <div v-for="(value, index) in Array(8)" :key="index" class="group">
        <div>
          <a
            class="min-h-80 w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:h-80">
            <div
              class="skeleton h-72 sm:h-48 lg:h-48 w-full object-cover object-center" />
          </a>
          <div class="mt-4 flex justify-between">
            <div>
              <div class="skeleton h-4 w-32" />

              <div class="flex mt-2 text-xs text-gray-500 items-center">
                <div
                  class="skeleton w-20 h-6 px-2 inline-flex rounded-md mr-2" />

                <div class="skeleton w-20 h-6 px-2 inline-flex rounded-md" />
              </div>

              <div class="skeleton w-32 h-4 mt-2" />
            </div>
          </div>
        </div>

        <!-- edit layout -->
        <div class="flex space-x-2 pt-2 overflow-hidden">
          <div class="skeleton w-6 h-6" />
          <div class="skeleton w-6 h-6" />
        </div>
      </div>
    </div>
  </div>
</template>
