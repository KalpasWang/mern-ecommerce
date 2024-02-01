import express from "express";
import User from "./user.model.js";
import { CustomError } from "../../utils/customError.js";
import { JWT_EXPIRES_IN_NUM } from "../../utils/constants.js";

const router = express.Router();

/**
 * login (authenticate) user
 * @access public
 * @route POST /api/users/auth
 */
router.post("/auth", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Invalid email", 400);
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new CustomError("Invalid password", 401);
    }
    // Set JWT as an HTTP-Only cookie
    const token = await user.generateToken();
    if (!token) {
      throw new CustomError("server Unable to generate token", 500);
    }
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: JWT_EXPIRES_IN_NUM * 24 * 60 * 60 * 1000,
    });
    // send res
    res.json({
      success: true,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * logout user
 * @access public
 * @route POST /api/users/logout
 */
router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
});

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
