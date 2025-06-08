const token = localStorage.getItem("token");

// 🔐 Protect route
if (!token) {
  window.location.href = "/login.html";
}

const userInfoEl = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");

// 🧾 Decode JWT token to get user email (simplified, no JWT lib needed)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const payload = parseJwt(token);
if (payload) {
  userInfoEl.textContent = `Logged in as: ${payload.email}`;
} else {
  userInfoEl.textContent = "";
}

// 🔓 Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

// 📦 Fetch and show products
// fetch("http://localhost:3147/api/products", {
fetch("http://localhost:40000/api/products", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById("product-list");
    products.products.forEach((p) => {
      const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({ ...product, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart!");
      };

      const card = document.createElement("div");
      card.className = "border p-4 rounded-xl shadow bg-white";
      card.innerHTML = `
        <h2 class="font-semibold text-lg">${p.title}</h2>
        <p>${p.description}</p>
        <p class="font-bold mt-2">$${p.price}</p>
        <button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm add-cart-btn">
          Add to Cart
        </button>
      `;

      card
        .querySelector(".add-cart-btn")
        .addEventListener("click", () => addToCart(p));

      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Error loading products:", err);
  });

if (payload?.role === "admin") {
  const adminBtn = document.createElement("a");
  adminBtn.href = "/admin.html";
  adminBtn.textContent = "Admin Panel";
  adminBtn.className = "bg-indigo-600 text-white px-3 py-1 rounded text-sm";
  document.querySelector(".flex.items-center.gap-4").appendChild(adminBtn);
}
