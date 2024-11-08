$(document).ready(function() {
    loadCartItems();
    setupEventListeners();
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = $('#cart-items');
    cartContainer.empty();

    if (cart.length === 0) {
        cartContainer.append(`
            <div class="text-center py-4">
                <p>Giỏ hàng trống</p>
                <a href="home.html" class="btn btn-primary">Tiếp tục mua sắm</a>
            </div>
        `);
        updateTotals([]);
        return;
    }

    // Hiển thị từng sản phẩm
    cart.forEach(item => {
        const price = parsePrice(item.price);
        const itemTotal = price * item.quantity;
        
        cartContainer.append(`
            <div class="cart-item mb-3">
                <div class="row align-items-center">
                    <div class="col-2">
                        <img src="${item.image}" alt="${item.title}" class="img-fluid" style="max-width: 80px;">
                    </div>
                    <div class="col-4">
                        <h6 class="mb-1">${item.title}</h6>
                        <small class="text-muted">Tác giả: ${item.author || 'Chưa cập nhật'}</small>
                    </div>
                    <div class="col-2 text-center">
                        ${item.quantity}
                    </div>
                    <div class="col-2 text-end">
                        ${item.price}
                    </div>
                    <div class="col-2 text-end">
                        ${formatPrice(itemTotal)}đ
                    </div>
                </div>
            </div>
        `);
    });

    updateTotals(cart);
}

function parsePrice(priceString) {
    // Loại bỏ ký tự đơn vị tiền tệ và dấu phẩy, sau đó chuyển thành số
    return parseInt(priceString.replace(/[,₫\s]/g, ''));
}

function calculateCartTotal(cart) {
    return cart.reduce((total, item) => {
        const price = parsePrice(item.price);
        return total + (price * item.quantity);
    }, 0);
}

function updateTotals(cart) {
    const subtotal = calculateCartTotal(cart);
    const shipping = cart.length > 0 ? 30000 : 0;
    const total = subtotal + shipping;

    // Cập nhật số lượng sản phẩm
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#totalItems').text(`${totalItems} sản phẩm`);

    // Cập nhật các khoản tiền
    $('#subtotal').text(`${formatPrice(subtotal)}đ`);
    $('#shipping').text(`${formatPrice(shipping)}đ`);
    $('#total').text(`${formatPrice(total)}đ`);
}

function setupEventListeners() {
    // Xử lý chọn phương thức thanh toán
    $('input[name="paymentMethod"]').change(function() {
        $('.payment-details').hide();
        if (this.id === 'bankingPayment') {
            $('#bankingDetails').show();
        } else if (this.id === 'momoPayment') {
            $('#momoDetails').show();
        }
    });

    // Xử lý nút thanh toán
    $('#confirmPayment').click(function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        const subtotal = calculateCartTotal(cart);
        const shipping = 30000;
        const total = subtotal + shipping;

        const orderDetails = {
            items: cart.map(item => ({
                ...item,
                itemTotal: formatPrice(parsePrice(item.price) * item.quantity) + 'đ'
            })),
            subtotal: formatPrice(subtotal) + 'đ',
            shipping: formatPrice(shipping) + 'đ',
            total: formatPrice(total) + 'đ',
            paymentMethod: $('input[name="paymentMethod"]:checked').next('label').text().trim(),
            date: new Date().toISOString()
        };

        // Lưu vào order history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push(orderDetails);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        // Clear cart
        localStorage.removeItem('cart');
        
        alert('Đặt hàng thành công!');
        window.location.href = 'LichSuDonHang.html';
    });
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
} 