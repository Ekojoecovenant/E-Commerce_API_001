document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  // const res = await fetch("http://localhost:3147/api/auth/login", {
  // const res = await fetch("http://localhost:40000/api/auth/login", {
  const res = await fetch(
    "https://e-commerce-api-001.onrender.com/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "/index.html";
  } else {
    document.getElementById("login-msg").textContent =
      data.message || "Login failed";
  }
});
