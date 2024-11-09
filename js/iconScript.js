$(document).ready(function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const dropdownMenu = $("#userDropdownMenu");

    // Kiểm tra xem phần tử dropdownMenu có tồn tại không
    if (dropdownMenu.length === 0) {
        console.error("Dropdown menu không tìm thấy.");
        return;
    }

    // Chèn nội dung vào menu dựa trên trạng thái đăng nhập
    if (isLoggedIn === "true") {
        dropdownMenu.html(`
            <li><a class="dropdown-item" href="ChiTietTaiKhoan.html">Chi tiết tài khoản</a></li>
            <li><a class="dropdown-item" href="#" id="logout">Đăng xuất</a></li>
        `);
    } else {
        dropdownMenu.html(`
            <li><a class="dropdown-item" href="login.html">Đăng nhập</a></li>
        `);
    }

    // Xử lý sự kiện khi nhấp vào biểu tượng người dùng để toggle dropdown
    $("#userDropdown").on("click", function (e) {
        e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
        dropdownMenu.toggle(); // Sử dụng toggle để hiển thị/ẩn menu
    });

    // Đăng xuất
    $(document).on("click", "#logout", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        window.location.reload(); // Tải lại trang để cập nhật giao diện
    });

    // Đảm bảo dropdown đóng khi người dùng nhấp ra ngoài
    $(document).on("click", function (e) {
        if (
            !$(e.target).closest("#userDropdown").length &&
            !$(e.target).closest("#userDropdownMenu").length
        ) {
            dropdownMenu.hide();
        }
    });
});