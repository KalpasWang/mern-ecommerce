import Product from "./product.model";

/**
 * @access Public
 * @route GET /api/products
 * @description Fetch all products
 */
export async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
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
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
}
