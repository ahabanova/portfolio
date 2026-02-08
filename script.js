// SVG BORDER HELPERS

function addSVGBorder(element) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("pathLength", "100");

    svg.appendChild(rect);
    element.appendChild(svg);
}

document.querySelectorAll(".nav-links a").forEach(addSVGBorder);
document.querySelectorAll(".education-item").forEach(addSVGBorder);
document.querySelectorAll(".portfolio-item").forEach(addSVGBorder);

// CUSTOM CURSOR

const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document
    .querySelectorAll(
        "a, button, .education-item, .skill-item, .btn, .hero-photo",
    )
    .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () =>
            cursor.classList.remove("hover"),
        );
    });

// SCROLL REVEAL

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

// PARALLAX

const parallaxItems = document.querySelectorAll(".parallax");

function handleParallax(scrollY) {
    if (window.innerWidth <= 1024) return;

    parallaxItems.forEach((el) => {
        const speed = el.dataset.speed || 0.1;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

// ACTIVE NAV LINK

const sections = document.querySelectorAll("section[id]");
const navLinksForActive = document.querySelectorAll(".nav-links a");

function setActiveNav(scrollY) {
    sections.forEach((section) => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollY >= top && scrollY < bottom) {
            navLinksForActive.forEach((link) => {
                link.style.color = "";
                if (link.getAttribute("href") === `#${id}`) {
                    link.style.color = "var(--color-accent)";
                }
            });
        }
    });
}

// SMOOTH SCROLL

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        if (anchor.closest("form")) return;

        e.preventDefault();

        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;

        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth",
        });
    });
});

// SCROLL HANDLER

function onScroll() {
    const scrollY = window.pageYOffset;

    handleReveal();
    handleParallax(scrollY);
    setActiveNav(scrollY);
}

window.addEventListener("scroll", () => {
    requestAnimationFrame(onScroll);
});

// HAMBURGER MENU

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navOverlay = document.querySelector(".nav-overlay");
const navLinksItems = document.querySelectorAll(".nav-links a");

// Toggle menu
function toggleMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    navOverlay.classList.toggle("active");
    document.body.style.overflow = hamburger.classList.contains("active")
        ? "hidden"
        : "";
}

// Open/close menu
if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
}

if (navOverlay) {
    navOverlay.addEventListener("click", toggleMenu);
}

// Close menu when clicking on a link
navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

// Close menu on escape key
document.addEventListener("keydown", (e) => {
    if (
        e.key === "Escape" &&
        hamburger &&
        hamburger.classList.contains("active")
    ) {
        toggleMenu();
    }
});

// INIT

window.addEventListener("load", () => {
    document.body.style.opacity = "1";
    handleReveal();
});
