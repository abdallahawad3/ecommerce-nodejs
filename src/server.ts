import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectToDatabase from "./config/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import categoryRoutes from "./routes/Category.js";
import subCategoryRoutes from "./routes/SubCategory.js";
import brandRoutes from "./routes/Brands.js";
import productRoutes from "./routes/Products.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/categories", categoryRoutes);
app.use("/api/subCategories", subCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
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
