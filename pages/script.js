// Aguarda o conteúdo da página ser totalmente carregado para garantir que todos os elementos existam
document.addEventListener('DOMContentLoaded', () => {

    console.log("Script carregado. Procurando elementos...");

    // --- LÓGICA DO CHATBOT ---
    const chatbotOverlay = document.getElementById('chatbotOverlay');
    const openChatbotBtn = document.getElementById('openChatbotBtn');
    const closeChatbotBtn = document.getElementById('chatbotCloseBtn');

    // Verifica se os elementos do chatbot existem antes de adicionar os eventos
    if (chatbotOverlay && openChatbotBtn && closeChatbotBtn) {
        console.log("Elementos do Chatbot encontrados. Adicionando eventos.");

        openChatbotBtn.addEventListener('click', () => {
            chatbotOverlay.classList.add('active');
        });

        closeChatbotBtn.addEventListener('click', () => {
            chatbotOverlay.classList.remove('active');
        });

        chatbotOverlay.addEventListener('click', (event) => {
            if (event.target === chatbotOverlay) {
                chatbotOverlay.classList.remove('active');
            }
        });
    } else {
        console.warn("AVISO: Elementos do chatbot não foram encontrados nesta página.");
    }


    // --- LÓGICA DO CARRINHO LATERAL ---
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');

    if (cartOverlay && openCartBtn && closeCartBtn) {
        console.log("Elementos do Carrinho encontrados. Adicionando eventos.");
        
        const openCart = () => cartOverlay.classList.add('active');
        const closeCart = () => cartOverlay.classList.remove('active');
        
        openCartBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', (event) => {
            if (event.target === cartOverlay) closeCart();
        });
    } else {
        console.warn("AVISO: Elementos do carrinho não foram encontrados nesta página.");
    }


    // --- LÓGICA DO MODAL DE ENDEREÇO ---
    const addressModalOverlay = document.getElementById('addressModalOverlay');
    const closeAddressModalBtn = document.getElementById('closeAddressModalBtn');
    const openAddressBtn = document.querySelector('.change-location');

    if (addressModalOverlay && closeAddressModalBtn && openAddressBtn) {
        console.log("Elementos do Modal de Endereço encontrados. Adicionando eventos.");

        const openAddressModal = () => addressModalOverlay.classList.add('active');
        const closeAddressModal = () => addressModalOverlay.classList.remove('active');

        openAddressBtn.addEventListener('click', openAddressModal);
        closeAddressModalBtn.addEventListener('click', closeAddressModal);
        addressModalOverlay.addEventListener('click', (event) => {
            if (event.target === addressModalOverlay) closeAddressModal();
        });
    } else {
        console.warn("AVISO: Elementos do modal de endereço não foram encontrados nesta página.");
    }


    // --- LÓGICA DOS SELETORES DE QUANTIDADE ---
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    if (quantitySelectors.length > 0) {
        console.log(`Encontrados ${quantitySelectors.length} seletores de quantidade.`);
        quantitySelectors.forEach(selector => {
            const minusBtn = selector.querySelector('.minus');
            const plusBtn = selector.querySelector('.plus');
            const input = selector.querySelector('.quantity-input');

            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', () => {
                    let currentValue = parseInt(input.value);
                    if (currentValue > 1) {
                        input.value = currentValue - 1;
                    }
                });
                plusBtn.addEventListener('click', () => {
                    let currentValue = parseInt(input.value);
                    input.value = currentValue + 1;
                });
            }
        });
    }

});

// Botão Voltar ao Topo
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 5 ? "inline" : "none";
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// MOSTRAR SENHA
function togglePasswordVisibility() { 
  var passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

function togglePasswordVisibilityConfirm() {
  var passwordConfirmInput = document.getElementById("password-confirm");
  if (passwordConfirmInput.type === "password") {
    passwordConfirmInput.type = "text";
  } else {
    passwordConfirmInput.type = "password";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const enableDarkTheme = document.getElementById("themeToggle");

  const set = (mode) => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  };

  // troca o tema ao marcar/desmarcar
  enableDarkTheme?.addEventListener("change", (enable) => {
    set(enable.target.checked ? "dark" : "light");
  });

  // aplica o tema salvo e sincroniza o checkbox
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    set(savedTheme);
    if (enableDarkTheme) enableDarkTheme.checked = (savedTheme === "dark");
  }
});

