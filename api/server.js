require("custom-env").env("dev");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const editProfileRoutes = require("./routes/editProfileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roomsRoutes = require("./routes/roomsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/users");
const History = require("./models/history");
const Room = require("./models/rooms");
const passport = require("passport");
require("./passport");
const compression = require("compression");

//Server setup
const app = express();

// Server middlewares
app.use(cors({ origin: process.env.APP_URL, credentials: true })); //Server CORS
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Compress all HTTP responses
app.use(compression());

//Server database connection

const dbURI = process.env.DATABASE_URL;
const port = parseInt(process.env.PORT) || 3000;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    http.listen(port, () => {
      console.log(`Listening on port *: ${port}`);
    });
  })
  .catch((err) => console.log(err));
//Server API Routes
app.use(authRoutes);
app.use(editProfileRoutes);
app.use(chatRoutes);
app.use(roomsRoutes);
app.use(contactRoutes);

//Socket Config

const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: process.env.APP_URL,
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["secretHeader"],
    credentials: true,
  },
});

//Socket Middlewares

const JWT_SECRET = process.env.JWT_SECRET;

io.use(async (socket, next) => {
  // fetch token from handshake auth sent by FE
  const token = socket.handshake.headers.cookie.split(";")[0];
  try {
    // verify jwt token and get user data
    const user = await jwt.verify(token.split("=")[1], JWT_SECRET);

    const userf = await User.findById(user.id);
    const { nickname, profile_img, description } = userf;
    // save the user data into socket object, to be used further
    socket.user = {
      _id: userf._id.toString(),
      ...{ nickname, profile_img, description },
    };
    next();
  } catch (error) {
    // if token is invalid, close connection
    return next(new Error(error.message));
  }
});

//Socket Events

io.on("connection", async (socket) => {
  console.log(socket.user.nickname, "is connected");
  console.log("user info", socket.user);
  console.log("socket id", socket.id);

  let ObjectId = mongoose.Types.ObjectId;

  //When a user disconnect
  socket.on("disconnecting", () => {
    let roomsFiltred = [...socket.rooms];
    roomsFiltred.splice(0, 1);
    roomsFiltred.forEach(async (roomId) => {
      socket.to(roomId).emit("user left", socket.user);
      socket.to(socket.user._id).emit("left somewhere", { roomId });
      await Room.findByIdAndUpdate(roomId, {
        $pull: { users: { _id: socket.user._id } },
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.user.nickname, "is disconnected");
  });

  //When user joined a room
  socket.on("join", async (roomId) => {
    if (ObjectId.isValid(roomId)) {
      console.log(socket.user.nickname + " joined: " + roomId);
      socket.join(roomId);
      await Room.findByIdAndUpdate(roomId, {
        $addToSet: { users: socket.user },
      });
      socket.to(roomId).emit("user joined", socket.user);
    }
  });

  //When user updates profile
  socket.on(
    "change socket info",
    ({ _id, nickname, profile_img, description }) => {
      socket.user = {
        _id,
        nickname,
        profile_img,
        description,
      };
    }
  );

  //When a message is sent

  socket.on(
    "send message",
    async ({ messageObject, roomId, roomName, mentionedIds }) => {
      messageObject.date = new Date();
      await History.findOneAndUpdate(
        { room_id: roomId },
        {
          $push: { messages: messageObject },
          $inc: { length: 1 },
        }
      );
      io.to(roomId).emit("user message", messageObject);

      //Send notification to mentionned users
      mentionedIds.forEach(async (el) => {
        //Send realtime notification
        io.to(el).emit("notification", {
          notification_type: "mention",
          room_id: roomId,
          room_name: roomName,
          date: new Date(),
          seen: false,
        });
        //Add notification to the database
        await User.findByIdAndUpdate(
          el,
          {
            $push: {
              notifications: {
                $each: [
                  {
                    notification_type: "mention",
                    room_id: roomId,
                    room_name: roomName,
                    date: new Date(),
                    seen: false,
                  },
                ],
                $position: 0,
              },
            },
          },
          { new: false }
        );
      });
    }
  );

  //When a user is banned

  socket.on("ban user", async ({ roomId, roomName, bannedUser }) => {
    let roomPromise = Room.findByIdAndUpdate(roomId, {
      $addToSet: { banned_users: bannedUser },
    });
    let userPromise = User.findByIdAndUpdate(bannedUser._id, {
      $addToSet: { banned_from: roomId },
    });
    await Promise.all([roomPromise, userPromise]);
    //disconnet banned user from room
    io.to(bannedUser._id).emit("banned", { roomId });
    //Send realtime notification
    io.to(bannedUser._id).emit("notification", {
      notification_type: "ban",
      room_id: roomId,
      room_name: roomName,
      date: new Date(),
      seen: false,
    });
    //Add notification to the database
    await User.findByIdAndUpdate(
      bannedUser._id,
      {
        $push: {
          notifications: {
            $each: [
              {
                notification_type: "ban",
                room_id: roomId,
                room_name: roomName,
                date: new Date(),
                seen: false,
              },
            ],
            $position: 0,
          },
        },
      },
      { new: false }
    );
    //Update UI
    io.to(roomId).emit("user banned", bannedUser);
  });

  //When a user is allowed

  socket.on("allow user", async ({ roomId, roomName, allowedUser }) => {
    let roomPromise = Room.findByIdAndUpdate(roomId, {
      $pull: { banned_users: { _id: allowedUser._id } },
    });
    let userPromise = User.findByIdAndUpdate(allowedUser._id, {
      $pull: { banned_from: roomId },
    });
    await Promise.all([roomPromise, userPromise]);
    //Update UI for allowe user
    io.to(allowedUser._id).emit("allowed", { roomId });
    //Send realtime notification
    io.to(allowedUser._id).emit("notification", {
      notification_type: "allow",
      room_id: roomId,
      room_name: roomName,
      date: new Date(),
      seen: false,
    });
    //Add notification to the database
    await User.findByIdAndUpdate(
      allowedUser._id,
      {
        $push: {
          notifications: {
            $each: [
              {
                notification_type: "allow",
                room_id: roomId,
                room_name: roomName,
                date: new Date(),
                seen: false,
              },
            ],
            $position: 0,
          },
        },
      },
      { new: false }
    );
    //Update UI
    io.to(roomId).emit("user allowed", allowedUser);
  });

  //Add to favourites

  socket.on("add favourite", async (roomId) => {
    try {
      // verify jwt token and get user data
      await User.findByIdAndUpdate(socket.user._id, {
        $push: { favourites: roomId },
      });
    } catch (error) {
      //close connection
      return next(new Error(error.message));
    }
  });

  socket.on("remove favourite", async (roomId) => {
    try {
      // verify jwt token and get user data
      await User.findByIdAndUpdate(socket.user._id, {
        $pull: { favourites: roomId },
      });
    } catch (error) {
      // close connection
      return next(new Error(error.message));
    }
  });

  //Voice recording

  socket.on(
    "voice record",
    async ({ messageObject, roomId, roomOwner, filename }) => {
      let recordLink = `${messageObject.userId}${filename.split("-")[0]}${
        filename.split("-")[1]
      }${filename.split("-")[2].split(":")[0]}${
        filename.split("-")[2].split(":")[1]
      }${filename.split("-")[2].split(":")[2]}.wav`;
      messageObject.value = `${process.env.CLIENT_URL}/users/${roomOwner}/rooms/${roomId}/uploads/${recordLink}`;
      messageObject.date = new Date();
      await History.findOneAndUpdate(
        { room_id: roomId },
        {
          $push: { messages: messageObject },
          $inc: { length: 1 },
        }
      );
      io.to(roomId).emit("record link", messageObject);
    }
  );

  //Chat Image upload

  socket.on(
    "image upload",
    async ({ messageObject, roomId, roomOwner, filename, type }) => {
      let imageLink = `${messageObject.userId}${filename.split("-")[0]}${
        filename.split("-")[1]
      }${filename.split("-")[2].split(":")[0]}${
        filename.split("-")[2].split(":")[1]
      }${filename.split("-")[2].split(":")[2]}.${type}`;
      messageObject.value = `${process.env.CLIENT_URL}/users/${roomOwner}/rooms/${roomId}/uploads/${imageLink}`;
      messageObject.date = new Date();
      await History.findOneAndUpdate(
        { room_id: roomId },
        {
          $push: { messages: messageObject },
          $inc: { length: 1 },
        }
      );
      io.to(roomId).emit("show image", messageObject);
    }
  );

  //When user leaves the room

  socket.on("leave", async (roomId) => {
    if (ObjectId.isValid(roomId)) {
      socket.leave(roomId);
      socket.to(socket.user._id).emit("left somewhere", { roomId });
      console.log(socket.user.nickname + " left: " + roomId);
      await Room.findByIdAndUpdate(roomId, {
        $pull: { users: { _id: socket.user._id } },
      });
      socket.to(roomId).emit("user left", socket.user);
    }
  });

  //User typing

  socket.on("is typing", (roomId) => {
    socket.to(roomId).emit("user typing", socket.user);
  });
  socket.on("clear interval", (roomId) => {
    socket.to(roomId).emit("clear timeout");
  });
});
