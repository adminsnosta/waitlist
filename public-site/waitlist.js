(() => {
  const form = document.querySelector('#waitlist-form');
  const email = document.querySelector('#waitlist-email');

  // FormSubmit redirects here only after accepting the form. The first use
  // still needs the owner to activate the destination mailbox.
  form.elements.namedItem('_next').value = new URL('./thanks.html', location.href).href;
  form.elements.namedItem('_url').value = location.href;

  form.addEventListener('submit', () => {
    email.value = email.value.trim();
  });
})();
