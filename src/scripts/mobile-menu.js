document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuButton || !mobileMenu) {
    console.error('Mobile menu elements not found');
    return;
  }

  function toggleMenu(show) {
    const menuIconWrapper = mobileMenuButton.querySelector('.menu-icon-wrapper');
    const closeIconWrapper = mobileMenuButton.querySelector('.close-icon-wrapper');

    if (show) {
      mobileMenu.classList.remove('hidden');
      if (menuIconWrapper) menuIconWrapper.classList.add('hidden');
      if (closeIconWrapper) closeIconWrapper.classList.remove('hidden');
      mobileMenuButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.add('hidden');
      if (menuIconWrapper) menuIconWrapper.classList.remove('hidden');
      if (closeIconWrapper) closeIconWrapper.classList.add('hidden');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !mobileMenu.classList.contains('hidden');
    toggleMenu(isOpen);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMenu(false);
      }
    }
  });

  // Close mobile menu when clicking a link
  const menuLinks = document.querySelectorAll('#mobile-menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Mobile dropdown toggles
  const dropdownButtons = document.querySelectorAll('.mobile-dropdown-button');
  dropdownButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = button.nextElementSibling;
      const icon = button.querySelector('.mobile-dropdown-icon');
      if (content) content.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      toggleMenu(false);
    }
  });

  console.log('Mobile menu initialized successfully');
});
