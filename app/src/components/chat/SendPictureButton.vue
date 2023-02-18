<template>
  <notification-view />
  <label v-if="!isRecording" for="file-upload">
    <span
      type="button"
      class="inline-flex items-center justify-center cursor-pointer rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
      <font-awesome-icon icon="fa-regular fa-image" />
    </span>
    <input
      id="file-upload"
      name="file-upload"
      type="file"
      class="sr-only"
      @change="sendImage" />
  </label>
</template>

<script>
import NotificationView from "../NotificationView.vue";
import { notify } from "notiwind";
import { useStore } from "vuex";

export default {
  components: { NotificationView },
  props: ["isRecording", "roomId", "roomOwner"],
  setup(props, context) {
    const store = useStore();
    const sendImage = async (e) => {
      const image = e.target.files[0];
      if (!image.type.includes("image")) {
        notify(
          {
            group: "error",
            title: "Failed",
            text: "This image format is not supported",
          },
          4000
        ); // 4s
      } else if (image.size > 519200) {
        notify(
          {
            group: "error",
            title: "Failed",
            text: "Image size should be < 500KB",
          },
          4000
        ); // 4s
      } else {
        var filename = new Date().toISOString();
        const formData = new FormData();
        formData.append("roomId", props.roomId);
        formData.append("roomOwner", props.roomOwner);
        formData.append("image_data", image, filename);
        await store
          .dispatch("uploadChatImage", { formData })
          .then(() => {
            context.emit("imageSaved", {
              filename: filename,
              type: image.type.split("/")[1],
            });
          })
          .catch(() => {
            notify(
              {
                group: "error",
                title: "Failed",
                text: "Something went wrong...",
              },
              4000
            ); // 4s
          });
      }
    };

    return { sendImage };
  },
};
</script>
