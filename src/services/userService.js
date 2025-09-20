import { db } from "../models/index.js";

export const registerUser = async ({ email, password, name, role }) => {
  const validRoles = ["Admin", "Teacher", "Student"];
  4;
  if (role && !validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await db.User.create({ email, password, name, role });
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};
