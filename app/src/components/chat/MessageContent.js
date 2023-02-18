import { h } from "vue";

const formatTime = (date) => {
  if (new Date(date).getMinutes().toString().length == 2) {
    return `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
  } else {
    return `${new Date(date).getHours()}:0${new Date(date).getMinutes()}`;
  }
};

const MessageContent = (props, context) => {
  return h(
    "div",
    props.messages.map((message) => {
      return new Date(message.date).toISOString().split("T")[0] == props.date
        ? h(
            "div",
            {
              class: "chat-message pb-4",
              key: message.id,
            },
            [
              h(
                "div",
                {
                  class: message.flexClass,
                },
                [
                  h(
                    "div",
                    {
                      class: message.colClass,
                    },
                    [
                      h(
                        "p",
                        {
                          class:
                            message.type == "user_message" ||
                            message.type == "user_voice" ||
                            message.type == "user_image"
                              ? "text-xs font-semibold"
                              : "hidden",
                        },
                        message.nickname
                      ),
                      message.dataType == "voice"
                        ? h("div", {}, [
                            h("audio", {
                              controls: true,
                              controlsList: "nodownload",
                              src: message.value,
                            }),
                            h(
                              "p",
                              {
                                class:
                                  message.type == "user_voice"
                                    ? "text-xs text-gray-500 ml-4"
                                    : "text-xs text-end text-gray-500 mr-4",
                              },
                              formatTime(message.date)
                            ),
                          ])
                        : message.dataType == "image"
                        ? h(
                            "div",
                            {
                              class: "relative w-64 h-64 cursor-pointer",
                              style: {
                                backgroundImage: `url(${message.value})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                              },
                              onClick() {
                                context.emit("showImage", message.value);
                              },
                            },
                            [
                              h(
                                "p",
                                {
                                  class:
                                    message.type == "user_image"
                                      ? "absolute bottom-2 left-4 px-2 py-1 bg-indigo-500 rounded-full text-xs text-end text-gray-50"
                                      : "absolute bottom-2 right-4 px-2 py-1 bg-indigo-500 rounded-full text-xs text-end text-gray-50",
                                },
                                formatTime(message.date)
                              ),
                            ]
                          )
                        : h(
                            "span",
                            {
                              class: `${message.reference} ${message.spanClass}`,
                            },
                            [
                              h("p", { class: "text-base" }, message.value),
                              message.dataType !== "notification"
                                ? h(
                                    "p",
                                    {
                                      class:
                                        message.type == "user_message"
                                          ? "text-xs text-gray-500"
                                          : "text-xs text-end text-gray-300",
                                    },
                                    formatTime(message.date)
                                  )
                                : h(),
                            ]
                          ),
                    ]
                  ),

                  h("img", {
                    class: message.imgClass,
                    src: message.profileImg,
                    referrerpolicy: "no-referrer",
                    onClick() {
                      if (
                        message.type == "user_message" ||
                        message.type == "user_voice" ||
                        message.type == "user_image"
                      ) {
                        context.emit("click", {
                          _id: message.userId,
                          nickname: message.nickname,
                        });
                      }
                    },
                  }),
                ]
              ),
            ]
          )
        : h();
    })
  );
};

MessageContent.emits = ["click", "showImage"];

export default MessageContent;
