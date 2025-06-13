// Product catalog (predefined)
const products = [
  { id: 1, name: "T-Shirt", price: 10.0 },
  { id: 2, name: "Jeans", price: 25.0 },
  { id: 3, name: "Sneakers", price: 40.0 },
  { id: 4, name: "Hat", price: 8.0 }
];

const catalogDiv = document.getElementById("catalog");

// Initialize Dexie
const db = new Dexie("ShoppingAppDB");
db.version(1).stores({
  items: "++id, name, quantity, price"
});

// Render catalog
products.forEach(product => {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  itemDiv.innerHTML = `
    <div class="iteminfo">
      <p>${product.name}</p>
      <p>$${product.price.toFixed(2)}</p>
    </div>
    <div>
      <input type="number" min="1" value="1" id="qty-${product.id}" style="width: 50px;" />
      <button>Add</button>
    </div>
  `;

  const button = itemDiv.querySelector("button");
  button.addEventListener("click", async () => {
    const qty = parseInt(document.getElementById(`qty-${product.id}`).value);
    if (qty > 0) {
      await db.items.add({
        name: product.name,
        quantity: qty,
        price: product.price
      });
      alert(`${product.name} added to list`);
    }
  });

  catalogDiv.appendChild(itemDiv);
  const products = [
  {
    id: 1,
    name: "Smartphone",
    price: 250.00,
    image: "images/smartphone.jpg"
  },
  {
    id: 2,
    name: "Laptop",
    price: 750.00,
    image: "images/laptop.jpg"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 45.00,
    image: "images/speaker.jpg"
  },
  {
    id: 4,
    name: "Smartwatch",
    price: 120.00,
    image: "images/smartwatch.jpg"
  }
];

// Set up Dexie DB
const db = new Dexie("ShoppingAppDB");
db.version(1).stores({
  items: "++id, name, quantity, price"
});

const catalogDiv = document.getElementById("catalog");

products.forEach(product => {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  itemDiv.innerHTML = `
    <div class="iteminfo">
      <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;"/>
      <p><strong>${product.name}</strong></p>
      <p>$${product.price.toFixed(2)}</p>
    </div>
    <div style="text-align:center">
      <input type="number" min="1" value="1" id="qty-${product.id}" style="width: 50px;" />
      <button class="additem">Add</button>
    </div>
  `;

  itemDiv.querySelector("button").addEventListener("click", async () => {
    const qty = parseInt(document.getElementById(`qty-${product.id}`).value);
    if (qty > 0) {
      await db.items.add({
        name: product.name,
        quantity: qty,
        price: product.price
      });
      alert(`${product.name} added to shopping list!`);
    }
  });

  catalogDiv.appendChild(itemDiv);
});
});
