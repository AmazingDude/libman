import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /books
export const getAllBooks = (req, res) => {
  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");
  
  const cpp = spawn(cppPath, ["list_books"], {
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

  cpp.on("error", (err) => {
    return res.status(500).json({ error: "Failed to execute C++ program", details: err.message });
  });

  cpp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Failed to execute C++ program", stderr: errorOutput });
    }
    
    // Parse C++ output into structured JSON
    const books = output
      .split("\n")
      .filter(line => line.trim() && line.includes("ID:"))
      .map(line => {
        const idMatch = line.match(/ID:\s*(\d+)/);
        const titleMatch = line.match(/Title:\s*([^|]+)/);
        const authorMatch = line.match(/Author:\s*([^|]+)/);
        const isbnMatch = line.match(/ISBN:\s*([^|]+)/);
        const availMatch = line.match(/Availability:\s*(\w+)/);
        
        return {
          id: idMatch ? parseInt(idMatch[1]) : null,
          title: titleMatch ? titleMatch[1].trim() : "",
          author: authorMatch ? authorMatch[1].trim() : "",
          isbn: isbnMatch ? isbnMatch[1].trim() : "",
          available: availMatch ? availMatch[1].trim() === "Available" : false
        };
      });
    
    res.json(books);
  });
};

// GET /books/search?title=xyz
export const searchBook = (req, res) => {
  const title = req.query.title;
  if (!title) return res.status(400).json({ error: "Title query missing" });

  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");
  
  const cpp = spawn(cppPath, ["list_books"], {
    cwd: cppWorkingDir
  });

  let output = "";
  
  cpp.stdout.on("data", (data) => {
    output += data.toString();
  });

  cpp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Failed to execute C++ program" });
    }
    
    // Parse and filter books
    const books = output
      .split("\n")
      .filter(line => line.trim() && line.includes("ID:"))
      .filter(line => line.toLowerCase().includes(title.toLowerCase()))
      .map(line => {
        const idMatch = line.match(/ID:\s*(\d+)/);
        const titleMatch = line.match(/Title:\s*([^|]+)/);
        const authorMatch = line.match(/Author:\s*([^|]+)/);
        const isbnMatch = line.match(/ISBN:\s*([^|]+)/);
        const availMatch = line.match(/Availability:\s*(\w+)/);
        
        return {
          id: idMatch ? parseInt(idMatch[1]) : null,
          title: titleMatch ? titleMatch[1].trim() : "",
          author: authorMatch ? authorMatch[1].trim() : "",
          isbn: isbnMatch ? isbnMatch[1].trim() : "",
          available: availMatch ? availMatch[1].trim() === "Available" : false
        };
      });

    res.json(books);
  });
};
