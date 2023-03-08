<template>
  <notification-view />
  <showImageModal
    v-if="openImage"
    @closeModal="openImage = false"
    :open="openImage"
    :imageLink="imageLink" />

  <div v-if="roomData">
    <!-- Banner section -->
    <ChatViewBanner :roomData="roomData" />
    <!-- Head section -->
    <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <ChatHeadSection
        :roomData="roomData"
        :roomId="roomId"
        :isFavourite="isFavourite"
        :isSearching="isSearching"
        @activateSearch="isSearching = !isSearching"
        :soundMuted="soundMuted"
        @mute="soundMuted = !soundMuted"
        @banUser="banUser"
        @allowUser="allowUser"
        @mentionUser="mentionUser"
        @addFavourite="addFavourite"
        :messagesContainer="messagesContainer"
        @scrollContainer="
          (n) => {
            messagesContainer.scrollTop = n;
          }
        " />
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
        <ChatMessagesSection
          :historyLoading="historyLoading"
          :showArrow="showArrow"
          :isTyping="isTyping"
          :history="addHistoryStyle(shownHistory)"
          :shownHistory="shownHistory"
          :messages="messages"
          :currentDate="currentDate"
          :typingUser="typingUser"
          @showMore="showMore"
          @mentionUser="mentionUser"
          @showImage="
            (link) => {
              openImage = true;
              imageLink = link;
            }
          " />
      </div>

      <ChatMessagesSkeleton v-else />

      <!-- Mentioned users section  -->
      <MentionSection
        :mentionedUsers="mentionedUsers"
        @removeMention="
          (user) => mentionedUsers.splice(mentionedUsers.indexOf(user), 1)
        " />

      <!-- Input section  -->
      <InputSection
        @getRecord="getRecord"
        @getImage="getImage"
        @startScroll="startScroll"
        @stopScroll="stopScroll"
        @sendMessage="sendMessage"
        :socket="socket"
        :roomId="roomId"
        :roomOwner="roomData.created_by" />
    </div>
  </div>
  <RoomChatViewSkeleton v-else />
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import RoomChatViewSkeleton from "./skeletons/RoomChatViewSkeleton.vue";
import ChatMessagesSkeleton from "./skeletons/ChatMessagesSkeleton.vue";
import ChatViewBanner from "./chat/ChatViewBanner.vue";
import ChatHeadSection from "./chat/ChatHeadSection.vue";
import ChatMessagesSection from "./chat/ChatMessagesSection.vue";
import MentionSection from "./chat/MentionSection.vue";
import InputSection from "./chat/InputSection.vue";
import { notify } from "notiwind";
import NotificationView from "./NotificationView.vue";
import { MessageObject } from "./classes/messageClass";
import { classTypeObject } from "./objects/classTypeObject";
import { clickOutSide as vClickOutSide } from "@mahdikhashan/vue3-click-outside";

const props = defineProps({
  roomId: String,
  socket: Object,
});

const emit = defineEmits(["fetchError"]);

//Main variables

const store = useStore();

const router = useRouter();

const roomData = ref(null);

const messagesContainer = ref(null); //used for Dom modification refs

const messages = ref([]);

const isSearching = ref(false);

const today = ref(new Date());

const currentDate = ref(today.value.toISOString().split("T")[0]);

const updateDate = () => {
  setInterval(() => {
    currentDate.value = new Date().toISOString().split("T")[0];
  }, 1000 * 60 * 60);
};

//Scroll handling

const isScrolling = ref(false);

const startScroll = () => {
  isScrolling.value = true;
};
const stopScroll = async () => {
  if (!historyLoading.value) {
    isScrolling.value = false;
    await nextTick(); //Wait until the DOM is fully updated
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
  }
};
const scrollDown = async () => {
  if (!isSearching.value && !isScrolling.value) {
    await nextTick(); //Wait until the DOM is fully updated
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; //Scroll to the bottom
  }
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
      props.socket.emit("user:join", props.roomId);

      //Avoid user added to connected again when refresh
      if (
        !roomData.value.users.map((el) => el._id).includes(store.state.user._id)
      ) {
        roomData.value.users.push(store.state.user);
      }
      ///Update date and scroll to bottom
      updateDate();
      scrollDown();
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
  props.socket.emit("user:leave", props.roomId);
});

props.socket.on("user:joined", async (user) => {
  if (!roomData.value.users.map((el) => el._id).includes(user._id)) {
    //Avoid user added to connected again when refresh
    roomData.value.users.push(user);
  }
});

props.socket.on("user:left", async (user) => {
  if (roomData.value.users.map((el) => el._id).includes(user._id)) {
    let indexLeft = roomData.value.users.map((el) => el._id).indexOf(user._id);
    roomData.value.users.splice(indexLeft, 1);
  }
});

//Text messages

const myMessage = ref("");

props.socket.on("message:from:user", async (messageObject) => {
  if (messageObject.userId == store.state.user._id) {
    Object.assign(messageObject, classTypeObject.my_message);
    messages.value.push(messageObject);
    scrollDown();
  } else {
    Object.assign(messageObject, classTypeObject.user_message);
    messages.value.push(messageObject);
    playSound("/sounds/incoming-message.wav");
    scrollDown();
  }
});

const sendMessage = (textMessage) => {
  myMessage.value = textMessage;
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
    props.socket.emit("chat:message", {
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
  props.socket.emit("chat:voice", {
    messageObject,
    roomId: props.roomId,
    filename,
    roomOwner: roomData.value.created_by,
  });
};

props.socket.on("voice:from:user", async (messageObject) => {
  if (messageObject.userId == store.state.user._id) {
    Object.assign(messageObject, classTypeObject.my_voice);
    messages.value.push(messageObject);
    scrollDown();
  } else {
    Object.assign(messageObject, classTypeObject.user_voice);
    messages.value.push(messageObject);
    playSound("/sounds/incoming-message.wav");
    scrollDown();
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
  props.socket.emit("chat:image", {
    messageObject,
    roomId: props.roomId,
    roomOwner: roomData.value.created_by,
    filename,
    type,
  });
};

props.socket.on("image:from:user", async (messageObject) => {
  if (messageObject.userId == store.state.user._id) {
    Object.assign(messageObject, classTypeObject.my_image);
    messages.value.push(messageObject);
    scrollDown();
  } else {
    Object.assign(messageObject, classTypeObject.user_image);
    messages.value.push(messageObject);
    playSound("/sounds/incoming-message.wav");
    scrollDown();
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

props.socket.on("room:ban:update:ui", (bannedUser) => {
  roomData.value.banned_users.push(bannedUser);
});

const banUser = (user) => {
  props.socket.emit("room:ban", {
    roomId: props.roomId,
    roomName: roomData.value.title,
    bannedUser: user,
  });
};

//User Allow

props.socket.on("room:allow:update:ui", (allowedUser) => {
  roomData.value.banned_users = roomData.value.banned_users.filter(
    (el) => el._id !== allowedUser._id
  );
});

const allowUser = (user) => {
  props.socket.emit("room:allow", {
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
    props.socket.emit("room:favourite:add", props.roomId);
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
    props.socket.emit("room:favourite:remove", props.roomId);
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

props.socket.on("typing:from:user", async (user) => {
  typingUser.value = {
    nickname: user.nickname,
    profile_img: user.profile_img,
  };
  isTyping.value = true;
  scrollDown();
  typingInterval.value = setTimeout(() => {
    isTyping.value = false;
  }, 700);
});

props.socket.on("chat:typing:clear:timeout", () => {
  clearInterval(typingInterval.value);
});
</script>
