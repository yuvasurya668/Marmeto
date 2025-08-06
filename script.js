document.addEventListener('DOMContentLoaded', () => {
    // Sample product data
    const products = [
        { id: 1, name: 'Tie-Dye Lounge Set', price: 150.00, image: 'P1.jpg' },
        { id: 2, name: 'Sunburst Tracksuit', price: 150.00, image: 'P2.jpg' },
        { id: 3, name: 'Retro Red Streetwear', price: 150.00, image: 'P3.jpg' },
        { id: 4, name: 'Urban Sportswear Combo', price: 150.00, image: 'P4.jpg' },
        { id: 5, name: 'Oversized Knit & Coat', price: 150.00, image: 'P5.jpg' },
        { id: 6, name: 'Chic Monochrome Blazer', price: 150.00, image: 'P6.jpg' }
    ];

    const productGrid = document.querySelector('.product-grid');
    const selectedProductsContainer = document.querySelector('.selected-products');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const discountAmountElement = document.querySelector('.discount-amount');
    const subtotalAmountElement = document.querySelector('.subtotal-amount');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    // selectedItems now stores objects with a product and a quantity
    let selectedItems = [];
    const minItemsForDiscount = 3;
    const discountPercentage = 0.30; // 30% off

    // Function to render product cards
    const renderProducts = () => {
        productGrid.innerHTML = ''; // Clear the grid before rendering
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-bundle-btn" data-id="${product.id}">Add to Bundle</button>
            `;
            productGrid.appendChild(productCard);
        });
    };

    
    const updateSidebar = () => {
        selectedProductsContainer.innerHTML = '';
        let total = 0;
        let totalItemsCount = 0;

        if (selectedItems.length === 0) {
            selectedProductsContainer.innerHTML = '<p>Your bundle is empty.</p>';
        } else {
            selectedItems.forEach(item => {
                total += item.product.price * item.quantity;
                totalItemsCount += item.quantity;

                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div>
                        <h4>${item.product.name}</h4>
                        <p>$${(item.product.price * item.quantity).toFixed(2)} (${item.quantity} x $${item.product.price.toFixed(2)})</p>
                    </div>
                    <div class="item-actions">
                        <button class="decrease-qty-btn" data-id="${item.product.id}">-</button>
                        <button class="increase-qty-btn" data-id="${item.product.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.product.id}">&times;</button>
                `;
                selectedProductsContainer.appendChild(productItem);
            });
        }

        const progress = (totalItemsCount / minItemsForDiscount) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        progressText.textContent = `${totalItemsCount}/${minItemsForDiscount} items added`;

        let discount = 0;
        if (totalItemsCount >= minItemsForDiscount) {
            discount = total * discountPercentage;
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Add Bundle to Cart';
        } else {
            addToCartBtn.disabled = true;
            const remainingItems = minItemsForDiscount - totalItemsCount;
            addToCartBtn.textContent = `Add ${remainingItems} more item${remainingItems !== 1 ? 's' : ''} to Proceed`;
        }

        const subtotal = total - discount;
        discountAmountElement.textContent = `-$${discount.toFixed(2)}`;
        subtotalAmountElement.textContent = `$${subtotal.toFixed(2)}`;
    };

    // Event listener for adding products from the main grid
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-bundle-btn')) {
            const productId = parseInt(e.target.dataset.id);
            const productToAdd = products.find(p => p.id === productId);

            const existingItem = selectedItems.find(item => item.product.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                selectedItems.push({ product: productToAdd, quantity: 1 });
            }
            updateSidebar();
        }
    });

    // Event listener for managing quantities and removing items from the sidebar
    selectedProductsContainer.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        const existingItem = selectedItems.find(item => item.product.id === productId);

        if (!existingItem) return;

        if (e.target.classList.contains('increase-qty-btn')) {
            existingItem.quantity += 1;
        } else if (e.target.classList.contains('decrease-qty-btn')) {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                selectedItems = selectedItems.filter(item => item.product.id !== productId);
            }
        } else if (e.target.classList.contains('remove-item-btn')) {
            selectedItems = selectedItems.filter(item => item.product.id !== productId);
        }
        updateSidebar();
    });

    // Event listener for "Add Bundle to Cart" button
    addToCartBtn.addEventListener('click', () => {
        if (selectedItems.length > 0) {
            console.log('Bundle Added to Cart:', selectedItems);
            alert('Bundle added to cart! Check the console for details.');
        }
    });

    // Initial render
    renderProducts();
    updateSidebar();
});