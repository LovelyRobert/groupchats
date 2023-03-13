const roomsController = require("../controllers/roomsController");
const { Router } = require("express");
const multer = require("multer");
const { verifyToken } = require("../middlewares/verifyTokenMiddleware");
const fs = require("fs");

const router = Router();

//Multer config

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./public/users/${req.decodedToken.id}/rooms/${req.body.title}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: async function (req, file, cb) {
    const fileExtension =
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    cb(null, `${req.decodedToken.id}-${req.body.title}.${fileExtension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (req.body.title.length) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

//Router

router.get("/rooms", verifyToken, roomsController.fetchRooms_get);
router.post(
  "/rooms/create",
  verifyToken,
  upload.single("file"),
  roomsController.createRoom_post
);
router.get("/room/:roomId", verifyToken, roomsController.fetchSingleRoom_get);

router.put(
  "/room/:roomId",
  verifyToken,
  upload.single("file"),
  roomsController.editRoom_put
);

router.delete(
  "/room/:roomId",
  verifyToken,
  roomsController.removeSingleRoom_delete
);

module.exports = router;
