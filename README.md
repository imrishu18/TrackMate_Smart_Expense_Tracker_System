
#  TrackMate – Smart Expense Tracker System

**TrackMate** is a full-featured personal expense tracker that lets you **log daily expenses, analyze insights, manage history, and set monthly budgets** — all through a beautiful, intuitive interface.

Built with **HTML**, **CSS**, **JavaScript**, **Node.js**, **MySQL**, TrackMate features a polished **glassmorphism UI**, smooth UX, and powerful data visualizations to help users make better financial decisions.

---

## 🌐 Live Demo  
**🔗 [TrackMate – Smart Expense Tracker](https://trackmate-smart-expense-tracker.netlify.app)**

---

## 📸 Screenshots & Features

---

### ✅ Signup Page  
> Create a new account using a modern and responsive form.

![Signup Page](public/assets/screenshots/SignupPage.png)

---

### 🔑 Login Page  
> Securely log in and instantly access your personal expense dashboard.

![Login Page](public/assets/screenshots/LoginPage.png)

---

### 🧭 Dashboard – Control Panel  
> Home hub to access all core features:
- Add Expense  
- Monthly Summary  
- Expense History  
- Insights  
- Set Your Budget 
- Smart Tips  

![Dashboard](public/assets/screenshots/DashBoardPage.png)

---

### ➕ Add Expense Modal  
> Easily log expenses with the following details:
- Name  
- Date  
- Amount  
- Payment Mode (Cash, Card, UPI, Other)  
- Category (Food, Travel, Shopping, etc.)

![Add Expense Modal](public/assets/screenshots/AddExpenseModal.png)

---

### 📆 Monthly Summary  
> Overview of your monthly expenses with instant filtering by month and year.

---

### 📂 Expense History  
> Detailed and interactive history of all logged expenses.
- Filter by date range  
- Edit entries in-place  
- Delete expenses instantly  
- Fully responsive and visually enhanced layout

![Expense History](public/assets/screenshots/ExpenseHistory.png)

---

### 📊 Insights – Visual Analytics

TrackMate provides **actionable insights** using **beautiful Chart visualizations**.

1. **Monthly Summary (Info Cards)**  
   → See total spent, top category, average daily spend, and peak spending month.  
   ![Insights Page](public/assets/screenshots/InsightsPage.png)

2. **Payment Type Distribution (Pie Chart)**  
   → Analyze which payment modes (Cash, Card, UPI) you use the most.  
   ![Payment Type](public/assets/screenshots/PaymentTypeDistribution.png)

3. **Monthly Spending Trend (Line Chart)**  
   → Visualize how your expenses fluctuate across the year.  
   ![Monthly Trend](public/assets/screenshots/MonthlyTrendOverview.png)

4. **Category-wise Spending (Donut Chart)**  
   → Understand your spending patterns by category.  
   ![Category Breakdown](public/assets/screenshots/CategoryBreakdown.png)

5. **Top 5 Expenses**  
   → See your highest individual expenses for the selected month.  
   ![Top Expenses](public/assets/screenshots/TopExpenses.png)

---

### 🧮 Set Your Budget 
> Set monthly spending limits.  
You can:
- Add budgets for specific months  
- Edit existing entries  
- Delete budgets anytime  

![Set Your Budget](public/assets/screenshots/SetYourBudget.png)

---

### 💡 Smart Tips  
> A collection of helpful financial advice, quotes, and spending hacks to keep you motivated and informed.

![Smart Tips](public/assets/screenshots/SmartTips.png)

---

## ⚙️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/trackmate-expense-tracker
cd trackmate-expense-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the Database
Import the SQL schema:
```bash
# In MySQL
SOURCE db/schema.sql;
```

Create a `.env` file in the root directory with your credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_db_name
DB_PORT=3306
JWT_SECRET=your_secret_key
```

### 4. Start the Server
```bash
node backend/server.js
```

### 5. Open in Browser
```bash
http://localhost:3000
```
---

## 👤 Author

Developed by [Rishu Raj]  

---
