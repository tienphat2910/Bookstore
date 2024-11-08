document.addEventListener('DOMContentLoaded', function () {
    const coupons = {
        'WELCOME10': 10, // Giảm 10%
        'SAVE20': 20,    // Giảm 20%
        'SUPER30': 30    // Giảm 30%
    };

    let appliedCoupon = null;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Hàm hiển thị giỏ hàng
    function displayCartSummary() {
        const cartSummary = document.getElementById('cartSummary');
        if (cart.length === 0) {
            cartSummary.innerHTML = '<p class="text-center">Giỏ hàng trống</p>';
            return;
        }

        cartSummary.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between">
                <span>${item.title}</span>
                <span>${item.quantity} x ${item.price}</span>
            </div>
        `).join('');
    }

    // Cập nhật tổng tiền và phí vận chuyển
    function updateTotal() {
        const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        let subtotal = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        let discount = 0;
        if (appliedCoupon) {
            discount = (subtotal * appliedCoupon.discount) / 100;
        }

        let shippingFee = 0;
        if (shippingMethod === 'standard') {
            shippingFee = 20000;
        } else if (shippingMethod === 'express') {
            shippingFee = 60000;
        }

        const totalAmount = subtotal - discount;
        const finalAmount = totalAmount + shippingFee;

        // Hiển thị thông tin
        document.getElementById('totalAmount').textContent = `${totalAmount} đ`;
        document.getElementById('shippingFee').textContent = `${shippingFee} đ`;
        document.getElementById('finalAmount').textContent = `${finalAmount} đ`;
    }

    // Xử lý áp dụng mã giảm giá
    document.getElementById('applyCoupon').addEventListener('click', function () {
        const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
        if (coupons[couponCode]) {
            appliedCoupon = { code: couponCode, discount: coupons[couponCode] };
            document.getElementById('couponMessage').textContent = `Áp dụng mã giảm giá ${coupons[couponCode]}% thành công!`;
            updateTotal();
        } else {
            document.getElementById('couponMessage').textContent = 'Mã giảm giá không hợp lệ';
        }
    });

    // Xử lý thanh toán
    document.getElementById('confirmPayment').addEventListener('click', function () {
        const shippingForm = document.getElementById('shippingForm');
        if (!shippingForm.checkValidity()) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Cập nhật thông tin đơn hàng và chuyển hướng đến Lịch Sử Đơn Hàng
        localStorage.setItem('order', JSON.stringify({
            shipping: {
                name: document.getElementById('receiverName').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            },
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            cart: cart,
            totalAmount: document.getElementById('finalAmount').textContent,
            note: document.getElementById('note').value
        }));

        window.location.href = 'LichSuDonHang.html';
    });

    // Hiển thị giỏ hàng và tính toán tổng tiền
    displayCartSummary();
    updateTotal();
});
