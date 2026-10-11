const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

const previewDialog = document.getElementById("previewDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogContent = document.getElementById("dialogContent");

function addPreviewField(title, value) {
    const wrapper = document.createElement("div");
    const heading = document.createElement("h3");
    const paragraph = document.createElement("p");
    heading.textContent = title;
    paragraph.textContent = value || "Not provided";
    wrapper.append(heading, paragraph);
    dialogContent.append(wrapper);
}

function openPreview(title, fields) {
    dialogTitle.textContent = title;
    dialogContent.replaceChildren();
    fields.forEach(([label, value]) => addPreviewField(label, value));
    if (typeof previewDialog.showModal === "function") {
        previewDialog.showModal();
    } else {
        alert("Preview dialog is not supported by this browser.");
    }
}

document.getElementById("closeDialog").addEventListener("click", () => previewDialog.close());
document.getElementById("dialogDone").addEventListener("click", () => previewDialog.close());
previewDialog.addEventListener("click", (event) => {
    if (event.target === previewDialog) previewDialog.close();
});

document.getElementById("reportForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    openPreview("Report preview", [
        ["Problem", form.problemTitle.value.trim()],
        ["Category", form.problemCategory.value],
        ["General location", form.problemLocation.value.trim()],
        ["Description", form.problemDescription.value.trim()],
        ["Contact name (private in a real system)", form.reporterName.value.trim() || "Not provided"],
        ["Contact phone (private in a real system)", form.reporterPhone.value.trim() || "Not provided"]
    ]);
    document.getElementById("reportMessage").textContent =
        "Preview opened. This prototype has not submitted or saved your report.";
});

document.getElementById("ideaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    openPreview("Community idea preview", [
        ["Idea", form.ideaTitle.value.trim()],
        ["Community", form.ideaLocation.value.trim()],
        ["Description", form.ideaDescription.value.trim()],
        ["Expected benefit", form.ideaBenefit.value.trim()]
    ]);
    document.getElementById("ideaMessage").textContent =
        "Preview opened. This prototype has not submitted or saved your idea.";
});

document.querySelectorAll(".support-button").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".community-card");
        const count = card.querySelector(".support-count");
        const message = document.getElementById("supportMessage");

        if (button.dataset.confirmed === "true") {
            message.textContent = "You have already confirmed this example report during this page visit.";
            return;
        }

        button.dataset.confirmed = "true";
        button.textContent = "Confirmed on this demo";
        button.disabled = true;
        button.classList.remove("button-outline");
        button.classList.add("button-primary");
        count.textContent = String(Number(count.textContent) + 1);
        message.textContent = `You confirmed "${button.dataset.title}" in this local demonstration. This change is not saved and is not sent to a leader.`;
    });
});

document.getElementById("reportSearch").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase().trim();
    document.querySelectorAll("#reportGrid .community-card").forEach((card) => {
        card.hidden = !card.dataset.search.includes(query) &&
            !card.textContent.toLowerCase().includes(query);
    });
});
