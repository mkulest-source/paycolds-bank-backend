const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "paycolds_secret";

let users = [
  { email: "admin@paycolds.com", password: "admin123", balance: 50000, transactions: [] },
  { email: "user@paycolds.com", password: "user123", balance: 2000, transactions: [] }
];

app.post("/login", (req, res) => {
  const user = users.find(u => u.email === req.body.email && u.password === req.body.password);
  if (!user) return res.status(401).json({ message: "Invalid login" });

  const token = jwt.sign({ email: user.email }, SECRET);
  res.json({ token });
});

app.get("/dashboard", (req, res) => {
  const token = req.headers.authorization;
  const data = jwt.verify(token, SECRET);

  const user = users.find(u => u.email === data.email);
  res.json(user);
});

app.post("/send", (req, res) => {
  const token = req.headers.authorization;
  const data = jwt.verify(token, SECRET);

  const sender = users.find(u => u.email === data.email);
  const receiver = users.find(u => u.email === req.body.to);

  if (!receiver) return res.json({ message: "User not found" });

  sender.balance -= Number(req.body.amount);
  receiver.balance += Number(req.body.amount);

  res.json({ message: "Success" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
