/* ==========================================================
   AEPUNS WEBSITE
   Main Script
========================================================== */

const bubbles = document.querySelectorAll(".bubble");
const website = document.querySelector("#website");
const stage = document.querySelector("#stage");
let isTransitioning = false;

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

        const stageBounds = stage.getBoundingClientRect();
        const point = document.querySelector(`#point-${bubble.id}`);
        const pointBounds = point.getBoundingClientRect();
        const pointX = pointBounds.left + (pointBounds.width / 2) - stageBounds.left;
        const pointY = pointBounds.top + (pointBounds.height / 2) - stageBounds.top;
        const scale = 20;
        const cameraX = (window.innerWidth / 2) - stageBounds.left - (pointX * scale);
        const cameraY = (window.innerHeight / 2) - stageBounds.top - (pointY * scale);
        const backgroundCameraX = (window.innerWidth / 2) - ((pointBounds.left + (pointBounds.width / 2)) * scale);
        const backgroundCameraY = (window.innerHeight / 2) - ((pointBounds.top + (pointBounds.height / 2)) * scale);

        stage.style.setProperty("--camera-x", `${cameraX}px`);
        stage.style.setProperty("--camera-y", `${cameraY}px`);
        website.style.setProperty("--background-camera-x", `${backgroundCameraX}px`);
        website.style.setProperty("--background-camera-y", `${backgroundCameraY}px`);

        bubbles.forEach((item) => {

            item.style.pointerEvents = "none";
            item.style.animation = "none";

        });

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

        if (bubble.id === "music") {

            const redirectToMusic = (event) => {

                if (event.target !== stage || event.propertyName !== "transform") {

                    return;

                }

                stage.removeEventListener("transitionend", redirectToMusic);
                window.location.href = "music.html";

            };

            stage.addEventListener("transitionend", redirectToMusic);

        }

        window.setTimeout(() => {

            document.body.classList.add("is-fading");
            stage.classList.add("is-fading");

        }, 1150);

        requestAnimationFrame(() => {

            document.body.classList.add("is-zooming");
            stage.classList.add("is-zooming");
            blankBubble.classList.add("is-visible");

        });

    });

});
