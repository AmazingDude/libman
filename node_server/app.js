import express from 'express';

const app = express();

app.use(express.json());

// Routes
app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Library Management System" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));