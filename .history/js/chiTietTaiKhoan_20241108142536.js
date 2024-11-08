$(document).ready(function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("userData"));

    // Kiểm tra nếu người dùng đã đăng nhập
    if (isLoggedIn !== "true" || !userData) {
        window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập
    }

    // Hiển thị tên người dùng
    $("#userName").text(userData.username);

    // Hiển thị phần "Thông tin tài khoản" mặc định
    $("#accountInfo").removeClass("d-none");
    $("#profileForm").removeClass("d-none");

    // Xử lý menu bên trái
    $("#accountInfoLink").on("click", function () {
        $(this).addClass("active");
        $("#profileLink").addClass("active");
        $("#addressLink, #passwordLink").removeClass("active");
        $("#accountInfo").removeClass("d-none");
        $("#profileForm").removeClass("d-none");
        $("#addressForm, #passwordForm").addClass("d-none");
    });

    $("#profileLink").on("click", function () {
        $("#profileForm").removeClass("d-none");
        $("#addressForm, #passwordForm").addClass("d-none");
        $(this).addClass("active");
        $("#addressLink, #passwordLink").removeClass("active");
    });

    $("#addressLink").on("click", function () {
        $("#addressForm").removeClass("d-none");
        $("#profileForm, #passwordForm").addClass("d-none");
        $(this).addClass("active");
        $("#profileLink, #passwordLink").removeClass("active");
    });

    $("#passwordLink").on("click", function () {
        $("#passwordForm").removeClass("d-none");
        $("#profileForm, #addressForm").addClass("d-none");
        $(this).addClass("active");
        $("#profileLink, #addressLink").removeClass("active");
    });

    // Xử lý lưu thông tin hồ sơ cá nhân
    $("#profileFormData").on("submit", function (e) {
        e.preventDefault();
        userData.name = $("#name").val();
        userData.phone = $("#phone").val();
        userData.email = $("#email").val();
        localStorage.setItem("userData", JSON.stringify(userData)); // Lưu lại vào localStorage
        alert("Cập nhật thông tin thành công!");
    });

    // Xử lý lưu địa chỉ mới
    $("#addressFormData").on("submit", function (e) {
        e.preventDefault();
        const newAddress = {
            name: $("#addressName").val(),
            phone: $("#addressPhone").val(),
            address: $("#address").val(),
            postalCode: $("#postalCode").val(),
        };
        const userAddresses = userData.addresses || [];
        userAddresses.push(newAddress);
        userData.addresses = userAddresses;
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Địa chỉ đã được lưu!");
    });

    // Xử lý đổi mật khẩu
    $("#passwordFormData").on("submit", function (e) {
        e.preventDefault();
        const currentPassword = $("#currentPassword").val();
        const newPassword = $("#newPassword").val();
        const confirmNewPassword = $("#confirmNewPassword").val();

        if (currentPassword !== userData.password) {
            alert("Mật khẩu hiện tại không đúng!");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert("Mật khẩu mới không khớp!");
            return;
        }

        userData.password = newPassword;
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Mật khẩu đã được đổi!");
    });
});