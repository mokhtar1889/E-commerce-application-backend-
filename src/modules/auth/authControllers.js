import { User } from "../../../database/models/userModel.js";
import { Token } from "../../../database/models/tokenModel.js";
import { asyncHandler } from "../../utile/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utile/sendEmail.js";
import Randomstring from "randomstring";
import { Cart } from "../../../database/models/cartModel.js";

//signUp
export let signUp = asyncHandler(async (req, res, next) => {
  // data from body
  let { username, email, password, gender, role, phoneNumber } = req.body;
  let user = await User.findOne({ email });

  // check email
  if (user) return next(new Error("user is already exists", { cause: 400 }));

  // create Token
  let token = jwt.sign({ username, email, role }, process.env.TOKEN_SECRET);

  let html = `<h3>Activate Account</h3>
    <a href="http://localhost:3000/auth/activateAccount/${token}">click here to activate your account<a/>
  `;

  // send email to activation
  sendEmail({ to: email, subject: "Activate Account", html });

  // create user
  let response = await User.create({
    username,
    email,
    password,
    gender,
    role,
    phoneNumber,
  });
  // response
  if (response)
    return res.json({
      success: true,
      message:
        "user created successfully check your email to activate your account",
    });
});

// activate Account
export let activateAccount = asyncHandler(async (req, res, next) => {
  // get token from params
  let { token } = req.params;

  //check user
  let payload = jwt.verify(token, process.env.TOKEN_SECRET);
  let user = await User.findOne({ email: payload.email });
  if (!user) return next(new Error("user is not exists!", { cause: 400 }));

  // change the activation state of the user to true
  user.isActivated = true;
  await user.save();

  //create cart
  await Cart.create({ user: user._id });

  //response
  res.json({ success: true, message: "your account is Activated " });
});

//signIn
export let signIn = asyncHandler(async (req, res, next) => {
  // data from body
  let { email, password } = req.body;
  let user = await User.findOne({ email });

  //check email
  if (!user) return next(new Error("user is not exists !!", { cause: 404 }));

  //check password
  let isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) return next(new Error("invalid password ", { cause: 401 }));

  //check Activation state
  if (!user.isActivated)
    return next(new Error("this account is not activated", { cause: 401 }));

  // generate token
  let token = jwt.sign(
    {
      username: user.username,
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.TOKEN_SECRET
  );

  //add Token to collection
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  //response
  res.json({ success: true, message: `welcome ${user.username}`, token });
});

//frogetPassword
export let forgetPassword = asyncHandler(async (req, res, next) => {
  //get email from body
  let { email } = req.body;
  //check email
  let user = await User.findOne({ email });
  if (!user) return next(new Error("email is not exists!!", { cause: 401 }));
  //generate reset code
  let resetCode = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  // add reset password code to user document
  user.resetCode = resetCode;
  await user.save();
  // send reset code to user's email
  let html = `<h3>${resetCode}</h3>`;
  sendEmail({ to: email, subject: "reset password code", html });
  // response
  res.json({ success: true, message: "reset code sent to you email" });
});

//reset password
export let resetPassword = asyncHandler(async (req, res, next) => {
  // data from body
  let { email, resetCode, password } = req.body;

  //check email
  let user = await User.findOne({ email });
  if (!user) return next(new Error("user is not exists!!", { cause: 401 }));

  console.log(resetCode, user.resetCode);

  //check reset code
  if (resetCode != user.resetCode)
    return next(new Error("invalid reset Code", { cause: 401 }));

  //reset password
  user.password = password;
  user.save();

  // remove resetCode
  await User.findOneAndUpdate({ email }, { $unset: { resetCode: 1 } });

  //invalidate tokens
  let response = await Token.findOneAndUpdate(
    { user: user._id },
    { isValid: false }
  );

  //response
  res.json({ success: true, message: "password reseted successfully" });
});

//TODO DELETE USER
