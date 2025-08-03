const db = require("../service/dbService");

// ---------------- SIGNUP ----------------
exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );

    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = users[0];

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    res.status(200).json({ success: true, message: "Login successful", userId: user.id });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
