import express from "express";
import { borrowBook, returnBook, getAllTransactions } from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/borrow", borrowBook);
router.post("/return", returnBook);
router.get("/", getAllTransactions);

export default router;
