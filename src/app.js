import express from "express";
import "dotenv/config";
import sequelize from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
