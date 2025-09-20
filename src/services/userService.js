import { db } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export const registerUser = async ({ email, password, name, role }) => {
  const validRoles = ["Admin", "Teacher", "Student"];
  4;
  if (role && !validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await db.User.create({ email, password, name, role });

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};
