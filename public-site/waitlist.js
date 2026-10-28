(() => {
  const form = document.querySelector('#waitlist-form');
  const email = document.querySelector('#waitlist-email');
  const button = document.querySelector('#waitlist-submit');
  const endpoint = 'https://script.google.com/macros/s/AKfycbzPo_7AllNY5e9wLT-2ASaf8gcSl_s_Co2mi3sMJZBVlx8oM06-qexO3utD9oBOquu_/exec';

  form.elements.namedItem('_next').value = new URL('./thanks.html', location.href).href;
  form.elements.namedItem('_url').value = location.href;

  if (!endpoint) {
    // Keep the activated FormSubmit enrollment working until the Google endpoint is ready.
    form.addEventListener('submit', () => { email.value = email.value.trim(); });
    return;
  }

  const feedback = document.createElement('p');
  feedback.className = 'waitlist-feedback';
  feedback.setAttribute('role', 'status');
  form.appendChild(feedback);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    email.value = email.value.trim();
    if (button.disabled) return;
    button.disabled = true;
    feedback.textContent = 'adding you to the list…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    const body = new URLSearchParams({
      email: email.value,
      origin: location.origin,
      nonce: crypto.randomUUID().replace(/-/g, ''),
      _honey: form.elements.namedItem('_honey').value,
    });
    try {
      // Apps Script does not expose CORS response headers. A completed request
      // is followed by an email confirmation, which is the source of truth.
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body, signal: controller.signal });
      location.assign(new URL('./thanks.html', location.href));
    } catch (_) {
      button.disabled = false;
      feedback.textContent = 'we couldn’t reach the waitlist. please try again.';
    } finally {
      clearTimeout(timer);
    }
  });
})();
