export const SPLASH_STORAGE_KEY = "belajarautomation-splash-seen";

// Dijalankan di <head> sebelum halaman tampil: lewati splash bila sudah
// pernah muncul di sesi browser ini (lihat .splash-screen di globals.css).
export const SPLASH_INIT_SCRIPT = `try{if(sessionStorage.getItem("${SPLASH_STORAGE_KEY}"))document.documentElement.dataset.splash="seen"}catch(e){}`;
