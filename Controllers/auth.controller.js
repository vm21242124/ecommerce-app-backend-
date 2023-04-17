import { asyncHandler } from "../services/asyncHandler.js";
import crypto from "crypto";
import { userModel } from "../Models/UserSchema.js";

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    //check if user exists
    try {
      const UserExist = await userModel.findOne({ email });
      if (!UserExist) {
        const user = await userModel.create({
          name,
          email,
          password,
        });
        const token = user.getJwtToken();
        user.password = undefined;
        // res.cookie(token, token, cookieOptions);
        res.status(200).cookie("token", token).json({
          success: true,
          message: "user created successfully",
          user,
        });
      } else {
        res.status(403).json("user already exits");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }else{
    res.status(401).json("fill all the details");
    return;
  }

});
export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email, password)) {
    res.status(401).json("fill all the details");
    return;
  }
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (user) {
      const isMatched = user.comparepass(password);
      if (isMatched) {
        const token = user.getJwtToken();
        delete user.password;
        res.status(200).cookie("token", token).json({
          success: true,
          message: "sigin successfully",
          user,
        });
      }
    } else {
      res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
export const signout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "logout successfully",
  });
});

export const forgotPass = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401).json("fill all the details");
    return;
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(401).json("fill all the details");
    return;
  }
  const resetToken = user.generateForgotPasswordToken();
  await user.save({ validateBeforeSave: true });
  console.log(req.protocol);
  console.log(req.get("X-Forwarded-Host"));
  const reseturl = `${req.headers.origin}/user/reset-password/${resetToken}`;
  console.log(resetToken);
  const text = `click on the link to reset the password -\n\n ${reseturl}`;
  try {
    await mailHelper({
      email: user.email,
      subject: "click on the link to reset the password",
      text,
    });
    res.status(200).json(`email sent to ${user.email}`);
  } catch (error) {
    forgotPasswordToken = undefined;
    forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400).json("failed to send mail");
  }
});

export const resetpassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmpass } = req.body;
  const forgopasstoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await userModel
    .findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    })
    .select("+password");
  if (!user) {
    return res.status(400).json("invalid token or too late");
  }
  if (password != confirmpass) {
    return res.status(400).json("password and confirmpass not matching");
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  const token = getJwtToken();
  await user.save();
  user.password = undefined;
  res.status(200).cookie("token", token).json({
    success: true,
    message: "password reset successfully",
    user,
  });
});
export const changepass = asyncHandler(async (req, res) => {
  const { password, confirmpass } = req.body;
  const user = req.user;
  if (password != confirmpass) {
    return res.status(400).json("password not matching");
  }
  userModel.password = password;
  await userModel.save();
  res.status(200).json({
    success: true,
    message: "password changed successfullly",
    user,
  });
});
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
export const updateProfile = asyncHandler(async (req, res) => {
  const { property, value } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json("user not found");
  }
  if (property === "name") {
    user.name = value;
  }
  if (property === "email" && value.includes("@")) {
    user.email = value;
  }
  await userModel.save();
  res.status(200).json({
    success: true,
    user,
  });
});
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json("user not found");
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const getallUser = asyncHandler(async (req, res) => {
  if (!(req.user.role === "ADMIN")) {
    res.status(403).json("your are not allowed to this route");
  }
  const users = await userModel.find();
  if (users.length === 0) {
    res.status(404).json("no user are available in db");
  } else {
    res.status(200).json(users);
  }
});
