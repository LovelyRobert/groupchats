const { Router } = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyTokenMiddleware");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = Router();

router.post("/signup", authController.signup_post);

router.post("/login", authController.login_post);

router.get("/logout", authController.logout_get);

router.get("/authenticated", verifyToken, authController.authenticated);

router.get("/user", verifyToken, authController.user_get);

router.delete("/user", verifyToken, authController.user_delete);

//Google
// Auth
router.get(
  "/auth",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

// Auth Callback
router.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.APP_URL}/login?message=You have previously signed up with a different signin method`,
    passReqToCallback: true,
    session: false,
  }),
  function (req, res) {
    const { user } = req;
    try {
      let maxAge = 3 * 24 * 60 * 60;
      const token = jwt.sign(
        { id: user._id, provider: user.provider },
        process.env.JWT_SECRET,
        { expiresIn: maxAge }
      );
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect(`${process.env.APP_URL}/chat-rooms`);
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
