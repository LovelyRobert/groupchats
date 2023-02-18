<template>
  <notification-view />
  <button
    @click="recordControl"
    type="button"
    class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none">
    <font-awesome-icon
      v-if="isRecording"
      class="text-indigo-600"
      icon="fa-solid fa-microphone"
      beat-fade />
    <font-awesome-icon
      v-else
      class="text-gray-500"
      icon="fa-solid fa-microphone" />
  </button>

  <p v-if="isRecording">{{ seconds }}s</p>
</template>

<script>
import { ref } from "vue";
import Recorder from "../directives/recorder.js";
import NotificationView from "../NotificationView.vue";
import { notify } from "notiwind";
import { useStore } from "vuex";

export default {
  name: "VoiceRecorderButton",

  components: { NotificationView },

  props: ["isRecording", "roomId", "roomOwner"],

  setup(props, context) {
    const store = useStore();

    const seconds = ref(0);

    const timer = ref(null);

    const recordLimit = ref(null);

    const recordSeconds = () => {
      timer.value = setInterval(() => {
        seconds.value += 1;
      }, 1000);
      recordLimit.value = setTimeout(() => {
        stopRecording();
      }, 61000);
    };

    const recordControl = () => {
      if (props.isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    var gumStream = ""; //stream from getUserMedia()
    var rec = ""; //Recorder.js object
    var input = ""; //MediaStreamAudioSourceNode we'll be recording

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext; //audio context to help us record

    const startRecording = () => {
      console.log("recordButton clicked");

      /*
            Simple constraints object, for more advanced audio features see
            https://addpipe.com/blog/audio-constraints-getusermedia/
        */

      var constraints = { audio: true, video: false };

      /*
            We're using the standard promise based getUserMedia() 
            https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log(
          "getUserMedia() success, stream created, initializing Recorder.js ..."
        );

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device
            */
        audioContext = new AudioContext();

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        console.log(input);
        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
            */
        rec = new Recorder(input, { numChannels: 1 }); //

        //start the recording process
        rec.record();
        console.log("Recording started");
        context.emit("startRecording");
        recordSeconds();
      });
    };

    const stopRecording = () => {
      console.log("stopButton clicked");
      clearInterval(timer.value);
      clearTimeout(recordLimit.value);
      seconds.value = 0;

      //tell the recorder to stop the recording
      rec.stop();
      context.emit("stopRecording");
      clearInterval(recordSeconds);

      //stop microphone access
      gumStream.getAudioTracks()[0].stop();

      //create the wav blob and pass it on to createDownloadLink
      rec.exportWAV(createDownloadLink);
    };

    const createDownloadLink = async (blob) => {
      //name of .wav file to use during upload and download (without extendion)
      var filename = new Date().toISOString();

      var formData = new FormData();
      formData.append("roomId", props.roomId);
      formData.append("roomOwner", props.roomOwner);
      formData.append("audio_data", blob, filename);
      await store
        .dispatch("uploadChatVoice", { formData })
        .then(() => {
          context.emit("recorded", filename);
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
    };
    return {
      startRecording,
      gumStream,
      rec,
      input,
      stopRecording,
      createDownloadLink,
      recordControl,
      seconds,
      recordSeconds,
      timer,
      recordLimit,
    };
  },
};
</script>
