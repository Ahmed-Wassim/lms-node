import {
  registerUser,
  loginUser,
  forgetPassword as forgetPasswordService,
  verifyResetCode as verifyResetCodeService,
  resetPassword as resetPasswordService,
  refresh as refreshTokenService,
  logout as logoutService,
} from "../services/userService.js";
import { generateRefreshToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await registerUser({ email, password, name, role });
  res.status(201).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser({ email, password });
  res.status(200).json({ user });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const message = await forgetPasswordService({ email });
  res.status(200).json(message);
};

export const verifyResetCode = async (req, res) => {
  const { code, email } = req.body;
  const message = await verifyResetCodeService({ code, email });
  res.status(200).json(message);
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const message = await resetPasswordService({ email, newPassword });
  res.status(200).json(message);
};

export const refreshToken = async (req, res) => {
  const { userId, refreshToken } = req.user;
  const newRefreshToken = await refreshTokenService({ userId, refreshToken });
  res.status(200).json({ refreshToken: newRefreshToken });
};

export const logout = async (req, res) => {
  const { userId, refreshToken } = req.user;
  await logoutService(userId, refreshToken);
  res.status(200).json({ message: "Logout successful" });
};
