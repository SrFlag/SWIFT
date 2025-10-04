document.addEventListener('DOMContentLoaded', () => {

    const App = {
        async init() {
            console.log("APP: Iniciando aplicação...");
            await this.loadComponents();

            console.log("APP: Componentes carregados. Inicializando módulos...");
            UI.init();
            Cart.init();
            ProductListing.init();
            Theme.init();
            console.log("APP: Todos os módulos inicializados com sucesso.");
        },

        async loadComponent(elementId, filePath) {
            const element = document.getElementById(elementId);
            if (!element) return;

            console.log(`COMPONENT LOADER: Tentando carregar '${filePath}' em #${elementId}`);
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }
                element.innerHTML = await response.text();
                console.log(`✅ SUCESSO: Componente '${filePath}' carregado em #${elementId}.`);
            } catch (error) {
                console.error(`❌ ERRO: Falha ao carregar o componente '${filePath}'. Verifique o caminho e se o arquivo existe.`, error);
                element.innerHTML = `<p style="color:red; text-align:center; font-weight:bold;">Falha ao carregar componente: ${filePath}</p>`;
            }
        },

        async loadComponents() {
            await Promise.all([
                this.loadComponent('header-placeholder', '_header.html'),
                this.loadComponent('footer-placeholder', '_footer.html'),
                this.loadComponent('modals-placeholder', '_modals.html')
            ]);
        }
    };

    /*
     * Módulo de Interface do Usuário (UI).
     */
    const UI = {
        init() {
            this.setupAllModals();
            this.setupBackToTop();
            this.setupPasswordToggle();
            this.setupQuantitySelectors();
        },

        setupModal(overlayId, openTrigger, closeTrigger) {
            document.body.addEventListener('click', (event) => {
                const overlay = document.getElementById(overlayId);
                if (!overlay) return;

                const openBtn = event.target.closest(openTrigger);
                const closeBtn = event.target.closest(closeTrigger);

                if (openBtn) {
                    event.preventDefault();
                    overlay.classList.add('active');
                }
                if (closeBtn) {
                    event.preventDefault();
                    overlay.classList.remove('active');
                }
            });
            
            // Lógica para fechar ao clicar no fundo do overlay
            document.body.addEventListener('click', (event) => {
                const overlay = document.getElementById(overlayId);
                if (event.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        },
        
        setupAllModals() {
            this.setupModal('cartOverlay', '#openCartBtn', '#closeCartBtn');
            this.setupModal('chatbotOverlay', '#openChatbotBtn', '#chatbotCloseBtn');
            this.setupModal('addressModalOverlay', '.change-location', '#closeAddressModalBtn');
        },

        setupBackToTop() {
            document.body.addEventListener('click', (event) => {
                if (event.target.closest('#backToTop')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            window.addEventListener("scroll", () => {
                const backToTopBtn = document.getElementById("backToTop");
                if (backToTopBtn) {
                    backToTopBtn.style.display = window.scrollY > 100 ? "block" : "none";
                }
            });
        },
        
        setupPasswordToggle() {
            document.body.addEventListener('click', (event) => {
                if (!event.target.classList.contains('toggle-password')) return;
                const inputGroup = event.target.closest('.input-group');
                const passwordInput = inputGroup?.querySelector('input[type="password"], input[type="text"]');
                if (passwordInput) {
                    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                }
            });
        },

        setupQuantitySelectors() {
            document.body.addEventListener('click', (event) => {
                const target = event.target;
                if (!target.matches('.quantity-btn')) return;
                const selector = target.closest('.quantity-selector');
                const input = selector?.querySelector('.quantity-input');
                if (!input) return;
                let currentValue = parseInt(input.value, 10);
                if (target.matches('.plus')) {
                    input.value = currentValue + 1;
                } else if (target.matches('.minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });
        }
    };

    /**
     * Módulo do Carrinho de Compras.
     */
    const Cart = {
        items: [],
        elements: {},
        init() {
            this.addEventListeners();
            this.render();
        },
        addEventListeners() {
            document.body.addEventListener('click', (event) => {
                if (event.target.closest('.add-to-cart-btn')) this.addToCart(event);
                if (event.target.closest('.ci-remove')) this.removeFromCart(event);
                if (event.target.closest('.ci-qty-btn')) this.changeQuantity(event);
            });
        },
        addToCart(event) {
            const productContainer = event.target.closest('.product-card, .pdp-layout');
            if (!productContainer) return;
            const name = productContainer.querySelector('h1, .product-name a').textContent.trim();
            const priceText = productContainer.querySelector('.product-price-large, .product-price').textContent;
            const price = parseFloat(priceText.replace('R$', '').replace(',', '.'));
            const qty = parseInt(productContainer.querySelector('.quantity-input').value, 10);
            const existingItem = this.items.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty += qty;
            } else {
                this.items.unshift({ name, price, qty });
            }
            this.render();
            document.getElementById('cartOverlay')?.classList.add('active');
        },
        removeFromCart(event) {
            const index = event.target.closest('.ci').dataset.index;
            this.items.splice(index, 1);
            this.render();
        },
        changeQuantity(event) {
            const index = event.target.closest('.ci').dataset.index;
            const action = event.target.dataset.action;
            if (action === 'increase') {
                this.items[index].qty++;
            } else if (action === 'decrease') {
                this.items[index].qty--;
            }
            if (this.items[index].qty <= 0) {
                this.items.splice(index, 1);
            }
            this.render();
        },
        updateTotals() {
            const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            if (this.elements.subtotal) this.elements.subtotal.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            if (this.elements.total) this.elements.total.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
        render() {
            this.elements.itemsContainer = this.elements.itemsContainer || document.getElementById('cartItemsContainer');
            this.elements.emptyMessage = this.elements.emptyMessage || document.querySelector('.empty-cart-message');
            this.elements.subtotal = this.elements.subtotal || document.getElementById('cartSubtotal');
            this.elements.total = this.elements.total || document.getElementById('cartTotal');

            if (!this.elements.itemsContainer) return;
            if (this.items.length === 0) {
                this.elements.itemsContainer.innerHTML = '';
                if (this.elements.emptyMessage) this.elements.emptyMessage.style.display = 'block';
            } else {
                if (this.elements.emptyMessage) this.elements.emptyMessage.style.display = 'none';
                this.elements.itemsContainer.innerHTML = this.items.map((item, index) => `<div class="ci" data-index="${index}"><div class="ci-details"><div class="ci-name">${item.name}</div><div class="ci-meta">${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div></div><div class="ci-controls"><button class="ci-qty-btn" data-action="decrease">-</button><span class="ci-qty">${item.qty}</span><button class="ci-qty-btn" data-action="increase">+</button></div><button class="ci-remove">X</button></div>`).join('');
            }
            this.updateTotals();
        }
    };

    /**
     * Módulo de Listagem de Produtos (PLP).
     */
    const ProductListing = {
        init() {
            document.body.addEventListener('click', this.handleFilterClick.bind(this));
        },
        handleFilterClick(event) {
            const filterOption = event.target.closest('.filter-option, .page-number');
            if (!filterOption) return;
            event.preventDefault();
            const group = filterOption.closest('.filter-options, .pagination');
            group?.querySelector('.active')?.classList.remove('active');
            filterOption.classList.add('active');
        }
    };

    /**
     * Módulo de Tema.
     */
    const Theme = {
        init() {
            document.body.addEventListener('change', (event) => {
                if (event.target.matches('#themeToggle')) {
                    this.set(event.target.checked ? "dark" : "light");
                }
            });
            const savedTheme = localStorage.getItem("theme") || "light";
            this.set(savedTheme);
        },
        set(mode) {
            document.documentElement.setAttribute("data-theme", mode);
            localStorage.setItem("theme", mode);
            const themeToggle = document.getElementById("themeToggle");
            if (themeToggle) themeToggle.checked = (mode === "dark");
        }
    };

    App.init();
});