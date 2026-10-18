document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const year = document.querySelector('#year');
    const links = document.querySelectorAll('.link-item');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (year) {
        year.textContent = String(new Date().getFullYear());
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
