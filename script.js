const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesButton = document.getElementById('acceptCookies');
const contactStatus = document.getElementById('contactStatus');

const contactResult = new URLSearchParams(window.location.search).get('contact');
const contactMessages = {
  sent: 'Thank you. Your message has been sent.',
  error: 'Sorry, we could not send your message. Please email contactus@comwaretechs.com directly.',
};

if (contactStatus && contactMessages[contactResult]) {
  contactStatus.textContent = contactMessages[contactResult];
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
