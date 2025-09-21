import express from "express";
import {
  register,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));
router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/verify-reset-code", verifyResetCode);
router.put("/reset-password", resetPassword);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
