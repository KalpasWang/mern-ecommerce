import express from "express";
import User from "./user.model.js";
import { CustomError } from "../../utils/customError.js";
import { JWT_EXPIRES_IN_NUM } from "../../utils/constants.js";
import { authProtector, authValidator, registerValidator } from "./user.middleware.js";

const router = express.Router();

/**
 * login (authenticate) user
 * @access public
 * @route POST /api/users/auth
 */
router.post("/auth", authValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new CustomError("Invalid email", 400);
    }
    const isMatch = await foundUser.matchPassword(password);
    if (!isMatch) {
      throw new CustomError("Invalid password", 401);
    }
    // Set JWT as an HTTP-Only cookie
    const token = await foundUser.generateToken();
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
      id: foundUser._id.toString(),
      name: foundUser.name,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
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
 * register new user
 * @access public
 * @route POST /api/users/register
 */
router.post("/register", registerValidator, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new CustomError("user alredy exists", 409);
    }
    const createdUser = await User.create({ name, email, password });
    if (!createdUser) {
      throw new CustomError("server Unable to create user", 500);
    }
    res.status(201).json({
      success: true,
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * get user profile
 * @access private
 * @route GET /api/users/profile
 */
router.get("/profile", authProtector, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.json({
      success: true,
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
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
