const { Router } = require("express");
const editProfileController = require("../controllers/editProfileController");
const multer = require("multer");
const { verifyToken } = require("../middlewares/verifyTokenMiddleware");

//Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `./public/users/${req.decodedToken.id}`;
    cb(null, path);
  },
  filename: async function (req, file, cb) {
    const fileExtension =
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    cb(null, `avatar-temp.${fileExtension}`);
  },
});

const upload = multer({
  storage,
});

//Router

const router = Router();

router.post(
  "/edit/profile",
  verifyToken,
  upload.single("file"),
  editProfileController.editProfile_post
);

router.post("/edit/info", verifyToken, editProfileController.editInfo_post);

module.exports = router;
