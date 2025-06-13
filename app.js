// console.log("js loaded"); // You can uncomment this for initial debugging

const db = new Dexie('ShoppingApp'); // Corrected app name for consistency

db.version(1).stores({
    items: '++id,name,quantity,price'
});

// Await for DOM to be ready
window.addEventListener('DOMContentLoaded', async () => { // Made this async
    console.log("DOM fully loaded");

    // Corrected IDs to match the HTML (lowercase 'i' for quantityInput, priceInput, itemForm)
    const nameInput = document.getElementById('nameInput');
    const quantityInput = document.getElementById('quantityInput'); // Corrected JS ID to match HTML
    const priceInput = document.getElementById('priceInput');     // Corrected JS ID to match HTML
    const itemsDiv = document.getElementById('itemsDiv');
    const totalpriceDiv = document.getElementById('totalpriceDiv');
    const itemForm = document.getElementById('itemForm');         // Corrected JS ID to match HTML

    // Robust error check for all elements
    if (!nameInput || !quantityInput || !priceInput || !itemsDiv || !totalpriceDiv || !itemForm) {
        console.error("❌ One or more required elements not found in the DOM. Please check your HTML IDs carefully.");
        // Consider adding a visible message to the user here as well
        return;
    }

    // --- NEW LOGIC: Populate default items if DB is empty ---
    try {
        const count = await db.items.count();
        if (count === 0) {
            console.log("Database is empty, adding default item: Trousers");
            await db.items.add({ name: "Trousers", quantity: 3, price: 6.00 });
            // Add other default items here if needed:
            // await db.items.add({ name: "Shirt", quantity: 2, price: 15.00 });
        }
    } catch (error) {
        console.error("Error checking or populating database:", error);
    }
    // --- END NEW LOGIC ---

    // Initial display of items when the page loads
    await displayItems(); // Call displayItems after elements are confirmed to exist and defaults are added

    itemForm.onsubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const name = nameInput.value.trim(); // Trim whitespace
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(priceInput.value);

        // More robust validation
        if (!name) {
            alert('Please enter an item name.');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity (a number greater than 0).');
            return;
        }
        if (isNaN(price) || price < 0) { // Price can be 0 (e.g., free item)
            alert('Please enter a valid price (a number, 0 or greater).');
            return;
        }

        try {
            await db.items.add({ name, quantity, price });
            console.log('Item added successfully!');
            itemForm.reset(); // Clear the form fields
            await displayItems(); // Update the displayed list after adding
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item. Please check the console for details.');
        }
    };

    // Function to display items from IndexedDB and handle deletions
    async function displayItems() {
        itemsDiv.innerHTML = ''; // Clear previous items (including initial placeholders)

        let total = 0;
        const allItems = await db.items.toArray();

        // Dynamically add the visual structure for items
        allItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item-entry'); // Add a class for styling if needed
            // Recreating the look from your screenshot: checkbox, iteminfo, delete button
            itemElement.innerHTML = `
                <label>
                    <input type="checkbox" class="checkbox" ${item.completed ? 'checked' : ''}>
                </label>
                <div class="iteminfo">
                    <p>${item.name}</p>
                    <p>$${item.price.toFixed(2)} * ${item.quantity}</p>
                </div>
                <button class="delete-item-btn" data-id="${item.id}">X</button>
            `;
            itemsDiv.appendChild(itemElement);

            total += item.quantity * item.price;
        });

        // Display "No items..." if the list is empty *after* processing items
        if (allItems.length === 0) {
             itemsDiv.innerHTML = '<p>No items in the list yet.</p>';
        }

        totalpriceDiv.textContent = `Totalprice : $${total.toFixed(2)}`; // Updated format to match screenshot

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-item-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const itemId = parseInt(event.target.dataset.id); // Get item ID from data-id attribute
                if (!isNaN(itemId)) {
                    try {
                        await db.items.delete(itemId); // Delete item from Dexie
                        console.log(`Item with ID ${itemId} deleted.`);
                        await displayItems(); // Refresh the list after deletion
                    } catch (error) {
                        console.error('Error deleting item:', error);
                        alert('Failed to delete item. Please check the console for details.');
                    }
                }
            });
        });

        // Optional: Add event listener for checkbox if you want to track completion
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (event) => {
                const itemDiv = event.target.closest('.item-entry');
                const itemId = parseInt(itemDiv.querySelector('.delete-item-btn').dataset.id);
                const item = await db.items.get(itemId);
                if (item) {
                    await db.items.update(itemId, { completed: event.target.checked });
                    console.log(`Item ${itemId} completion status updated.`);
                    // Optionally re-display if you want visual changes based on completion
                    // await displayItems();
                }
            });
        });
    }

    // The initial call is now correctly inside the DOMContentLoaded listener
    // and after all elements have been found and listeners set up.
}); 