$(document).ready(function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("userData"));

    // Kiểm tra nếu người dùng đã đăng nhập
    if (isLoggedIn !== "true" || !userData) {
        window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập
    }

    // Hiển thị tên người dùng
    $("#userName").text(userData.username);

    // Xử lý menu bên trái
    $("#accountInfoLink").on("click", function () {
        $("#accountInfo").removeClass("d-none");
    });

    $("#profileLink").on("click", function () {
        $("#profileForm").removeClass("d-none");
        $("#addressForm, #passwordForm").addClass("d-none");
    });

    $("#addressLink").on("click", function () {
        $("#addressForm").removeClass("d-none");
        $("#profileForm, #passwordForm").addClass("d-none");
    });

    $("#passwordLink").on("click", function () {
        $("#passwordForm").removeClass("d-none");
        $("#profileForm, #addressForm").addClass("d-none");
    });

    // Xử lý lưu thông tin hồ sơ cá nhân
    $("#profileFormData").on("submit", function (e) {
        e.preventDefault();
        userData.name = $("#name").val();
        userData.phone = $("#phone").val();
        userData.email = $("#email").val();
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Thông tin đã được lưu!");
    });

    // Xử lý lưu địa chỉ
    $("#addressFormData").on("submit", function (e) {
        e.preventDefault();
        const newAddress = {
            name: $("#addressName").val(),
            phone: $("#addressPhone").val(),
            address: $("#address").val(),
            postalCode: $("#postalCode").val(),
        };
        userData.address = newAddress;
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Địa chỉ đã được lưu!");
    });

    // Xử lý thay đổi mật khẩu
    $("#passwordFormData").on("submit", function (e) {
        e.preventDefault();
        const currentPassword = $("#currentPassword").val();
        const newPassword = $("#newPassword").val();
        const confirmNewPassword = $("#confirmNewPassword").val();

        if (currentPassword === userData.password && newPassword === confirmNewPassword) {
            userData.password = newPassword;
            localStorage.setItem("userData", JSON.stringify(userData));
            alert("Mật khẩu đã được thay đổi!");
        } else {
            alert("Mật khẩu không khớp.");
        }
    });
});