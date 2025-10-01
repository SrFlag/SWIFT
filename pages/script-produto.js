document.addEventListener("DOMContentLoaded", () => {
  // Trocar 'active' nas opções de filtro (por grupo)
  document.querySelectorAll(".pagination").forEach((wheel) => {
    wheel.addEventListener("click", (clickEvent) => {
      const eventColor = clickEvent.target.closest(".page-number");
      if (!eventColor) return;
      clickEvent.preventDefault();

      // se clicar de novo na mesma opção, opcionalmente desmarca:
      const alreadyActive = eventColor.classList.contains("active");

      // remove 'active' apenas dentro deste grupo
      wheel
        .querySelectorAll(".page-number.active")
        .forEach((pageNumber) => pageNumber.classList.remove("active"));

      if (!alreadyActive) {
        eventColor.classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Trocar 'active' nas opções de filtro (por grupo)
  document.querySelectorAll(".filter-options").forEach((group) => {
    group.addEventListener("click", (e) => {
      const el = e.target.closest(".filter-option");
      if (!el) return;
      e.preventDefault();

      // se clicar de novo na mesma opção, opcionalmente desmarca:
      const alreadyActive = el.classList.contains("active");

      // remove 'active' apenas dentro deste grupo
      group
        .querySelectorAll(".filter-option.active")
        .forEach((a) => a.classList.remove("active"));

      if (!alreadyActive) {
        el.classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Trocar 'active' nas opções de filtro (por grupo)
  document.querySelectorAll(".filter-options").forEach((group) => {
    group.addEventListener("click", (e) => {
      const el = e.target.closest(".filter-option");
      if (!el) return;
      e.preventDefault();

      const alreadyActive = el.classList.contains("active");

      group
        .querySelectorAll(".filter-option.active")
        .forEach((a) => a.classList.remove("active"));

      if (!alreadyActive) el.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Trocar 'active' nas opções de filtro (por grupo)
  document.querySelectorAll(".filter-options").forEach((group) => {
    group.addEventListener("click", (e) => {
      const el = e.target.closest(".filter-option");
      if (!el) return;
      e.preventDefault();

      const alreadyActive = el.classList.contains("active");

      group
        .querySelectorAll(".filter-option.active")
        .forEach((a) => a.classList.remove("active"));

      if (!alreadyActive) el.classList.add("active");
    });
  });
});

// ---------------- CARRINHO ----------------
document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  let subtotalAmount = 0;
  let totalDiscount = 0;
  let totalAmount = 0;

  // ---------- CONVERSÃO DE TEXTO ----------
  function parsePrice(text) {
    return (
      parseFloat(String(text).trim().replace("R$", "").replace(",", ".")) || 0
    );
  }

  const cartItems = document.getElementById("cartItems");
  const emptyCartMessage = document.querySelector(".empty-cart-message");

  // --------- ADICIONAR ITEM NA LISTA ---------
  function renderCart() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
      cartItems.innerHTML = "";
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      return;
    }
    if (emptyCartMessage) emptyCartMessage.style.display = "none";

    cartItems.innerHTML = cart.map((product, itemIndex) => `
        <div class="ci" data-index="${itemIndex}">
          <span class="ci-name">${product.name}</span>
          <span class="ci-meta">
            ${product.qty} × ${product.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
          </span>
          <button class="ci-remove" aria-label="Remover item">×</button>
        </div>
      `).join("");
  }

  // --------- UPDATE NOS VALORES ---------
  function updateTotals() {
    subtotalAmount = cart.reduce((sum, product) => sum + (product.price || 0) * (product.qty || 0),0);
    totalAmount = subtotalAmount - totalDiscount;

    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl = document.getElementById("cartTotal");
    if (subtotalEl) subtotalEl.innerText = subtotalAmount.toFixed(2);
    if (totalEl) totalEl.innerText = totalAmount.toFixed(2);
  }

  // ABRIR O CARRINHO (ao adicionar)
  function openCart() {
    const openCartButton = document.getElementById("openCartBtn");
    if (openCartButton) {
      openCartButton.click();
    } else {
      (document.getElementById("cartOverlay") || document.querySelector(".side-panel-overlay"))?.classList.add("active");
    }
  }

  // --------- FECHA O CARRINHO ---------
  function CloseCart() {
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCartButton = document.getElementById("closeCartBtn");

    closeCartButton &&
      closeCartButton.addEventListener("click", () => {
        cartOverlay && cartOverlay.classList.remove("active");
      });

    cartOverlay &&
      cartOverlay.addEventListener("click", (eventClose) => {
        if (eventClose.target === cartOverlay)
          cartOverlay.classList.remove("active");
      });
  }

  // --------- ADICIONAR ITEM ---------
  function handleAddToCart(addEvent) {
    const addButton = addEvent.currentTarget;
    const productCard = addButton.closest(".product-card");
    if (!productCard) return;

    // PEGAR AS INFORMAÇÕES DO PRODUTO
    function getProductInfo() {
      const name = productCard
        .querySelector(".product-name, .product-name a")
        .textContent.trim();
      const priceText = productCard
        .querySelector(".product-price")
        .textContent.trim();
      const price = parsePrice(priceText);
      const qty =
        parseInt(
          productCard.querySelector(".quantity-input")?.value || "1",
          10
        ) || 1;
      return { name, price, qty };
    }

    const {
      name: productName,
      price: productPrice,
      qty: productQty,
    } = getProductInfo();

    const productNames = cart.map((product) => product.name);
    if (productNames.includes(productName)) {
      cart[productNames.indexOf(productName)].qty += productQty;
    } else {
      cart.unshift({ name: productName, price: productPrice, qty: productQty });
    }

    updateTotals();
    renderCart();
    openCart();
  }

  // --------- REGISTRAR ITEM NO CARRINHO ---------
  function registerAddToCart() {
    const addToCartButtons = document.getElementsByClassName("add-to-cart-btn");
    for (let i = 0; i < addToCartButtons.length; i++) {
      addToCartButtons[i].addEventListener("click", handleAddToCart);
    }
  }

  // --------- REMOVER ITEM ---------
  function registerItemRemoval() {
    document.addEventListener("click", (removeEvent) => {
      const removeButton = removeEvent.target.closest(".ci-remove");
      if (!removeButton) return;

      const itemRow = removeButton.closest(".ci");
      const itemIndex = itemRow ? parseInt(itemRow.dataset.index, 10) : -1; // bate com data-index
      if (itemIndex < 0) return;

      cart.splice(itemIndex, 1);
      updateTotals();
      renderCart();
    });
  }

  // INICIALIZAÇÃO
  updateTotals();
  renderCart();
  registerAddToCart();
  registerItemRemoval();
  CloseCart();
});
