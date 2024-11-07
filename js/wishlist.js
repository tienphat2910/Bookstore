// Khởi tạo danh sách yêu thích từ localStorage
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Thêm/xóa sản phẩm khỏi danh sách yêu thích
function toggleWishlist(product) {
    const index = wishlist.findIndex(item => item.id === product.id);
    
    if (index === -1) {
        // Thêm vào wishlist nếu chưa có
        wishlist.push(product);
        showToast('Đã thêm vào danh sách yêu thích');
    } else {
        // Xóa khỏi wishlist nếu đã có
        wishlist.splice(index, 1);
        showToast('Đã xóa khỏi danh sách yêu thích');
    }
    
    // Lưu vào localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistIcon();
}

// Kiểm tra sản phẩm có trong wishlist không
function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

// Cập nhật số lượng trên icon wishlist
function updateWishlistIcon() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
    }
}

// Hiển thị thông báo
function showToast(message) {
    Toastify({
        text: message,
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#333",
        }
    }).showToast();
} 