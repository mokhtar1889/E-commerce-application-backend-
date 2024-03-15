import jwt from "jsonwebtoken";
import { User } from "../../database/models/userModel.js";
import { Token } from "../../database/models/tokenModel.js";

export let isAuthenticated = async (req, res, next) => {
  //token
  let { token } = req.headers;
  // check the token
  if (!token) return next(new Error("token is required", { cause: 404 }));
  //check barear key
  if (!token.startsWith("Route__"))
    return next(new Error("invalid Token", { cause: 400 }));
  // get token without barear key
  token = token.split("Route__")[1];
  //token payload
  let payload = jwt.verify(token, process.env.TOKEN_SECRET);
  //check token in database
  let tokenFromDB = await Token.findOne({ token, isValid: true });
  if (!tokenFromDB)
    return next(new Error("token is not valid!!", { cause: 400 }));
  //check email
  let user = await User.findOne({ email: payload.email });
  if (!user) return next(new Error("user is not exists!!", { cause: 404 }));
  //add username to req object
  req.user = user;

  return next();
};
