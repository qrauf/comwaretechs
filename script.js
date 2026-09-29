const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesButton = document.getElementById('acceptCookies');
const contactStatus = document.getElementById('contactStatus');

const contactForm = document.getElementById('contactForm');
const contactThanks = document.getElementById('contactThanks');
const contactAgainButton = document.getElementById('contactAgain');
const contactResult = new URLSearchParams(window.location.search).get('contact');

if (contactResult === 'sent' && contactForm && contactThanks) {
  contactForm.hidden = true;
  contactThanks.hidden = false;
  contactThanks.focus({ preventScroll: true });
} else if (contactResult === 'error' && contactStatus) {
  contactStatus.textContent = 'Sorry, we could not send your message. Please try again or email contactus@comwaretechs.com directly.';
  contactStatus.hidden = false;
}

if (contactResult) {
  window.history.replaceState(null, '', `${window.location.pathname}#contact`);
}

if (contactAgainButton) {
  contactAgainButton.addEventListener('click', () => {
    contactThanks.hidden = true;
    contactForm.hidden = false;
    contactForm.reset();
    document.getElementById('name')?.focus();
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  });
}

// Re-enable the button if the page is restored from the back/forward cache.
window.addEventListener('pageshow', () => {
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Send';
  }
});

if (acceptCookiesButton) {
  acceptCookiesButton.addEventListener('click', () => {
    cookieBanner.classList.add('is-hidden');
    sessionStorage.setItem('comware-cookie-accepted', 'true');
  });
}

if (sessionStorage.getItem('comware-cookie-accepted') === 'true') {
  cookieBanner.classList.add('is-hidden');
}
