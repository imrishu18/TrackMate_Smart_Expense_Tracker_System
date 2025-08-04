document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Session expired. Please log in again.");
    window.location.href = "index.html";
    return;
  }

  const BASE_URL = "https://trackmatesmartexpensetrackersystem.onrender.com/api";
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const applyBtn = document.getElementById("applyBtn");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  for (let m = 1; m <= 12; m++) {
    const option = new Option(
      new Date(0, m - 1).toLocaleString("default", { month: "long" }),
      m.toString()
    );
    if (m === currentMonth) option.selected = true;
    monthSelect.appendChild(option);
  }

  for (let y = currentYear; y >= currentYear - 5; y--) {
    const option = new Option(y, y);
    if (y === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }

  applyBtn.addEventListener("click", loadInsights);
  document.getElementById("backBtn").onclick = () => window.location.href = "dashboard.html";

  let paymentChart, monthlyChart, categoryChart;

  const formatMonthName = (month) => {
    if (!month || isNaN(month)) return "-";
    return new Date(0, month - 1).toLocaleString("default", { month: "long" });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? "-" : date.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const showNoDataMessage = (id, show) => {
    const msg = document.getElementById(id);
    if (msg) msg.style.display = show ? "block" : "none";
  };

  async function parseJsonSafe(res, label) {
    try {
      const text = await res.text();
      const json = JSON.parse(text);
      return json.success ? json : { data: [] };
    } catch (e) {
      console.error(`❌ JSON parse error for ${label}:`, e);
      return { data: [] };
    }
  }

  async function loadInsights() {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);

    const categoryURL = `${BASE_URL}/insights/category?userId=${userId}&month=${month}&year=${year}`;
    const monthlyURL = `${BASE_URL}/insights/monthly-trend?userId=${userId}&year=${year}`;
    const paymentURL = `${BASE_URL}/insights/payment-type?userId=${userId}&month=${month}&year=${year}`;
    const peakURL = `${BASE_URL}/insights/peak-month?userId=${userId}&year=${year}`;
    const expensesURL = `${BASE_URL}/expenses/all?userId=${userId}&month=${month}&year=${year}`;

    try {
      const [categoryRes, monthlyRes, paymentRes, peakRes, expensesRes] = await Promise.all([
        fetch(categoryURL),
        fetch(monthlyURL),
        fetch(paymentURL),
        fetch(peakURL),
        fetch(expensesURL)
      ]);

      const categoryData = (await parseJsonSafe(categoryRes, "Category")).data || [];
      const monthlyData = (await parseJsonSafe(monthlyRes, "Monthly")).data || [];
      const paymentData = (await parseJsonSafe(paymentRes, "Payment")).data || [];
      const peak = (await parseJsonSafe(peakRes, "Peak")).data || {};
      const expenses = (await parseJsonSafe(expensesRes, "Expenses")).expenses || [];

      const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const avgDaily = (totalSpent / new Date(year, month, 0).getDate()).toFixed(2);

      const categoryTotals = {};
      expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount);
      });
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

      // Update key insights
      document.getElementById("totalSpent").textContent = `₹${totalSpent}`;
      document.getElementById("peakDay").textContent = `${peak?.month ? formatMonthName(peak.month) : "-"}`;
      document.getElementById("avgDaily").textContent = `₹${avgDaily}`;
      document.getElementById("leastCategory").textContent = `${topCategory}`;

      // Payment Pie Chart
      if (paymentChart) paymentChart.destroy();
      const ctxPayment = document.getElementById("paymentChart").getContext("2d");
      showNoDataMessage("noDataPayment", paymentData.length === 0);
      if (paymentData.length > 0) {
        const total = paymentData.reduce((sum, p) => sum + parseFloat(p.total), 0);
        paymentChart = new Chart(ctxPayment, {
          type: "pie",
          data: {
            labels: paymentData.map(p => p.payment_type),
            datasets: [{
              data: paymentData.map(p => parseFloat(p.total)),
              backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF6384", "#9966FF"]
            }]
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = parseFloat(context.raw);
                    const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                    return `${context.label}: ₹${value} (${percent}%)`;
                  }
                }
              },
              legend: {
                labels: {
                  generateLabels: chart => {
                    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    return chart.data.labels.map((label, i) => {
                      const value = chart.data.datasets[0].data[i];
                      const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                      return {
                        text: `${label}: ₹${value} (${percent}%)`,
                        fillStyle: chart.data.datasets[0].backgroundColor[i],
                        strokeStyle: chart.data.datasets[0].backgroundColor[i],
                        fontColor: "#111827",
                        index: i
                      };
                    });
                  }
                }
              }
            }
          }
        });
      }

      // Monthly Trend Bar Chart
      if (monthlyChart) monthlyChart.destroy();
      const ctxMonthly = document.getElementById("monthlyChart").getContext("2d");
      showNoDataMessage("noDataMonthly", monthlyData.length === 0);
      if (monthlyData.length > 0) {
        monthlyChart = new Chart(ctxMonthly, {
          type: "bar",
          data: {
            labels: monthlyData.map(m => formatMonthName(m.month)),
            datasets: [{
              label: "Monthly Spend (₹)",
              data: monthlyData.map(m => parseFloat(m.total)),
              backgroundColor: "#22c55e"
            }]
          },
          options: {
            scales: {
              x: {
                ticks: { color: "#111827" },
                grid: { color: "#e5e7eb" }
              },
              y: {
                ticks: { color: "#111827" },
                grid: { color: "#e5e7eb" }
              }
            },
            plugins: {
              legend: {
                labels: { color: "#111827" }
              }
            }
          }
        });
      }

      // Category Doughnut Chart
      if (categoryChart) categoryChart.destroy();
      const ctxCategory = document.getElementById("categoryChart").getContext("2d");
      showNoDataMessage("noDataCategory", categoryData.length === 0);
      if (categoryData.length > 0) {
        const total = categoryData.reduce((sum, c) => sum + parseFloat(c.total), 0);
        categoryChart = new Chart(ctxCategory, {
          type: "doughnut",
          data: {
            labels: categoryData.map(c => c.category),
            datasets: [{
              data: categoryData.map(c => parseFloat(c.total)),
              backgroundColor: ["#0ea5e9", "#38bdf8", "#818cf8", "#f472b6", "#fb923c", "#34d399"]
            }]
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = parseFloat(context.raw);
                    const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                    return `${context.label}: ₹${value} (${percent}%)`;
                  }
                }
              },
              legend: {
                labels: {
                  generateLabels: chart => {
                    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    return chart.data.labels.map((label, i) => {
                      const value = chart.data.datasets[0].data[i];
                      const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                      return {
                        text: `${label}: ₹${value} (${percent}%)`,
                        fillStyle: chart.data.datasets[0].backgroundColor[i],
                        strokeStyle: chart.data.datasets[0].backgroundColor[i],
                        fontColor: "#111827",
                        index: i
                      };
                    });
                  }
                }
              }
            }
          }
        });
      }

      // Top 5 Expenses
      const topList = document.getElementById("topList");
      topList.innerHTML = "";
      const top5 = expenses.sort((a, b) => b.amount - a.amount).slice(0, 5);
      showNoDataMessage("noDataTopList", top5.length === 0);
      top5.forEach(exp => {
        const div = document.createElement("div");
        div.className = "topItem";
        div.innerHTML = `
          <strong>${exp.expense_name}</strong><br/>
          ₹${exp.amount} • ${formatDate(exp.expense_date)}<br/>
          Payment: ${exp.payment_type}, Category: ${exp.category}
        `;
        topList.appendChild(div);
      });

    } catch (err) {
      console.error("❌ Insights Error:", err);
      alert("Something went wrong while loading your insights. Please check your connection or try again.");
    }
  }

  loadInsights();
});
