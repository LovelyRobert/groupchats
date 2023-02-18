<template>
  <div class="pt-8">
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

              <div class="flex -space-x-2 pt-1 overflow-hidden">
                <div class="skeleton h-4 w-28 mt-2 inline-block mr-2" />
                <div
                  v-for="(value, index) in Array(5)"
                  :key="index"
                  class="inline-block cursor-pointer pl-1">
                  <div
                    class="skeleton h-5 w-5 mt-1 rounded-full object-cover ring-2 ring-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
