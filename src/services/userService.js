import { db } from "../models/index.js";
import { sendEmail } from "../utils/email.js";
import {
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../utils/jwt.js";
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

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  await db.RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

export const forgetPassword = async ({ email }) => {
  console.log("available associations", db.User.associations);
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = await bcrypt.hash(code, 10);

  console.log(code, hashedCode);

  await db.ResetToken.create({
    token: hashedCode,
    userId: user.id,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  const html = `
    <div>
      <h1>Reset Password</h1>
      <p>Please use the following code to reset your password:</p>
      <p>${code}</p>
    </div>
  `;

  await sendEmail(user.email, "Reset Password", html);

  return { message: "Email sent successfully" };
};

export const verifyResetCode = async ({ code, email }) => {
  const user = await db.User.findOne({ where: { email } });

  const resetToken = await db.ResetToken.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });

  if (!resetToken) {
    throw new Error("Invalid reset code db");
  }

  const isMatch = await bcrypt.compare(code, resetToken.token);

  if (!isMatch) {
    throw new Error("Invalid reset code");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error("Reset code has expired");
  }

  return { message: "Reset code is valid" };
};

export const resetPassword = async ({ email, newPassword }) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ password: newPassword });

  return { message: "Password reset successfully" };
};

export async function refresh(oldToken) {
  const decoded = verifyToken(oldToken);

  const stored = await db.RefreshToken.findOne({
    where: { token: oldToken, userId: decoded.id },
  });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  await stored.destroy();

  const newAccess = generateToken({ id: decoded.id });
  const newRefresh = generateRefreshToken({ id: decoded.id });

  await db.RefreshToken.create({
    token: newRefresh,
    userId: decoded.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccess, refreshToken: newRefresh };
}

export async function logout(userId, refreshToken) {
  await db.RefreshToken.destroy({ where: { userId, token: refreshToken } });
}
