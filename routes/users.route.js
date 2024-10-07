import express from "express";
import {
  getAllUsers,
  getUser,
  register,
  login,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from "multer";
import appError from "../utils/appError.js";

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("Invalid file type", 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter });

const usersRouter = express.Router();

usersRouter.route("/").get(verifyToken, getAllUsers);
usersRouter.route("/register").post(upload.single("avatar"), register);
usersRouter.route("/login").post(login);
usersRouter.route("/:userId").get(getUser).patch(updateUser).delete(deleteUser);

export default usersRouter;
