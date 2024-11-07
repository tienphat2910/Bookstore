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

// Cập nhật hàm filterProducts
function filterProducts() {
    const category = getUrlParameter('category');
    
    // Nếu không có category, trả về tất cả sách
    if (!category) {
        return window.books || [];
    }

    // Lấy danh sách categories cần lọc từ mapping
    const categoriesToFilter = categoryMapping[category] || [category];

    console.log('Filtering by categories:', categoriesToFilter); // Debug log

    // Lọc sách theo categories
    const filteredBooks = window.books.filter(book => 
        book.category.some(bookCategory => 
            categoriesToFilter.includes(bookCategory)
        )
    );

    console.log('Filtered books:', filteredBooks); // Debug log
    return filteredBooks;
}

// Hàm lấy parameter từ URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Hàm hiển thị sản phẩm
function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    const filteredProducts = filterProducts();
    
    // Cập nhật số lượng sản phẩm
    document.getElementById('total-products').textContent = 
        `Hiển thị ${filteredProducts.length} sản phẩm`;

    // Xóa nội dung cũ
    productsContainer.innerHTML = '';

    // Hiển thị sản phẩm
    filteredProducts.forEach(book => {
        const productHTML = `
            <div class="col-md-4 mb-4">
                <div class="card product-card">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.author}</p>
                        <p class="card-text"><strong>${book.price}</strong></p>
                        <button class="btn btn-primary add-to-cart" 
                            data-product-id="${book.title}">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });

    // Thêm sự kiện click cho các nút "Thêm vào giỏ hàng"
    addCartButtonEvents();
}

// Hàm thêm sự kiện cho nút thêm vào giỏ hàng
function addCartButtonEvents() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productId = e.target.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Hàm sắp xếp sản phẩm
function sortProducts(sortType) {
    const productsContainer = document.getElementById('products-container');
    let products = filterProducts();

    switch(sortType) {
        case 'price-asc':
            products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-desc':
            products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'name-asc':
            products.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            products.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    // Xóa và hiển thị lại sản phẩm
    productsContainer.innerHTML = '';
    products.forEach(book => {
        const productHTML = `
            <div class="col-md-4 mb-4">
                <div class="card product-card">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.author}</p>
                        <p class="card-text"><strong>${book.price}</strong></p>
                        <button class="btn btn-primary add-to-cart" 
                            data-product-id="${book.title}">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });

    addCartButtonEvents();
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị sản phẩm
    displayProducts();

    // Thêm sự kiện cho dropdown sắp xếp
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    // Cập nhật tiêu đề category
    const category = getUrlParameter('category');
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle && category) {
        const titleMapping = {
            'van-hoc': 'Văn Học',
            'kinh-te': 'Kinh Tế',
            'tam-ly': 'Tâm Lý - Kỹ Năng Sống',
            'thieu-nhi': 'Sách Thiếu Nhi',
            'foreign-children': 'Children Books',
            'foreign-classic': 'Classic Books',
            'foreign-bestseller': 'Best Sellers'
        };
        categoryTitle.textContent = titleMapping[category] || 'Tất cả sản phẩm';
    }
});