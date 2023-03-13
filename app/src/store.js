import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    user: null, //take false or user abject after user fetch
    profileUpdated: false,
  },
  mutations: {
    getUser(state, val) {
      state.user = val;
    },
    updateProfileStatus(state) {
      state.profileUpdated = !state.profileUpdated;
    },
    updateUserBanned(state, val) {
      state.user.banned_from.push(val);
    },
    updateUserAllowed(state, val) {
      state.user.banned_from.splice(state.user.banned_from.indexOf(val), 1);
    },
  },
  actions: {
    async fetchUser({ commit }) {
      await axios
        .get(process.env.VUE_APP_API_ENDPOINT + "/user", {
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          commit("getUser", response.data);
        });
    },
    checkAuth() {
      return axios.get(process.env.VUE_APP_API_ENDPOINT + "/authenticated", {
        withCredentials: true,
        credentials: "include",
      });
    },
    login(context, payload) {
      const { form } = payload;
      return axios.post(process.env.VUE_APP_API_ENDPOINT + "/login", form, {
        withCredentials: true,
        credentials: "include",
      });
    },
    logOut() {
      return axios.get(process.env.VUE_APP_API_ENDPOINT + "/logout", {
        withCredentials: true,
        credentials: "include",
      });
    },
    signUp(context, payload) {
      const { form } = payload;
      return axios.post(process.env.VUE_APP_API_ENDPOINT + "/signup", form, {
        withCredentials: true,
        credentials: "include",
      });
    },
    updateNotifications() {
      return axios.get(
        process.env.VUE_APP_API_ENDPOINT + "/chat/update/notifications",
        {
          withCredentials: true,
          credentials: "include",
        }
      );
    },
    removeRoom(context, payload) {
      const { roomId } = payload;
      return axios.delete(
        process.env.VUE_APP_API_ENDPOINT + `/room/${roomId}`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
    },
    createRoom(context, payload) {
      const { formData } = payload;
      return axios.post(
        process.env.VUE_APP_API_ENDPOINT + "/rooms/create",
        formData,
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    editProfile(context, payload) {
      const { formData } = payload;
      return axios.put(
        process.env.VUE_APP_API_ENDPOINT + "/user/profile",
        formData,
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    editInfo(context, payload) {
      const { formInfo } = payload;
      return axios.put(
        process.env.VUE_APP_API_ENDPOINT + "/user/info",
        formInfo,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
    },
    desactivateAccount() {
      return axios.delete(process.env.VUE_APP_API_ENDPOINT + "/user", {
        withCredentials: true,
        credentials: "include",
      });
    },
    sendContactMessage(context, payload) {
      const { form } = payload;
      return axios.post(process.env.VUE_APP_API_ENDPOINT + "/send-mail", form, {
        withCredentials: true,
        credentials: "include",
      });
    },
    fetchUserRooms({ state }) {
      return axios.get(process.env.VUE_APP_API_ENDPOINT + "/rooms", {
        params: {
          created_by: state.user._id,
        },
        withCredentials: true,
        credentials: "include",
      });
    },
    fetchAllRooms() {
      return axios.get(process.env.VUE_APP_API_ENDPOINT + "/rooms", {
        withCredentials: true,
        credentials: "include",
      });
    },
    fetchSingleRoom(context, payload) {
      const { roomId } = payload;
      return axios.get(process.env.VUE_APP_API_ENDPOINT + `/room/${roomId}`, {
        withCredentials: true,
        credentials: "include",
      });
    },
    editRoom(context, payload) {
      const { roomId, formData } = payload;
      return axios.put(
        process.env.VUE_APP_API_ENDPOINT + `/room/${roomId}`,
        formData,
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    fetchRoomHistory(context, payload) {
      const { roomId, skip } = payload;
      return axios.get(
        process.env.VUE_APP_API_ENDPOINT + `/history/${roomId}`,
        {
          params: {
            skip,
          },
          withCredentials: true,
          credentials: "include",
        }
      );
    },
    uploadChatVoice(context, payload) {
      const { formData } = payload;
      return axios.post(
        process.env.VUE_APP_API_ENDPOINT + "/chat/upload/voice",
        formData,
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    uploadChatImage(context, payload) {
      const { formData } = payload;
      return axios.post(
        process.env.VUE_APP_API_ENDPOINT + "/chat/upload/picture",
        formData,
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  },
  getters: {
    getProfileImg(state) {
      return state.user.profile_img;
    },
  },
});

export default store;
