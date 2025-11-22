import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /users
export const getAllUsers = (req, res) => {
  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");
  
  const cpp = spawn(cppPath, ["list_users"], {
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
    const users = output
      .split(/\r?\n/)
      .filter(line => line.trim() && line.includes("ID:"))
      .map(line => {
        const idMatch = line.match(/ID:\s*(\d+)/);
        const nameMatch = line.match(/Name:\s*([^|]+)/);
        const phoneMatch = line.match(/Phone:\s*(.+)/);
        
        return {
          id: idMatch ? parseInt(idMatch[1]) : null,
          name: nameMatch ? nameMatch[1].trim() : "",
          phone: phoneMatch ? phoneMatch[1].trim() : ""
        };
      });
    
    res.json(users);
  });
};

// POST /users - Add new user
export const addUser = (req, res) => {
  const { name, phone } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }

  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");
  
  // First get the highest ID
  const listCpp = spawn(cppPath, ["list_users"], { cwd: cppWorkingDir });
  
  let output = "";
  
  listCpp.stdout.on("data", (data) => {
    output += data.toString();
  });

  listCpp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Failed to get users list" });
    }
    
    // Calculate next ID
    const users = output
      .split(/\r?\n/)
      .filter(line => line.trim() && line.includes("ID:"))
      .map(line => {
        const idMatch = line.match(/ID:\s*(\d+)/);
        return idMatch ? parseInt(idMatch[1]) : 0;
      });
    
    const nextId = users.length > 0 ? Math.max(...users) + 1 : 1;
    
    // Add the new user
    const addCpp = spawn(cppPath, ["add_user", nextId.toString(), name, phone], {
      cwd: cppWorkingDir
    });
    
    let addOutput = "";
    let errorOutput = "";
    
    addCpp.stdout.on("data", (data) => {
      addOutput += data.toString();
    });
    
    addCpp.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    
    addCpp.on("close", (addCode) => {
      if (addCode !== 0) {
        return res.status(500).json({ error: "Failed to add user", stderr: errorOutput });
      }
      
      res.status(201).json({ 
        message: "User added successfully",
        user: { id: nextId, name, phone }
      });
    });
  });
};

// GET /users/search?name=xyz
export const searchUser = (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "Name query missing" });

  const cppPath = path.resolve(__dirname, "../../backend_cpp/library.exe");
  const cppWorkingDir = path.resolve(__dirname, "../../backend_cpp");
  
  const cpp = spawn(cppPath, ["list_users"], {
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
    
    // Parse and filter users
    const users = output
      .split(/\r?\n/)
      .filter(line => line.trim() && line.includes("ID:"))
      .filter(line => line.toLowerCase().includes(name.toLowerCase()))
      .map(line => {
        const idMatch = line.match(/ID:\s*(\d+)/);
        const nameMatch = line.match(/Name:\s*([^|]+)/);
        const phoneMatch = line.match(/Phone:\s*(.+)/);
        
        return {
          id: idMatch ? parseInt(idMatch[1]) : null,
          name: nameMatch ? nameMatch[1].trim() : "",
          phone: phoneMatch ? phoneMatch[1].trim() : ""
        };
      });

    res.json(users);
  });
};
