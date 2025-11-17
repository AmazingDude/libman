export const getAllBooks = (req, res) => {
  // Placeholder until C++ integration
  res.json([
    { id: 1, title: "Harry Potter", author: "J.K. Rowling", isbn: "123" },
    { id: 2, title: "Trip", author: "Erin Dillon", isbn: "456" }
  ]);
};

export const searchBook = (req, res) => {
  const { name } = req.query;
  // Placeholder
  res.json({ result: `Searched for ${name}, will integrate C++ later.` });
};
