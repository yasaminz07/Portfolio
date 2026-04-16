// ── THEME TOGGLE ──
const html = document.documentElement;
const toggle = document.getElementById("themeToggle");

let theme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", theme);

function updateThemeIcon() {
  if (!toggle) return;

  toggle.innerHTML =
    theme === "dark"
      ? '<i data-lucide="sun"></i>'
      : '<i data-lucide="moon"></i>';

  if (window.lucide) {
    lucide.createIcons();
  }
}

if (toggle) {
  updateThemeIcon();

  toggle.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon();
  });
}

// ── HAMBURGER ──
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });
}

// ── REVEAL ON SCROLL ──
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((element) => {
    revealObserver.observe(element);
  });
}

// ── EDUCATION TABS ──
document.querySelectorAll(".edu-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".edu-tab").forEach((button) => {
      button.classList.remove("active");
    });

    document.querySelectorAll(".edu-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    tab.classList.add("active");

    const targetPanel = document.getElementById(`tab-${tab.dataset.tab}`);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  });
});

// ── PROJECT FILTER ──
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    const filter = button.dataset.filter;
    const cards = document.querySelectorAll("[data-category]");

    cards.forEach((card) => {
      const matches =
        filter === "all" || card.dataset.category.includes(filter);
      card.style.display = matches ? "" : "none";
      card.style.opacity = matches ? "1" : "0";
    });
  });
});

// ── CONTACT FORM ──
const submitBtn = document.getElementById("submitBtn");
const formDiv = document.getElementById("contactForm");
const successDiv = document.getElementById("formSuccess");

function validate() {
  const nameInput = document.getElementById("inp-name");
  const emailInput = document.getElementById("inp-email");
  const subjectInput = document.getElementById("inp-subject");
  const messageInput = document.getElementById("inp-message");

  const groupName = document.getElementById("group-name");
  const groupEmail = document.getElementById("group-email");
  const groupSubject = document.getElementById("group-subject");
  const groupMessage = document.getElementById("group-message");

  if (
    !nameInput ||
    !emailInput ||
    !subjectInput ||
    !messageInput ||
    !groupName ||
    !groupEmail ||
    !groupSubject ||
    !groupMessage
  ) {
    return false;
  }

  let ok = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value;
  const message = messageInput.value.trim();

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  groupName.classList.toggle("error", !name);
  groupEmail.classList.toggle("error", !emailRe.test(email));
  groupSubject.classList.toggle("error", !subject);
  groupMessage.classList.toggle("error", !message);

  if (!name || !emailRe.test(email) || !subject || !message) {
    ok = false;
  }

  return ok;
}

if (submitBtn && formDiv && successDiv) {
  submitBtn.addEventListener("click", async () => {
    if (!validate()) return;

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const subjectSelect = document.getElementById("inp-subject");

    const payload = {
      name: document.getElementById("inp-name").value.trim(),
      email: document.getElementById("inp-email").value.trim(),
      subject: subjectSelect.options[subjectSelect.selectedIndex].text,
      message: document.getElementById("inp-message").value.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      submitBtn.classList.remove("loading");

      if (response.ok && result.success) {
        formDiv.style.display = "none";
        successDiv.classList.add("show");
      } else {
        submitBtn.disabled = false;
        await showAlertModal(result.message || "Failed to send message.", {
          title: "Message not sent",
          type: "danger",
        });
      }
    } catch (error) {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      await showAlertModal("Something went wrong. Please try again.", {
        title: "Error",
        type: "danger",
      });
      console.error("Frontend form error:", error);
    }
  });
}

// ── ADMIN JS alert ──
function showCustomModal({
  title = "Notice",
  message = "",
  type = "default",
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) {
  return new Promise((resolve) => {
    const modal = document.getElementById("customModal");
    const titleEl = document.getElementById("customModalTitle");
    const messageEl = document.getElementById("customModalMessage");
    const iconEl = document.getElementById("customModalIcon");
    const confirmBtn = document.getElementById("modalConfirm");
    const cancelBtn = document.getElementById("modalCancel");
    const backdrop = modal?.querySelector(".custom-modal-backdrop");

    if (
      !modal ||
      !titleEl ||
      !messageEl ||
      !iconEl ||
      !confirmBtn ||
      !cancelBtn
    ) {
      resolve(showCancel ? confirm(message) : true);
      return;
    }

    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;
    cancelBtn.style.display = showCancel ? "inline-flex" : "none";

    iconEl.className = "custom-modal-icon";

    if (type === "danger") {
      iconEl.classList.add("danger");
      iconEl.textContent = "!";
    } else if (type === "success") {
      iconEl.classList.add("success");
      iconEl.textContent = "✓";
    } else if (type === "warning") {
      iconEl.classList.add("warning");
      iconEl.textContent = "!";
    } else {
      iconEl.textContent = "i";
    }

    modal.classList.remove("hidden");

    function cleanup(result) {
      modal.classList.add("hidden");
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
      backdrop?.removeEventListener("click", onCancel);
      document.removeEventListener("keydown", onKeyDown);
      resolve(result);
    }

    function onConfirm() {
      cleanup(true);
    }

    function onCancel() {
      cleanup(false);
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        cleanup(false);
      }
    }

    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
    backdrop?.addEventListener("click", onCancel);
    document.addEventListener("keydown", onKeyDown);
  });
}

function showAlertModal(message, options = {}) {
  return showCustomModal({
    title: options.title || "Notice",
    message,
    type: options.type || "default",
    confirmText: options.confirmText || "OK",
    showCancel: false,
  });
}

function showConfirmModal(message, options = {}) {
  return showCustomModal({
    title: options.title || "Please confirm",
    message,
    type: options.type || "warning",
    confirmText: options.confirmText || "OK",
    cancelText: options.cancelText || "Cancel",
    showCancel: true,
  });
}

// ── ADMIN JS ──
const adminLoginSection = document.getElementById("loginSection");
const adminAdminSection = document.getElementById("adminSection");
const adminInquiriesList = document.getElementById("inquiriesList");
const adminKeyInput = document.getElementById("adminKey");
const adminLoginBtn = document.getElementById("loginBtn");
const adminRefreshBtn = document.getElementById("refreshBtn");
const adminLogoutBtn = document.getElementById("logoutBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

if (
  adminLoginSection &&
  adminAdminSection &&
  adminInquiriesList &&
  adminKeyInput &&
  adminLoginBtn
) {
  let adminKey = "";

  adminLoginBtn.addEventListener("click", async () => {
    adminKey = adminKeyInput.value.trim();

    if (!adminKey) {
      showAlertModal("Please enter the admin key.", {
        title: "Admin key required",
        type: "warning",
      });
      return;
    }

    await loadAdminInquiries();
  });

  adminKeyInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      adminKey = adminKeyInput.value.trim();

      if (!adminKey) {
        showAlertModal("Please enter the admin key.");
        return;
      }

      await loadAdminInquiries();
    }
  });

  if (adminRefreshBtn) {
    adminRefreshBtn.addEventListener("click", async () => {
      await loadAdminInquiries();
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      adminKey = "";
      adminKeyInput.value = "";
      adminAdminSection.classList.add("is-hidden");
      adminLoginSection.classList.remove("is-hidden");
      adminInquiriesList.innerHTML = "";
    });
  }

  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener("click", async () => {
      const selectedIds = Array.from(
        document.querySelectorAll(".admin-select-box:checked"),
      ).map((checkbox) => checkbox.id.replace("select-", ""));

      await deleteMultipleInquiries(selectedIds);
    });
  }

  async function loadAdminInquiries() {
    try {
      const response = await fetch("/api/inquiries", {
        headers: {
          "x-admin-key": adminKey,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showAlertModal(
          "The admin key you entered is incorrect. Please try again.",
          {
            title: "Access denied",
            type: "danger",
            confirmText: "Try again",
          },
        );
        return;
      }

      adminLoginSection.classList.add("is-hidden");
      adminAdminSection.classList.remove("is-hidden");

      renderAdminInquiries(data.inquiries);
    } catch (error) {
      console.error(error);
      showAlertModal("Something went wrong.");
    }
  }

  function getAdminStatusClass(status) {
    const normalised = String(status).toLowerCase();

    if (normalised === "replied & resolved") return "both";
    if (normalised === "resolved") return "resolved";
    if (normalised === "replied") return "replied";
    return "new";
  }

  function renderAdminInquiries(inquiries) {
    if (!inquiries.length) {
      adminInquiriesList.innerHTML = `
        <div class="admin-empty-state">
          No inquiries found yet.
        </div>
      `;
      return;
    }

    adminInquiriesList.innerHTML = inquiries
      .map((item) => {
        const statusClass = getAdminStatusClass(item.status);

        return `
          <div class="admin-inquiry-card">
            <div class="admin-inquiry-head">
              <div class="admin-status-pill ${statusClass}">
                Status: ${escapeAdminHtml(item.status)}
              </div>
            </div>

            <div class="admin-info-block">
              <div class="admin-info-row"><strong>Name:</strong> ${escapeAdminHtml(item.name)}</div>
              <div class="admin-info-row"><strong>Email:</strong> ${escapeAdminHtml(item.email)}</div>
              <div class="admin-info-row"><strong>Subject:</strong> ${escapeAdminHtml(item.subject)}</div>
              <div class="admin-info-row"><strong>Message:</strong></div>
            </div>

            <div class="admin-message-box">${escapeAdminHtml(item.message).replace(/\n/g, "<br>")}</div>

            <div class="admin-received">Received: ${escapeAdminHtml(item.created_at)}</div>

            <div class="admin-checks">
              <div class="admin-check-item">
                <input
                  type="checkbox"
                  id="select-${item.id}"
                  class="admin-select-box"
                />
                <label for="select-${item.id}">
                  <span class="admin-fake-check"></span>
                  <span>Select</span>
                </label>
              </div>

              <div class="admin-check-item">
                <input
                  type="checkbox"
                  id="replied-${item.id}"
                  ${item.replied ? "checked" : ""}
                />
                <label for="replied-${item.id}">
                  <span class="admin-fake-check"></span>
                  <span>Replied</span>
                </label>
              </div>

              <div class="admin-check-item">
                <input
                  type="checkbox"
                  id="resolved-${item.id}"
                  ${item.resolved ? "checked" : ""}
                />
                <label for="resolved-${item.id}">
                  <span class="admin-fake-check"></span>
                  <span>Resolved</span>
                </label>
              </div>

              <button
                class="admin-btn danger admin-delete-one"
                data-id="${item.id}"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    inquiries.forEach((item) => {
      const repliedCheckbox = document.getElementById(`replied-${item.id}`);
      const resolvedCheckbox = document.getElementById(`resolved-${item.id}`);

      if (repliedCheckbox) {
        repliedCheckbox.addEventListener("change", async () => {
          await handleAdminCheckboxChange(item.id);
        });
      }

      if (resolvedCheckbox) {
        resolvedCheckbox.addEventListener("change", async () => {
          await handleAdminCheckboxChange(item.id);
        });
      }
    });

    document.querySelectorAll(".admin-delete-one").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        await deleteSingleInquiry(id);
      });
    });
  }

  async function handleAdminCheckboxChange(id) {
    const replied = document.getElementById(`replied-${id}`).checked;
    const resolved = document.getElementById(`resolved-${id}`).checked;

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ replied, resolved }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showAlertModal(data.message || "Failed to update inquiry.");
        await loadAdminInquiries();
        return;
      }

      await loadAdminInquiries();
    } catch (error) {
      console.error(error);
      showAlertModal("Failed to update inquiry.");
      await loadAdminInquiries();
    }
  }

  async function deleteSingleInquiry(id) {
    const confirmed = await showConfirmModal(
      "Are you sure you want to delete this inquiry?",
      {
        title: "Delete inquiry",
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showAlertModal(data.message || "Failed to delete inquiry.");
        return;
      }

      await loadAdminInquiries();
    } catch (error) {
      console.error(error);
      showAlertModal("Failed to delete inquiry.");
    }
  }

  async function deleteMultipleInquiries(ids) {
    if (!ids.length) {
      showAlertModal("Please select at least one inquiry.");
      return;
    }

    const confirmed = await showConfirmModal(
      `Are you sure you want to delete ${ids.length} selected inquiry/inquiries?`,
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/inquiries/delete-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showAlertModal(data.message || "Failed to delete selected inquiries.");
        return;
      }

      await loadAdminInquiries();
    } catch (error) {
      console.error(error);
      showAlertModal("Failed to delete selected inquiries.");
    }
  }

  function escapeAdminHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
