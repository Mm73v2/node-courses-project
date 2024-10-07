import jwt from "jsonwebtoken";

const generateJWT = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWS_SECRET_KEY, {
    expiresIn: "30m",
  });
  return token;
};

export default generateJWT;
