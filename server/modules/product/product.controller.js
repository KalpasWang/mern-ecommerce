import express from "express";
import { isValidObjectId } from "mongoose";
import Product from "./product.model.js";
import { CustomError } from "../../utils/customError.js";

const router = express.Router();

/**
 * Fetch all products
 * @access public
 * @route GET /api/products
 */
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find().select(
      "-description -reviews -numReviews -countInStock -modifiedBy"
    );
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Fetch single product by id
 * @access public
 * @route GET /api/products/:id
 */
router.get("/:id", async (req, res, next) => {
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
});

export { router as productRoutes };
