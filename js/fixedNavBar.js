document.addEventListener("scroll", function() {
    let navBar = document.getElementById('navBar');
    let sectionUno = document.getElementById("seccionPrimera");
    
    // Calcula la posición de sectionUno
    let sectionUnoRect = sectionUno.getBoundingClientRect();
    
    // Agrega o quita la clase según la posición de scroll
    if (window.scrollY > sectionUnoRect.top) {
                navBar.classList.add("fixed"); // Fija el menú en su posición
    } else {
                navBar.classList.remove("fixed"); // Quita la fijación del menú
    }
});