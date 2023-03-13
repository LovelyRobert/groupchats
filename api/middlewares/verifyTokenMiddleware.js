const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(403).json();
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    if (req.originalUrl == "/user" || req.originalUrl == "/authenticated") {
      res.json(false);
    } else {
      res.status(401).json("Non authorized :)");
    }
  }
};
