// --- DOM Elements ---
const resultEl = document.getElementById('password-display');
const lengthEl = document.getElementById('length-slider');
const lengthValueEl = document.getElementById('length-value');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const historyList = document.getElementById('history-list');

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

// --- Event Listeners ---
// Update angka pada slider secara realtime
lengthEl.addEventListener('input', (e) => {
    lengthValueEl.innerText = e.target.value;
});

// Event klik tombol Generate
generateBtn.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    
    // Trigger Animasi
    resultEl.classList.remove('animate-pop');
    void resultEl.offsetWidth; // Trigger reflow untuk reset animasi
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

// Fungsi Kriptografi acak agar tidak bias (Unbiased Random)
function getSecureRandom(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
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

    if (score <= 2) {
        strengthBar.classList.add('weak');
        strengthBar.innerText = 'Lemah';
        strengthText.innerText = 'Password terlalu pendek atau kurang variasi. Gunakan minimal 8 karakter dengan campuran huruf, angka, dan simbol.';
    } else if (score <= 4) {
        strengthBar.classList.add('medium');
        strengthBar.innerText = 'Cukup';
        strengthText.innerText = 'Cukup baik, tetapi bisa lebih kuat dengan menambah panjang atau menggunakan lebih banyak simbol.';
    } else if (score === 5) {
        strengthBar.classList.add('strong');
        strengthBar.innerText = 'Kuat';
        strengthText.innerText = 'Password kuat! Kombinasi karakter sudah bagus dan sulit ditebak.';
    } else {
        strengthBar.classList.add('very-strong');
        strengthBar.innerText = 'Sangat Kuat';
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
    passwordHistory.forEach(pass => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const passText = document.createElement('span');
        passText.innerText = pass;
        passText.className = 'history-pass-text';
        
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

        li.appendChild(passText);
        li.appendChild(copyBtnHistory);
        historyList.appendChild(li);
    });
}