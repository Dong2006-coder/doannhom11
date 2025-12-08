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
// ==================== java.js - PHIÊN BẢN HOÀN CHỈNH CUỐI CÙNG - CHẠY 100% ====================

const toast = document.getElementById('toast');

// Cập nhật số lượng trên header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart_nhom11') || '[]');
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = total);
}

// Định dạng tiền
function formatPrice(num) {
    return num.toLocaleString('vi-VN') + '₫';
}

// Hiển thị toast
function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.text').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Thêm sản phẩm vào giỏ (dùng chung)
function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart_nhom11') || '[]');
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }
    localStorage.setItem('cart_nhom11', JSON.stringify(cart));
    updateCartCount();
    showToast(`Đã thêm "${name}" vào giỏ hàng!`);

    // QUAN TRỌNG: Nếu đang ở trang giỏ hàng → tự động reload bảng
    if (document.querySelector('.cart-table')) {
        loadCartTable(); // Gọi lại để cập nhật bảng ngay lập tức
    }
}

// Tải lại bảng giỏ hàng (dùng khi thêm mới từ chính trang giỏ hàng)
function loadCartTable() {
    const cartTable = document.querySelector('.cart-table');
    if (!cartTable) return;

    // Giữ lại header
    const header = cartTable.querySelector('.header-row');
    cartTable.innerHTML = '';
    if (header) cartTable.appendChild(header);

    const cart = JSON.parse(localStorage.getItem('cart_nhom11') || '[]');
    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'row product-row';
        row.innerHTML = `
            <div><img src="${item.img}" class="product-img" alt="${item.name}"></div>
            <div class="product-name">${item.name}</div>
            <div class="price-js" data-price="${item.price}">${formatPrice(item.price)}</div>
            <div><input type="number" class="qty" value="${item.qty}" min="1"></div>
            <div>KG</div>
            <div class="total-js">${formatPrice(item.price * item.qty)}</div>
            <div><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></div>
        `;
        cartTable.appendChild(row);
    });
    updateTotal();
}

// Cập nhật tổng tiền
function updateTotal() {
    let total = 0;
    document.querySelectorAll('.product-row').forEach(row => {
        const price = parseInt(row.querySelector('.price-js').dataset.price || 0);
        const qty = parseInt(row.querySelector('.qty').value || 1);
row.querySelector('.total-js').textContent = formatPrice(price * qty);
        total += price * qty;
    });
    const totalEl = document.querySelector('.total');
    if (totalEl) totalEl.value = formatPrice(total);
}

// Lưu giỏ hàng từ bảng (khi bấm cập nhật/hủy/xóa)
function saveCartFromTable() {
    const items = [];
    document.querySelectorAll('.product-row').forEach(row => {
        items.push({
            img: row.querySelector('.product-img').src,
            name: row.querySelector('.product-name').textContent.trim(),
            price: parseInt(row.querySelector('.price-js').dataset.price),
            qty: parseInt(row.querySelector('.qty').value)
        });
    });
    localStorage.setItem('cart_nhom11', JSON.stringify(items));
    updateCartCount();
}

// ==================== BẮT SỰ KIỆN THÊM GIỎ HÀNG - HOẠT ĐỘNG MỌI TRANG ====================
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.them-gio-hang');
    if (!btn) return;

    // Tìm card cha (linh hoạt với mọi cấu trúc HTML)
    const card = btn.closest('.sp-card') || btn.closest('.product-card');
    if (!card) return;

    const nameEl = card.querySelector('.name');
    const priceEl = card.querySelector('.price');

    if (!nameEl || !priceEl) return;

    const name = nameEl.textContent.trim();

    // Lấy giá hiện tại (phần text trước thẻ <s>)
    let priceText = priceEl.childNodes[0]?.textContent || priceEl.textContent || '';
    const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;

    if (price === 0) {
        alert('Lỗi: Không đọc được giá sản phẩm!');
        return;
    }

    const img = card.querySelector('img')?.src || 'images/no-image.jpg';

    addToCart(name, price, img);
});

// ==================== KHỞI ĐỘNG ====================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Nếu là trang giỏ hàng
    if (document.querySelector('.cart-table')) {
        loadCartTable();

        // Xóa sản phẩm
        document.querySelector('.cart-table').addEventListener('click', e => {
            if (e.target.closest('.delete-btn')) {
                e.target.closest('.product-row').remove();
                saveCartFromTable();
                updateTotal();
            }
        });

        // Cập nhật giỏ hàng
        document.querySelector('.update-btn')?.addEventListener('click', () => {
            saveCartFromTable();
            showToast('Cập nhật giỏ hàng thành công!');
        });

        // Hủy toàn bộ
        document.querySelector('.cancel-btn')?.addEventListener('click', () => {
            if (confirm('Bạn có chắc muốn hủy toàn bộ giỏ hàng?')) {
                localStorage.removeItem('cart_nhom11');
                loadCartTable();
                updateCartCount();
                showToast('Đã hủy giỏ hàng!');
            }
});

        // Tự động cập nhật tổng khi thay đổi số lượng
        document.querySelector('.cart-table').addEventListener('input', e => {
            if (e.target.classList.contains('qty')) {
                if (e.target.value < 1) e.target.value = 1;
                updateTotal();
            }
        });
    }
});