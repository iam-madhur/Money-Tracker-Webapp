document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expensesList = document.getElementById("expenses-list");

  fetchExpenses();

  expenseForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;

    if (description.trim() && amount.trim()) {
      addExpense(description, amount);
      expenseForm.reset(); 
    } else {
      console.error("Description and amount are required");
    }
  });

  function fetchExpenses() {
    fetch("/expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        return response.json();
      })
      .then((expenses) => {
        if (Array.isArray(expenses)) {
          expensesList.innerHTML = "";
          expenses.forEach((expense) => {
            const row = createExpenseRow(expense);
            expensesList.appendChild(row);
          });
        } else {
          throw new Error("Expenses data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error.message);
      });
  }

  function addExpense(description, amount) {
    fetch("/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, amount }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add expense");
        }
        return response.json();
      })
      .then((newExpense) => {
        const row = createExpenseRow(newExpense);
        expensesList.appendChild(row);
      })
      .catch((error) => {
        console.error("Error adding expense:", error.message);
      });
  }

  function createExpenseRow(expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${expense.description}</td>
          <td>$${expense.amount}</td>
          <td>${new Date(expense.date).toLocaleDateString()}</td>
      `;
    return row;
  }
});
