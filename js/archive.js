"use strict";

for (const file of document.querySelectorAll(".experiment-file")) {
    file.addEventListener("toggle", () => {
        file.querySelector(".file-toggle").textContent = file.open ? "Close file" : "Open file";
    });
}

function openLinkedExperiment() {
    const file = document.getElementById(location.hash.slice(1));
    if (file instanceof HTMLDetailsElement) {
        file.open = true;
        file.scrollIntoView({ block: "start" });
    }
}

window.addEventListener("hashchange", openLinkedExperiment);
openLinkedExperiment();
