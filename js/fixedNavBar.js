/**
 * FIXED NAVBAR - Gestión del efecto blur y fijo al hacer scroll
 * Adaptado para estructura BEM
 */

class FixedNavBar {
    constructor(options = {}) {
        // Configuración por defecto
        this.config = {
            scrollThreshold: 50,           // Píxeles para activar el efecto
            headerSelector: '#header',     // Selector del header
            triggerSelector: '#inicio',    // Selector del elemento trigger (primera sección)
            fixedClass: 'header--fixed',   // Clase BEM para estado fijo
            scrolledClass: 'header--scrolled', // Clase BEM para estado con scroll
            debounceTime: 10,              // Tiempo de debounce para el scroll
            ...options
        };

        // Elementos del DOM
        this.header = document.querySelector(this.config.headerSelector);
        this.triggerSection = document.querySelector(this.config.triggerSelector);
        
        // Estado
        this.isScrolled = false;
        this.isFixed = false;
        this.lastScrollTop = 0;
        
        // Funciones con throttle/debounce
        this.handleScrollDebounced = this.debounce(this.handleScroll.bind(this), this.config.debounceTime);
        
        // Inicializar
        this.init();
    }

    init() {
        if (!this.header) {
            console.warn('FixedNavBar: Header no encontrado');
            return;
        }

        if (!this.triggerSection) {
            console.warn('FixedNavBar: Sección trigger no encontrada, usando scroll por defecto');
        }

        this.bindEvents();
        this.handleScroll(); // Verificar estado inicial
    }

    bindEvents() {
        // Evento de scroll con debounce
        window.addEventListener('scroll', this.handleScrollDebounced, { passive: true });
        
        // Evento de resize para recalcular posiciones
        window.addEventListener('resize', this.debounce(() => {
            this.handleScroll();
        }, 100));
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
        
        // Determinar si debe aplicarse el efecto
        let shouldApplyEffect = false;
        
        if (this.triggerSection) {
            // Usar la posición de la sección trigger
            const triggerRect = this.triggerSection.getBoundingClientRect();
            shouldApplyEffect = scrollTop > Math.abs(triggerRect.top);
        } else {
            // Usar threshold de scroll
            shouldApplyEffect = scrollTop > this.config.scrollThreshold;
        }

        // Aplicar clases según el estado
        this.updateHeaderState(shouldApplyEffect, scrollTop, scrollDirection);
        
        this.lastScrollTop = scrollTop;
    }

    updateHeaderState(shouldApplyEffect, scrollTop, direction) {
        const hasChanged = shouldApplyEffect !== this.isScrolled;
        
        if (hasChanged) {
            this.isScrolled = shouldApplyEffect;
            
            if (shouldApplyEffect) {
                this.activateScrolledState();
            } else {
                this.deactivateScrolledState();
            }
        }

        // Actualizar clase fixed para desktop (solo si es necesario)
        if (window.innerWidth >= 992) {
            this.updateFixedState(shouldApplyEffect);
        }
    }

    activateScrolledState() {
        this.header.classList.add(this.config.scrolledClass);
        
        // Disparar evento personalizado
        this.dispatchCustomEvent('navbarScrolled', {
            isScrolled: true,
            scrollTop: window.pageYOffset
        });
        
        console.log('NavBar: Estado scrolled activado');
    }

    deactivateScrolledState() {
        this.header.classList.remove(this.config.scrolledClass);
        
        // Disparar evento personalizado
        this.dispatchCustomEvent('navbarScrolled', {
            isScrolled: false,
            scrollTop: window.pageYOffset
        });
        
        console.log('NavBar: Estado scrolled desactivado');
    }

    updateFixedState(shouldBeFixed) {
        if (shouldBeFixed && !this.isFixed) {
            this.header.classList.add(this.config.fixedClass);
            this.isFixed = true;
            
            this.dispatchCustomEvent('navbarFixed', {
                isFixed: true
            });
            
        } else if (!shouldBeFixed && this.isFixed) {
            this.header.classList.remove(this.config.fixedClass);
            this.isFixed = false;
            
            this.dispatchCustomEvent('navbarFixed', {
                isFixed: false
            });
        }
    }

    // Función utilitaria para debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Disparar eventos personalizados
    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: {
                timestamp: Date.now(),
                ...detail
            }
        });
        document.dispatchEvent(event);
    }

    // Método público para forzar actualización
    forceUpdate() {
        this.handleScroll();
    }

    // Método público para obtener estado
    getState() {
        return {
            isScrolled: this.isScrolled,
            isFixed: this.isFixed,
            scrollTop: window.pageYOffset
        };
    }

    // Método público para actualizar configuración
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.forceUpdate();
    }

    // Método público para destruir la instancia
    destroy() {
        // Remover event listeners
        window.removeEventListener('scroll', this.handleScrollDebounced);
        window.removeEventListener('resize', this.forceUpdate);
        
        // Limpiar clases
        this.header.classList.remove(this.config.scrolledClass, this.config.fixedClass);
        
        console.log('FixedNavBar: Instancia destruida');
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Configuración personalizada (opcional)
    const navbarConfig = {
        scrollThreshold: 50,
        headerSelector: '#header',
        triggerSelector: '#inicio',
        fixedClass: 'header--fixed',
        scrolledClass: 'header--scrolled',
        debounceTime: 10
    };

    // Crear instancia global
    window.fixedNavBarInstance = new FixedNavBar(navbarConfig);
    
    // Listeners para eventos personalizados (opcional)
    document.addEventListener('navbarScrolled', (e) => {
        console.log('Navbar scroll event:', e.detail);
    });
    
    document.addEventListener('navbarFixed', (e) => {
        console.log('Navbar fixed event:', e.detail);
    });
    
    // Ejemplo de uso de smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = window.fixedNavBarInstance?.header?.offsetHeight || 60;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});