document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");
  window.togglePasswordVisibility = function (inputId, iconElement) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  iconElement.innerHTML = isPassword
    ? '<i class="fa-solid fa-eye-slash"></i>'
    : '<i class="fa-solid fa-eye"></i>';
};

  // ----------------- SIGNUP FORM -----------------
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !email || !password) {
        message.textContent = "Please fill in all fields.";
        message.style.color = "red";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        message.textContent = data.message;

        if (data.success) {
          message.style.color = "lightgreen";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          message.style.color = "red";
        }
      } catch (err) {
        console.error("Signup error:", err);
        message.textContent = "Server error occurred.";
        message.style.color = "red";
      }
    });
  }

  // ----------------- LOGIN FORM -----------------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        message.textContent = "Please enter both email and password.";
        message.style.color = "red";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        message.textContent = data.message;

        if (data.success) {
          localStorage.setItem("userId", data.userId); 
          message.style.color = "lightgreen";
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        } else {
          message.style.color = "red";
        }
      } catch (err) {
        console.error("Login error:", err);
        message.textContent = "Server error.";
        message.style.color = "red";
      }
    });
  }
});
