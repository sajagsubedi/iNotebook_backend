const jwt = require("jsonwebtoken");
const JWT_Secret = process.env.JWT_SECRET;

const checkUser = async (req, res, next) => {
  //getting auth token from requeat header
  let { auth_token: token } = req.headers;

  // checking whether the token exists or not
  if (!token) {
    res.status(401).send({
      error: "Please authenticate using a valid token",
    });
  }
  try {
    //verifying user from the jwt
    let decoded = await jwt.verify(token, JWT_Secret);

    //setting user in req
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};

//export of middleware
module.exports = checkUser;
