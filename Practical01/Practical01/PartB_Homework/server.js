const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send("Welcome to Homework API");
});

app.get('/intro', (req, res) => {
  res.send("Hi, I'm David, a student learning to build APIs with Express!");
});

app.get('/name', (req, res) => {
  res.send("David Chong");
});

app.get('/hobbies', (req, res) => {
  res.json(["coding", "gaming", "music"]);
});

app.get('/food', (req, res) => {
  res.send("Ramen, Fried Chicken, Bubble Tea");
});

app.get('/student', (req, res) => {
  res.json({
    name: "David",
    hobbies: ["coding", "gaming", "music"],
    intro: "Hi, I'm David, a Year 2 student passionate about building APIs!"
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
