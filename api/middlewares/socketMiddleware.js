const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports.socketVerifyToken = async (socket, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
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
};
