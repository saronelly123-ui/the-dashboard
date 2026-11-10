
// ==================================
// 1. SIDEBAR NAVIGATION
// ==================================

const menuLinks = document.querySelectorAll(".sidebar-menu a");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    closeSidebar();
  });
});


// ==================================
// 2. HAMBURGER MENU
// ==================================

const hamburger = document.getElementById("hamburger");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("sidebar-open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

sidebarBackdrop.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
  }
});


// ==================================
// 3. LIGHT MODE AND DARK MODE
// ==================================

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("dashboard-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDark ? "☀️" : "🌙";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const currentTheme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";

  localStorage.setItem("dashboard-theme", currentTheme);

  updateThemeButton();
});


// ==================================
// 4. SEARCH ORDERS
// ==================================

const searchInput = document.getElementById("searchInput");
const orderRows = document.querySelectorAll("#ordersTable tbody tr");
const noResults = document.getElementById("noResults");

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();

  let visibleRows = 0;

  orderRows.forEach((row) => {
    const matches = row.textContent.toLowerCase().includes(searchValue);

    row.style.display = matches ? "" : "none";

    if (matches) {
      visibleRows++;
    }
  });

  noResults.hidden = visibleRows !== 0;
});


// ==================================
// 5. NOTIFICATION BUTTON
// ==================================

const notificationBtn = document.getElementById("notificationBtn");

notificationBtn.addEventListener("click", () => {
  document.getElementById("activity").scrollIntoView({
    behavior: "smooth"
  });

  alert("You have 3 recent activities.");
});


// ==================================
// 6. DOWNLOAD ORDERS REPORT
// ==================================

const downloadButton = document.getElementById("downloadReport");

downloadButton.addEventListener("click", () => {
  const rows = document.querySelectorAll("#ordersTable tr");

  const csvData = Array.from(rows).map((row) => {
    const cells = Array.from(row.querySelectorAll("th, td"));

    return cells.map((cell) => {
      const value = cell.textContent.trim().replace(/"/g, '""');
      return `"${value}"`;
    }).join(",");
  });

  const csvContent = "\uFEFF" + csvData.join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "dashboard-orders-report.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});


// ==================================
// 7. SAVE ADMIN SETTINGS
// ==================================

const saveSettings = document.getElementById("saveSettings");
const adminName = document.getElementById("adminName");
const settingsMessage = document.getElementById("settingsMessage");

const welcomeText = document.querySelector(".welcome");
const avatar = document.querySelector(".avatar");

// Restore saved admin name
const savedAdminName = localStorage.getItem("admin-name");

if (savedAdminName) {
  adminName.value = savedAdminName;
  welcomeText.textContent = `Welcome back, ${savedAdminName}!`;
  avatar.textContent = savedAdminName.charAt(0).toUpperCase();
}

saveSettings.addEventListener("click", () => {
  const name = adminName.value.trim();

  if (name === "") {
    settingsMessage.textContent = "Please enter an admin name.";
    settingsMessage.style.color = "#ef4444";
    return;
  }

  // Save name
  localStorage.setItem("admin-name", name);

  // Update dashboard
  welcomeText.textContent = `Welcome back, ${name}!`;
  avatar.textContent = name.charAt(0).toUpperCase();

  // Show success message
  settingsMessage.textContent = "Settings saved successfully!";
  settingsMessage.style.color = "#10b981";
});
