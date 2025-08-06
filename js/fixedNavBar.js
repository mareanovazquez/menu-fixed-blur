// Versión ultra-simplificada
function initFixedNavbar() {
    const header = document.querySelector('#header');
    const threshold = 50;
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > threshold;
        header.classList.toggle('header--scrolled', scrolled);
        
        // Solo aplicar fixed en desktop
        if (window.innerWidth >= 992) {
            header.classList.toggle('header--fixed', scrolled);
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initFixedNavbar);