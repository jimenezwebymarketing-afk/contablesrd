document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.getElementById("main-nav");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("is-open");
            navLinks.classList.toggle("is-open");
        });

        // Cerrar menú al hacer clic en un enlace (en móvil)
        navLinks.querySelectorAll("a[href^='#']").forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("is-open");
                navLinks.classList.remove("is-open");
            });
        });
    }

    // Año dinámico en el footer
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Animación de notificación de WhatsApp ("¿Cómo podemos ayudarte?")
    const waNotification = document.getElementById("whatsapp-notification");
    if (waNotification) {
        setTimeout(() => {
            waNotification.classList.add("is-visible");
            setTimeout(() => {
                waNotification.classList.remove("is-visible");
            }, 12000);
        }, 3000);
    }
});
