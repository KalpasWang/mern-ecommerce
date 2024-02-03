import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  isAdmin: Joi.boolean(),
});

export const registerValidator = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.details.message });
  }
  next();
};
