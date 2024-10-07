import express from "express";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";
import coursesSchema from "../middlewares/courses-validation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
import userRoles from "../utils/userRoles.js";

const coursesRouter = express.Router();

coursesRouter.route("/").get(getAllCourses).post(coursesSchema(), createCourse);

coursesRouter
  .route("/:courseId")
  .get(getCourse)
  .patch(updateCourse)
  .delete(
    verifyToken,
    isAllowed(userRoles.ADMIN, userRoles.MANAGER),
    deleteCourse
  );

export default coursesRouter;
