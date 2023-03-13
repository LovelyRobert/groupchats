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
const passport = require("passport");
require("./passport");
const compression = require("compression");
const registerUserHandlers = require("./socket/handlers/userHandler");
const registerChatHandlers = require("./socket/handlers/chatHandler");
const registerRoomHandlers = require("./socket/handlers/roomHandler");
const { socketVerifyToken } = require("./middlewares/socketMiddleware");

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
io.use(socketVerifyToken);

//Socket Events
const onConnection = async (socket) => {
  console.log(socket.user.nickname, "is connected.");
  console.log("user info:", socket.user);
  console.log("socket id:", socket.id);
  registerUserHandlers(io, socket);
  registerChatHandlers(io, socket);
  registerRoomHandlers(io, socket);
};

io.on("connection", onConnection);

module.exports = app;
