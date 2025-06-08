document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // const res = await fetch("http://localhost:3147/api/auth/register", {
    const res = await fetch("http://localhost:40000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/index.html";
    } else {
      document.getElementById("register-msg").textContent =
        data.message || "Registration failed";
    }
  });
