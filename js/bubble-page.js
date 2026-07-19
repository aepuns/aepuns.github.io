const homeLink = document.querySelector(".back-link");
const bubbleId = document.body.dataset.bubble;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let isLeaving = false;

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        isLeaving = false;
        document.body.classList.remove("is-leaving");
    }
});

homeLink.addEventListener("click", (event) => {
    if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        isLeaving
    ) {
        return;
    }

    event.preventDefault();
    isLeaving = true;
    sessionStorage.setItem("return-to-bubble", bubbleId);

    if (localStorage.getItem("disable-bubble-zoom") === "true") {
        window.location.href = homeLink.href;
        return;
    }

    document.body.classList.add("is-leaving");

    window.setTimeout(() => {
        window.location.href = homeLink.href;
    }, prefersReducedMotion.matches ? 0 : 350);
});
