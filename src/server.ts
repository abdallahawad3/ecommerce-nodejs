import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectToDatabase from "./config/db.js";
import categoryRoutes from "./routes/categoryRoute.js";
import subCategoryRoutes from "./routes/subCategoryRoute.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/categories", categoryRoutes);
app.use("/api/subCategories", subCategoryRoutes);
app.use(errorMiddleware);

connectToDatabase();
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection at:", err);
  server.close(() => {
    console.error("Server closed due to unhandled rejection");
    process.exit(1);
  });
});
