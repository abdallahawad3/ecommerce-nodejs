import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectToDatabase from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

await connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
