import express from 'express';
import cors from 'cors';
import booksRouter from './routes/books.js';
import usersRouter from './routes/users.js';
import transactionsRouter from './routes/transactions.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api", transactionsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Library Management System API", status: "running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));