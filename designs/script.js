"use strict";

const designs = {
    paint: {
        title: "Paint.exe",
        description: "A little Windows 98. A little art class. A lot of personality.",
        hint: "TRY THE BUTTONS. MAKE A DOODLE."
    },
    sketchbook: {
        title: "Sketchbook",
        description: "Warm paper, happy accidents, and a portfolio that feels like a personal notebook.",
        hint: "OPEN A PROJECT. FOLLOW A THREAD."
    },
    desktop: {
        title: "Yemi OS",
        description: "Your own tiny operating system. Open a file. Follow your curiosity.",
        hint: "OPEN A FILE. TRY THE START MENU."
    }
};
const tabs = [...document.querySelectorAll("[data-design-tab]")];
const panels = [...document.querySelectorAll(".concept")];
const startButton = document.querySelector("#start-button");
const startMenu = document.querySelector("#start-menu");

function setStartMenu(open) {
    startMenu.hidden = !open;
    startButton.setAttribute("aria-expanded", String(open));
}

function showDesign() {
    const requested = location.hash.slice(1);
    const selected = Object.hasOwn(designs, requested) ? requested : "paint";
    document.body.dataset.design = selected;
    for (const panel of panels) panel.hidden = panel.id !== selected;
    for (const tab of tabs) {
        const active = tab.dataset.designTab === selected;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
    }
    document.querySelector("#direction-description").textContent = designs[selected].description;
    document.querySelector("#direction-hint").textContent = designs[selected].hint;
    document.title = `Yemi's design playground - ${designs[selected].title}`;
    setStartMenu(false);
}

for (const [index, tab] of tabs.entries()) {
    tab.addEventListener("click", () => {
        const hash = `#${tab.dataset.designTab}`;
        if (location.hash !== hash) history.pushState(null, "", hash);
        showDesign();
    });
    tab.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].focus();
        tabs[next].click();
    });
}
window.addEventListener("hashchange", showDesign);
window.addEventListener("popstate", showDesign);
showDesign();

for (const link of document.querySelectorAll("[data-scroll-to]")) {
    link.addEventListener("click", event => {
        event.preventDefault();
        document.getElementById(link.dataset.scrollTo).scrollIntoView({ block: "start" });
    });
}

startButton.addEventListener("click", () => setStartMenu(startMenu.hidden));
document.addEventListener("click", event => {
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) setStartMenu(false);
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !startMenu.hidden) {
        setStartMenu(false);
        startButton.focus();
    }
});

const clock = document.querySelector("#os-clock");
function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit"
    }).format(now);
}
updateClock();
window.setInterval(updateClock, 30000);
