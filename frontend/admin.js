const token = localStorage.getItem("token");
if (!token) location.href = "/login.html";

const payload = JSON.parse(atob(token.split(".")[1]));
if (payload.role !== "admin") location.href = "/index.html";

const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const categorySelect = form.categoryId;

async function fetchCategories() {
  // const res = await fetch("http://localhost:3147/api/categories", {
  // const res = await fetch("http://localhost:40000/api/categories", {
  const res = await fetch(
    "https://e-commerce-api-001.onrender.com/api/categories",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const cats = await res.json();
  categorySelect.innerHTML = cats.categories
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");
}

async function fetchProducts() {
  // const res = await fetch("http://localhost:3147/api/products", {
  // const res = await fetch("http://localhost:40000/api/products", {
  const res = await fetch(
    "https://e-commerce-api-001.onrender.com/api/products",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const products = await res.json();
  productList.innerHTML = "";

  products.products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "p-4 bg-white rounded shadow";
    div.innerHTML = `
      <h2 class="text-lg font-semibold">${p.title}</h2>
      <p>${p.description}</p>
      <p class="font-bold my-2">$${p.price}</p>
      <div class="flex gap-2">
        <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded text-sm">Edit</button>
        <button class="delete-btn bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
      </div>
    `;

    div.querySelector(".edit-btn").onclick = () => {
      form.id.value = p.id;
      form.title.value = p.title;
      form.description.value = p.description;
      form.price.value = p.price;
      form.categoryId.value = p.categoryId;
    };

    div.querySelector(".delete-btn").onclick = async () => {
      if (confirm("Delete this product?")) {
        // await fetch(`http://localhost:3147/api/products/${p.id}`, {
        // await fetch(`http://localhost:40000/api/products/${p.id}`, {
        await fetch(
          `https://e-commerce-api-001.onrender.com/api/products/${p.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchProducts();
      }
    };

    productList.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = {
    title: form.title.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
    categoryId: parseInt(form.categoryId.value),
  };

  const id = form.id.value;
  const method = id ? "PATCH" : "POST";
  const url = id
    ? // ? `http://localhost:3147/api/products/${id}`
      // : "http://localhost:3147/api/products";
      //   `http://localhost:40000/api/products/${id}`
      // : "http://localhost:40000/api/products";
      `https://e-commerce-api-001.onrender.com/api/products/${id}`
    : "https://e-commerce-api-001.onrender.com/api/products";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  form.reset();
  fetchProducts();
});

fetchCategories();
fetchProducts();
