const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./models/users");
const JWTStrategy = require("passport-jwt");

//attach the {authenticate_user} to req.session.passport.user.{authenticated_user}
passport.serializeUser((user, done) => {
  done(null, user);
});

//get the {authenticated_user} for the session from "req.session.passport.user.{authenticated_user}, and attach it to req.user.{authenticated_user}
passport.deserializeUser(function (user, done) {
  done(null, user);
});

//Defining the "authUser" function, and authenticate the user.
//Passing {authenticate_user} to the passport.serialize()
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}/auth/callback/`,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const currentUser = await User.findOne({ email: profile.email });

      if (!currentUser) {
        try {
          const user = await User.create({
            nickname: `${profile.given_name[0]}${
              profile.family_name[0]
            }${profile.id.slice(0, 8)}`,
            email: profile.email,
            password: null,
            provider: "google",
            profile_img: profile.picture,
          });
          profile._id = user._id.toString();
        } catch (err) {
          console.log(err);
        }
        return done(null, profile);
      }

      if (currentUser.provider != "google") {
        //return error
        return done(null, false, {
          message: `You have previously signed up with a different signin method`,
        });
      }

      //If the user already registred
      profile._id = currentUser._id.toString();
      return done(null, profile); //since we just want the "Google" profile information after log in
    }
  )
);

passport.use(
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies.jwt;
        }
        return token;
      },
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      if (!jwtPayload) {
        return done("No token found...");
      }
      return done(null, jwtPayload);
    }
  )
);
