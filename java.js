/* ==========================
   GIỎ HÀNG - NHÓM 11
   DÙNG LOCALSTORAGE CHO TẤT CẢ TRANG
========================== */

// LẤY GIÁ TRỊ ĐÃ LƯU TRONG LOCALSTORAGE (NẾU CHƯA CÓ THÌ = 0)
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

// Phần hiển thị số lượng trong giỏ hàng ở header
const cartDisplay = document.getElementById("cart-count");

// Hàm cập nhật số giỏ hàng lên giao diện
function updateCartCount() {
    if (cartDisplay) {
        cartDisplay.textContent = cartCount;
    }
}

// ===== CẬP NHẬT NGAY KHI LOAD TRANG =====
updateCartCount();

// ===== NÚT "THÊM VÀO GIỎ" TRÊN CÁC TRANG SẢN PHẨM =====
const addButtons = document.querySelectorAll(".them-gio-hang");

addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        cartCount++; // tăng số lượng
        localStorage.setItem("cartCount", cartCount); // lưu lại
        updateCartCount(); // hiển thị
    });
});

/* ẨN SỐ GIỎ HÀNG KHI VÀO TRANG THANH TOÁN (URL có 'checkout' hoặc 'thanhtoan') */
const currentPage = window.location.href;
if ((currentPage.includes("checkout") || currentPage.includes("thanhtoan")) && cartDisplay) {
    cartDisplay.style.display = "none";
}

/* ============================================================
   PHẦN GIỎ HÀNG TRONG TRANG CART (BẢNG SẢN PHẨM, TỔNG TIỀN...)
============================================================ */

// Các phần tử chỉ có ở trang giỏ hàng, nên phải kiểm tra null
const cartWrapper = document.querySelector(".cart-wrapper .cart-table");
const totalInput = document.querySelector(".total");
const cancelBtn = document.querySelector(".cancel-btn");
const updateBtn = document.querySelector(".update-btn");

// Định dạng tiền
function formatPrice(number) {
    return number.toLocaleString("vi-VN") + "₫";
}

// Cập nhật tổng tiền
function updateTotal() {
    if (!cartWrapper || !totalInput) return;

    let total = 0;
    const rows = cartWrapper.querySelectorAll(".product-row");

    rows.forEach(row => {
        const price = parseInt(row.querySelector(".price-js").dataset.price);
        const qty = parseInt(row.querySelector(".qty").value) || 1;
        row.querySelector(".total-js").textContent = formatPrice(price * qty);
        total += price * qty;
    });

    totalInput.value = formatPrice(total);
}

// XÓA SẢN PHẨM TRONG BẢNG (event delegation)
if (cartWrapper) {
    cartWrapper.addEventListener("click", function (e) {
        if (e.target.closest(".delete-btn")) {
            e.target.closest(".product-row").remove();
            updateTotal();
        }
    });
}

// THÊM SẢN PHẨM VÀO BẢNG GIỎ HÀNG (nếu có nút .add-btn ở trang này)
if (cartWrapper) {
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);

            // Kiểm tra đã có sản phẩm này trong giỏ chưa
            let existing = Array.from(cartWrapper.querySelectorAll(".product-name"))
                .find(el => el.textContent === name);

            if (existing) {
                let qtyInput = existing.closest(".product-row").querySelector(".qty");
                qtyInput.value = parseInt(qtyInput.value) + 1;
                updateTotal();
                return;
            }

            // Tạo hàng mới
            const row = document.createElement("div");
            row.classList.add("row", "product-row");
            row.innerHTML = `
                <div><img src="${btn.closest(".product-card").querySelector("img").src}" class="product-img"></div>
                <div class="product-name">${name}</div>
                <div class="price-js" data-price="${price}">${formatPrice(price)}</div>
                <div><input type="number" class="qty" value="1" min="1"></div>
                <div>KG</div>
                <div class="total-js">${formatPrice(price)}</div>
                <div>
                    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            cartWrapper.appendChild(row);

            row.querySelector(".qty").addEventListener("input", updateTotal);
            updateTotal();
        });
    });
}

// HỦY ĐẶT HÀNG: xóa hết sản phẩm + tổng tiền về 0 (không bắt buộc reset số giỏ hàng)
if (cancelBtn && cartWrapper) {
    cancelBtn.addEventListener("click", function () {
        const rows = cartWrapper.querySelectorAll(".product-row");
        rows.forEach(row => row.remove());
        updateTotal();
    });
}

// TOAST THÔNG BÁO
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.querySelector(".text").textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// CẬP NHẬT GIỎ HÀNG: cập nhật tổng tiền + RESET SỐ GIỎ HÀNG VỀ 0
if (updateBtn) {
    updateBtn.addEventListener("click", function () {
        updateTotal();
        showToast("Cập nhật giỏ hàng thành công!");

        // 🔥 phần bạn yêu cầu: khi bấm CẬP NHẬT GIỎ HÀNG → số trên nút Giỏ hàng(...) về 0
        cartCount = 0;
        localStorage.setItem("cartCount", cartCount);
        updateCartCount();
    });
}
