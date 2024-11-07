document.addEventListener('DOMContentLoaded', function() {
    console.log('Available books:', window.books); // Kiểm tra data có được load không
    const category = getUrlParameter('category');
    console.log('Selected category:', category); // Kiểm tra category từ URL
    
    updateCategoryTitle(category);
    displayProducts();
});

const categoryMapping = {
    // Sách trong nước
    'van-hoc': ['classics'],
    'kinh-te': ['economics'],
    'tam-ly': ['psychology'],
    'thieu-nhi': ['children'],
    'giao-khoa': ['education'],
    'ngoai-ngu': ['language'],
    
    // Foreign books
    'foreign-children': ['children'],
    'foreign-classic': ['classics'],
    'foreign-bestseller': ['best-seller'],
    
    // ... other mappings ...
};

// Hàm lấy giá trị số từ chuỗi giá (ví dụ: "87.75 $" -> 87.75)
function extractPrice(priceString) {
    return parseFloat(priceString.replace(/[^\d.]/g, ''));
}

// Hàm lọc sản phẩm với nhiều điều kiện
function filterProducts() {
    let filteredBooks = [...window.books]; // Tạo bản sao của mảng books
    
    // 1. Lọc theo category từ URL
    const urlCategory = getUrlParameter('category');
    if (urlCategory && urlCategory !== 'all') {
        const categoriesToFilter = categoryMapping[urlCategory] || [urlCategory];
        filteredBooks = filteredBooks.filter(book => 
            book.category.some(cat => categoriesToFilter.includes(cat))
        );
    }

    // 2. Lọc theo khoảng giá
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    filteredBooks = filteredBooks.filter(book => {
        const price = extractPrice(book.price);
        return price >= minPrice && price <= maxPrice;
    });

    // 3. Lọc theo thể loại được chọn từ checkbox
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter input:checked'))
        .map(input => input.value);
    
    if (selectedCategories.length > 0) {
        filteredBooks = filteredBooks.filter(book =>
            book.category.some(cat => selectedCategories.includes(cat))
        );
    }

    return filteredBooks;
}

// Hàm lấy parameter từ URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Hàm hiển thị sản phẩm
function displayProducts(products = null) {
    const productsToDisplay = products || filterProducts();
    const productsContainer = document.getElementById('products-container');
    
    // Cập nhật số lượng sản phẩm
    document.getElementById('total-products').textContent = 
        `Hiển thị ${productsToDisplay.length} sản phẩm`;

    // Xóa nội dung cũ
    productsContainer.innerHTML = '';

    // Hiển thị sản phẩm
    productsToDisplay.forEach(book => {
        const productHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="book-card">
                    <div class="book-image">
                        <img src="${book.image}" alt="${book.title}">
                        <div class="overlay">
                            <button class="btn btn-primary add-to-cart" data-product-id="${book.title}">
                                Thêm vào giỏ hàng
                            </button>
                            <button class="btn btn-outline-primary view-detail" data-product-id="${book.title}">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                    <div class="book-info">
                        <div>
                            <h5 class="book-title">${book.title}</h5>
                            <p class="book-author">${book.author}</p>
                        </div>
                        <p class="book-price">${book.price}</p>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });

    // Cập nhật active filters
    updateActiveFilters();
}

// Thêm sự kiện cho các nút trong card sách
function addBookEventListeners() {
    // Sự kiện cho nút thêm vào giỏ hàng
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
            e.stopPropagation();
        });
    });

    // Sự kiện cho nút xem chi tiết
    document.querySelectorAll('.view-detail').forEach(button => {
        button.addEventListener('click', function(e) {
            const productId = this.getAttribute('data-product-id');
            window.location.href = `ChiTietSanPham.html?id=${productId}`;
            e.stopPropagation();
        });
    });

    // Sự kiện hover cho card sách
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.overlay').style.opacity = '1';
        });
        card.addEventListener('mouseleave', function() {
            this.querySelector('.overlay').style.opacity = '0';
        });
    });
}

// Hàm sắp xếp sản phẩm
function sortProducts(sortType) {
    let products = filterProducts();

    switch(sortType) {
        case 'price-asc':
            products.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
            break;
        case 'price-desc':
            products.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
            break;
        case 'name-asc':
            products.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            products.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    displayProducts(products);
}

// Khởi tạo trang và thêm các event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị sản phẩm ban đầu
    displayProducts();

    // Thêm event listener cho nút áp dụng giá
    const applyPriceBtn = document.querySelector('.btn-apply-price');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            displayProducts();
        });
    }

    // Thêm event listener cho các checkbox category
    document.querySelectorAll('.category-filter input').forEach(input => {
        input.addEventListener('change', () => {
            displayProducts();
        });
    });

    // Thêm event listener cho dropdown sắp xếp
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    // Thêm event listener cho việc xóa filter
    const activeFilters = document.querySelector('.active-filters');
    if (activeFilters) {
        activeFilters.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove')) {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;

                if (filterType === 'price') {
                    document.getElementById('minPrice').value = '';
                    document.getElementById('maxPrice').value = '';
                } else if (filterType === 'category') {
                    const checkbox = document.querySelector(`.category-filter input[value="${filterValue}"]`);
                    if (checkbox) checkbox.checked = false;
                }

                displayProducts();
            }
        });
    }
});

// Hàm cập nhật hiển thị filters đang active
function updateActiveFilters() {
    const activeFiltersContainer = document.querySelector('.active-filters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';

    // Hiển thị filter giá
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    if (minPrice || maxPrice) {
        const priceFilter = document.createElement('span');
        priceFilter.className = 'filter-badge';
        priceFilter.innerHTML = `
            Giá: ${minPrice || '0'}$ - ${maxPrice || '∞'}$
            <i class="fas fa-times remove" data-filter="price"></i>
        `;
        activeFiltersContainer.appendChild(priceFilter);
    }

    // Hiển thị filter category
    document.querySelectorAll('.category-filter input:checked').forEach(input => {
        const badge = document.createElement('span');
        badge.className = 'filter-badge';
        badge.innerHTML = `
            ${input.nextElementSibling.textContent}
            <i class="fas fa-times remove" data-filter="category" data-value="${input.value}"></i>
        `;
        activeFiltersContainer.appendChild(badge);
    });
}