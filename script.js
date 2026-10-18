document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const year = document.querySelector('#year');
    const links = document.querySelectorAll('.link-item');
    const themeToggle = document.querySelector('#theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    // Update the theme, the toggle's accessible name, and the browser chrome color.
    const setTheme = (theme, savePreference = false) => {
        const isDark = theme === 'dark';
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const label = themeToggle.querySelector('span');
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            if (icon) {
                icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
            if (label) {
                label.textContent = isDark ? 'Light mode' : 'Dark mode';
            }
        }

        if (themeColor) {
            themeColor.setAttribute('content', isDark ? '#121112' : '#ffffff');
        }

        if (savePreference) {
            try { localStorage.setItem('aao-sobha-theme', isDark ? 'dark' : 'light'); } catch (_) {}
        }
    };

    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.dataset.theme;
            setTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
        });
    }

    // Add a restrained tilt interaction only on devices with a precise pointer.
    const isHoverableDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (container && isHoverableDevice && !reducedMotion) {
        container.addEventListener('pointermove', (event) => {
            const rect = container.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            container.style.transform = `perspective(1200px) rotateY(${x * 1.8}deg) rotateX(${-y * 1.8}deg)`;
        });

        container.addEventListener('pointerleave', () => {
            container.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
        });
    }

    // Lightweight click ripple for the social and contact links.
    if (!reducedMotion) {
        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                const rect = link.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.setAttribute('aria-hidden', 'true');
                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;
                link.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
            });
        });
    }
});
