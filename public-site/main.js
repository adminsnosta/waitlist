const loadingScreen = document.querySelector('.loading-screen');
if (loadingScreen) {
  document.documentElement.classList.add('has-js');
  const startedAt = performance.now();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finished = false;
  const finishLoading = () => {
    if (finished) return;
    finished = true;
    const remaining = Math.max(0, (reducedMotion ? 0 : 850) - (performance.now() - startedAt));
    window.setTimeout(() => {
      loadingScreen.classList.add('is-finished');
      window.setTimeout(() => { loadingScreen.hidden = true; }, reducedMotion ? 0 : 450);
    }, remaining);
  };
  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading, { once: true });
  window.setTimeout(finishLoading, 5000);
}

document.querySelectorAll('[data-comparison]').forEach((comparison) => {
  const range = comparison.querySelector('.comparison-range');
  const before = comparison.querySelector('.comparison-before');
  const divider = comparison.querySelector('.comparison-divider');
  const handle = comparison.querySelector('.comparison-handle');
  const update = () => {
    const position = Number(range.value);
    before.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    divider.style.left = `${position}%`;
    handle.style.left = `${position}%`;
  };
  range.addEventListener('input', update);
  update();
});

const postPreview = document.querySelector('.post-preview');
if (postPreview) {
  const starButton = postPreview.querySelector('[data-star-button]');
  const baseStarCount = Number(starButton.dataset.count) || 0;
  const photo = postPreview.querySelector('.post-preview-photo');
  const starBurst = postPreview.querySelector('.post-star-burst');
  const feedback = postPreview.querySelector('.post-preview-feedback');
  let lastTouchTap = 0;
  let lastTouchStar = 0;

  const showCount = (button, count) => {
    const value = Math.max(0, Number(count) || 0);
    const countLabel = button.querySelector('.post-action-count');
    button.dataset.count = String(value);
    countLabel.textContent = value ? value.toLocaleString() : '';
    countLabel.hidden = value === 0;
  };
  postPreview.querySelectorAll('.post-action').forEach((button) => {
    showCount(button, button.dataset.count);
  });

  const showStarBurst = () => {
    photo.classList.remove('is-bursting');
    void photo.offsetWidth;
    photo.classList.add('is-bursting');
  };

  const setStarred = (starred) => {
    starButton.classList.toggle('is-starred', starred);
    starButton.setAttribute('aria-pressed', String(starred));
    starButton.setAttribute('aria-label', starred ? 'remove star from this post' : 'star this post');
    showCount(starButton, baseStarCount + (starred ? 1 : 0));
    if (starred) showStarBurst();
    feedback.hidden = true;
  };

  starButton.addEventListener('click', () => {
    setStarred(starButton.getAttribute('aria-pressed') !== 'true');
  });

  photo.addEventListener('dblclick', () => {
    if (Date.now() - lastTouchStar < 600) return;
    setStarred(true);
  });

  photo.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch') return;
    const now = Date.now();
    if (now - lastTouchTap < 350) {
      lastTouchStar = now;
      lastTouchTap = 0;
      setStarred(true);
    } else {
      lastTouchTap = now;
    }
  });

  starBurst.addEventListener('animationend', () => photo.classList.remove('is-bursting'));

  postPreview.querySelectorAll('[data-post-action]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.postAction === 'comment') {
        const comments = postPreview.querySelector('.post-preview-comments');
        comments.scrollIntoView({ block: 'nearest' });
        comments.focus({ preventScroll: true });
        feedback.hidden = true;
        return;
      }
      feedback.textContent = 'sharing will be available with published posts.';
      feedback.hidden = false;
    });
  });
}
