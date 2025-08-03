document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    showToast("Session expired. Please log in again.");
    window.location.href = "index.html";
    return;
  }

  const modal = document.getElementById("addExpenseModal");
  const openModalBtn = document.getElementById("openAddExpenseBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const addExpenseForm = document.getElementById("addExpenseForm");
  const summaryMonthSelect = document.getElementById("summaryMonthSelect");
  const summaryYearSelect = document.getElementById("summaryYearSelect");
  const monthlySummary = document.getElementById("monthlySummary");

  // Toast Notification Function
  function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.background = isError
      ? "linear-gradient(to right, #0ea5e9, #7f1d1d)" // red gradient for error
      : "linear-gradient(to right,  #0ea5e9, #0f766e)"; // rose-indigo for success
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  // Open Modal
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close Modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Submit Expense
  addExpenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const name = document.getElementById("name").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const paymentType = document.getElementById("paymentType").value;
    const category = document.getElementById("category").value;

    if (!date || !name || !amount || !paymentType || !category) {
      showToast("All fields are required.", true);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          expense_date: date,
          expense_name: name,
          amount,
          payment_type: paymentType,
          category
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast("✅ Expense added successfully!");
        addExpenseForm.reset();
        modal.style.display = "none";
        fetchMonthlySummary();
      } else {
        showToast("❌ " + data.message, true);
      }
    } catch (err) {
      console.error(err);
      showToast("Server error. Please try again later.", true);
    }
  });

  // Populate Month and Year dropdowns
  function populateSummaryFilters() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Month Dropdown
    for (let m = 1; m <= 12; m++) {
      const option = document.createElement("option");
      option.value = m.toString().padStart(2, "0");
      option.textContent = new Date(0, m - 1).toLocaleString("default", { month: "long" });
      if (m === currentMonth) option.selected = true;
      summaryMonthSelect.appendChild(option);
    }

    // Year Dropdown (current to 5 years back)
    for (let y = currentYear; y >= currentYear - 5; y--) {
      const option = document.createElement("option");
      option.value = y;
      option.textContent = y;
      if (y === currentYear) option.selected = true;
      summaryYearSelect.appendChild(option);
    }

    fetchMonthlySummary();
  }

  // Fetch Monthly Summary
  async function fetchMonthlySummary() {
    const month = summaryMonthSelect.value;
    const year = summaryYearSelect.value;
    if (!month || !year) return;

    const selectedMonth = `${year}-${month}`;

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/summary?month=${selectedMonth}&userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        monthlySummary.textContent = `₹${data.total}`;
      } else {
        monthlySummary.textContent = "₹0";
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      monthlySummary.textContent = "₹0";
    }
  }

  // Filter change listeners
  summaryMonthSelect.addEventListener("change", fetchMonthlySummary);
  summaryYearSelect.addEventListener("change", fetchMonthlySummary);

  // Navigation
  document.getElementById("viewHistoryBtn").addEventListener("click", () => {
    window.location.href = "history.html";
  });

  document.getElementById("viewInsightsBtn").addEventListener("click", () => {
    window.location.href = "insights.html";
  });

  // Initialize
  populateSummaryFilters();
});


// Add event listeners once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const budgetBtn = document.getElementById("viewBudgetBtn");
  const tipsBtn = document.getElementById("viewTipsBtn");
  const backBtn = document.getElementById("backBtn");

  if (budgetBtn) {
    budgetBtn.addEventListener("click", () => {
      window.location.href = "budget.html";
    });
  }

  if (tipsBtn) {
    tipsBtn.addEventListener("click", () => {
      window.location.href = "smarttips.html";
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});