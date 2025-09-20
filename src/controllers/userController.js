import { registerUser } from "../services/userService.js";

export const register = async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await registerUser({ email, password, name, role });
  res.status(201).json({ message: "User registered successfully", user });
};
