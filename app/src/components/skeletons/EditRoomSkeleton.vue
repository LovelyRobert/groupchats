<template>
  <div class="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
    <div>
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <div class="skeleton w-44 h-4" />
            <div class="skeleton mt-1 w-full h-10" />
          </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
          <div class="shadow sm:overflow-hidden sm:rounded-md">
            <div class="space-y-6 px-4 py-5 sm:p-6">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3 sm:col-span-2">
                  <div class="block skeleton h-4 w-32" />
                  <div class="mt-1 flex rounded-md">
                    <div class="skeleton block w-full h-10 flex-1" />
                  </div>
                </div>
              </div>

              <div>
                <div class="block skeleton h-4 w-32" />
                <div class="mt-1">
                  <div class="skeleton mt-1 block w-full h-32" />
                </div>
                <div class="skeleton mt-2 h-2 w-96" />
              </div>

              <div
                class="skeleton mt-1 flex justify-center h-36 rounded-md border-2 border-dashed" />

              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <div class="skeleton block h-4 w-32" />
                  <div
                    class="skeleton w-full h-10 mt-1 block w-full rounded-md py-2 px-3" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <div class="skeleton block h-4 w-32" />
                  <div
                    class="skeleton w-full h-10 mt-1 block w-full rounded-md py-2 px-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200"></div>
      </div>
    </div>

    <div class="flex flex-row-reverse bg-gray-50 px-4 py-3 text-right sm:px-6">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Update
      </button>
    </div>
  </div>
</template>
