let xp = parseInt(localStorage.getItem('lani_xp')) || 0;
let currentVocabIdx = 0;
let roleStep = 0;
let currentQuizIdx = 0;

// Chuyển trang chính
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId + (pageId.includes('page')?'':'-page') || pageId).style.display = 'block';
    if(pageId === 'dashboard') document.getElementById('lesson-workspace').style.display = 'none';
}

// Vào bài học
function openLesson() {
    showPage('lesson-workspace');
    loadVocab();
    document.getElementById('mixed-content').innerHTML = lesson1Content.mixedStory;
}

// Tab điều hướng
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tab + '-tab').style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Flashcard
function loadVocab() {
    const item = lesson1Content.vocab[currentVocabIdx];
    document.getElementById('vocab-en').innerText = item.en;
    document.getElementById('vocab-vi').innerText = item.vi;
    document.getElementById('vocab-index').innerText = `${currentVocabIdx+1}/10`;
    document.querySelector('.card-box').classList.remove('flip');
}
function nextVocab() { if(currentVocabIdx < 9) {currentVocabIdx++; loadVocab(); addXP(2);} }
function prevVocab() { if(currentVocabIdx > 0) {currentVocabIdx--; loadVocab();} }

// Story Sub-tabs
function switchSubTab(type) {
    document.querySelectorAll('.sub-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(type + '-content').style.display = 'block';
    event.currentTarget.classList.add('active');
    if(type === 'dict') renderDict();
    if(type === 'shadow') renderShadow();
}

function renderDict() {
    document.getElementById('dict-list').innerHTML = lesson1Content.fullStory.map((s, i) => 
        `<p>${i+1}. ${s.replace(/perfect timing|comfort zone|speak up/gi, "___")} <input id="d-${i}"></p>`
    ).join('');
}

function renderShadow() {
    document.getElementById('shadow-list').innerHTML = lesson1Content.fullStory.map((s, i) => 
        `<div class="shadow-item"><p>${s}</p>
        <button onclick="speak('${s}')">🔊 Nghe</button>
        <button onclick="record(${i}, '${s}')">🎤 Nói</button><span id="s-${i}"></span></div>`
    ).join('');
}

function speak(t) { const u = new SpeechSynthesisUtterance(t); u.lang='en-US'; window.speechSynthesis.speak(u); }

function record(i, target) {
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = 'en-US'; rec.start();
    document.getElementById(`s-${i}`).innerText = " Đang nghe...";
    rec.onresult = (e) => {
        const text = e.results[0][0].transcript.toLowerCase();
        const isCorrect = target.toLowerCase().includes(text);
        document.getElementById(`s-${i}`).innerText = isCorrect ? " ✅ Khớp!" : " ❌ Thử lại";
        if(isCorrect) addXP(5);
    };
}

// Roleplay
function speakRoleplay() {
    if(roleStep >= lesson1Content.roleplay.length) return;
    const step = lesson1Content.roleplay[roleStep];
    const box = document.getElementById('chat-box');
    box.innerHTML += `<p><b>Bot:</b> ${step.bot}</p>`;
    speak(step.bot);
    setTimeout(() => {
        box.innerHTML += `<p style="color:blue"><b>Bạn:</b> ${step.answer}</p>`;
        addXP(10); roleStep++;
    }, 2000);
}

// Quiz
function openQuiz() { document.getElementById('quiz-overlay').style.display='flex'; showQuiz(); }
function closeQuiz() { document.getElementById('quiz-overlay').style.display='none'; }
function showQuiz() {
    const q = lesson1Content.vocab[currentQuizIdx];
    document.getElementById('quiz-question').innerText = `"${q.en}" là gì?`;
    const opts = [q.vi, "Sai rồi", "Không phải", "Trật lất"].sort(()=>Math.random()-0.5);
    document.getElementById('quiz-options').innerHTML = opts.map(o => `<button onclick="checkQ('${o}','${q.vi}')">${o}</button>`).join('');
}
function checkQ(a, c) {
    if(a===c) { addXP(15); alert("Đúng!"); } else alert("Sai!");
    currentQuizIdx++;
    if(currentQuizIdx < 10) showQuiz(); else { alert("Xong!"); closeQuiz(); currentQuizIdx=0; }
}

function addXP(n) { xp += n; document.getElementById('xp-display').innerText = xp; localStorage.setItem('lani_xp', xp); }
window.onload = () => { document.getElementById('xp-display').innerText = xp; };
