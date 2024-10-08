import { asyncHandler } from "../services/asyncHandler.js";
import crypto from "crypto";
import { userModel } from "../Models/UserSchema.js";
import { mailHelper } from "../services/Mailhelper.js";
import CustomError from "../Utils/cutomError.js";

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name || email || password)) {
    throw new CustomError("Fill all the details", 403);
  }

  const UserExist = await userModel.findOne({ email });
  if (UserExist) {
    throw new CustomError("User Already Exits", 403);
  }
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
  }
});
export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email, password)) {
    throw new CustomError("fill all the details", 401);
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("User Not Found", 404);
  }

  const isMatched = await user.comparepass(password);

  if (isMatched) {
    const token = user.getJwtToken();
    delete user.password;
    res.status(200).cookie("token", token).json({
      success: true,
      message: "sigin successfully",
      user,
    });
  } else {
    throw new CustomError("Invalid Credentials", 403);
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
    throw new CustomError("fill all the details", 401);
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new CustomError("user not found", 401);
  }

  const resetToken = await user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: true });

  const reseturl = `http://localhost:5000/api/user/reset-password/${resetToken}`;

  const text = `click on the link to reset the password -\n\n ${reseturl}`;
  try {
    await mailHelper({
      recepeint: "nannie.gaylord3@ethereal.email",
      subject: "click on the link to reset the password",
      text,
    });
    res.status(200).json(`email sent to ${user.email}`);
  } catch (error) {
    forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new CustomError("failed to send mail", 400);
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
      forgopasstoken,
      forgotPasswordExpiry: { $gt: Date.now() },
    })
    .select("+password");
  if (!user) {
    throw new CustomError("invalid token or too late", 400);
  }
  if (password != confirmpass) {
    throw new CustomError("password and confirmpass not matching", 403);
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
   throw new CustomError("password not matching",400);
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
    throw new CustomError("user not found",404);
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
    throw new CustomError("user not found",404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const getallUser = asyncHandler(async (req, res) => {
  if (!(req.user.role === "ADMIN")) {
    throw new CustomError("your are not allowed to this route",403);
  }
  const users = await userModel.find();
  if (users.length === 0) {
    throw new CustomError("no user are available in db",400);
  } else {
    res.status(200).json(users);
  }
});
