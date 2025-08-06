class MenuToggle {
    constructor() {
        // Elementos del DOM
        this.menuToggle = document.getElementById('menuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
        this.socialLinks = document.querySelectorAll('.mobile-menu__social-link');

        // Estado del menú
        this.isMenuOpen = false;

        // Inicializar
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.mobileMenu) {
            console.warn('MenuToggle: Elementos requeridos no encontrados');
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Click en el botón toggle
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Click en enlaces del menú móvil
        this.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Click en enlaces de redes sociales
        this.socialLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Cerrar menú al hacer click fuera (opcional)
        // NOTA: Actualmente deshabilitado porque el menú ocupa 100vw x 100vh
        // Habilitar solo si cambias las dimensiones del menú móvil en proyectos futuros
        /*
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        */

        // Cerrar menú al cambiar el tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;

        // Agregar clases BEM para estado activo
        this.menuToggle.classList.add('menu-toggle--active');
        this.mobileMenu.classList.add('mobile-menu--active');

        // Actualizar atributos ARIA
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';

        // Disparar evento personalizado
        this.dispatchCustomEvent('menuOpened');
    }

    closeMenu() {
        if (!this.isMenuOpen) return;

        this.isMenuOpen = false;

        // Remover clases BEM de estado activo
        this.menuToggle.classList.remove('menu-toggle--active');
        this.mobileMenu.classList.remove('mobile-menu--active');

        // Actualizar atributos ARIA
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');

        // Restaurar scroll del body
        document.body.style.overflow = '';

        // Devolver focus al botón toggle
        this.menuToggle.focus();

        // Disparar evento personalizado
        this.dispatchCustomEvent('menuClosed');
    }

    dispatchCustomEvent(eventName) {
        const event = new CustomEvent(eventName, {
            detail: { isMenuOpen: this.isMenuOpen }
        });
        document.dispatchEvent(event);
    }

    // Método público para obtener el estado
    getMenuState() {
        return this.isMenuOpen;
    }

    // Método público para destruir la instancia
    destroy() {
        // Remover todos los event listeners
        this.menuToggle.removeEventListener('click', this.toggleMenu);
        document.removeEventListener('keydown', this.handleEscape);
        document.removeEventListener('click', this.handleOutsideClick);
        window.removeEventListener('resize', this.handleResize);

        // Limpiar estado
        this.closeMenu();
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global para acceso desde otros scripts si es necesario
    window.menuToggleInstance = new MenuToggle();

    // Listeners para eventos personalizados (opcional)
    document.addEventListener('menuOpened', (e) => {
    });

    document.addEventListener('menuClosed', (e) => {

    });
});