// --- DOM Elements ---
const resultEl = document.getElementById('password-display');
const lengthEl = document.getElementById('length-slider');
const lengthInputEl = document.getElementById('length-input');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const strengthBar = document.getElementById('strength-bar');
const strengthLabel = document.getElementById('strength-label');
const strengthText = document.getElementById('strength-text');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const toggleAllHistoryBtn = document.getElementById('toggle-all-history');

// --- Karakter Referensi ---
const randomFunc = {
    lower: () => String.fromCharCode(getSecureRandom(26) + 97), // a-z
    upper: () => String.fromCharCode(getSecureRandom(26) + 65), // A-Z
    number: () => String.fromCharCode(getSecureRandom(10) + 48), // 0-9
    symbol: () => {
        const symbols = '!@#$%^&*';
        return symbols[getSecureRandom(symbols.length)];
    }
};

// State untuk History
let passwordHistory = [];
let allPasswordsVisible = false;

// --- Event Listeners ---
// Sinkronisasi Slider -> Input Angka
lengthEl.addEventListener('input', (e) => {
    lengthInputEl.value = e.target.value;
});

// Sinkronisasi Input Angka -> Slider (Tanpa maksa ubah angka saat ngetik)
lengthInputEl.addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    if (!isNaN(value)) {
        // Slider tetap sinkron dalam batas 6-32
        lengthEl.value = Math.min(Math.max(value, 6), 32);
    }
});

// Validasi & Clamping saat user klik di luar input (blur)
lengthInputEl.addEventListener('blur', () => {
    let value = parseInt(lengthInputEl.value);
    
    if (isNaN(value) || value < 6) {
        lengthInputEl.value = 6;
    } else if (value > 32) {
        lengthInputEl.value = 32;
    }
    lengthEl.value = lengthInputEl.value;
});

// Event klik tombol Generate
generateBtn.addEventListener('click', () => {
    let length = parseInt(lengthInputEl.value);

    // Final check sebelum generate
    if (isNaN(length) || length < 6) {
        length = 6;
    } else if (length > 32) {
        length = 32;
    }
    
    lengthInputEl.value = length;
    lengthEl.value = length;

    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    
    // Trigger Animasi
    resultEl.classList.remove('animate-pop');
    void resultEl.offsetWidth; 
    resultEl.classList.add('animate-pop');
});

// Event klik Copy to Clipboard
copyBtn.addEventListener('click', () => {
    const password = resultEl.innerText;
    if (!password || password === 'P@ssw0rdAkanMunculDisini') return;
    
    navigator.clipboard.writeText(password).then(() => {
        copyBtn.innerText = '✅';
        setTimeout(() => copyBtn.innerText = '📋', 2000);
    });
});

// Dark Mode Toggle
themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggleBtn.innerText = isDark ? '🌙' : '☀️';
});

// --- Core Logic ---

// Fungsi Kriptografi acak agar tidak bias (menghapus modulo bias)
function getSecureRandom(max) {
    const array = new Uint32Array(1);
    const maxUint32 = 4294967296; // 2^32
    const limit = maxUint32 - (maxUint32 % max);

    let r;
    do {
        window.crypto.getRandomValues(array);
        r = array[0];
    } while (r >= limit);

    return r % max;
}

// Fungsi utama pembuat password
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);

    // Validasi: Jika tidak ada checkbox yang dipilih
    if (typesCount === 0) {
        alert('Tolong pilih minimal satu jenis karakter!');
        return '';
    }

    // Pastikan setiap jenis karakter yang dipilih muncul minimal 1 kali
    for(let i = 0; i < typesArr.length; i++) {
        const funcName = Object.keys(typesArr[i])[0];
        generatedPassword += randomFunc[funcName]();
    }

    // Isi sisa panjang password secara acak
    for(let i = typesArr.length; i < length; i++) {
        const randomType = typesArr[getSecureRandom(typesArr.length)];
        const funcName = Object.keys(randomType)[0];
        generatedPassword += randomFunc[funcName]();
    }

    // Acak ulang (shuffle) hasil akhir agar karakter awal tidak selalu berurutan sesuai checkbox
    const finalPassword = shuffleString(generatedPassword);
    
    // Update UI Kekuatan & Riwayat
    updateStrength(finalPassword, typesCount);
    addToHistory(finalPassword);

    return finalPassword;
}

// Fungsi pengacak string (Fisher-Yates Shuffle)
function shuffleString(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getSecureRandom(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

// Logika Indikator Kekuatan Password dengan Penjelasan Detail
function updateStrength(password, typesCount) {
    strengthBar.className = 'strength-bar'; // Reset
    let score = 0;

    // Skor berdasarkan panjang
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Skor berdasarkan variasi karakter
    if (typesCount >= 2) score += 1;
    if (typesCount >= 3) score += 1;
    if (typesCount >= 4) score += 1;

    // Hitung lebar bar (minimal 10% agar tetap terlihat)
    let width = Math.max((score / 6) * 100, 10);
    strengthBar.style.width = `${width}%`;

    if (score <= 2) {
        strengthBar.classList.add('weak');
        strengthLabel.innerText = 'Lemah';
        strengthText.innerText = 'Password terlalu pendek atau kurang variasi. Gunakan minimal 8 karakter dengan campuran huruf, angka, dan simbol.';
    } else if (score <= 4) {
        strengthBar.classList.add('medium');
        strengthLabel.innerText = 'Cukup';
        strengthText.innerText = 'Cukup baik, tetapi bisa lebih kuat dengan menambah panjang atau menggunakan lebih banyak simbol.';
    } else if (score === 5) {
        strengthBar.classList.add('strong');
        strengthLabel.innerText = 'Kuat';
        strengthText.innerText = 'Password kuat! Kombinasi karakter sudah bagus dan sulit ditebak.';
    } else {
        strengthBar.classList.add('very-strong');
        strengthLabel.innerText = 'Sangat Kuat';
        strengthText.innerText = 'Sangat aman! Password ini memiliki tingkat keamanan yang sangat tinggi.';
    }
}

// Mengelola array riwayat password (Maksimal 5)
function addToHistory(password) {
    if(!password) return;
    passwordHistory.unshift(password); // Tambahkan ke awal array
    if (passwordHistory.length > 5) passwordHistory.pop(); // Batasi 5 riwayat
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    passwordHistory.forEach((pass, index) => {
        const li = document.createElement('li');

        const passWrapper = document.createElement('div');
        passWrapper.className = 'history-pass-wrapper';

        const passText = document.createElement('span');
        passText.innerText = allPasswordsVisible ? pass : '••••••••'; 
        passText.className = 'history-pass-text';
        passText.dataset.visible = allPasswordsVisible ? 'true' : 'false';

        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = allPasswordsVisible ? '🙈' : '👁️';
        toggleBtn.className = 'toggle-history-btn';
        toggleBtn.title = allPasswordsVisible ? 'Sembunyikan Password' : 'Lihat Password';
        
        toggleBtn.onclick = () => {
            const isVisible = passText.dataset.visible === 'true';
            passText.innerText = isVisible ? '••••••••' : pass;
            passText.dataset.visible = !isVisible;
            toggleBtn.innerText = isVisible ? '👁️' : '🙈';
            toggleBtn.title = isVisible ? 'Lihat Password' : 'Sembunyikan Password';
        };

        const copyBtnHistory = document.createElement('button');
        copyBtnHistory.innerText = '📋';
        copyBtnHistory.className = 'copy-history-btn';
        copyBtnHistory.title = 'Salin ke Papan Klip';
        
        copyBtnHistory.onclick = () => {
            navigator.clipboard.writeText(pass).then(() => {
                copyBtnHistory.innerText = '✅';
                setTimeout(() => copyBtnHistory.innerText = '📋', 2000);
            });
        };

        passWrapper.appendChild(passText);
        passWrapper.appendChild(toggleBtn);
        
        li.appendChild(passWrapper);
        li.appendChild(copyBtnHistory);
        historyList.appendChild(li);
    });
}

// Event Toggle All
toggleAllHistoryBtn.addEventListener('click', () => {
    if (passwordHistory.length === 0) return;
    
    allPasswordsVisible = !allPasswordsVisible;
    renderHistory();
    
    toggleAllHistoryBtn.innerText = allPasswordsVisible ? '🙈' : '👁️‍🗨️';
    toggleAllHistoryBtn.title = allPasswordsVisible ? 'Sembunyikan Semua' : 'Tampilkan Semua';
});

// Event Hapus Riwayat
clearHistoryBtn.addEventListener('click', () => {
    if (passwordHistory.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat password?')) {
        passwordHistory = [];
        renderHistory();
    }
});