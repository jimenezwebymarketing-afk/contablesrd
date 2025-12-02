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

    // EmailJS config (reemplaza con tus credenciales reales)
    const EMAILJS_PUBLIC_KEY = "TU_PUBLIC_KEY_DE_EMAILJS";
    const EMAILJS_SERVICE_ID = "TU_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";

    if (window.emailjs && EMAILJS_PUBLIC_KEY !== "TU_PUBLIC_KEY_DE_EMAILJS") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");
    const submitBtn = document.getElementById("contact-submit");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nombre = form.elements["nombre"].value.trim();
            const empresa = form.elements["empresa"].value.trim();
            const email = form.elements["email"].value.trim();
            const telefono = form.elements["telefono"].value.trim();
            const servicio = form.elements["servicio"].value;
            const mensaje = form.elements["mensaje"].value.trim();

            if (!nombre || !email || !mensaje) {
                alert("Por favor completa tu nombre, correo y mensaje antes de enviar.");
                return;
            }

            if (window.emailjs &&
                EMAILJS_PUBLIC_KEY !== "TU_PUBLIC_KEY_DE_EMAILJS" &&
                EMAILJS_SERVICE_ID !== "TU_SERVICE_ID" &&
                EMAILJS_TEMPLATE_ID !== "TU_TEMPLATE_ID") {

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Enviando...";
                }
                if (statusEl) {
                    statusEl.textContent = "Enviando tu mensaje, por favor espera...";
                }

                const templateParams = {
                    nombre,
                    empresa: empresa || "No especificada",
                    correo: email,
                    telefono: telefono || "No especificado",
                    servicio: servicio || "No especificado",
                    mensaje
                };

                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                    .then(function () {
                        if (statusEl) {
                            statusEl.textContent = "¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.";
                        }
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = "Enviar mensaje";
                        }
                        form.reset();
                    })
                    .catch(function () {
                        if (statusEl) {
                            statusEl.textContent = "Ocurrió un problema al enviar con EmailJS. Intentaremos abrir tu correo.";
                        }
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = "Enviar mensaje";
                        }
                        fallbackMailto(nombre, empresa, email, telefono, servicio, mensaje);
                    });

            } else {
                fallbackMailto(nombre, empresa, email, telefono, servicio, mensaje);
            }
        });
    }

    function fallbackMailto(nombre, empresa, email, telefono, servicio, mensaje) {
        const subject = encodeURIComponent("Nuevo mensaje desde Contables RD");
        let bodyLines = [
            "Nombre: " + nombre,
            "Empresa: " + (empresa || "No especificada"),
            "Correo: " + email,
            "Teléfono: " + (telefono || "No especificado"),
            "Servicio de interés: " + (servicio || "No especificado"),
            "",
            "Mensaje:",
            mensaje
        ];

        const body = encodeURIComponent(bodyLines.join("\n"));
        const mailtoLink = "mailto:info@contablesrd.com?subject=" + subject + "&body=" + body;

        alert("No se encontró configuración activa de EmailJS. Se abrirá tu aplicación de correo para enviar el mensaje.");
        window.location.href = mailtoLink;
    }
});
