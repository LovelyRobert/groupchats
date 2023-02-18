import { createWebHistory, createRouter } from "vue-router";

import HomeView from "../components/HomeView.vue";
import RoomsView from "../components/RoomsView.vue";
import LoginView from "../components/auth/LoginView.vue";
import SignupView from "../components/auth/SignupView.vue";
import RoomChatView from "../components/RoomChatView.vue";
import CreateRoomView from "../components/CreateRoomView.vue";
import EditRoomView from "../components/EditRoomView.vue";
import EditProfileView from "../components/EditProfileView.vue";
import ProfileGeneralView from "../components/profile/ProfileGeneralView.vue";
import ProfileRoomsView from "../components/profile/ProfileRoomsView.vue";
import ContactView from "../components/ContactView.vue";
import AboutView from "../components/AboutView.vue";
import NotFound from "../components/NotFound.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    component: HomeView,
    name: "Home",
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
  },
  {
    name: "Rooms",
    path: "/chat-rooms",
    component: RoomsView,
    meta: { requiresAuth: true },
  },
  {
    name: "CreateRoom",
    path: "/create-room",
    component: CreateRoomView,
    meta: { requiresAuth: true },
  },
  {
    name: "EditRoom",
    path: "/room/:roomId/edit",
    component: EditRoomView,
    props: true,
    meta: { requiresAuth: true, requiresOwn: true },
  },
  {
    path: "/room/:roomId",
    name: "RoomChat",
    component: RoomChatView,
    props: true,
    meta: { requiresAuth: true, requiresAllow: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: true, hideForAuth: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
    meta: { requiresAuth: true, hideForAuth: true },
  },
  {
    path: "/edit-profile",
    redirect: "/edit-profile/general",
    component: EditProfileView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/edit-profile/general",
        name: "ProfileGeneral",
        component: ProfileGeneralView,
      },
      {
        path: "/edit-profile/rooms",
        name: "ProfileRooms",
        component: ProfileRoomsView,
      },
    ],
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactView,
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: "link-active",
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    await store.dispatch("checkAuth").then((res) => {
      if (res.data) {
        if (to.meta.hideForAuth) {
          return next({ name: "Home" });
        } else {
          next();
        }
      } else {
        if (to.meta.hideForAuth) {
          next();
        } else {
          return next({ name: "Login" });
        }
      }
    });
  } else {
    next();
  }
});

router.beforeResolve(async (to, from, next) => {
  if (to.meta.requiresOwn) {
    await store.dispatch("fetchUser").then(() => {
      if (!store.state.user.rooms.includes(to.params.roomId)) {
        return next({ name: "NotFound" });
      } else {
        next();
      }
    });
  } else if (to.meta.requiresAllow) {
    await store.dispatch("fetchUser").then(() => {
      if (store.state.user.banned_from.includes(to.params.roomId)) {
        return next({ name: "NotFound" });
      }
      next();
    });
  } else {
    next();
  }
});

export default router;
