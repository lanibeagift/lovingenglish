let xp = parseInt(localStorage.getItem('lani_xp')) || 0;
let streak = parseInt(localStorage.getItem('lani_streak')) || 0;
let currentVocabIdx = 0;
let roleStep = 0;
let currentQuizIdx = 0;

// Cập nhật điểm lên màn hình (An toàn, không lo lỗi null)
function updateStats() {
    const xpEl = document.getElementById('xp-display');
    const streakEl = document.getElementById('streak-display');
    if(xpEl) xpEl.innerText = xp;
    if(streakEl) streakEl.innerText = streak;
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById(pageId === 'dashboard' ? 'dashboard-page' : pageId + '-page');
    if(target) target.style.display = 'block';
    if(pageId === 'dashboard') document.getElementById('lesson-workspace').style.display = 'none';
}

function openLesson() {
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('lesson-workspace').style.display = 'block';
    loadVocab();
    document.getElementById('mixed-content').innerHTML = lesson1Content.mixedStory;
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tab + '-tab').style.display = 'block';
    if(event) event.currentTarget.classList.add('active');
}

function loadVocab() {
    const item = lesson1Content.vocab[currentVocabIdx];
    document.getElementById('vocab-en').innerText = item.en;
    document.getElementById('vocab-vi').innerText = item.vi;
    document.getElementById('vocab-index').innerText = `${currentVocabIdx+1}/10`;
}

function nextVocab() { if(currentVocabIdx < 9) {currentVocabIdx++; loadVocab(); addXP(2);} }
function prevVocab() { if(currentVocabIdx > 0) {currentVocabIdx--; loadVocab();} }

function addXP(n) {
    xp += n;
    updateStats();
    localStorage.setItem('lani_xp', xp);
}

function switchSubTab(type) {
    document.querySelectorAll('.sub-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(type + '-content').style.display = 'block';
    if(event) event.currentTarget.classList.add('active');
    if(type === 'shadow') renderShadow();
}

function renderShadow() {
    document.getElementById('shadow-list').innerHTML = lesson1Content.fullStory.map((s, i) => 
        `<div style="margin-bottom:10px;">
            <p>${s}</p>
            <button onclick="speak('${s}')">🔊 Nghe</button>
            <button onclick="record(${i},'${s}')">🎤 Nói</button>
            <span id="s-${i}"></span>
        </div>`
    ).join('');
}

function speak(t) { 
    const u = new SpeechSynthesisUtterance(t); 
    u.lang='en-US'; 
    window.speechSynthesis.speak(u); 
}

function record(i, target) {
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = 'en-US'; rec.start();
    document.getElementById(`s-${i}`).innerText = " 🎧...";
    rec.onresult = (e) => {
        const text = e.results[0][0].transcript.toLowerCase();
        const ok = target.toLowerCase().includes(text);
        document.getElementById(`s-${i}`).innerText = ok ? " ✅ Khớp" : " ❌ Thử lại";
        if(ok) addXP(5);
    };
}

function speakRoleplay() {
    if(roleStep >= lesson1Content.roleplay.length) return;
    const step = lesson1Content.roleplay[roleStep];
    const box = document.getElementById('chat-box');
    box.innerHTML += `<p><b>Bot:</b> ${step.bot}</p>`;
    speak(step.bot);
    setTimeout(() => {
        box.innerHTML += `<p style="color:blue"><b>Bạn:</b> ${step.answer}</p>`;
        addXP(10); roleStep++;
    }, 1500);
}

function openQuiz() { document.getElementById('quiz-overlay').style.display='flex'; showQuiz(); }
function closeQuiz() { document.getElementById('quiz-overlay').style.display='none'; }
function showQuiz() {
    const q = lesson1Content.vocab[currentQuizIdx];
    document.getElementById('quiz-question').innerText = `"${q.en}" nghĩa là gì?`;
    const opts = [q.vi, "Nghĩa sai A", "Nghĩa sai B", "Nghĩa sai C"].sort(()=>Math.random()-0.5);
    document.getElementById('quiz-options').innerHTML = opts.map(o => `<button onclick="checkQ('${o}','${q.vi}')">${o}</button>`).join('');
}
function checkQ(a, c) {
    if(a===c) { addXP(15); alert("Chính xác!"); } else alert("Sai rồi!");
    currentQuizIdx++;
    if(currentQuizIdx < 10) showQuiz(); else { alert("Hoàn thành Quiz!"); closeQuiz(); currentQuizIdx=0; }
}

window.onload = () => { updateStats(); };
