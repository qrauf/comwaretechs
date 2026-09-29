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
  window.history.replaceState(null, '', window.location.pathname);
}

// Clean URLs for home-page sections: /about and /contact serve the home page
// (via the static site's catch-all document) and scroll to the section.
const sectionPaths = { '/': 'top', '/about': 'about', '/contact': 'contact' };
const normalizePath = (path) => path.replace(/\/+$/, '') || '/';

function scrollToSection(path, behavior) {
  const section = document.getElementById(sectionPaths[path]);
  if (!section) return false;
  if (path === '/') {
    window.scrollTo({ top: 0, behavior });
  } else {
    section.scrollIntoView({ behavior });
  }
  return true;
}

if (document.getElementById('about')) {
  const initialPath = normalizePath(window.location.pathname);
  if (initialPath !== '/' && sectionPaths[initialPath]) {
    window.addEventListener('load', () => scrollToSection(initialPath, 'instant'));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || link.origin !== window.location.origin || link.hash) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    const path = normalizePath(link.pathname);
    if (!sectionPaths[path]) return;

    event.preventDefault();
    if (normalizePath(window.location.pathname) !== path) {
      window.history.pushState(null, '', path);
    }
    scrollToSection(path, 'smooth');
  });

  window.addEventListener('popstate', () => {
    scrollToSection(normalizePath(window.location.pathname), 'smooth');
  });
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
