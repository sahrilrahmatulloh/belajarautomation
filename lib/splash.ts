export const SPLASH_STORAGE_KEY = "belajarautomation-splash-seen";

// Dijalankan di <head> sebelum halaman tampil: lewati splash bila sudah pernah muncul di
// browser ini (lihat .splash-screen di globals.css). Disimpan di localStorage, bukan per tab,
// agar membuka tab baru tidak menunggu splash 1,8 detik lagi.
export const SPLASH_INIT_SCRIPT = `try{if(localStorage.getItem("${SPLASH_STORAGE_KEY}"))document.documentElement.dataset.splash="seen"}catch(e){}`;
