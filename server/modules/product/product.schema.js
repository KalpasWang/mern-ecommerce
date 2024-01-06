import Joi from "joi";

// product schema
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  image: Joi.string().required(),
  brand: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  soldAmount: Joi.number().min(0).required(),
  rating: Joi.number().precision(2).min(0).max(5).required(),
  numReviews: Joi.number().min(0).required(),
  price: Joi.number().min(0).required(),
  countInStock: Joi.number().min(0).required(),
});
