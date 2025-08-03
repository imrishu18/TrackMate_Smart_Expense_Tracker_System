document.addEventListener("DOMContentLoaded", () => {
  const budgetForm = document.getElementById("budgetForm");
  const monthInput = document.getElementById("budgetMonth");
  const amountInput = document.getElementById("budgetAmount");
  const budgetList = document.getElementById("savedBudgets");
  const clearBtn = document.getElementById("clearAllBtn");

  function loadBudgets() {
    const saved = localStorage.getItem("trackmateBudgets");
    return saved ? JSON.parse(saved) : {};
  }

  function saveBudgets(budgets) {
    localStorage.setItem("trackmateBudgets", JSON.stringify(budgets));
  }

  function renderBudgets() {
    const budgets = loadBudgets();
    budgetList.innerHTML = "";

    const months = Object.keys(budgets);
    if (months.length === 0) {
      budgetList.innerHTML = `<li>No budgets set yet.</li>`;
      return;
    }

    months.forEach((month) => {
      const li = document.createElement("li");
      li.textContent = `${month} → ₹${budgets[month]}`;
      budgetList.appendChild(li);
    });
  }

  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const month = monthInput.value;
    const amount = parseFloat(amountInput.value.trim());

    if (!month || isNaN(amount) || amount <= 0) {
      alert("Please select a valid month and enter a valid amount.");
      return;
    }

    const budgets = loadBudgets();
    budgets[month] = amount;
    saveBudgets(budgets);

    budgetForm.reset();
    renderBudgets();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all budget entries?")) {
      localStorage.removeItem("trackmateBudgets");
      renderBudgets();
    }
  });

  renderBudgets();
});

