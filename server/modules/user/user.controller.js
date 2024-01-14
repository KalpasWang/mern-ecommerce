import express from "express";
import User from "./user.model";

const router = express.Router();

/**
 * get all users
 * @access private - admin only
 * @route GET /api/users
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
