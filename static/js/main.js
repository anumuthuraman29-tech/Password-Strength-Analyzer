/**
 * SecurePass — Main Dashboard Interaction & Utilities
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Toggle
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebar');

  if (menuToggleBtn && sidebar) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // User Profile Dropdown
  const profileMenuBtn = document.getElementById('userProfileMenuBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileMenuBtn && profileDropdown) {
    profileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      profileDropdown.classList.remove('show');
    });
  }

  // Notification Icon Demo
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('System Integrity: All security policies active and up-to-date.', 'success');
    });
  }
});

/**
 * Universal Toast Notification
 * @param {string} message - Message text
 * @param {'success'|'error'|'info'} type - Toast type
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
