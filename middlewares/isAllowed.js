import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

const isAllowed = (...roles) => {
  return (req, res, next) => {
    const role = req.currentUser.role;
    if (!roles.includes(role)) {
      const error = appError.create(
        "You are not allowed to do this action",
        401,
        httpStatusText.FAIL
      );
      return next(error);
    }

    next();
  };
};

export default isAllowed;
