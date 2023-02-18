const { Router } = require("express");
const contactController = require("../controllers/contactController");

const router = Router();

router.post("/send-mail", contactController.send_mail_post);

module.exports = router;
