let cartCount = 0;
// Lấy phần hiển thị số lượng trong giỏ hàng
const cartDisplay = document.getElementById("cart-count");
const addButtons = document.querySelectorAll(".them-gio-hang");
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
// ===  BÌNH   ===//
//================= TĂNG GIỎ HÀNG =================//
const cartWrapper = document.querySelector('.cart-wrapper .cart-table');
const totalInput = document.querySelector('.total');
const cancelBtn = document.querySelector('.cancel-btn');
const updateBtn = document.querySelector('.update-btn');
//============ĐINH DẠNG TIỀN ============//
function formatPrice(number) {
    return number.toLocaleString('vi-VN') + '₫';
}
//=============CẬP NHẬT TỔNG TIỀN ============//
function updateTotal() {
    let total = 0;
    const rows = cartWrapper.querySelectorAll('.product-row');
    rows.forEach(row => {
        const price = parseInt(row.querySelector('.price-js').dataset.price);
        const qty = parseInt(row.querySelector('.qty').value);
        row.querySelector('.total-js').textContent = formatPrice(price * qty);
        total += price * qty;
    });
    totalInput.value = formatPrice(total);
}

// Xóa sản phẩm
cartWrapper.addEventListener('click', function(e){
    if(e.target.closest('.delete-btn')) {
        e.target.closest('.product-row').remove();
        updateTotal();
    }
});

// Thêm sản phẩm
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function(){
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);

        let existing = Array.from(cartWrapper.querySelectorAll('.product-name'))
            .find(el => el.textContent === name);
        if(existing){
            let qtyInput = existing.closest('.product-row').querySelector('.qty');
            qtyInput.value = parseInt(qtyInput.value) + 1;
            updateTotal();
            return;
        }

        const row = document.createElement('div');
        row.classList.add('row', 'product-row');
        row.innerHTML = `
            <div><img src="${btn.closest('.product-card').querySelector('img').src}" class="product-img"></div>
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

        row.querySelector('.qty').addEventListener('input', updateTotal);
        updateTotal();
    });
});
// ================== HỦY ĐẶT HÀNG ==================//
cancelBtn.addEventListener('click', function(){
    const rows = cartWrapper.querySelectorAll('.product-row');
    rows.forEach(row => row.remove());  // xóa toàn bộ sản phẩm
    updateTotal(); // cập nhật tổng tiền về 0
   

});
// ==================THÔNG BÁO CẬP NHẬT================== //
function showToast(message) {
    const toast = document.getElementById("toast");
toast.querySelector(".text").textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

updateBtn.addEventListener("click", function() {
    updateTotal();
    showToast("Cập nhật giỏ hàng thành công!");
});
