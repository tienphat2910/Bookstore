// Hàm hiển thị giỏ hàng
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Giỏ hàng trống</p>';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="img-fluid" style="width: 50px; height: 70px;">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-author">${item.author}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                            min="1" onchange="updateQuantity('${item.id}', this.value)">
                    </div>
                </div>
                <button class="btn btn-danger ms-3" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity));
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Hàm áp dụng mã giảm giá
function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    const code = couponInput.value.trim().toUpperCase();

    const coupons = {
        'WELCOME10': 10, // Giảm 10%
        'SAVE20': 20,    // Giảm 20%
        'SUPER30': 30    // Giảm 30%
    };

    if (!code) {
        showCouponMessage('Vui lòng nhập mã giảm giá', 'danger');
        return;
    }

    if (coupons.hasOwnProperty(code)) {
        appliedCoupon = { code: code, discount: coupons[code] };
        showCouponMessage(`Áp dụng mã giảm giá ${coupons[code]}% thành công!`, 'success');
        updateCartSummary();
    } else {
        showCouponMessage('Mã giảm giá không hợp lệ', 'danger');
    }
}

// Hiển thị thông báo mã giảm giá
function showCouponMessage(message, type) {
    const couponMessage = document.getElementById('couponMessage');
    couponMessage.textContent = message;
    couponMessage.className = `text-${type} mt-2 coupon-message`;
}

// Cập nhật thông tin giỏ hàng
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

    let discount = 0;
    if (appliedCoupon) {
        discount = (subtotal * appliedCoupon.discount) / 100;
    }

    const total = subtotal - discount;

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} đ`;
    document.getElementById('discount').textContent = `-${discount.toFixed(2)} đ`;
    document.getElementById('total-price').textContent = `${total.toFixed(2)} đ`;
}

// Hàm xử lý thanh toán
function handleCheckout() {
    // Lưu thông tin thanh toán vào localStorage hoặc backend
    alert("Thanh toán thành công!");
}

// Khởi tạo giỏ hàng khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    displayCart();
    updateCartSummary();
});