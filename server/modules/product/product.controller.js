import Product from "./product.model.js";
import { CustomError } from "../../utils/customError.js";
import { isValidObjectId } from "mongoose";

/**
 * @access Public
 * @route GET /api/products
 * @description Fetch all products
 */
export async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find().select("-reviews");
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @access Public
 * @route GET /api/products/:id
 * @description Fetch single product by id
 */
export async function getProductById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new CustomError(`product not found with invalid product Id`, 404);
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json({
        success: true,
        product,
      });
    } else {
      throw new CustomError("Product not found", 404);
    }
  } catch (error) {
    next(error);
  }
}
