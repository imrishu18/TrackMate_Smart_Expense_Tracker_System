document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Session expired. Please login again.");
    window.location.href = "index.html";
    return;
  }
  document.getElementById("editExpenseModal").style.display = "none";

  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const filterBtn = document.getElementById("filterBtn");
  const tableBody = document.getElementById("historyTableBody");

  const editModal = document.getElementById("editExpenseModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const editForm = document.getElementById("editExpenseForm");

  // Populate Month Dropdown
  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, "0");
    const name = new Date(0, i - 1).toLocaleString("default", { month: "long" });
    const option = new Option(name, month);
    if (i === now.getMonth() + 1) option.selected = true;
    monthSelect.add(option);
  }

  // Populate Year Dropdown
  const currentYear = now.getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    const option = new Option(i, i);
    if (i === currentYear) option.selected = true;
    yearSelect.add(option);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function loadExpenses() {
    const month = monthSelect.value;
    const year = yearSelect.value;

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/all?userId=${userId}&month=${month}&year=${year}`);
      const data = await res.json();

      tableBody.innerHTML = "";

      if (!data.success || data.expenses.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6" style="text-align:center; color: #888;">No records found</td>`;
        tableBody.appendChild(row);
        return;
      }

      data.expenses.forEach((exp) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${formatDate(exp.expense_date)}</td>
          <td>${exp.expense_name}</td>
          <td>₹${exp.amount}</td>
          <td>${exp.payment_type}</td>
          <td>${exp.category || 'Other'}</td>
          <td>
            <button class="edit-btn" onclick="openEditModal(${exp.id}, '${exp.expense_name}', ${exp.amount}, '${exp.payment_type}', '${exp.expense_date}', '${exp.category || 'Other'}')">Edit</button>
            <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  }

  filterBtn.addEventListener("click", loadExpenses);
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  window.openEditModal = (id, name, amount, paymentType, date, category) => {
    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editAmount").value = amount;
    document.getElementById("editPaymentType").value = paymentType;
    document.getElementById("editDate").value = date.split("T")[0];
    document.getElementById("editCategory").value = category || "Other";
    editModal.style.display = "flex";
  };

  closeEditModal.onclick = () => editModal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === editModal) editModal.style.display = "none";
  };

  editForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const updatedExpense = {
      expense_name: document.getElementById("editName").value,
      amount: document.getElementById("editAmount").value,
      payment_type: document.getElementById("editPaymentType").value,
      expense_date: document.getElementById("editDate").value,
      category: document.getElementById("editCategory").value,
    };

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense),
      });

      const data = await res.json();
      if (data.success) {
        alert("Expense updated!");
        editModal.style.display = "none";
        loadExpenses();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating expense.");
    }
  };

  window.deleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (data.success) {
        alert("Expense deleted.");
        loadExpenses();
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting expense.");
    }
  };

  loadExpenses();
});
