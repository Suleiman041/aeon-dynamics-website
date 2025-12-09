// ============================================
// Theme Management (Respects System Preference)
// ============================================

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateLogo(theme) {
    const logoImage = document.getElementById('logoImage');
    if (logoImage) {
        logoImage.src = theme === 'dark'
            ? 'AEON_dark_mode-removebg-preview.png'
            : 'AEON_light_mode-removebg-preview.png';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    // Use saved theme if user has toggled, otherwise use system preference
    const theme = savedTheme || getSystemTheme();

    document.documentElement.setAttribute('data-theme', theme);
    updateLogo(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Save user preference
    updateLogo(newTheme);
}

// Initialize theme on page load
initTheme();

// Listen for system theme changes (only if user hasn't manually toggled)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        // Only update if user hasn't set a preference
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateLogo(newTheme);
    }
});

// Theme toggle button
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
