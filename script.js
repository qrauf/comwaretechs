const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesButton = document.getElementById('acceptCookies');

if (acceptCookiesButton) {
  acceptCookiesButton.addEventListener('click', () => {
    cookieBanner.classList.add('is-hidden');
    sessionStorage.setItem('comware-cookie-accepted', 'true');
  });
}

if (sessionStorage.getItem('comware-cookie-accepted') === 'true') {
  cookieBanner.classList.add('is-hidden');
}
