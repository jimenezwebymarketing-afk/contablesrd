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

    // Sticky Nav con efecto de scroll
    const navWrapper = document.querySelector(".nav-wrapper");
    if (navWrapper) {
        let lastScrollY = window.scrollY;
        
        function handleScroll() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                navWrapper.classList.add("scrolled");
            } else {
                navWrapper.classList.remove("scrolled");
            }
            
            lastScrollY = currentScrollY;
        }
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Check initial state
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

    // Carrusel de Reviews
    const reviewsTrack = document.querySelector(".reviews-track");
    const prevBtn = document.querySelector(".review-prev");
    const nextBtn = document.querySelector(".review-next");
    
    if (reviewsTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        const cardWidth = 366; // 350px + 16px gap
        const visibleCards = Math.floor(reviewsTrack.parentElement.offsetWidth / cardWidth) || 1;
        const maxPosition = -(reviewsTrack.children.length - visibleCards) * cardWidth;
        
        function updateCarousel() {
            reviewsTrack.style.transform = `translateX(${currentPosition}px)`;
        }
        
        nextBtn.addEventListener("click", () => {
            if (currentPosition > maxPosition) {
                currentPosition -= cardWidth;
                if (currentPosition < maxPosition) currentPosition = maxPosition;
                updateCarousel();
            }
        });
        
        prevBtn.addEventListener("click", () => {
            if (currentPosition < 0) {
                currentPosition += cardWidth;
                if (currentPosition > 0) currentPosition = 0;
                updateCarousel();
            }
        });
        
        // Touch/drag support
        let isDragging = false;
        let startX = 0;
        let dragStartPosition = 0;
        
        reviewsTrack.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.pageX;
            dragStartPosition = currentPosition;
        });
        
        reviewsTrack.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const diff = e.pageX - startX;
            currentPosition = dragStartPosition + diff;
            updateCarousel();
        });
        
        reviewsTrack.addEventListener("mouseup", () => {
            isDragging = false;
            // Snap to nearest card
            currentPosition = Math.round(currentPosition / cardWidth) * cardWidth;
            if (currentPosition > 0) currentPosition = 0;
            if (currentPosition < maxPosition) currentPosition = maxPosition;
            updateCarousel();
        });
        
        reviewsTrack.addEventListener("mouseleave", () => {
            if (isDragging) {
                isDragging = false;
                currentPosition = Math.round(currentPosition / cardWidth) * cardWidth;
                if (currentPosition > 0) currentPosition = 0;
                if (currentPosition < maxPosition) currentPosition = maxPosition;
                updateCarousel();
            }
        });
    }

    // Formulario de contacto con Web3Forms
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById("btn-submit");
            const formMessage = document.getElementById("form-message");
            
            // Estado de carga
            btn.classList.add("is-loading");
            btn.disabled = true;
            formMessage.classList.remove("is-visible", "success", "error");
            
            // Recopilar datos del formulario
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Redirigir a página de agradecimiento
                    window.location.href = "gracias.html";
                } else {
                    console.error("Web3Forms error:", result);
                    throw new Error(result.message || "Error al enviar el mensaje");
                }
            } catch (error) {
                formMessage.textContent = "Error: " + error.message + ". Por favor, intenta de nuevo o contáctanos por WhatsApp.";
                formMessage.classList.add("is-visible", "error");
                console.error("Error completo:", error);
            } finally {
                btn.classList.remove("is-loading");
                btn.disabled = false;
            }
        });
    }
});
