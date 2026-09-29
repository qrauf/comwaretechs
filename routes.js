// Clean URLs for page sections, e.g. /about or /azure instead of #about or
// /cloud-partners#azure. The server serves the owning page for these paths
// (catch-all document for the home page, ingress rewrites for the partners
// page); this script scrolls to the section and keeps the URL in sync.
const sectionRouteGroups = [
  { marker: 'about', routes: { '/': null, '/about': 'about', '/contact': 'contact' } },
  { marker: 'aws', routes: { '/cloud-partners': null, '/aws': 'aws', '/azure': 'azure', '/gcp': 'gcp' } },
  {
    marker: 'strategy',
    routes: {
      '/services': null,
      '/strategy': 'strategy',
      '/migration': 'migration',
      '/infrastructure': 'infrastructure',
      '/security': 'security',
      '/automation': 'automation',
      '/support': 'support',
      '/data': 'data',
      '/optimization': 'optimization',
    },
  },
  {
    marker: 'agentic-ai',
    routes: {
      '/ai-services': null,
      '/agentic-ai': 'agentic-ai',
      '/generative-ai': 'generative-ai',
      '/assessment': 'assessment',
      '/big-data': 'big-data',
      '/whitepaper': 'whitepaper',
    },
  },
];

const normalizePath = (path) => path.replace(/\/+$/, '') || '/';
const sectionRoutes = sectionRouteGroups.find((group) => document.getElementById(group.marker))?.routes;

function scrollToRoute(path, behavior) {
  const sectionId = sectionRoutes[path];
  if (sectionId === null) {
    window.scrollTo({ top: 0, behavior });
  } else {
    document.getElementById(sectionId)?.scrollIntoView({ behavior });
  }
}

if (sectionRoutes) {
  const initialPath = normalizePath(window.location.pathname);
  if (sectionRoutes[initialPath]) {
    window.addEventListener('load', () => scrollToRoute(initialPath, 'instant'));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || link.origin !== window.location.origin || link.hash) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    const path = normalizePath(link.pathname);
    if (!(path in sectionRoutes)) return;

    event.preventDefault();
    if (normalizePath(window.location.pathname) !== path) {
      window.history.pushState(null, '', path);
    }
    scrollToRoute(path, 'smooth');
  });

  window.addEventListener('popstate', () => {
    const path = normalizePath(window.location.pathname);
    if (path in sectionRoutes) scrollToRoute(path, 'smooth');
  });
}
