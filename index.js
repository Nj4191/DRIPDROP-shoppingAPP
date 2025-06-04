const db = dexie ('shoppingApp')
db.version(1).stores({
    items: '++id,name,Quantity,price'
});

const ItemForm = document.getElementById('ItemsForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalpriceDiv = document.getElementById('totalpricediv');

 ItemForm.onsubmit = async (e) => {
    e.preventDefault() }
