let cartCount = 0;

// Lấy phần hiển thị số lượng trong giỏ hàng
const cartDisplay = document.getElementById("cart-count");
const addButtons = document.querySelectorAll(".add-btn");

// Kiểm tra nếu tìm thấy giỏ hàng
if (cartDisplay) {
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            cartCount++;
            cartDisplay.textContent = cartCount;
        });
    });
} else {
    console.log("Không tìm thấy #cart-count");
}
