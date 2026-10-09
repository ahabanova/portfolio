// Custom cursor

const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll("a, button, .hero-photo").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

// Scroll reveal

const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .stagger-children",
);

function handleReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - revealPoint) {
            el.classList.add("active");
        }
    });
}

// Active navigation link

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function setActiveNav(scrollY) {
    let currentId = "";

    sections.forEach((section) => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            currentId = section.id;
        }
    });

    const atBottom =
        window.innerHeight + scrollY >= document.body.scrollHeight - 2;
    if (atBottom && sections.length) {
        currentId = sections[sections.length - 1].id;
    }

    navLinks.forEach((link) => {
        link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${currentId}`,
        );
    });
}

// Smooth scroll

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;

        e.preventDefault();

        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth",
        });
    });
});

// Scroll handler

function onScroll() {
    handleReveal();
    setActiveNav(window.scrollY);
}

window.addEventListener("scroll", () => {
    requestAnimationFrame(onScroll);
});

// Hamburger menu

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");
const navOverlay = document.querySelector(".nav-overlay");

function toggleMenu() {
    const isOpen = hamburger.classList.toggle("active");
    navMenu.classList.toggle("active", isOpen);
    navOverlay.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
}

if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
}

if (navOverlay) {
    navOverlay.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (hamburger.classList.contains("active")) {
            toggleMenu();
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger?.classList.contains("active")) {
        toggleMenu();
    }
});

// Contact form + toast (Notyf)

const notyf =
    typeof Notyf !== "undefined"
        ? new Notyf({
              duration: 5000,
              dismissible: false,
              ripple: false,
              position: { x: "right", y: "bottom" },
              types: [
                  {
                      type: "success",
                      background: "#ffffff",
                      icon: {
                          className: "notyf__icon--success",
                          tagName: "i",
                          color: "#ffffff",
                      },
                  },
                  {
                      type: "error",
                      background: "#ffffff",
                      icon: {
                          className: "notyf__icon--error",
                          tagName: "i",
                          color: "#ffffff",
                      },
                  },
              ],
          })
        : null;

const contactForm = document.querySelector(".contact-form");

if (contactForm && notyf) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Odesílám…";

        // FormSubmit má AJAX endpoint: stejná adresa, jen s /ajax/
        const ajaxUrl = contactForm.action.replace(
            "formsubmit.co/",
            "formsubmit.co/ajax/",
        );

        try {
            const response = await fetch(ajaxUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(
                    Object.fromEntries(new FormData(contactForm)),
                ),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || String(data.success) !== "true") {
                console.error("FormSubmit:", response.status, data);
                throw new Error(data.message || response.statusText);
            }

            notyf.success("Děkuji, zpráva byla odeslána. Ozvu se co nejdříve.");
            contactForm.reset();
        } catch (error) {
            notyf.error(
                "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo mi napište e-mail.",
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Gallery(GLightbox)

const bookGallery =
    typeof GLightbox !== "undefined"
        ? GLightbox({
              selector: ".glightbox",
              loop: true,
              touchNavigation: true,
          })
        : null;

document.querySelectorAll("[data-open-gallery]").forEach((link) => {
    link.addEventListener("click", (e) => {
        if (!bookGallery) return;
        e.preventDefault();
        bookGallery.openAt(0);
    });
});

// Init

window.addEventListener("load", () => {
    handleReveal();
    setActiveNav(window.scrollY);
});
