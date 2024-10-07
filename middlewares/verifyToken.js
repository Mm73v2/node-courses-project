import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";
const verifyToken = (req, res, next) => {
  const authHeaders =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeaders) {
    const err = appError.create(
      "No JWT token provided",
      401,
      httpStatusText.ERROR
    );
    return next(err);
  }
  const token = authHeaders.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWS_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (error) {
    const err = appError.create("Invalid JWT token", 401, httpStatusText.ERROR);
    return next(err);
  }
};

export default verifyToken;
