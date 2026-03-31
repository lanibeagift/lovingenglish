// 1. KHỞI TẠO DỮ LIỆU (Lưu vào LocalStorage)
let userData = JSON.parse(localStorage.getItem('lani_english_data')) || {
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    mistakes: []
};

// 2. HIỂN THỊ DỮ LIỆU LÊN MÀN HÌNH
function updateUI() {
    document.getElementById('xp-display').innerText = userData.xp;
    document.getElementById('streak-display').innerText = userData.streak;
}

// 3. CHUYỂN TRANG
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId + '-page').style.display = 'block';
    
    // Cập nhật trạng thái menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// 4. DANH SÁCH BÀI HỌC MẪU
const lessons = [
    { id: 1, title: "Giới thiệu bản thân", status: "open" },
    { id: 2, title: "Công việc Freelance", status: "open" },
    { id: 3, title: "Từ vựng TOEIC 1", status: "locked" }
];

function renderLessons() {
    const list = document.getElementById('lesson-list');
    list.innerHTML = lessons.map(l => `
        <div class="lesson-card">
            <h3>${l.title}</h3>
            <button onclick="startLesson(${l.id})">${l.status === 'open' ? 'Học ngay' : '🔒 Khóa'}</button>
        </div>
    `).join('');
}

// Hàm giả lập học xong nhận XP
function startLesson(id) {
    alert("Bắt đầu bài học " + id);
    userData.xp += 10;
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem('lani_english_data', JSON.stringify(userData));
}

// Chạy khi trang web tải xong
window.onload = () => {
    updateUI();
    renderLessons();
};