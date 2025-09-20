import sequelize from "../config/database.js";
import ResetToken from "./resetToken.js";
import User from "./user.js";

User.hasMany(ResetToken, { foreignKey: "userId" });
ResetToken.belongsTo(User, { foreignKey: "userId" });

const db = {
  User,
  ResetToken,
};

export { sequelize, db };
