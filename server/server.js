import express from "express";
import cookieParser from "cookie-parser";

// init server
const app = express();
const port = process.env.PORT || 5000;

// setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
