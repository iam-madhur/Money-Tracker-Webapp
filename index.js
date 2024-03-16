const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost/money_tracker_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", expenseSchema);

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

app.post("/expenses", async (req, res) => {
  const { description, amount } = req.body;
  if (!description || !amount) {
    return res
      .status(400)
      .json({ message: "Description and amount are required" });
  }

  const expense = new Expense({
    description,
    amount,
  });
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error saving expense:", err.message); 
    res.status(500).json({ message: "Failed to save expense" });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
