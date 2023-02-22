<template>
  <div v-if="hasError">
    <HeadViewSkeleton />
    <SomethingWentWrong :error="error" />
    <FooterViewSkeleton />
  </div>

  <div v-else>
    <div v-if="$store.state.user !== null && socket !== null">
      <HeadView
        @fetchError="handleError"
        @updateNotifSeen="updateNotifSeen"
        :notifications="notifications" />
      <router-view
        @reRender="componentKey += 1"
        @fetchError="handleError"
        :key="componentKey"
        :socket="socket">
      </router-view>
      <FooterView />
    </div>
    <div v-else>
      <HeadViewSkeleton />
      <MainLoadingView />
      <FooterViewSkeleton />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import HeadView from "./components/partials/HeadView.vue";
import HeadViewSkeleton from "./components/skeletons/HeadViewSkeleton.vue";
import FooterViewSkeleton from "./components/skeletons/FooterViewSkeleton.vue";
import MainLoadingView from "./components/MainLoadingView.vue";
import FooterView from "./components/partials/FooterView.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";

const componentKey = ref(0);

const store = useStore();

const router = useRouter();

const socket = ref(null);

const hasError = ref(false);

const handleError = (message) => {
  hasError.value = true;
  error.value = message;
};

const error = ref(null);

const notifications = ref([]);

const updateNotifSeen = () => {
  notifications.value.forEach((el) => (el.seen = true));
};

onMounted(async () => {
  try {
    await store.dispatch("fetchUser");
    notifications.value = store.state.user.notifications;
    if (store.state.user) {
      //Socket initialize
      socket.value = io(process.env.VUE_APP_API_ENDPOINT, {
        transports: ["websocket"],
      });
      socket.value.emit("connection");
      socket.value.emit("user:join", store.state.user._id);
      //Socket events
      socket.value.on("notification", (NotificationObject) => {
        notifications.value.unshift(NotificationObject);
      });
      socket.value.on("room:ban:disconnect", ({ roomId }) => {
        //Add the room to users' banned for the UI state update
        store.commit("updateUserBanned", roomId);
        //Automatically disconnect when banned
        router.push({ name: "Home" });
      });
      socket.value.on("room:allow:update:user", ({ roomId }) => {
        store.commit("updateUserAllowed", roomId);
      });
      socket.value.on("user:left:somewhere", ({ roomId }) => {
        if (roomId == router.currentRoute.value.params.roomId) {
          router.push({ name: "Rooms" });
        }
      });
    } else {
      socket.value = false;
    }
  } catch (err) {
    hasError.value = true;
    error.value = err.message;
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>
