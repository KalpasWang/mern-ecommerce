import express from "express";
import User from "./user.model";

const router = express.Router();

/**
 * @access private - admin only
 * @route GET /api/users
 * @description get all users
 */
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
});
// router.get("/:id", getProductById);

export { router as userRoutes };
