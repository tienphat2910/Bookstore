// Thêm object chứa các mã giảm giá
const coupons = {
    'WELCOME10': 10, // Giảm 10%
    'SAVE20': 20,    // Giảm 20%
    'SUPER30': 30    // Giảm 30%
};

let appliedCoupon = null;

// Hàm áp dụng mã giảm giá
function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
        showCouponMessage('Vui lòng nhập mã giảm giá', 'danger');
        return;
    }

    if (coupons.hasOwnProperty(code)) {
        appliedCoupon = {
            code: code,
            discount: coupons[code]
        };
        showCouponMessage(`Áp dụng mã giảm giá ${coupons[code]}% thành công!`, 'success');
        updateCartSummary();
    } else {
        showCouponMessage('Mã giảm giá không hợp lệ', 'danger');
    }
}

// Hàm hiển thị thông báo mã giảm giá
function showCouponMessage(message, type) {
    const couponMessage = document.getElementById('couponMessage');
    couponMessage.textContent = message;
    couponMessage.className = `text-${type} mt-2 coupon-message`;
}

// Cập nhật hàm updateCartSummary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tính tổng tiền tạm tính
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

    // Tính giảm giá
    let discount = 0;
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
    }

    // Tính tổng tiền sau giảm giá
    const total = subtotal - discount;

    // Hiển thị các giá trị
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} đ`;
    document.getElementById('discount').textContent = `-${discount.toFixed(2)} đ`;
    document.getElementById('total-price').textContent = `${total.toFixed(2)} đ`;
}

// Cập nhật hàm displayCart
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Giỏ hàng trống</p>';
        updateCartSummary();
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-author">${item.author}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="btn btn-danger ms-3" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartSummary();
}

// Hàm cập nhật số lượng
// function updateQuantity(productId, newQuantity) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const item = cart.find(item => item.id === productId);

//     if (item) {
//         item.quantity = Math.max(1, parseInt(newQuantity));
//         localStorage.setItem('cart', JSON.stringify(cart));
//         displayCart();
//     }
// }
function updateQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        newQuantity = parseInt(newQuantity);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1; // Đảm bảo số lượng tối thiểu là 1
        }
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}


// Hàm xóa sản phẩm
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Hàm tính tổng tiền
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

    document.getElementById('total-price').textContent = `${total.toFixed(2)} đ`;
}

// Khởi tạo giỏ hàng khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    displayCart();
});

// Kiểm tra trạng thái đăng nhập
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Xử lý nút thanh toán
function handleCheckout() {
    if (!isLoggedIn()) {
        // Lưu URL hiện tại vào session storage để sau khi đăng nhập có thể quay lại
        sessionStorage.setItem('redirectAfterLogin', 'GioHang.html');

        // Hiển thị thông báo
        Swal.fire({
            title: 'Bạn cần đăng nhập',
            text: 'Vui lòng đăng nhập để tiếp tục thanh toán',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Đăng nhập',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Chuyển hướng đến trang đăng nhập
                window.location.href = 'login.html';
            }
        });
    } else {
        // Nếu đã đăng nhập, tiếp tục quy trình thanh toán
        proceedToCheckout();
    }
}

// Hàm xử lý thanh toán
function proceedToCheckout() {
    // Kiểm tra giỏ hàng có trống không
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        Swal.fire({
            title: 'Giỏ hàng trống',
            text: 'Vui lòng thêm sản phẩm vào giỏ hàng',
            icon: 'warning'
        });
        return;
    }

    // Tiếp tục quy trình thanh toán
    window.location.href = 'ThanhToan.html';
} 