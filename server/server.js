import app from "./app.js";
import connectDB from "./utils/db.js";

async function initServer() {
  const port = process.env.PORT || 5000;
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  });
}

initServer();
