import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

const userSchema = Joi.object({
  name: Joi.string()
    .max(50)
    .required()
    .pattern(/^[a-zA-Z\u4e00-\u9fa5\s]+$/, "name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(/^\w+$/, "password").required(),
});

const authSchema = Joi.object({
  email: userSchema.extract("email"),
  password: userSchema.extract("password"),
});

export function authValidator(req, res, next) {
  const { error } = authSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ success: false, message: error.details[0].message });
  }
  next();
}

export const registerValidator = (req, res, next) => {
  if (typeof req.body.name === "string" && req.body.name.length > 0) {
    req.body.name = req.body.name.trim();
  }
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ success: false, message: error.details[0].message });
  }
  next();
};

export const authProtector = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Not authorized, no valid token" });
  }
};
