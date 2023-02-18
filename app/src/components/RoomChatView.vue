<template>
  <notification-view />
  <showImageModal
    v-if="openImage"
    @closeModal="openImage = false"
    :open="openImage"
    :imageLink="imageLink" />

  <div v-if="roomData">
    <!-- Banner section -->
    <div
      class="w-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${roomData.img})` }"
      style="height: 15rem">
      <div
        class="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
        <div class="text-center">
          <div class="flex mt-2 text-xs text-gray-500 items-center">
            <span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-indigo-200 text-indigo-800 mr-2"
              >{{ roomData.language }} </span
            ><span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-orange-200 text-orange-800"
              >{{ roomData.category }}
            </span>
          </div>
          <h1 class="text-white text-3xl font-semibold uppercase sm:text-4xl">
            {{ roomData.title }}
          </h1>
          <router-link to="/chat-rooms"
            ><button
              class="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-500 focus:outline-none focus:bg-red-500">
              LEAVE ROOM
              <font-awesome-icon
                icon="fa-solid fa-arrow-right-from-bracket" /></button
          ></router-link>
        </div>
      </div>
    </div>

    <!-- Head section -->

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
            <img
              :src="`${$store.state.user.profile_img}?${new Date()}`"
              referrerpolicy="no-referrer"
              alt=""
              class="w-10 sm:w-16 h-10 sm:h-16 rounded-full object-cover" />
          </div>
          <div class="flex flex-col leading-tight">
            <div class="text-2xl mt-1 flex items-center">
              <span
                v-if="$store.state.user"
                class="flex flex-row justify-center items-center text-gray-700 mr-3"
                >{{ $store.state.user.nickname }}
                <p
                  v-if="roomData.created_by == $store.state.user._id"
                  class="text-xs pl-2 text-red-500">
                  (Moderator) <font-awesome-icon icon="fa-regular fa-flag" /></p
              ></span>
            </div>
            <span
              v-if="$store.state.user.description.length"
              class="text-lg text-gray-600"
              >{{ `${$store.state.user.description.slice(0, 20)}...` }}</span
            >
          </div>
        </div>

        <transition mode="out-in">
          <div class="justify-self-center col-span-3 lg:col-span-1">
            <div v-if="isSearching" class="relative w-96">
              <SearchInChat
                :isSearching="isSearching"
                @scrollContainer="(n) => (messagesContainer.scrollTop = n)"
                :messagesContainer="messagesContainer" />
            </div>
            <div v-else class="flex -space-x-2 overflow-hidden">
              <ConnectedSlideover
                :connectedUsers="roomData.users"
                :bannedUsers="roomData.banned_users"
                :key="connectedSlideoverKey"
                :messagesContainer="messagesContainer"
                :roomCreatedBy="roomData.created_by"
                @mention="mentionUser"
                @reRender="connectedSlideoverKey += 1"
                @ban="banUser"
                @allow="allowUser"
                @scrollContainer="(n) => (messagesContainer.scrollTop = n)" />
            </div>
          </div>
        </transition>

        <div
          class="flex items-center col-span-3 lg:col-span-1 justify-self-center lg:justify-self-end space-x-2">
          <router-link
            v-if="roomData.created_by == $store.state.user._id"
            :to="{
              name: 'EditRoom',
              params: {
                roomId,
              },
            }"
            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
            <font-awesome-icon
              class="text-red-500"
              icon="fa-solid fa-pen-to-square" />
          </router-link>
          <button
            @click="isSearching = !isSearching"
            type="button"
            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
            <svg
              v-if="!isSearching"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="h-6 w-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <font-awesome-icon
              v-else
              class="text-red-600"
              icon="fa-solid fa-xmark" />
          </button>
          <button
            @click="addFavourite"
            type="button"
            :class="{
              'text-white bg-red-500 hover:bg-red-300': isFavourite,
              'text-gray-500 hover:bg-gray-300': !isFavourite,
            }"
            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="h-6 w-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
          <button
            @click="soundMuted = !soundMuted"
            type="button"
            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out hover:bg-indigo-300 focus:outline-none">
            <font-awesome-icon
              v-if="!soundMuted"
              class="text-indigo-600"
              icon="fa-solid fa-volume-high" />
            <font-awesome-icon
              v-else
              class="text-gray-500"
              icon="fa-solid fa-volume-xmark" />
          </button>
        </div>
      </div>

      <!-- Messages section -->

      <div
        v-if="shownHistory"
        ref="messagesContainer"
        tabindex="0"
        @keyup.up="startScroll"
        @keyup.down="startScroll"
        @mousewheel="startScroll"
        v-click-out-side="stopScroll"
        class="flex flex-col space-y-4 p-3 h-50 overflow-y-auto outline-none scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div v-if="showArrow">
          <ClipLoader
            v-if="historyLoading"
            class="justify-center py-2 px-4"
            :color="'#312e81'" />
          <div v-else @click="showMore" class="flex flex-col mb-10">
            <button class="text-indigo-600">
              <font-awesome-icon icon="fa-regular fa-circle-up" />
            </button>
            <p class="text-center text-xs cursor-pointer">Show More</p>
          </div>
        </div>
        <div v-else>
          <p class="text-center text-xs text-gray-600">
            No more messages to show...
          </p>
        </div>

        <!-- History messages  -->

        <div v-for="date in historyDates(shownHistory)" :key="date">
          <div class="flex items-end justify-center mb-6">
            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2">
              <span
                class="px-2 py-1 rounded inline-block text-white rounded-full bg-indigo-600 text-gray-600"
                >{{ date }}</span
              >
            </div>
          </div>

          <transition-group>
            <MessageContent
              :messages="addHistoryStyle(shownHistory)"
              :date="date"
              @click="mentionUser"
              @showImage="
                (link) => {
                  openImage = true;
                  imageLink = link;
                }
              " />
          </transition-group>
        </div>

        <!-- Realtime messages  -->
        <div class="flex items-end justify-center">
          <hr
            class="text-center w-1/2 h-0.5 my-2 px-0.5 bg-gray-100 md:my-10" />
        </div>

        <div class="flex items-end justify-center">
          <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2">
            <span
              v-if="
                currentDate !==
                  historyDates(shownHistory)[
                    historyDates(shownHistory).length - 1
                  ] && messages.length
              "
              class="px-2 py-1 rounded inline-block text-white rounded-full bg-indigo-600 text-gray-600"
              >{{ currentDate }}</span
            >
          </div>
        </div>

        <transition-group>
          <MessageContent
            :messages="messages"
            :date="new Date().toISOString().split('T')[0]"
            @click="mentionUser"
            @showImage="
              (link) => {
                openImage = true;
                imageLink = link;
              }
            " />
        </transition-group>

        <!-- Typing notification  -->

        <transition>
          <div v-if="isTyping" class="chat-message">
            <div class="flex items-center justify-center">
              <div
                class="flex flex-col space-y-2 text-xs text-green-600 max-w-xs mx-2 items-center order-last">
                <span class="text-indigo-600">
                  {{ typingUser.nickname }} is typing...
                </span>
              </div>
              <img :src="typingUser.profile_img" class="w-6 h-6 rounded-full" />
            </div>
          </div>
        </transition>
      </div>

      <ChatMessagesSkeleton v-else />

      <!-- Mentioned users section  -->

      <div
        v-if="mentionedUsers.length"
        class="border-t-2 h-auto border-gray-200 px-2 pt-2 mb-2 sm:mb-2 h-0">
        <div class="flex flex-row">
          <span
            v-for="user in mentionedUsers"
            :key="user.id"
            class="px-2 py-1 mr-2 rounded inline-block text-white text-xs rounded-full bg-indigo-600 text-gray-600">
            @{{ user.nickname }}
            <font-awesome-icon
              @click="mentionedUsers.splice(mentionedUsers.indexOf(user), 1)"
              class="pt-1 cursor-pointer"
              icon="fa-solid fa-xmark" />
          </span>
        </div>
      </div>

      <!-- Input section  -->

      <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div class="relative flex-row">
          <span class="absolute inset-y-0 flex items-center">
            <VoiceRecorderButton
              @startRecording="isRecording = true"
              @stopRecording="isRecording = false"
              @recorded="getRecord"
              :roomId="roomId"
              :roomOwner="roomData.created_by"
              :isRecording="isRecording" />
          </span>
          <input
            v-if="!isRecording"
            @click="startScroll"
            @focus="stopScroll"
            v-model="myMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Write your message!"
            class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
          <div v-else class="center pl-14 py-3 justify-center">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
          </div>

          <div
            class="absolute z-20 right-0 bottom-0 items-center inset-y-0 sm:flex">
            <SendPictureButton
              v-if="!showEmojis"
              :isRecording="isRecording"
              :roomId="roomId"
              :roomOwner="roomData.created_by"
              @imageSaved="getImage" />
            <button
              v-if="!isRecording"
              v-click-out-side="clickOutSideEmojis"
              @click="showEmojis = true"
              type="button"
              class="items-center inline-flex justify-center mr-4 ml-2 rounded-full text-gray-600 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
              <font-awesome-icon icon="fa-regular fa-face-smile" />
              <transition>
                <EmojiPicker
                  v-if="showEmojis"
                  :native="true"
                  :display-recent="true"
                  @select="onSelectEmoji" />
              </transition>
            </button>
            <button
              v-if="!isRecording && !showEmojis"
              @click="sendMessage"
              type="button"
              class="inline-flex items-center justify-center rounded-lg px-3 py-3 sm:px-4 sm:py-3 transition duration-500 ease-in-out text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
              <span class="hidden sm:block sm:font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-6 w-6 ml-0 sm:ml-2 transform rotate-90">
                <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <room-chat-view-skeleton v-else />
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import RoomChatViewSkeleton from "./skeletons/RoomChatViewSkeleton.vue";
import ChatMessagesSkeleton from "./skeletons/ChatMessagesSkeleton.vue";
import ConnectedSlideover from "./chat/ConnectedSlideover.vue";
import VoiceRecorderButton from "./chat/VoiceRecorderButton.vue";
import MessageContent from "./chat/MessageContent";
import SearchInChat from "./chat/SearchInChat.vue";
import SendPictureButton from "./chat/SendPictureButton.vue";
import { clickOutSide as vClickOutSide } from "@mahdikhashan/vue3-click-outside";
import { notify } from "notiwind";
import NotificationView from "./NotificationView.vue";
import EmojiPicker from "vue3-emoji-picker"; // import emojis picker compopnent
import "/node_modules/vue3-emoji-picker/dist/style.css"; // import emojis css
import { MessageObject } from "./classes/messageClass";
import { classTypeObject } from "./objects/classTypeObject";

const props = defineProps({
  roomId: String,
  socket: Object,
});

const emit = defineEmits(["fetchError"]);

//Main variables

const store = useStore();

const router = useRouter();

const connectedSlideoverKey = ref(0);

const roomData = ref(null);

const messagesContainer = ref(null); //used for Dom modification refs

const messages = ref([]);

const isSearching = ref(false);
const isScrolling = ref(false);
const startScroll = () => {
  isScrolling.value = true;
};
const stopScroll = async () => {
  isScrolling.value = false;
  await nextTick(); //Wait until the DOM is fully updated
  messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
};

//Date automatic update

const today = ref(new Date());

const currentDate = ref(today.value.toISOString().split("T")[0]);

// watch(currentDate, ()=>{
//    //push date message if newdate is different of old date
// })

const updateDate = () => {
  setInterval(() => {
    currentDate.value = new Date().toISOString().split("T")[0];
  }, 1000 * 60 * 60);
};

//History handling

const shownHistory = ref(null);

const skip = ref(1);

const historyLoading = ref(false);

const showArrow = ref(true);

const showMore = async () => {
  historyLoading.value = true;
  skip.value += 1;
  await store
    .dispatch("fetchRoomHistory", {
      roomId: props.roomId,
      skip: skip.value,
    })
    .then((res) => {
      shownHistory.value = [...res.data.messages, ...shownHistory.value];
      historyLoading.value = false;
      if (shownHistory.value.length == res.data.length) {
        //Hide Show more when all the history messages are uploaded
        showArrow.value = false;
      }
    })
    .catch((err) => {
      emit("fetchError", err.message);
    });
};

const historyDates = (messages) => {
  let dates = messages.map(
    (el) => new Date(el.date).toISOString().split("T")[0]
  ); //to get an array of  message dates
  let noDuplicate = dates.filter(
    (item, index) => dates.indexOf(item) === index
  ); //remove duplicate dates
  return noDuplicate;
};

const addHistoryStyle = (messages) => {
  messages.map((el) => {
    if (el.userId == store.state.user._id) {
      if (el.dataType == "message") {
        Object.assign(el, classTypeObject.my_message);
      }
      if (el.dataType == "voice") {
        Object.assign(el, classTypeObject.my_voice);
      }
      if (el.dataType == "image") {
        Object.assign(el, classTypeObject.my_image);
      }
    } else {
      if (el.dataType == "message") {
        Object.assign(el, classTypeObject.user_message);
      }
      if (el.dataType == "voice") {
        Object.assign(el, classTypeObject.user_voice);
      }
      if (el.dataType == "image") {
        Object.assign(el, classTypeObject.user_image);
      }
    }
  });
  return messages;
};

//Connect and disconnect

const messageId = ref(0); //Initializing the new messages ID

onMounted(async () => {
  let fetchRoom = store.dispatch("fetchSingleRoom", { roomId: props.roomId });
  let fetchHistory = store.dispatch("fetchRoomHistory", {
    roomId: props.roomId,
    skip: skip.value,
  });
  await Promise.all([fetchRoom, fetchHistory])
    .then(async (res) => {
      roomData.value = res[0].data;
      shownHistory.value = res[1].data.messages;
      messageId.value = shownHistory.value.length
        ? shownHistory.value[shownHistory.value.length - 1].id
        : 0;

      //Hide Show more if all the history messages are uploaded
      if (shownHistory.value.length == res[1].data.length) {
        showArrow.value = false;
      }
      props.socket.emit("join", props.roomId);

      //Avoid user added to connected again when refresh
      if (
        !roomData.value.users.map((el) => el._id).includes(store.state.user._id)
      ) {
        roomData.value.users.push(store.state.user);
      }
      ///Update date and scroll to bottom
      updateDate();
      await nextTick();
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    })
    .catch((err) => {
      if (err.response.status === 404) {
        router.push({ name: "NotFound" });
      } else {
        emit("fetchError", err.message);
      }
    });
});

onUnmounted(() => {
  props.socket.emit("leave", props.roomId);
});

props.socket.on("user joined", async (user) => {
  if (!roomData.value.users.map((el) => el._id).includes(user._id)) {
    //Avoid user added to connected again when refresh
    roomData.value.users.push(user);
  }
});

props.socket.on("user left", async (user) => {
  if (roomData.value.users.map((el) => el._id).includes(user._id)) {
    let indexLeft = roomData.value.users.map((el) => el._id).indexOf(user._id);
    roomData.value.users.splice(indexLeft, 1);
  }
});

//Text messages

const myMessage = ref("");

props.socket.on("user message", async (messageObject) => {
  if (messageObject.userId == store.state.user._id) {
    Object.assign(messageObject, classTypeObject.my_message);
    messages.value.push(messageObject);
    if (!isSearching.value && !isScrolling.value) {
      await nextTick(); //Wait until the DOM is fully updated
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
    }
  } else {
    Object.assign(messageObject, classTypeObject.user_message);
    messages.value.push(messageObject);
    playSound("/sounds/incoming-message.wav");
    if (!isSearching.value && !isScrolling.value) {
      await nextTick(); //Wait until the DOM is fully updated
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
    }
  }
});

const sendMessage = () => {
  if (myMessage.value || mentionedUsers.value.length) {
    messageId.value += 1;
    let mentionedNicknames = [];
    let mentionedIds = [];
    if (mentionedUsers.value.length) {
      mentionedNicknames = mentionedUsers.value.map((el) => `@${el.nickname}`);
      mentionedIds = mentionedUsers.value.map((el) => el._id);
      myMessage.value = myMessage.value + " " + mentionedNicknames.join(" ");
    }
    let messageObject = new MessageObject(
      messageId.value,
      store.state.user._id,
      store.state.user.nickname,
      store.state.user.profile_img,
      myMessage.value,
      "message"
    );
    props.socket.emit("send message", {
      messageObject,
      roomId: props.roomId,
      roomName: roomData.value.title,
      mentionedIds,
    });
    myMessage.value = "";
    mentionedUsers.value = [];
  }
};

//Voice recording

const isRecording = ref(false);

const getRecord = (filename) => {
  mentionedUsers.value = [];
  messageId.value += 1;
  let messageObject = new MessageObject(
    messageId.value,
    store.state.user._id,
    store.state.user.nickname,
    store.state.user.profile_img,
    "",
    "voice"
  );
  props.socket.emit("voice record", {
    messageObject,
    roomId: props.roomId,
    filename,
    roomOwner: roomData.value.created_by,
  });
};

props.socket.on("record link", async (messageObject) => {
  if (messageObject.userId == store.state.user._id) {
    Object.assign(messageObject, classTypeObject.my_voice);
    messages.value.push(messageObject);
    if (!isSearching.value && !isScrolling.value) {
      await nextTick(); //Wait until the DOM is fully updated
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
    }
  } else {
    Object.assign(messageObject, classTypeObject.user_voice);
    messages.value.push(messageObject);
    playSound("/sounds/incoming-message.wav");
    if (!isSearching.value && !isScrolling.value) {
      await nextTick(); //Wait until the DOM is fully updated
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
    }
  }
});

//Image upload

const openImage = ref(false);

const getImage = ({ filename, type }) => {
  mentionedUsers.value = [];
  messageId.value += 1;
  let messageObject = new MessageObject(
    messageId.value,
    store.state.user._id,
    store.state.user.nickname,
    store.state.user.profile_img,
    "",
    "image"
  );
  props.socket.emit("image upload", {
    messageObject,
    roomId: props.roomId,
    roomOwner: roomData.value.created_by,
    filename,
    type,
  });
};

props.socket.on("show image", async (messageObject) => {
  if (messageObject.userId == store.state.user._id) {
    Object.assign(messageObject, classTypeObject.my_image);
    messages.value.push(messageObject);
    if (!isSearching.value && !isScrolling.value) {
      await nextTick(); //Wait until the DOM is fully updated
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
    }
  } else {
    Object.assign(messageObject, classTypeObject.user_image);
    messages.value.push(messageObject);
    playSound("/sounds/incoming-message.wav");
    if (!isSearching.value && !isScrolling.value) {
      await nextTick(); //Wait until the DOM is fully updated
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
    }
  }
});

//User mention

const mentionedUsers = ref([]);

const mentionUser = (user) => {
  let { _id, nickname } = user;
  if (!mentionedUsers.value.some((el) => el._id == user._id)) {
    mentionedUsers.value.push({ _id, nickname });
  }
};

//User Ban

props.socket.on("user banned", (bannedUser) => {
  roomData.value.banned_users.push(bannedUser);
});

const banUser = (user) => {
  props.socket.emit("ban user", {
    roomId: props.roomId,
    roomName: roomData.value.title,
    bannedUser: user,
  });
};

//User Allow

props.socket.on("user allowed", (allowedUser) => {
  roomData.value.banned_users = roomData.value.banned_users.filter(
    (el) => el._id !== allowedUser._id
  );
});

const allowUser = (user) => {
  props.socket.emit("allow user", {
    roomId: props.roomId,
    roomName: roomData.value.title,
    allowedUser: user,
  });
};

//Add room to favourites

const favourites = ref(new Set(store.state.user.favourites));

const isFavourite = computed(() => {
  return favourites.value.has(props.roomId); //return Boolean
});

const addFavourite = () => {
  if (!isFavourite.value) {
    props.socket.emit("add favourite", props.roomId);
    favourites.value.add(props.roomId);
    store.state.user.favourites.push(props.roomId);
    notify(
      {
        group: "generic",
        title: "Success",
        text: "Room added successfully to favourites!",
      },
      4000
    ); // 4s
  } else {
    props.socket.emit("remove favourite", props.roomId);
    favourites.value.delete(props.roomId);
    store.state.user.favourites.splice(
      store.state.user.favourites.indexOf(props.roomId),
      1
    );
    notify(
      {
        group: "generic",
        title: "Success",
        text: "Room removed successfully from favourites!",
      },
      4000
    ); // 4s
  }
};

//Notification sounds

const soundMuted = ref(false);

const playSound = (sound) => {
  if (!soundMuted.value) {
    if (sound) {
      var audio = new Audio(sound);
      audio.play();
    }
  }
};

//User typing detection

const isTyping = ref(false);

const typingUser = ref(null);

const typingInterval = ref(null);

watchEffect((onInvalidate) => {
  if (myMessage.value.length) {
    props.socket.emit("is typing", props.roomId);

    onInvalidate(() => {
      if (myMessage.value.length) {
        props.socket.emit("clear interval", props.roomId);
      }
    });
  }
});

props.socket.on("user typing", async (user) => {
  typingUser.value = {
    nickname: user.nickname,
    profile_img: user.profile_img,
  };
  isTyping.value = true;
  if (!isSearching.value && !isScrolling.value) {
    await nextTick(); //Wait until the DOM is fully updated
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
  }

  typingInterval.value = setTimeout(() => {
    isTyping.value = false;
  }, 700);
});

props.socket.on("clear timeout", () => {
  clearInterval(typingInterval.value);
});

//Add Emojis

const showEmojis = ref(false);

function onSelectEmoji(emoji) {
  myMessage.value = myMessage.value ? myMessage.value + emoji.i : emoji.i;
}

const clickOutSideEmojis = () => {
  showEmojis.value = false;
};
</script>
