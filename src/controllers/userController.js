import { registerUser, loginUser } from "../services/userService.js";

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
