import mongoose from "mongoose";
const connectToDatabase = () => {
  const dbUrl = process.env.DB_URL || "";
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Connected to the database successfully.🙋🙋");
    })
    .catch((error) => {
      console.error("Error connecting to the database:❌ ", error);
    });
};

export default connectToDatabase;
