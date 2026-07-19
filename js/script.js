/* ==========================================================
   AEPUNS WEBSITE
   Main Script
========================================================== */

const bubbles = document.querySelectorAll(".bubble");
const website = document.querySelector("#website");
const stage = document.querySelector("#stage");
const settingsButton = document.querySelector("#settings-button");
const settingsPanel = document.querySelector("#settings-panel");
const disableZoom = document.querySelector("#disable-zoom");
const disableBackground = document.querySelector("#disable-background");
const bubblePages = {
    updates: "updates.html",
    music: "music.html",
    about: "about.html",
    wip: "wip.html",
    socials: "socials.html"
};
let isTransitioning = false;

disableZoom.checked = document.documentElement.classList.contains("disable-bubble-zoom");
disableBackground.checked = document.documentElement.classList.contains("disable-background-motion");

settingsButton.addEventListener("click", () => {
    const willOpen = settingsPanel.hidden;
    settingsPanel.hidden = !willOpen;
    settingsButton.setAttribute("aria-expanded", String(willOpen));
    settingsButton.setAttribute("aria-label", willOpen ? "Close settings" : "Open settings");
});

disableZoom.addEventListener("change", () => {
    document.documentElement.classList.toggle("disable-bubble-zoom", disableZoom.checked);
    localStorage.setItem("disable-bubble-zoom", String(disableZoom.checked));
});

disableBackground.addEventListener("change", () => {
    document.documentElement.classList.toggle("disable-background-motion", disableBackground.checked);
    localStorage.setItem("disable-background-motion", String(disableBackground.checked));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !settingsPanel.hidden) {
        settingsPanel.hidden = true;
        settingsButton.setAttribute("aria-expanded", "false");
        settingsButton.setAttribute("aria-label", "Open settings");
        settingsButton.focus();
    }
});

window.addEventListener("pageshow", (event) => {
    if (
        event.persisted &&
        document.body.classList.contains("is-whiteout")
    ) {
        window.location.reload();
    }
});

const returnBubbleId = sessionStorage.getItem("return-to-bubble");
const zoomEffectsDisabled = document.documentElement.classList.contains("disable-bubble-zoom");
const returnFromBubble = document.documentElement.classList.contains("returning-from-bubble")
    && !zoomEffectsDisabled
    && document.querySelector(`#${returnBubbleId}`)
    && document.querySelector(`#point-${returnBubbleId}`);

if (returnBubbleId && zoomEffectsDisabled) {
    sessionStorage.removeItem("return-to-bubble");
    document.documentElement.classList.remove("returning-from-bubble");
    document.body.style.visibility = "visible";
}

if (returnFromBubble) {

    sessionStorage.removeItem("return-to-bubble");

    const bubble = document.querySelector(`#${returnBubbleId}`);
    const point = document.querySelector(`#point-${returnBubbleId}`);
    const stageBounds = stage.getBoundingClientRect();
    const pointBounds = point.getBoundingClientRect();
    const pointX = pointBounds.left + (pointBounds.width / 2) - stageBounds.left;
    const pointY = pointBounds.top + (pointBounds.height / 2) - stageBounds.top;
    const scale = 30;
    const cameraX = (window.innerWidth / 2) - stageBounds.left - (pointX * scale);
    const cameraY = (window.innerHeight / 2) - stageBounds.top - (pointY * scale);
    const backgroundCameraX = (window.innerWidth / 2) - ((pointBounds.left + (pointBounds.width / 2)) * scale);
    const backgroundCameraY = (window.innerHeight / 2) - ((pointBounds.top + (pointBounds.height / 2)) * scale);
    const bubbleBounds = bubble.getBoundingClientRect();
    const blankBubble = bubble.cloneNode(true);

    stage.style.setProperty("--camera-x", `${cameraX}px`);
    stage.style.setProperty("--camera-y", `${cameraY}px`);
    website.style.setProperty("--background-camera-x", `${backgroundCameraX}px`);
    website.style.setProperty("--background-camera-y", `${backgroundCameraY}px`);

    blankBubble.id = `${returnBubbleId}-blank`;
    blankBubble.classList.add("bubble-blank", "is-visible");
    blankBubble.src = bubble.src.replace(/\.png$/, "-blank.png");
    blankBubble.alt = "";
    blankBubble.style.left = `${bubbleBounds.left - stageBounds.left}px`;
    blankBubble.style.top = `${bubbleBounds.top - stageBounds.top}px`;
    blankBubble.style.right = "auto";
    blankBubble.style.bottom = "auto";
    blankBubble.style.width = `${bubbleBounds.width}px`;
    blankBubble.style.height = `${bubbleBounds.height}px`;
    blankBubble.style.transform = "none";
    stage.append(blankBubble);

    document.body.classList.add("is-preparing-return", "is-returning-home", "is-transitioning", "is-zooming", "is-fading");
    stage.classList.add("is-zooming");
    stage.getBoundingClientRect();

    document.body.style.visibility = "visible";
    document.documentElement.classList.remove("returning-from-bubble");
    document.body.classList.remove("is-preparing-return");

    const finishZoomOut = (event) => {
        if (event.target === stage && event.propertyName === "transform") {
            stage.removeEventListener("transitionend", finishZoomOut);
            document.body.classList.remove("is-returning-home", "is-transitioning");
        }
    };

    stage.addEventListener("transitionend", finishZoomOut);

    requestAnimationFrame(() => {
        document.body.classList.remove("is-zooming", "is-fading");
        stage.classList.remove("is-zooming");

        window.setTimeout(() => {
            blankBubble.classList.remove("is-visible");
            blankBubble.addEventListener("transitionend", () => {
                blankBubble.remove();
            }, { once:true });
        }, 500);
    });

}

/* ==========================================================
                    Hover Rock
========================================================== */

bubbles.forEach((bubble) => {

    bubble.addEventListener("mouseenter", () => {

        const animation = bubble.id === "about" ? "rock-about" : "rock";

        bubble.style.animation = `${animation} .8s ease-in-out infinite alternate`;

    });

    bubble.addEventListener("mouseleave", () => {

        bubble.style.animation = "";

    });

});

/* ==========================================================
                    Click Transition
========================================================== */

bubbles.forEach((bubble) => {

    bubble.addEventListener("click", () => {

        if (isTransitioning) {

            return;

        }

        isTransitioning = true;
        document.body.classList.add("is-transitioning");

        bubbles.forEach((item) => {
            item.style.pointerEvents = "none";
            item.style.animation = "none";
        });

        if (document.documentElement.classList.contains("disable-bubble-zoom")) {
            sessionStorage.setItem("return-to-bubble", bubble.id);
            window.location.href = bubblePages[bubble.id];

            return;
        }

        const stageBounds = stage.getBoundingClientRect();
        const point = document.querySelector(`#point-${bubble.id}`);
        const pointBounds = point.getBoundingClientRect();
        const pointX = pointBounds.left + (pointBounds.width / 2) - stageBounds.left;
        const pointY = pointBounds.top + (pointBounds.height / 2) - stageBounds.top;
        const scale = 30;
        const cameraX = (window.innerWidth / 2) - stageBounds.left - (pointX * scale);
        const cameraY = (window.innerHeight / 2) - stageBounds.top - (pointY * scale);
        const backgroundCameraX = (window.innerWidth / 2) - ((pointBounds.left + (pointBounds.width / 2)) * scale);
        const backgroundCameraY = (window.innerHeight / 2) - ((pointBounds.top + (pointBounds.height / 2)) * scale);

        stage.style.setProperty("--camera-x", `${cameraX}px`);
        stage.style.setProperty("--camera-y", `${cameraY}px`);
        website.style.setProperty("--background-camera-x", `${backgroundCameraX}px`);
        website.style.setProperty("--background-camera-y", `${backgroundCameraY}px`);

        const bubbleBounds = bubble.getBoundingClientRect();
        const blankBubble = bubble.cloneNode(true);

        blankBubble.id = `${bubble.id}-blank`;
        blankBubble.classList.add("bubble-blank");
        blankBubble.src = bubble.src.replace(/\.png$/, "-blank.png");
        blankBubble.alt = "";
        blankBubble.style.left = `${bubbleBounds.left - stageBounds.left}px`;
        blankBubble.style.top = `${bubbleBounds.top - stageBounds.top}px`;
        blankBubble.style.right = "auto";
        blankBubble.style.bottom = "auto";
        blankBubble.style.width = `${bubbleBounds.width}px`;
        blankBubble.style.height = `${bubbleBounds.height}px`;
        blankBubble.style.transform = "none";

        stage.append(blankBubble);

        const redirectToBubblePage = (event) => {

            if (event.target !== stage || event.propertyName !== "transform") {

                return;

            }

            stage.removeEventListener("transitionend", redirectToBubblePage);
            document.body.classList.add("is-whiteout");
            sessionStorage.setItem("return-to-bubble", bubble.id);

            window.setTimeout(() => {

                window.location.href = bubblePages[bubble.id];

            }, 100);

        };

        stage.addEventListener("transitionend", redirectToBubblePage);

        requestAnimationFrame(() => {

            document.body.classList.add("is-zooming");
            stage.classList.add("is-zooming");
            blankBubble.classList.add("is-visible");

        });

    });

});
