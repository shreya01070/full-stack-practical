const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware
app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`Request received at: ${currentTime}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

let users = [];
let idCounter = 1;

const sendResponse = (res, message, data = null) => {
  res.json({
    message,
    time: new Date().toLocaleString(),
    data
  });
};

// Root
app.get("/", (req, res) => {
  sendResponse(res, "Server Running");
});

// Get all users
app.get("/users", (req, res) => {
  sendResponse(res, "Users fetched successfully", users);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return sendResponse(res, "User not found");
  }

  sendResponse(res, "User fetched successfully", user);
});

// Add user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return sendResponse(res, "Name and email are required");
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return sendResponse(res, "Email already exists");
  }

  const newUser = {
    id: idCounter++,
    name,
    email
  };

  users.push(newUser);
  sendResponse(res, "User added successfully", newUser);
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return sendResponse(res, "User not found");
  }

  users.splice(index, 1);
  sendResponse(res, "User deleted successfully");
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, "All fields required");
  }

  if (email === "admin@gmail.com" && password === "1234") {
    return sendResponse(res, "Login Success");
  }

  sendResponse(res, "Invalid Credentials");
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});