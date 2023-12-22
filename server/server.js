import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// init server
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
