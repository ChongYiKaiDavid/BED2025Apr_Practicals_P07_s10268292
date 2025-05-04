const express = require("express");
const app = express();
const PORT = 3000;

// Home Route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// About Route
app.get("/about", (req, res) => {
  res.send("About Page");
});

// Contact Route
app.get("/contact", (req, res) => {
  res.send("Contact Page");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
