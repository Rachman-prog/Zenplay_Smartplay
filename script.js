// --- FITUR HAMBURGER MENU & HIDE ON SCROLL ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');

// 1. Logika Klik Hamburger Menu
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
}

// 2. Logika Sembunyikan Navbar Saat Scroll ke Bawah
let prevScrollpos = window.pageYOffset;

window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    
    // Jangan sembunyikan navbar jika menu sedang terbuka di HP
    if (navLinks && navLinks.classList.contains('nav-active')) {
        return;
    }

    if (navbar) {
        if (prevScrollpos > currentScrollPos) {
            navbar.style.top = "0"; // Scroll atas -> Muncul
        } else {
            navbar.style.top = "-100px"; // Scroll bawah -> Sembunyi
        }
    }
    prevScrollpos = currentScrollPos;
}

// --- Fungsi 1: Tes Mandiri (Self-Check) ---
function calculateResult() {
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');
    
    const q1 = form.querySelector('input[name="q1"]:checked');
    const q2 = form.querySelector('input[name="q2"]:checked');
    const q3 = form.querySelector('input[name="q3"]:checked');

    if (!q1 || !q2 || !q3) {
        alert("Bro, isi semua pertanyaannya dulu ya!");
        return;
    }

    const score = parseInt(q1.value) + parseInt(q2.value) + parseInt(q3.value);
    
    resultDiv.classList.remove('hidden', 'res-aman', 'res-waspada', 'res-bahaya');
    
    if (score <= 1) {
        resultDiv.innerHTML = "<h3>Status: GGWP! (Aman) 🎮</h3><p>Kebiasaan main game kamu sangat sehat. Terus pertahankan work-life balance kamu!</p>";
        resultDiv.classList.add('res-aman');
    } else if (score <= 4) {
        resultDiv.innerHTML = "<h3>Status: Hati-Hati Kena Gank (Waspada) ⚠️</h3><p>Kamu mulai kehilangan kendali waktu. Coba mulai set alarm saat main game dan kurangi durasinya.</p>";
        resultDiv.classList.add('res-waspada');
    } else {
        resultDiv.innerHTML = "<h3>Status: Waktunya Touch Grass! (Bahaya) 🚨</h3><p>Gaming sudah mulai merusak rutinitas harianmu. Saatnya detox digital dan perbanyak interaksi di dunia nyata!</p>";
        resultDiv.classList.add('res-bahaya');
    }
}

// --- Fungsi 2: Kalkulator Waktu Bermain ---
function calculatePlaytime() {
    const jam = parseFloat(document.getElementById('jam-per-hari').value);
    const hari = parseFloat(document.getElementById('hari-per-minggu').value);
    const calcResult = document.getElementById('calc-result');

    if (isNaN(jam) || isNaN(hari) || jam < 0 || hari < 0 || jam > 24 || hari > 7) {
        alert("Masukin angka yang masuk akal dong, Bang! Maksimal 24 jam sehari & 7 hari seminggu. 😅");
        return;
    }

    const totalJamSetahun = jam * hari * 52;
    const totalHariSetahun = (totalJamSetahun / 24).toFixed(1);
    
    calcResult.classList.remove('hidden', 'res-aman', 'res-waspada', 'res-bahaya');
    
    let message = "";
    let cssClass = "";

    if (totalJamSetahun === 0) {
        message = "<h3>Valid, lu emang nggak main game. 👏</h3><p>Cari hobi lain atau lanjut push hal positif lainnya!</p>";
        cssClass = "res-aman";
    } else if (totalJamSetahun < 500) {
        message = `<h3>Total: ${totalJamSetahun} Jam / Tahun ⏳</h3>
                   <p>Setara dengan rebahan sambil main game selama <b>${totalHariSetahun} hari</b> non-stop. Masih wajar, <i>balance is key!</i> 🔑</p>`;
        cssClass = "res-aman";
    } else if (totalJamSetahun < 1500) {
        message = `<h3>Total: ${totalJamSetahun} Jam / Tahun ⏳</h3>
                   <p>Setara dengan nge-game <b>${totalHariSetahun} hari</b> full tanpa tidur! Lumayan banyak juga ya. Jangan lupa ngerjain tugas kuliah! 📚</p>`;
        cssClass = "res-waspada";
    } else {
        message = `<h3>Total: ${totalJamSetahun} Jam / Tahun 💀</h3>
                   <p>GILA! Itu setara dengan <b>${totalHariSetahun} hari</b> non-stop! Bro, lu ngabisin ${totalHariSetahun} hari penuh dalam setahun cuma di depan layar. Waktunya Touch Grass beneran! 🚨🌱</p>`;
        cssClass = "res-bahaya";
    }

    calcResult.innerHTML = message;
    calcResult.classList.add(cssClass);
}

// --- Fungsi 3: Background Music Toggle & Toast Notification (DENGAN RE-PLAYING STATE) ---
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

if (bgMusic) {
    bgMusic.volume = 0.4;
}

// Fungsi Toast
function showToast(message) {
    let toast = document.getElementById('toast-notif');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notif';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// [BARU] Mengecek status musik di localStorage saat halaman baru dimuat
window.addEventListener('DOMContentLoaded', () => {
    const savedTime = localStorage.getItem('musicTime');
    const savedPlaying = localStorage.getItem('musicPlaying');

    // Jika ada data detik lagu sebelumnya, set ke detik tersebut
    if (bgMusic && savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }

    // Jika di halaman sebelumnya musiknya menyala, nyalakan kembali otomatis
    if (bgMusic && savedPlaying === 'true') {
        bgMusic.play().then(() => {
            isPlaying = true;
            if (musicToggle) {
                musicToggle.innerHTML = '⏸️ Pause Lo-Fi';
                musicToggle.classList.add('playing');
            }
        }).catch(error => {
            console.log("Autoplay ditahan browser. Musik aktif otomatis setelah user berinteraksi dengan halaman.");
            
            // Pengaman Browser Policy: Musik akan langsung jalan begitu user klik area mana saja di halaman baru
            document.body.addEventListener('click', () => {
                if (localStorage.getItem('musicPlaying') === 'true' && !isPlaying) {
                    bgMusic.play();
                    isPlaying = true;
                    if (musicToggle) {
                        musicToggle.innerHTML = '⏸️ Pause Lo-Fi';
                        musicToggle.classList.add('playing');
                    }
                }
            }, { once: true });
        });
    }
});

// [BARU] Menyimpan detik lagu berjalan secara berkala (setiap 1 detik) ke dalam memori lokal
setInterval(() => {
    if (bgMusic && !bgMusic.paused) {
        localStorage.setItem('musicTime', bgMusic.currentTime);
    }
}, 1000);

// Logika saat tombol musik diklik manual
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '🎵 Play Lo-Fi';
            musicToggle.classList.remove('playing');
            showToast('⏸️ <strong>BGM Off:</strong> Waktunya fokus menyelesaikan misi utama!');
            
            // Simpan status mati di memori
            localStorage.setItem('musicPlaying', 'false');
        } else {
            bgMusic.play();
            musicToggle.innerHTML = '⏸️ Pause Lo-Fi';
            musicToggle.classList.add('playing');
            showToast('🎧 <strong>Buff Aktif:</strong> Lo-Fi Beats menemani sesi healing-mu.');
            
            // Simpan status menyala & detik awal di memori
            localStorage.setItem('musicPlaying', 'true');
            localStorage.setItem('musicTime', bgMusic.currentTime);
        }
        isPlaying = !isPlaying;
    });
}