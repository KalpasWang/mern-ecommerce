import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string()
    .max(50)
    .required()
    .pattern(/^[a-zA-Z\u4e00-\u9fa5\s]+$/, "name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(/^\w+$/, "password").required(),
});

export const registerValidator = (req, res, next) => {
  req.body.name = req.body.name.trim();
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ success: false, message: error.details.message });
  }
  next();
};
