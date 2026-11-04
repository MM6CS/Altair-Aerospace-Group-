const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const setTheme = theme => {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.querySelectorAll('[data-light-src][data-dark-src]').forEach(image => {
      image.src = image.dataset[isDark ? 'darkSrc' : 'lightSrc'];
    });
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeToggle.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.querySelector('[aria-hidden="true"]').textContent = isDark ? '☼' : '◐';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#080e16' : '#f7f9fc');
  };

  try {
    setTheme(localStorage.getItem('altair-theme') === 'light' ? 'light' : 'dark');
  } catch (error) {
    console.error('Unable to read the saved ALTAIR colour theme.', error);
    setTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try {
      localStorage.setItem('altair-theme', theme);
    } catch (error) {
      console.error('Unable to save the ALTAIR colour theme preference.', error);
    }
  });
}

const categoryFilter = document.getElementById('project-category');
if (categoryFilter) {
  const requestedCategory = new URLSearchParams(window.location.search).get('discipline');
  if ([...categoryFilter.options].some(option => option.value === requestedCategory)) {
    categoryFilter.value = requestedCategory;
  }
}

const builderDivision = document.querySelector('[name="division"]');
if (builderDivision) {
  const requestedDivision = new URLSearchParams(window.location.search).get('division');
  if ([...builderDivision.options].some(option => option.value === requestedDivision)) {
    builderDivision.value = requestedDivision;
    const builderCategory = document.querySelector('[name="category"]');
    if (builderCategory && [...builderCategory.options].some(option => option.value === requestedDivision)) {
      builderCategory.value = requestedDivision;
    }
  }
}
