
const cart = [];

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const money = (amount) =>
  amount.toLocaleString("ms-MY", {
    style: "currency",
    currency: "MYR"
  });

function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = money(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Troli anda masih kosong.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div>
        <h3>${item.name}</h3>
        <p>Saiz: ${item.size} · ${money(item.price)} seunit</p>
        <div class="cart-actions">
          <button data-action="minus" data-index="${index}"
            aria-label="Kurangkan kuantiti">−</button>
          <span>${item.quantity}</span>
          <button data-action="plus" data-index="${index}"
            aria-label="Tambah kuantiti">+</button>
          <button class="remove-item" data-action="remove"
            data-index="${index}">Buang</button>
        </div>
      </div>
      <strong>${money(item.price * item.quantity)}</strong>
    </div>
  `).join("");
}

document.querySelectorAll(".btn-add").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const size = document.getElementById(
      button.dataset.size
    ).value;

    const existingItem = cart.find(item =>
      item.name === name && item.size === size
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name,
        price,
        size,
        quantity: 1
      });
    }

    updateCart();

    button.textContent = "DITAMBAH ✓";
    setTimeout(() => {
      button.textContent = "TAMBAH KE TROLI +";
    }, 1000);
  });
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (!cart[index]) return;

  if (action === "plus") {
    cart[index].quantity++;
  } else if (action === "minus") {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (action === "remove") {
    cart.splice(index, 1);
  }

  updateCart();
});

document.getElementById("checkout")
  .addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Sila tambah produk ke troli dahulu.");
      return;
    }

    // GANTIKAN dengan nombor WhatsApp kedai anda.
    // Format: kod negara + nombor, tanpa simbol + atau sengkang.
    const phone = "601110280343";

    const orderLines = cart.map((item, index) =>
      `${index + 1}. ${item.name}\n` +
      `   Saiz: ${item.size}\n` +
      `   Kuantiti: ${item.quantity}\n` +
      `   Harga: ${money(item.price * item.quantity)}`
    );

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const message =
      "HELLO! Saya ingin membuat pesanan:\n\n" +
      orderLines.join("\n\n") +
      "\n\nJumlah: " + money(total) +
      "\n\nMohon sahkan stok dan kos penghantaran. Terima kasih!";

    const whatsappURL =
      "https://wa.me/" + phone +
      "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });

updateCart();
