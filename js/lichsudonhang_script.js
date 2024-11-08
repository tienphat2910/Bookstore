$(document).ready(function() {
    loadOrderHistory();
});

function loadOrderHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const container = $('#orderHistory');
    container.empty();

    if (orderHistory.length === 0) {
        container.append(`
            <div class="text-center py-4">
                <p>Bạn chưa có đơn hàng nào</p>
                <a href="home.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `);
        return;
    }

    orderHistory.reverse().forEach((order, index) => {
        container.append(createOrderCard(order, index));
    });
}

function createOrderCard(order, index) {
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const status = getRandomStatus();
    
    return `
        <div class="order-card mb-4">
            <div class="order-header d-flex justify-content-between align-items-center">
                <div>
                    <h5>Đơn hàng #${String(index + 1).padStart(6, '0')}</h5>
                    <small class="text-muted">Đặt ngày: ${formattedDate}</small>
                </div>
                <span class="status-badge status-${status.toLowerCase()}">${getStatusText(status)}</span>
            </div>
            <div class="order-body">
                ${createOrderItems(order.items)}
            </div>
            <div class="order-footer d-flex justify-content-between align-items-center">
                <div>
                    <strong>Tổng tiền: ${order.total}</strong>
                </div>
                <div>
                    <button class="btn btn-outline-primary btn-sm me-2" 
                            onclick='viewOrderDetail("${index + 1}", ${JSON.stringify(order)})'>
                        Xem chi tiết
                    </button>
                    ${status === 'PENDING' ? `
                        <button class="btn btn-outline-danger btn-sm" onclick="cancelOrder(${index})">
                            Hủy đơn hàng
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function createOrderItems(items) {
    return items.map(item => `
        <div class="order-item mb-3">
            <div class="row align-items-center">
                <div class="col-2">
                    <img src="${item.image}" alt="${item.title}" class="img-fluid">
                </div>
                <div class="col-4">
                    <h6>${item.title}</h6>
                    <small class="text-muted">Tác giả: ${item.author || 'Chưa cập nhật'}</small>
                </div>
                <div class="col-2 text-center">
                    ${item.quantity}x
                </div>
                <div class="col-2 text-end">
                    ${item.price}
                </div>
                <div class="col-2 text-end">
                    ${item.itemTotal}
                </div>
            </div>
        </div>
    `).join('');
}

function viewOrderDetail(orderNumber, order) {
    $('#orderNumber').text(orderNumber);
    const orderDetails = $('#orderDetails');
    orderDetails.empty();
    
    orderDetails.append(`
        <div class="mb-4">
            <h6>Thông tin đơn hàng</h6>
            <p>Ngày đặt: ${new Date(order.date).toLocaleDateString('vi-VN')}</p>
            <p>Phương thức thanh toán: ${order.paymentMethod}</p>
            <p>Trạng thái: ${getStatusText(getRandomStatus())}</p>
        </div>
        
        <div class="mb-4">
            <h6>Chi tiết sản phẩm</h6>
            ${createOrderItems(order.items)}
        </div>
        
        <div class="mb-4">
            <h6>Tổng thanh toán</h6>
            <p>Tạm tính: ${order.subtotal}</p>
            <p>Phí vận chuyển: ${order.shipping}</p>
            <p class="mb-0"><strong>Tổng tiền: ${order.total}</strong></p>
        </div>
    `);
    
    $('#orderDetailModal').modal('show');
}

function getRandomStatus() {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getStatusText(status) {
    const statusMap = {
        'PENDING': 'Chờ xác nhận',
        'PROCESSING': 'Đang xử lý',
        'SHIPPED': 'Đang giao hàng',
        'DELIVERED': 'Đã giao hàng',
        'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function cancelOrder(index) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orderHistory.splice(index, 1);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        loadOrderHistory();
    }
}