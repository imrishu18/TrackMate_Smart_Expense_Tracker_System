const budgetForm = document.getElementById("budgetForm");
const monthSelect = document.getElementById("budgetMonth");
const amountInput = document.getElementById("budgetAmount");
const budgetList = document.getElementById("savedBudgets");
const clearAllBtn = document.getElementById("clearAllBtn");

function loadBudgets() {
  const saved = JSON.parse(localStorage.getItem("trackmateBudgets")) || {};
  budgetList.innerHTML = "";

  if (Object.keys(saved).length === 0) {
    budgetList.innerHTML = "<li>No budgets set yet.</li>";
    return;
  }

  Object.entries(saved).forEach(([month, amount]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${month}</strong> - ₹${amount}</span>
      <span class="icon-actions">
        <i class="fas fa-edit edit-icon" title="Edit" data-month="${month}"></i>
        <i class="fas fa-trash delete-icon" title="Delete" data-month="${month}"></i>
      </span>
    `;
    budgetList.appendChild(li);
  });

  addIconListeners();
}

function addIconListeners() {
  document.querySelectorAll(".edit-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const month = icon.dataset.month;
      const saved = JSON.parse(localStorage.getItem("trackmateBudgets")) || {};
      const amount = saved[month];

      monthSelect.value = month;
      amountInput.value = amount;
    });
  });

  document.querySelectorAll(".delete-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const month = icon.dataset.month;
      if (confirm(`Delete budget for ${month}?`)) {
        const saved = JSON.parse(localStorage.getItem("trackmateBudgets")) || {};
        delete saved[month];
        localStorage.setItem("trackmateBudgets", JSON.stringify(saved));
        loadBudgets();
      }
    });
  });
}

budgetForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const month = monthSelect.value;
  const amount = amountInput.value;

  if (!month || !amount || isNaN(amount) || amount <= 0) return;

  const saved = JSON.parse(localStorage.getItem("trackmateBudgets")) || {};
  saved[month] = amount;

  localStorage.setItem("trackmateBudgets", JSON.stringify(saved));
  loadBudgets();
  budgetForm.reset();
});

clearAllBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete all budgets?")) {
    localStorage.removeItem("trackmateBudgets");
    loadBudgets();
  }
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

window.addEventListener("DOMContentLoaded", loadBudgets);
