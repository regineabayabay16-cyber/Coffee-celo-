function changeQty(id, amount){
  let input = document.getElementById(id);
  let value = parseInt(input.value);
  value += amount;
  if(value < 1) value = 1;
  input.value = value;
}

function addToCart(item, price, id){
  let quantity = parseInt(document.getElementById(id).value);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find(p => p.item === item);
  if(existing){
    existing.quantity += quantity;
  } else {
    cart.push({item, price, quantity});
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function displayCart(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartTable = document.getElementById("cart");
  let total = 0;
  cartTable.innerHTML = "";

  cart.forEach(product=>{
    let subtotal = product.price * product.quantity;
    total += subtotal;

    cartTable.innerHTML += `
      <tr>
        <td>${product.item}</td>
        <td>${product.quantity}</td>
        <td>₱${product.price}</td>
        <td>₱${subtotal}</td>
      </tr>
    `;
  });

  document.getElementById("total").innerText = total;
  calculateChange();
}

function toggleCashInput(){
  let method = document.getElementById("paymentMethod").value;
  let cashSection = document.getElementById("cashSection");

  if(method === "Cash"){
    cashSection.style.display = "block";
  } else {
    cashSection.style.display = "none";
  }
}

function calculateChange(){
  let total = parseFloat(document.getElementById("total").innerText);
  let cash = parseFloat(document.getElementById("cashAmount").value) || 0;
  let change = cash - total;
  document.getElementById("changeAmount").innerText = change >= 0 ? change : 0;
}

document.addEventListener("input", function(e){
  if(e.target.id === "cashAmount"){
    calculateChange();
  }
});

function checkout(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0){
    alert("Cart is empty!");
    return;
  }

  let total = document.getElementById("total").innerText;
  let payment = document.getElementById("paymentMethod").value;
  let receiptHTML = "";

  cart.forEach(product=>{
    receiptHTML += `
      <p>${product.item} x${product.quantity} - ₱${product.price * product.quantity}</p>
    `;
  });

  receiptHTML += `<hr>`;
  receiptHTML += `<p><strong>Total: ₱${total}</strong></p>`;
  receiptHTML += `<p>Payment Method: ${payment}</p>`;

  if(payment === "Cash"){
    let cash = document.getElementById("cashAmount").value;
    let change = document.getElementById("changeAmount").innerText;
    receiptHTML += `<p>Cash: ₱${cash}</p>`;
    receiptHTML += `<p>Change: ₱${change}</p>`;
  }

  receiptHTML += `<p>Date: ${new Date().toLocaleString()}</p>`;

  document.getElementById("receiptDetails").innerHTML = receiptHTML;
  document.getElementById("receiptModal").style.display = "block";

  localStorage.removeItem("cart");
  displayCart();
}

function closeReceipt(){
  document.getElementById("receiptModal").style.display = "none";
}
