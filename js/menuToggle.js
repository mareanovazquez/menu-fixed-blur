const menuToggle = document.getElementById('toggle');
const menuShow = document.getElementById('menuMobile');
const menuItems = document.querySelectorAll(".itemMenuMobile");
const menuItemsRRSS = document.querySelectorAll(".itemMenuRRSS")

function deployMenu() {
    menuToggle.classList.toggle('on');
    menuShow.classList.toggle('menuShow');
}

function closeMenu() {
    menuToggle.classList.remove("on");
    menuShow.classList.remove("menuShow");
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
        menuToggle.classList.remove("on");
        menuShow.classList.remove("menuShow");
    }
  });