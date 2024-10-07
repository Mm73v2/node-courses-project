import { body } from "express-validator";
const coursesSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 2 })
      .withMessage("Title should be at least 2 chars"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isLength({ min: 0 })
      .withMessage("Price should be at least 2 digits."),
  ];
};

export default coursesSchema;
