import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "../public/styles.css";
import Notifications from "notiwind";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import AlertsModal from ".//components/modals/AlertsModal.vue";
import ShowImageModal from ".//components/modals/ShowImageModal.vue";
import NotificationView from ".//components/NotificationView.vue";
import SomethingWentWrong from ".//components/SomethingWentWrong.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faBan,
  faFire,
  faStar,
  faQuoteLeft,
  faMicrophone,
  faVolumeHigh,
  faVolumeXmark,
  faArrowRightFromBracket,
  faArrowUp,
  faArrowDown,
  faXmark,
  faLock,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFlag,
  faArrowAltCircleUp,
  faImage,
  faUser,
  faComment,
  faFaceSmile,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(
  faBan,
  faFire,
  faStar,
  faQuoteLeft,
  faLock,
  faMicrophone,
  faVolumeHigh,
  faVolumeXmark,
  faArrowRightFromBracket,
  faArrowUp,
  faArrowDown,
  faXmark,
  faFlag,
  faArrowAltCircleUp,
  faImage,
  faUser,
  faPenToSquare,
  faTrash,
  faComment,
  faFaceSmile,
  faEye,
  faEyeSlash
);

createApp(App)
  .use(router)
  .use(store)
  .use(Notifications)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("ClipLoader", ClipLoader)
  .component("AlertsModal", AlertsModal)
  .component("ShowImageModal", ShowImageModal)
  .component("NotificationView", NotificationView)
  .component("SomethingWentWrong", SomethingWentWrong)
  .mount("#app");
