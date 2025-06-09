//console.log("js loaded");
const db = new Dexie ('shoppingApp')
db.version(1).stores({
    items: '++id,name,quantity,price'
});
//wait for dom to be ready
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");

  const nameInput = document.getElementById('nameinput');
  const quantityInput = document.getElementById('quantityinput');
  const priceInput = document.getElementById('priceinput');
  const itemsDiv = document.getElementById('itemsDiv');
  const totalpriceDiv = document.getElementById('totalpriceDiv');
  const ItemForm = document.getElementById('ItemForm');

  if (!nameInput || !quantityinput || !priceinput || !itemsDiv || !totalpriceDiv || !ItemForm) {
    console.error("❌ One or more required elements not found in the DOM.");
    return;
  }

  ItemForm.onsubmit = async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const quantity = parseInt(quantityinput.value);
    const price = parseFloat(priceinput.value);

    if (!name || quantity <= 0 || price < 0) {
      alert("Please enter valid item details.");
      return;
    }

    await db.items.add({ name, quantity, price });
    displayItems();
    ItemForm.reset();
  };
    // Display items on initial load
  async function displayItems() {
    const allItems = await db.items.toArray();
    itemsDiv.innerHTML = '';
    let total = 0;

    allItems.forEach(item => {
      total += item.quantity * item.price;
      const div = document.createElement('div');
      div.textContent = `${item.name} - ${item.quantity} x $${item.price}`;
      itemsDiv.appendChild(div);
    });

    
totalpriceDiv.textContent = `Total: $${total.toFixed(2)}`;
  }

  displayItems();// Initial call to display items
});


