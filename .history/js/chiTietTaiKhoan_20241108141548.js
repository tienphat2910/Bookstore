$(document).ready(function () {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
        // Hiển thị thông tin tài khoản
        $("#username").text(userData.username);
        $("#name").val(userData.name);
        $("#phone").val(userData.phone);
        $("#email").val(userData.email);

        // Thêm các tỉnh vào dropdown
        const cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"]; // Chưa có đầy đủ, bạn cần lấy danh sách đầy đủ
        cities.forEach(function (city) {
            $("#city").append(new Option(city, city));
        });

        // Xử lý sự kiện thay đổi tỉnh
        $("#city").on("change", function () {
            // Cập nhật danh sách quận/huyện khi chọn tỉnh
            const districts = ["Quận 1", "Quận 2"]; // Danh sách quận của tỉnh đã chọn
            $("#district").html('<option value="">Chọn Quận/Huyện</option>');
            districts.forEach(function (district) {
                $("#district").append(new Option(district, district));
            });
            $("#district").prop("disabled", false);
        });

        // Xử lý sự kiện thay đổi quận/huyện
        $("#district").on("change", function () {
            const wards = ["Phường 1", "Phường 2"]; // Danh sách xã/phường
            $("#ward").html('<option value="">Chọn Xã/Phường</option>');
            wards.forEach(function (ward) {
                $("#ward").append(new Option(ward, ward));
            });
            $("#ward").prop("disabled", false);
        });

        // Lưu thay đổi thông tin tài khoản
        $("#profileForm").on("submit", function (e) {
            e.preventDefault();
            userData.name = $("#name").val();
            userData.phone = $("#phone").val();
            userData.email = $("#email").val();
            localStorage.setItem("userData", JSON.stringify(userData));
            alert("Thông tin cá nhân đã được cập nhật.");
        });

        // Lưu địa chỉ mới
        $("#addressForm").on("submit", function (e) {
            e.preventDefault();
            const newAddress = {
                name: $("#addressName").val(),
                phone: $("#addressPhone").val(),
                city: $("#city").val(),
                district: $("#district").val(),
                ward: $("#ward").val(),
                address: $("#address").val(),
                postalCode: $("#postalCode").val(),
            };
            localStorage.setItem("userAddress", JSON.stringify(newAddress));
            alert("Địa chỉ đã được lưu.");
        });

        // Đổi mật khẩu
        $("#passwordForm").on("submit", function (e) {
            e.preventDefault();
            const currentPassword = $("#currentPassword").val();
            const newPassword = $("#newPassword").val();
            const confirmPassword = $("#confirmPassword").val();

            if (newPassword === confirmPassword) {
                userData.password = newPassword;
                localStorage.setItem("userData", JSON.stringify(userData));
                alert("Mật khẩu đã được thay đổi.");
            } else {
                alert("Mật khẩu mới và mật khẩu nhập lại không khớp.");
            }
        });
    }
});