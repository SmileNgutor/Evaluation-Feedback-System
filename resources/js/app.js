import 'preline';

document.addEventListener('DOMContentLoaded', () => {
    window.HSStaticMethods.autoInit(); // Add this
});
// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initComponents(); // 👈 initialize Preline
});
import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();
