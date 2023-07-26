// Lắng nghe sự kiện click vào nút "Login"
// Lấy giá trị từ các trường input
let user = {
  userInfo: {
    username: "",
    password: "",
  },

  login(event) {
    event.preventDefault();
    this.userInfo = {
      username: $("#inp-username").val(),
      password: $("#inp-password").val(),
    };

    // Kiểm tra nếu các trường input không trống
    if (
      this.userInfo.username.trim() !== "" &&
      this.userInfo.password.trim() !== ""
    ) {
      // Gửi thông tin đăng nhập đến server
      $.ajax({
        url: "/login",
        type: "POST",
        data: JSON.stringify(this.userInfo),
        contentType: "application/json",
        success: (res) => {
          // Lưu token vào cookie (thời gian hết hạn trong 1 giờ)
          document.cookie = "token=" + res + ";expires=1h;path=/";
          // Chuyển hướng người dùng đến trang sau khi đăng nhập thành công
          window.location.href = "/index.html";
          console.error("Đăng nhập không thất bại.");
        },
        error: (e) => {
          // Xử lý lỗi nếu có
          console.log("Lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.");
          console.log(e);
        },
      });
    }
  },
  register(event) {
    event.preventDefault();
    this.userInfo = {
      username: $("#inp-username").val(),
      password: $("#inp-password").val(),
    };
    // Kiểm tra nếu các trường input không trống
    if (
      this.userInfo.username.trim() !== "" &&
      this.userInfo.password.trim() !== ""
    ) {
      // Gửi thông tin đăng nhập đến server
      $.ajax({
        url: "/register",
        type: "POST",
        data: JSON.stringify(this.userInfo),
        contentType: "application/json",
        success: (res) => {
          console.log(res);
          console.log("Đăng kí thành công");
        },
        error: (e) => {
          // Xử lý lỗi nếu có
          console.log("Lỗi trong quá trình đăng kí. Vui lòng thử lại sau.");
          console.log(e);
        },
      });
    }
  },
};
$("#btn-login").on("click", user.login);
$("#btn-register").on("click", user.register);
