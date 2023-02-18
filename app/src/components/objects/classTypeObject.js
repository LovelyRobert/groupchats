module.exports.classTypeObject = {
  my_message: {
    flexClass: "flex items-end justify-end",
    colClass: "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end",
    spanClass:
      "px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white",
    imgClass: "w-6 h-6 rounded-full object-cover order-2",
    type: "my_message",
    reference: "message-box",
  },
  user_message: {
    flexClass: "flex items-start my-2", //
    colClass:
      "flex flex-col space-y-1 text-xs max-w-xs mx-2 order-2 items-start",
    spanClass:
      "px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600",
    imgClass: "cursor-pointer w-6 h-6 rounded-full object-cover order-1",
    type: "user_message",
    reference: "message-box",
  },
  my_voice: {
    flexClass: "flex items-end justify-end items-center",
    colClass: "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end",
    imgClass: "w-6 h-6 rounded-full object-cover order-2",
    type: "my_voice",
  },
  user_voice: {
    flexClass: "flex items-start my-2",
    colClass:
      "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start",
    imgClass: "cursor-pointer w-6 h-6 rounded-full object-cover order-1",
    type: "user_voice",
  },
  my_image: {
    flexClass: "flex items-end justify-end",
    colClass: "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end",
    imgClass: "w-6 h-6 rounded-full object-cover order-2",
    type: "my_image",
  },
  user_image: {
    flexClass: "flex items-start my-2",
    colClass:
      "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start",
    imgClass: "cursor-pointer w-6 h-6 rounded-full object-cover order-1",
    type: "user_image",
  },
  disconnect_message: {
    flexClass: "flex items-center justify-center",
    colClass:
      "flex flex-col space-y-2 text-xs text-green-600 max-w-xs mx-2 items-center order-last",
    spanClass: "text-red-600",
    imgClass: "w-6 h-6 rounded-full object-cover",
    type: "disconnect_message",
  },
  connect_message: {
    flexClass: "flex items-center justify-center",
    colClass:
      "flex flex-col space-y-2 text-xs text-green-600 max-w-xs mx-2 items-center order-last",
    spanClass: "text-green-600",
    imgClass: "w-6 h-6 rounded-full object-cover",
    type: "connect_message",
  },
};
