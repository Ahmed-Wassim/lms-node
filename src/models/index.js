import sequelize from "../config/database.js";
import RefreshToken from "./RefreshToken.js";
import ResetToken from "./resetToken.js";
import User from "./user.js";

User.hasMany(ResetToken, { foreignKey: "userId" });
ResetToken.belongsTo(User, { foreignKey: "userId" });

User.hasMany(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

const db = {
  User,
  ResetToken,
  RefreshToken,
};

export { sequelize, db };
