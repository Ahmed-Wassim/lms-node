import { db } from "../models/index.js";
import { sendEmail } from "../utils/email.js";
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

export const forgetPasswordUser = async ({ email }) => {
  console.log("available associations", db.User.associations);
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = await bcrypt.hash(code, 10);

  console.log(code, hashedCode);

  const resetCode = await db.ResetToken.create({
    token: hashedCode,
    userId: user.id,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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
