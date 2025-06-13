//console.log("js loaded");
const db = new Dexie('shoppingApp');
db.version(1).stores({
  items: '++id,name,quantity,price'
});

document.addEventListener("DOMContentLoaded", async () => {
  const itemForm = document.getElementById("ItemForm");
  const itemsDiv = document.getElementById("itemsDiv");
  const nameInput = document.getElementById("nameinput");
  const quantityInput = document.getElementById("quantityinput");
  const priceInput = document.getElementById("priceinput");
  const totalPriceDiv = document.getElementById("totalpriceDiv");

  let items = [];

  // Update the total price with KSh and commas
  function updateTotal() {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceDiv.textContent = `Total: KSh ${total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  }

  // Render the items list
  function renderItems() {
    const oldItems = itemsDiv.querySelectorAll(".item");
    oldItems.forEach(item => item.remove());

    items.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "item";

      // Checkbox
      const checkboxLabel = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox";
      checkbox.checked = true;
      checkboxLabel.appendChild(checkbox);

      // Item info
      const itemInfo = document.createElement("div");
      itemInfo.className = "iteminfo";
      itemInfo.innerHTML = `
        <p>${item.name}</p>
        <p>KSh ${item.price.toLocaleString('en-KE', { minimumFractionDigits: 2 })} × ${item.quantity}</p>
      `;

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "deleteButton";
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", async () => {
        await db.items.delete(item.id);
        items = items.filter(i => i.id !== item.id);
        renderItems();
        updateTotal();
      });

      itemEl.appendChild(checkboxLabel);
      itemEl.appendChild(itemInfo);
      itemEl.appendChild(deleteButton);
      itemsDiv.insertBefore(itemEl, totalPriceDiv);
    });

    updateTotal();
  }

  // Load items from IndexedDB
  async function loadItems() {
    items = await db.items.toArray();
    renderItems();
  }

  // Handle form submit
  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);

    if (!name || isNaN(quantity) || isNaN(price) || quantity <= 0 || price < 0) {
      alert("Please enter valid item details.");
      return;
    }

    // Add to DB
    const id = await db.items.add({ name, quantity, price });

    // Add to local list 
    items.push({ id, name, quantity, price });
    renderItems();

    // Reset form
    nameInput.value = "";
    quantityInput.value = 1;
    priceInput.value = "0.00";
  });

  // Load from DB on page load
  await loadItems();
});



