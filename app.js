const overlay = document.getElementById("subscribeOverlay");
const openButtons = document.querySelectorAll("[data-open-subscribe]");
const closeButtons = document.querySelectorAll("[data-close-subscribe]");
const joinForm = document.querySelector(".join-form");
const message = document.querySelector(".form-message");
const lightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCloseButtons = document.querySelectorAll("[data-close-lightbox]");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");
const zoomableImages = document.querySelectorAll(
    ".hero-card-main img, .panel-founder img, .gallery-card img, .benefit-callout img, .visit-card img, .night-card img"
);

let scale = 1;
let lightboxOpen = false;
let lightboxHistoryOpen = false;

function setOverlay(open) {
    overlay.classList.toggle("active", open);
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("modal-open", open);
}

function applyZoom() {
    lightboxImage.style.transform = `scale(${scale})`;
}

function adjustZoom(nextScale) {
    scale = Math.min(4, Math.max(1, nextScale));
    applyZoom();
}

function openLightbox(image) {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    scale = 1;
    applyZoom();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    lightboxOpen = true;

    if (!lightboxHistoryOpen) {
        history.pushState({ lightbox: true }, "");
        lightboxHistoryOpen = true;
    }
}

function closeLightbox(fromHistory = false) {
    if (!lightboxOpen) {
        return;
    }

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    scale = 1;
    lightboxOpen = false;

    if (!overlay.classList.contains("active")) {
        document.body.classList.remove("modal-open");
    }

    if (!fromHistory && lightboxHistoryOpen) {
        history.back();
        return;
    }

    lightboxHistoryOpen = false;
}

openButtons.forEach((button) => {
    button.addEventListener("click", () => setOverlay(true));
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => setOverlay(false));
});

zoomableImages.forEach((image) => {
    image.addEventListener("click", () => openLightbox(image));
});

lightboxCloseButtons.forEach((button) => {
    button.addEventListener("click", () => closeLightbox());
});

zoomInBtn.addEventListener("click", () => adjustZoom(scale + 0.25));
zoomOutBtn.addEventListener("click", () => adjustZoom(scale - 0.25));
zoomResetBtn.addEventListener("click", () => adjustZoom(1));

lightboxImage.addEventListener("click", () => {
    adjustZoom(scale >= 2 ? 1 : scale + 0.5);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightboxOpen) {
        closeLightbox();
        return;
    }

    if (event.key === "Escape" && overlay.classList.contains("active")) {
        setOverlay(false);
    }
});

window.addEventListener("popstate", () => {
    if (lightboxOpen) {
        closeLightbox(true);
    } else {
        lightboxHistoryOpen = false;
    }
});

joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(joinForm);
    const name = formData.get("name")?.toString().trim() || "Swimmer";
    const plan = formData.get("plan")?.toString() || "membership";

    message.textContent = `${name}, your ${plan} request has been captured. We'll contact you shortly.`;
    joinForm.reset();
});
