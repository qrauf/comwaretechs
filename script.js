const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesButton = document.getElementById('acceptCookies');
const contactStatus = document.getElementById('contactStatus');

if (contactStatus && new URLSearchParams(window.location.search).get('contact') === 'sent') {
  contactStatus.textContent = 'Thank you. Your message has been sent.';
  contactStatus.hidden = false;
  window.history.replaceState(null, '', `${window.location.pathname}#contact`);
}

if (acceptCookiesButton) {
  acceptCookiesButton.addEventListener('click', () => {
    cookieBanner.classList.add('is-hidden');
    sessionStorage.setItem('comware-cookie-accepted', 'true');
  });
}

if (sessionStorage.getItem('comware-cookie-accepted') === 'true') {
  cookieBanner.classList.add('is-hidden');
}
