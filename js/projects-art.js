const sectionStorageKey = "projects-art-section";
const sectionTitle = document.querySelector(".projects-art-title");
const sectionTabs = Array.from(document.querySelectorAll(".projects-art-tab"));
const sectionPanels = Array.from(document.querySelectorAll(".projects-art-panel"));

if (window.twemoji) {
    twemoji.parse(document.querySelector(".bubble-page"), { folder: "svg", ext: ".svg" });
}

function updateSectionUnderline() {
    const activeTab = sectionTabs.find((tab) => tab.getAttribute("aria-pressed") === "true");

    if (!activeTab) {
        return;
    }

    sectionTitle.style.setProperty("--active-tab-left", `${activeTab.offsetLeft}px`);
    sectionTitle.style.setProperty("--active-tab-width", `${activeTab.offsetWidth}px`);
}

function selectSection(section, shouldStore = true) {
    sectionTabs.forEach((tab) => {
        tab.setAttribute("aria-pressed", String(tab.dataset.section === section));
    });

    sectionPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== section;
    });

    if (shouldStore) {
        localStorage.setItem(sectionStorageKey, section);
    }

    requestAnimationFrame(updateSectionUnderline);
}

const storedSection = localStorage.getItem(sectionStorageKey);
selectSection(storedSection === "art" ? "art" : "projects", false);

sectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        selectSection(tab.dataset.section);
    });
});

window.addEventListener("resize", updateSectionUnderline);
document.fonts?.ready.then(updateSectionUnderline);
