import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import { User } from "../models/users.model.js";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";
import bcrypt from "bcryptjs";
import generateJWT from "../utils/generateJWT.js";
const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find(
    {},
    { __v: false, password: false, token: false }
  )
    .limit(limit)
    .skip(skip);
  return res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const avatar = req.file.filename;
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    const error = appError.create(
      "A user with this email is already registerd",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar,
  });

  // generate JWT token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();
  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: newUser },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.create(
      "Email and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email }, { password: 0, __v: 0 });
  if (!user) {
    const error = appError.create(
      "user is not found",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const matchedPasswords = await bcrypt.compare(password, user.password);

  if (!matchedPasswords) {
    const error = appError.create("Wrong password", 400, httpStatusText.FAIL);
    return next(error);
  }

  const token = await generateJWT({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user, token },
  });
});

const getUser = asyncWrapper(async (req, res) => {});

const updateUser = asyncWrapper(async (req, res) => {});
const deleteUser = asyncWrapper(async (req, res) => {});

export { getAllUsers, getUser, register, login, updateUser, deleteUser };
