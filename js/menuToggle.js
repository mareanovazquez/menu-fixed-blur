const menuToggle = document.getElementById('toggle');
const menuShow = document.getElementById('menuMobile');
const menuItems = document.querySelectorAll(".itemMenuMobile");
const menuItemsRRSS = document.querySelectorAll(".itemMenuRRSS")

function deployMenu() {
    menuToggle.classList.toggle('on');
    
    if (menuShow.classList.contains('menuShow')) {
        // Si el menú está visible, lo ocultamos con animación
        menuShow.classList.add('menuHide');
        
        // Esperamos a que termine la animación antes de remover las clases
        setTimeout(() => {
            menuShow.classList.remove('menuShow', 'menuHide');
        }, 300); // 300ms = tiempo de transición definido en CSS
    } else {
        // Si el menú está oculto, lo mostramos
        menuShow.classList.add('menuShow');
    }
}

function closeMenu() {
    menuToggle.classList.remove("on");
    
    if (menuShow.classList.contains('menuShow')) {
        menuShow.classList.add('menuHide');
        
        setTimeout(() => {
            menuShow.classList.remove("menuShow", 'menuHide');
        }, 300);
    }
}

menuToggle.addEventListener('click', deployMenu);

// Agrega un controlador de eventos a cada elemento del menú para cerrar el menú cuando se hace clic
menuItems.forEach(item => {
    item.addEventListener("click", closeMenu);
});

menuItemsRRSS.forEach(item => {
    item.addEventListener("click", closeMenu);
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
        closeMenu();
    }
});

// Opcional: Función para mostrar/ocultar el navbar mobile con animación basada en scroll
function handleNavbarVisibility() {
    const navBarMobile = document.querySelector('.navBarMobile');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down - ocultar navbar
            navBarMobile.classList.add('hide');
        } else {
            // Scrolling up - mostrar navbar
            navBarMobile.classList.remove('hide');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
}

// Descomentar la siguiente línea si quieres que el navbar se oculte al hacer scroll hacia abajo
 handleNavbarVisibility();