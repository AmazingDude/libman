import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /borrow - Borrow a book
export const borrowBook = (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: "userId and bookId are required" });
  }

  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");

  const cpp = spawn(cppPath, ["borrow_book", userId.toString(), bookId.toString()], {
    cwd: cppWorkingDir
  });

  let output = "";
  let errorOutput = "";

  cpp.stdout.on("data", (data) => {
    output += data.toString();
  });

  cpp.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  cpp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ 
        error: "Failed to borrow book",
        message: errorOutput || output
      });
    }

    if (output.includes("Borrow failed")) {
      return res.status(400).json({ 
        error: "Borrow failed",
        message: "Book may not be available or user/book ID is invalid"
      });
    }

    res.json({ 
      message: "Book borrowed successfully",
      userId,
      bookId
    });
  });
};

// POST /return - Return a book
export const returnBook = (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: "userId and bookId are required" });
  }

  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");

  const cpp = spawn(cppPath, ["return_book", userId.toString(), bookId.toString()], {
    cwd: cppWorkingDir
  });

  let output = "";
  let errorOutput = "";

  cpp.stdout.on("data", (data) => {
    output += data.toString();
  });

  cpp.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  cpp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ 
        error: "Failed to return book",
        message: errorOutput || output
      });
    }

    if (output.includes("Return failed")) {
      return res.status(400).json({ 
        error: "Return failed",
        message: "Book may not be borrowed or user/book ID is invalid"
      });
    }

    res.json({ 
      message: "Book returned successfully",
      userId,
      bookId
    });
  });
};

// GET /transactions - Get all transactions
export const getAllTransactions = (req, res) => {
  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");

  const cpp = spawn(cppPath, ["list_transactions"], { cwd: cppWorkingDir });

  let output = "";

  cpp.stdout.on("data", (data) => {
    output += data.toString();
  });

  cpp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    // Parse C++ output into structured JSON
    const transactions = output
      .split(/\r?\n/)
      .filter(line => line.trim() && line.includes("TransactionID:"))
      .map(line => {
        const idMatch = line.match(/TransactionID:\s*(\d+)/);
        const userIdMatch = line.match(/UserID:\s*(\d+)/);
        const bookIdMatch = line.match(/BookID:\s*(\d+)/);
        const borrowDateMatch = line.match(/BorrowDate:\s*([^|]+)/);
        const returnDateMatch = line.match(/ReturnDate:\s*(.+)/);

        const returnDate = returnDateMatch ? returnDateMatch[1].trim() : "";
        const returned = returnDate !== "" && returnDate !== "Not Returned";

        return {
          id: idMatch ? parseInt(idMatch[1]) : null,
          userId: userIdMatch ? parseInt(userIdMatch[1]) : null,
          bookId: bookIdMatch ? parseInt(bookIdMatch[1]) : null,
          borrowDate: borrowDateMatch ? borrowDateMatch[1].trim() : "",
          returnDate: returned ? returnDate : "",
          returned: returned
        };
      });

    res.json(transactions);
  });
};
