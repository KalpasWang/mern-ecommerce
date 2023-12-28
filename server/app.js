import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// init server
const app = express();
const port = process.env.PORT || 5000;

// setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

export default app;
