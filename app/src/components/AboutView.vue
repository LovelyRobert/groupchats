<template>
  <!-- section 1 -->
  <div class="isolate bg-white">
    <div
      class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
      <svg
        class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
        viewBox="0 0 1155 678"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
          fill-opacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z" />
        <defs>
          <linearGradient
            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#9089FC" />
            <stop offset="1" stop-color="#4338ca" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <main>
      <div class="relative px-6 lg:px-8">
        <div class="mx-auto max-w-2xl py-16 sm:py-48 lg:py-56">
          <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div
              class="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Want to contribute to the project?
              <router-link to="/contact" class="font-semibold text-indigo-600"
                ><span class="absolute inset-0" aria-hidden="true"></span
                >Contact us <span aria-hidden="true">&rarr;</span></router-link
              >
            </div>
          </div>
          <div class="text-center">
            <h1
              class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Keeps evolving and adding new features
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              The primary feature of a openCHAT is the ability to send and
              receive messages between users using rooms(group chats). This can
              be done through text, images, or voice messages. openCHAT is for
              everyone who wants fast and reliable group messaging. Users around
              the world can discuss and share everyting about their common
              favourite topics using chat rooms.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <router-link
                to="/chat-rooms"
                class="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Get started
              </router-link>
              <router-link
                to="/create-room"
                class="text-base font-semibold leading-7 text-gray-900"
                >Create your room <span aria-hidden="true">→</span>
              </router-link>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            class="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
              fill-opacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z" />
            <defs>
              <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#9089FC" />
                <stop offset="1" stop-color="#4338ca" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </main>
  </div>
  <!-- section 2 -->

  <div class="overflow-hidden bg-white py-8 lg:mb-16 sm:py-16">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div class="lg:pr-8 lg:pt-4">
          <div class="lg:max-w-lg">
            <h2
              class="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
              Who is openCHAT for?
            </h2>
            <p
              class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Main features
            </p>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              Create your own room and gather people around the world, to chat
              about any topic you want. Moderate users connected to your room
              and enjoy all openCHAT functionalities.
            </p>
            <dl
              class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
              <div
                v-for="feature in features"
                :key="feature.name"
                class="relative pl-9">
                <dt class="inline font-semibold text-gray-900">
                  <component
                    :is="feature.icon"
                    class="absolute top-1 left-1 h-5 w-5 text-indigo-600"
                    aria-hidden="true" />
                  {{ feature.name }}
                </dt>
                {{ " " }}
                <dd class="inline">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div>
          <img
            src="/Capture.png"
            alt="Product screenshot"
            class="w-[48rem] max-w-none rounded-xl shadow-xl mb-10 lg-mb-0 lg:mt-48 ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width="2432"
            height="1442" />
        </div>
      </div>
    </div>
  </div>

  <!-- section 3 -->
  <div class="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
    <img
      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1097 845"
      aria-hidden="true"
      class="hidden transform-gpu blur-3xl sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:w-[68.5625rem]">
      <path
        fill="url(#10724532-9d81-43d2-bb94-866e98dd6e42)"
        fill-opacity=".2"
        d="M301.174 646.641 193.541 844.786 0 546.172l301.174 100.469 193.845-356.855c1.241 164.891 42.802 431.935 199.124 180.978 195.402-313.696 143.295-588.18 284.729-419.266 113.148 135.13 124.068 367.989 115.378 467.527L811.753 372.553l20.102 451.119-530.681-177.031Z" />
      <defs>
        <linearGradient
          id="10724532-9d81-43d2-bb94-866e98dd6e42"
          x1="1097.04"
          x2="-141.165"
          y1=".22"
          y2="363.075"
          gradientUnits="userSpaceOnUse">
          <stop stop-color="#776FFF" />
          <stop offset="1" stop-color="#4338ca" />
        </linearGradient>
      </defs>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1097 845"
      aria-hidden="true"
      class="absolute left-1/2 -top-52 -z-10 w-[68.5625rem] -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0">
      <path
        fill="url(#8ddc7edb-8983-4cd7-bccb-79ad21097d70)"
        fill-opacity=".2"
        d="M301.174 646.641 193.541 844.786 0 546.172l301.174 100.469 193.845-356.855c1.241 164.891 42.802 431.935 199.124 180.978 195.402-313.696 143.295-588.18 284.729-419.266 113.148 135.13 124.068 367.989 115.378 467.527L811.753 372.553l20.102 451.119-530.681-177.031Z" />
      <defs>
        <linearGradient
          id="8ddc7edb-8983-4cd7-bccb-79ad21097d70"
          x1="1097.04"
          x2="-141.165"
          y1=".22"
          y2="363.075"
          gradientUnits="userSpaceOnUse">
          <stop stop-color="#776FFF" />
          <stop offset="1" stop-color="#4338ca" />
        </linearGradient>
      </defs>
    </svg>
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Customize your room
        </h2>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Control how your rooms looks by customizing banner, title, language,
          category and desctiption, making it more accessible to other users.
          You can also edit your room any time from your profile section.
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Users can search for any room matching your preferences using the
          filter functionnality:
        </p>
      </div>
      <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
        <div
          class="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
          <span v-for="filter in Filters" :key="filter.name"
            >{{ filter.name }}
          </span>
        </div>
        <dl
          class="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.name"
            class="flex flex-col-reverse">
            <dt class="text-base leading-7 text-gray-300">{{ stat.name }}</dt>
            <dd class="text-2xl font-bold leading-9 tracking-tight text-white">
              {{ stat.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AdjustmentsIcon } from "@heroicons/vue/outline";
import {
  AtSymbolIcon,
  PhotographIcon,
  ChatAlt2Icon,
} from "@heroicons/vue/solid";

const features = [
  {
    name: "Tag other users.",
    description:
      "Tag any room user in your messages, they will automatically be notified about your tag.",
    icon: AtSymbolIcon,
  },
  {
    name: "Send media files.",
    description:
      "Upload any picture or record up to 1min voice message inside the chat.",
    icon: PhotographIcon,
  },
  {
    name: "Moderate your room.",
    description:
      "Control who can connect to your room by banning or allowing to connect into it.",
    icon: AdjustmentsIcon,
  },
  {
    name: "Keep your room chat history.",
    description:
      "Room chat history is automatically kept, allowing new connected users to follow up.",
    icon: ChatAlt2Icon,
  },
];

const Filters = [
  { name: "Keyword" },
  { name: "Category" },
  { name: "Language" },
];
const stats = [
  { name: "Rooms per user", value: "4" },
  { name: "Messages", value: "Unlimited" },
  { name: "Connected users", value: "Unlimited" },
  { name: "Media sharing", value: "Unlimited" },
];
</script>
