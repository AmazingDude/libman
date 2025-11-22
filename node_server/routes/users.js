import express from "express";
import { getAllUsers, searchUser, addUser } from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/search", searchUser);
router.post("/", addUser);

export default router;
