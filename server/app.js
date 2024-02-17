import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler } from "./utils/errorHandler.js";
import { productRoutes } from "./modules/product/product.controller.js";
import { userRoutes } from "./modules/user/user.controller.js";

// load env
dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

// init server
const app = express();

// setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.get("*", (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

export default app;
