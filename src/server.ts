import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectToDatabase from "./config/db.js";
import categoryRoutes from "./routes/categoryRoute.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/categories", categoryRoutes);
app.use(errorMiddleware);

function startServer() {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error);
    });
}

startServer();
