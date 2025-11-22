import express from "express";
import { getAllBooks, searchBook } from "../controllers/booksController.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/search", searchBook);

export default router;
