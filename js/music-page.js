const releaseCards = document.querySelectorAll(".release-card");
const homeLink = document.querySelector(".back-link");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let isLeaving = false;

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        isLeaving = false;
        document.body.classList.remove("is-leaving");
    }
});

const fadeToPage = (link, markBubbleReturn = false) => {
    link.addEventListener("click", (event) => {
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

        if (markBubbleReturn) {
            sessionStorage.setItem("return-to-bubble", "music");
        }

        if (localStorage.getItem("disable-bubble-zoom") === "true") {
            window.location.href = link.href;
            return;
        }

        document.body.classList.add("is-leaving");

        window.setTimeout(() => {
            window.location.href = link.href;
        }, prefersReducedMotion.matches ? 0 : 350);
    });
};

releaseCards.forEach((card) => {
    fadeToPage(card);
});

fadeToPage(homeLink, true);
