
// Theme switching functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add animation class
        if (this.themeToggle) {
            this.themeToggle.classList.add('rotating');
            setTimeout(() => {
                this.themeToggle.classList.remove('rotating');
            }, 300);
        }
        
        // Smooth transition effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name=theme-color]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const color = theme === 'dark' ? '#0f1419' : '#ffffff';
        metaThemeColor.content = color;
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Add theme transition styles
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .theme-transition * {
        transition: background-color 0.3s ease, 
                   color 0.3s ease, 
                   border-color 0.3s ease,
                   box-shadow 0.3s ease !important;
    }
    
    .rotating {
        animation: rotate 0.3s ease-in-out;
    }
    
    @keyframes rotate {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
    }
    
    /* Dark theme specific animations */
    [data-theme="dark"] .profile-decoration {
        animation: rotate 20s linear infinite;
    }
    
    [data-theme="dark"] .scroll-arrow {
        animation: bounce 2s infinite;
    }
    
    /* Theme-aware selection colors */
    ::selection {
        background: var(--primary-color);
        color: white;
    }
    
    ::-moz-selection {
        background: var(--primary-color);
        color: white;
    }
    
    /* Improved accessibility for theme toggle */
    .theme-toggle:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .theme-toggle:active {
        transform: scale(0.95);
    }
`;

document.head.appendChild(themeStyles);

// Auto-detect system theme preference on first visit
if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}
