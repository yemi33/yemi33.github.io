"use strict";

const siteRoot = new URL("../", document.currentScript.src);
const projects = {
    minions: {
        title: "Minions",
        category: "AI AGENTS / DEVELOPER TOOLS",
        description: "A mission control for a multi-agent AI development team. A place to turn a big idea into coordinated, inspectable work.",
        details: [
            "Organizes work items, plans, pull requests, agent meetings, and pipelines in one dashboard.",
            "Coordinates agents across planning, implementation, and validation, with notes and a shared knowledge base.",
            "Supports Claude Code and GitHub Copilot CLI runtimes."
        ],
        url: new URL("minions/", siteRoot).href,
        label: "Explore Minions"
    },
    copilot: {
        title: "Microsoft 365 Copilot",
        category: "SOFTWARE ENGINEER II / MICROSOFT",
        description: "I help bring AI-powered collaboration to mobile. My work connects the experiences people use with the platforms that make them possible.",
        details: [
            "Led cross-platform delivery of notebook navigation, chat steering, and notebook-first workflows across partner teams.",
            "Designed reusable APIs and state-management patterns for AI-powered document experiences.",
            "Earlier, built Microsoft Loop Android experiences including notifications, in-app purchases, and deep linking."
        ],
        url: new URL("resume.html", siteRoot).href,
        label: "Read my full resume"
    },
    contact: {
        title: "Let's say hello",
        category: "CONTACT / MOUNTAIN VIEW, CA",
        description: "Have a question, a project, or a delightfully weird idea? I'd love to hear it.",
        details: [
            "Email: yshin1999@gmail.com",
            "Use the email button below, or copy this address into your favorite email service. No configured mail app? You can still write to me there."
        ],
        url: "mailto:yshin1999@gmail.com",
        label: "Open email app"
    },
    chef: {
        title: "Chef rAImsey",
        category: "NATURAL LANGUAGE PROCESSING / CREATIVE CODING",
        description: "An early experiment in putting language models to deliciously questionable use: an AI that asks about your dessert preferences and dreams up a recipe.",
        details: [
            "Combines natural language processing, probabilistic language modeling, and recipe generation.",
            "Built with Python, with experiments in GPT-2, tokenization, and vector representations.",
            "A reminder that a playful question can be a very good starting point for learning."
        ],
        url: "https://github.com/yemi33/Chef-Raimsey",
        label: "See it on GitHub"
    }
};

const projectDialog = document.querySelector("#project-dialog");
for (const button of document.querySelectorAll("[data-project]")) {
    if (typeof projectDialog.showModal !== "function") continue;
    button.setAttribute("aria-haspopup", "dialog");
    button.addEventListener("click", event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const project = projects[button.dataset.project];
        document.querySelector(".dialog-titlebar > span").textContent = button.dataset.project === "contact"
            ? "CONTACT.TXT / YEMI SHIN"
            : "PROJECT FILE / YEMI SHIN";
        document.querySelector("#project-title").textContent = project.title;
        document.querySelector("#project-category").textContent = project.category;
        document.querySelector("#project-description").textContent = project.description;
        document.querySelector("#project-details").replaceChildren(...project.details.map(detail => {
            const item = document.createElement("li");
            item.textContent = detail;
            return item;
        }));
        const destination = document.querySelector("#project-destination");
        destination.href = project.url;
        destination.target = "_self";
        destination.textContent = `${project.label} \u2197`;
        projectDialog.showModal();
    });
}
document.querySelector("#close-project").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", event => {
    const bounds = projectDialog.getBoundingClientRect();
    if (event.target === projectDialog && (
        event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom
    )) projectDialog.close();
});

function initializeDoodle() {
    const canvas = document.querySelector("#doodle-canvas");
    const context = canvas.getContext("2d");
    const doodleStatus = document.querySelector("#doodle-status");
    const undoButton = document.querySelector("#undo-doodle");
    const controls = document.querySelectorAll("[data-tool], [data-color], #clear-doodle");
    for (const control of controls) control.disabled = !context;
    if (!context) {
        undoButton.disabled = true;
        doodleStatus.textContent = "Drawing isn't available in this browser. All project and resume links still work.";
        return;
    }
    doodleStatus.textContent = "Pick a color below, then draw here. Your doodle isn't uploaded or saved.";
    let color = "#25221f";
    let tool = "pen";
    let stroke = null;
    const strokes = [];

    function revealDoodle() {
        const bounds = canvas.getBoundingClientRect();
        if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
            canvas.scrollIntoView({ block: "center" });
        }
    }

    function setTool(next) {
        tool = next;
        for (const button of document.querySelectorAll("[data-tool]")) {
            const active = button.dataset.tool === tool;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        }
        doodleStatus.textContent = `${tool === "pen" ? "Pencil" : "Eraser"} selected. Draw in the little canvas.`;
        revealDoodle();
    }

    for (const button of document.querySelectorAll("[data-tool]")) {
        button.addEventListener("click", () => setTool(button.dataset.tool));
    }
    for (const swatch of document.querySelectorAll("[data-color]")) {
        swatch.addEventListener("click", () => {
            color = swatch.dataset.color;
            document.querySelector(".current-color").style.setProperty("--drawing-color", color);
            for (const button of document.querySelectorAll("[data-color]")) {
                button.setAttribute("aria-pressed", String(button === swatch));
            }
            setTool("pen");
            doodleStatus.textContent = `${swatch.getAttribute("aria-label")} pencil selected. Make your mark.`;
        });
    }

    function drawStroke(line) {
        context.globalCompositeOperation = line.tool === "eraser" ? "destination-out" : "source-over";
        context.strokeStyle = line.color;
        context.fillStyle = line.color;
        context.lineWidth = line.tool === "eraser" ? 25 : 5;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        if (line.points.length === 1) {
            context.arc(line.points[0].x, line.points[0].y, context.lineWidth / 2, 0, Math.PI * 2);
            context.fill();
        } else {
            context.moveTo(line.points[0].x, line.points[0].y);
            for (const point of line.points.slice(1)) context.lineTo(point.x, point.y);
            context.stroke();
        }
    }

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const line of strokes) drawStroke(line);
        if (stroke) drawStroke(stroke);
        undoButton.disabled = strokes.length === 0;
    }

    function pointFromEvent(event) {
        const bounds = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - bounds.left) * canvas.width / bounds.width,
            y: (event.clientY - bounds.top) * canvas.height / bounds.height
        };
    }

    canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0 || stroke) return;
        event.preventDefault();
        stroke = { color, tool, pointerId: event.pointerId, points: [pointFromEvent(event)] };
        canvas.setPointerCapture(event.pointerId);
        redraw();
    });
    canvas.addEventListener("pointermove", event => {
        if (!stroke || stroke.pointerId !== event.pointerId) return;
        stroke.points.push(pointFromEvent(event));
        redraw();
    });
    function finishStroke(event) {
        if (!stroke || stroke.pointerId !== event.pointerId) return;
        strokes.push(stroke);
        stroke = null;
        redraw();
        doodleStatus.textContent = "A masterpiece in progress. Your doodle stays on this page.";
    }
    canvas.addEventListener("pointerup", finishStroke);
    canvas.addEventListener("pointercancel", finishStroke);
    canvas.addEventListener("lostpointercapture", finishStroke);
    undoButton.addEventListener("click", () => {
        strokes.pop();
        redraw();
        doodleStatus.textContent = "Last stroke undone. Happy accidents welcome.";
        revealDoodle();
    });
    document.querySelector("#clear-doodle").addEventListener("click", () => {
        strokes.length = 0;
        stroke = null;
        redraw();
        doodleStatus.textContent = "Fresh canvas. Another idea?";
        revealDoodle();
    });
}

initializeDoodle();
