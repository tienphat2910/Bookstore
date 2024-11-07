const books = [
    // Best Sellers
    {
        category: ["best-seller"],
        title: "Dune",
        author: "Frank Herbert",
        price: "87.75 $",
        image: "../img/book1.png"
    },
    {
        category: ["best-seller"],
        title: "1984",
        author: "George Orwell",
        price: "35.75 $",
        image: "../img/book2.png"
    },
    {
        category: ["best-seller"],
        title: "Ikigai",
        author: "Hector Garcia",
        price: "36.00 $",
        image: "../img/book3.png"
    },
    {
        category: ["best-seller"],
        title: "Metafizik",
        author: "Aristoteles",
        price: "36.00 $",
        image: "../img/book4.png"
    },
    {
        category: ["best-seller"],
        title: "Romeo ve Juliet",
        author: "William Shakespeare",
        price: "87.75 $",
        image: "../img/book5.png"
    },
    // Classics
    {
        category: ["classics"],
        title: "Olağanüstü Bir Gece",
        author: "Stefan Zweig",
        price: "35.75 $",
        image: "../img/book6.png"
    },
    {
        category: ["classics"],
        title: "Savaş ve Barış",
        author: "Lev Tolstoy",
        price: "36.00 $",
        image: "../img/book7.jpg"
    },
    {
        category: ["classics"],
        title: "Suç ve Ceza",
        author: "Fyodor Dostoyevski",
        price: "36.00 $",
        image: "../img/book8.jpg"
    },
    {
        category: ["classics", "best-seller"],
        title: "Co-Intelligence - Living And Working With AI",
        author: "Ethan Mollick",
        price: "15.00 $",
        image: "../img/book14.png"
    },
    // Children's Books
    {
        category: ["children"],
        title: "Alev Saçlı Çocuk",
        author: "Christine Nöstlinger",
        price: "25.00 $",
        image: "../img/book9.png"
    },
    {
        category: ["children"],
        title: "Mor Bir Fil Gördüm Sanki!",
        author: "Varol Yaşaroğlu",
        price: "15.00 $",
        image: "../img/book10.png"
    },
    {
        category: ["children"],
        title: "Cinderella",
        author: "Disney Classic",
        price: "18.00 $",
        image: "../img/book11.png"
    },
    {
        category: ["children", "best-seller"],
        title: "I Am Superman",
        author: "Teitelbaum, Michael",
        price: "6.00 $",
        image: "../img/book12.png"
    },
    {
        category: ["children", "best-seller"],
        title: "I Am Batman",
        author: "Teitelbaum, Michael",
        price: "6.00 $",
        image: "../img/book13.png"
    },
];

function loadBooks(category) {
    const filteredBooks = books.filter(book => book.category.includes(category));
    const container = document.getElementById(`${category}-books`);

    // Clear existing content
    container.innerHTML = "";

    // Load the first 4 books
    filteredBooks.slice(0, 4).forEach(book => {
        const bookHTML = `
            <div class="col-md-3 mb-4">
              <div class="book">
                <img src="${book.image}" alt="${book.title}" class="picture" />
                <div class="text-9">
                  <div class="name">
                    <span class="${book.title.toLowerCase().replace(/\s+/g, "-")}" style="display: block;">${book.title}</span>
                    <span style="display: block; color: #777">${book.author}</span>
                  </div>
                  <div class="price">
                    <span class="price-a">${book.price}</span>
                  </div>
                </div>
              </div>
            </div>`;
        container.innerHTML += bookHTML;
    });
}

function loadAllBooks(category) {
    const filteredBooks = books.filter(book => book.category.includes(category));
    const container = document.getElementById(`${category}-books`);

    // Clear existing content
    container.innerHTML = "";

    // Load all books
    filteredBooks.forEach(book => {
        const bookHTML = `
            <div class="col-md-3 mb-4">
              <div class="book">
                <img src="${book.image}" alt="${book.title}" class="picture" />
                <div class="text-9">
                  <div class="name">
                    <span class="${book.title.toLowerCase().replace(/\s+/g, "-")}" style="display: block;">${book.title}</span>
                    <span style="display: block; color: #777">${book.author}</span>
                  </div>
                  <div class="price">
                    <span class="price-a">${book.price}</span>
                  </div>
                </div>
              </div>
            </div>`;
        container.innerHTML += bookHTML;
    });
}

// Load initial books
loadBooks("best-seller");
loadBooks("classics");
loadBooks("children");

// Event listeners for "View All"
document.querySelectorAll(".view-all").forEach(button => {
    let isExpanded = false; // Track if books are currently displayed
    button.addEventListener("click", event => {
        event.preventDefault();
        const category = event.currentTarget.getAttribute("data-category");

        if (isExpanded) {
            // If books are already displayed, hide them and change text back
            document.getElementById(`${category}-books`).innerHTML = "";
            loadBooks(category);
            event.currentTarget.textContent = "View All"; // Change text back to "View All"
        } else {
            // If books are hidden, show all and change text to "Hide"
            loadAllBooks(category);
            event.currentTarget.textContent = "Hide"; // Change text to "Hide"
        }

        isExpanded = !isExpanded; // Toggle the state
    });
});


// Chức năng tìm kiếm sách
function searchBooks(keyword) {
    const searchKeyword = keyword.toLowerCase();
    const results = books.filter(book => 
        book.title.toLowerCase().includes(searchKeyword) || 
        book.author.toLowerCase().includes(searchKeyword)
    );

    const container = document.getElementById('search-results');
    container.innerHTML = ""; // Xóa kết quả cũ
    results.forEach(book => {
        const bookHTML = `
            <div class="col-md-3 mb-4">
              <div class="book">
                <img src="${book.image}" alt="${book.title}" class="picture" />
                <div class="text-9">
                  <div class="name">
                    <span>${book.title}</span>
                    <span style="display: block; color: #777">${book.author}</span>
                  </div>
                  <div class="price">
                    <span class="price-a">${book.price}</span>
                  </div>
                </div>
              </div>
            </div>`;
        container.innerHTML += bookHTML;
    });
}

// Lắng nghe sự kiện nhập từ khóa tìm kiếm
document.querySelector('.search-input').addEventListener('input', (e) => {
    const keyword = e.target.value;
    searchBooks(keyword);
});

// Chức năng thêm sách vào yêu thích
const favoriteBooks = [];

function addToFavorites(bookTitle) {
    const book = books.find(b => b.title === bookTitle);
    if (book && !favoriteBooks.includes(book)) {
        favoriteBooks.push(book);
        alert(`Đã thêm "${book.title}" vào yêu thích!`);
    }
}

// Thêm sự kiện vào biểu tượng yêu thích cho từng sách
document.querySelectorAll('.heart-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        const bookTitle = e.target.getAttribute('data-title');
        addToFavorites(bookTitle);
    });
});

// Chức năng hiển thị giỏ hàng
const cart = [];

function addToCart(bookTitle) {
    const book = books.find(b => b.title === bookTitle);
    if (book) {
        cart.push(book);
        alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
    }
}

function displayCart() {
    const cartContainer = document.getElementById('cart-content');
    cartContainer.innerHTML = ""; // Xóa nội dung cũ
    cart.forEach(book => {
        const bookHTML = `
            <div class="cart-item">
                <img src="${book.image}" alt="${book.title}" width="50" height="50">
                <span>${book.title} - ${book.price}</span>
            </div>`;
        cartContainer.innerHTML += bookHTML;
    });
}

// Lắng nghe sự kiện nhấp vào biểu tượng giỏ hàng
document.querySelector('.icon-outline-shopping-cart').addEventListener('click', () => {
    displayCart();
    document.getElementById('cart-modal').classList.toggle('hidden');
});

// Thêm chức năng đóng giỏ hàng
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.add('hidden');
});
