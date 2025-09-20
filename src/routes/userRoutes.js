import express from "express";
import { register } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));
router.post("/register", register);

export default router;
