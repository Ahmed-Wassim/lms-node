import express from "express";
import {
  register,
  login,
  forgetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));
router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);

export default router;
