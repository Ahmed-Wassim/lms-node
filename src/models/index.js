import sequelize from "../config/database.js";
import User from "./user.js";

const db = {
  User,
};

export { sequelize, db };
