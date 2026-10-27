(() => {
  const key = 'nosta-theme';
  let theme = 'light';
  try {
    theme = localStorage.getItem(key) === 'dark' ? 'dark' : 'light';
  } catch (_) {
    // The switch still works for this page if storage is unavailable.
  }

  const applyTheme = (nextTheme) => {
    theme = nextTheme;
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#101e3e' : '#f7edb6';
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const label = theme === 'dark' ? 'switch to light theme' : 'switch to dark theme';
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = label;
    });
  };

  window.nostaTheme = {
    set(nextTheme) {
      applyTheme(nextTheme === 'dark' ? 'dark' : 'light');
      try { localStorage.setItem(key, theme); } catch (_) { /* Keep the page usable. */ }
    },
  };

  applyTheme(theme);
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        window.nostaTheme.set(theme === 'dark' ? 'light' : 'dark');
      });
    });
  });
})();
