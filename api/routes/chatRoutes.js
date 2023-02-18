const { Router } = require("express");
const chatController = require("../controllers/chatController");
const multer = require("multer");
const { verifyToken } = require("../middlewares/verifyTokenMiddleware");
const fs = require("fs");

//Multer config

const storageVoice = multer.diskStorage({
  destination: function (req, file, cb) {
    const { roomId, roomOwner } = req.body;
    const path = `./public/users/${roomOwner}/rooms/${roomId}/uploads`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.decodedToken.id}${file.originalname.split("-")[0]}${
        file.originalname.split("-")[1]
      }${file.originalname.split("-")[2].split(":")[0]}${
        file.originalname.split("-")[2].split(":")[1]
      }${file.originalname.split("-")[2].split(":")[2]}.wav`
    );
  },
});

const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { roomId, roomOwner } = req.body;
    const path = `./public/users/${roomOwner}/rooms/${roomId}/uploads`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.decodedToken.id}${file.originalname.split("-")[0]}${
        file.originalname.split("-")[1]
      }${file.originalname.split("-")[2].split(":")[0]}${
        file.originalname.split("-")[2].split(":")[1]
      }${file.originalname.split("-")[2].split(":")[2]}.${
        file.mimetype.split("/")[1]
      }`
    );
  },
});

const uploadAudio = multer({
  storage: storageVoice,
});

const uploadPicture = multer({
  storage: storageImage,
});

const router = Router();

router.post(
  "/chat/upload/voice",
  verifyToken,
  uploadAudio.single("audio_data"),
  chatController.uploadVoice_post
);
router.post(
  "/chat/upload/picture",
  verifyToken,
  uploadPicture.single("image_data"),
  chatController.sendPicture_post
);
router.get("/history/:roomId", verifyToken, chatController.history_get);
router.get(
  "/chat/update/notifications",
  verifyToken,
  chatController.notifications_seen
);

module.exports = router;
