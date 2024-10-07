import { validationResult } from "express-validator";
import { Course } from "../models/courses.model.js";
import httpStatusText from "../utils/httpStatusText.js";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";
const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  return res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  const error = appError.create("course not found.", 404, httpStatusText.FAIL);
  if (!course) {
    return next(error);
  }
  console.log(error);
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.findByIdAndUpdate(courseId, {
    $set: { ...req.body },
  });
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { course: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.deleteOne({ _id: courseId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

export { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse };
