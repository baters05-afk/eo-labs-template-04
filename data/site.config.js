/*
 * Business configuration — the file you edit first for every new client.
 * Everything here can also be overridden by data/client.override.js
 * (exported from /admin) without touching this file.
 */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};

EO.defaults.siteConfig = {
  /* true  → DEMO TEMPLATE label, no data sent, no LocalBusiness schema, no fake contacts/projects.
     false → live client site. */
  demoMode: true,

  /* Visual character: "black-frame" | "warm-stone" | "minimal-white" (see css/presets.css) */
  preset: 'black-frame',

  company: {
    name: 'EO Labs Windows & Doors',
    shortName: 'EO Labs',
    legalName: '',
    description: { en: '', de: '' }, // footer blurb on live sites
    logo: 'assets/icons/logo.svg',
    /* true  → logo is a single-colour SVG that follows the text colour of the theme.
       false → logo is shown as an ordinary image (use for colour logos / PNG). */
    logoMono: true,
    favicon: 'assets/icons/favicon.svg'
  },

  /* Optional colour overrides on top of the preset. null = keep the preset value.
     primary   = "dark" section surface     secondary = "light" section surface
     accent    = buttons / highlights       black     = footer / page base */
  branding: {
    primary: null,
    secondary: null,
    accent: null,
    black: null,
    textDark: null,
    textLight: null,
    muted: null
  },

  /* Leave empty in demo mode — placeholders are shown instead of invented details. */
  contact: {
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    serviceArea: ['DE', 'AT', 'CH', 'BE', 'NL']
  },

  social: { instagram: '', linkedin: '', youtube: '' },

  /* Footer legal links (only rendered when a URL is set) */
  legal: { privacy: '', terms: '', cookies: '' },

  languages: {
    default: 'en',
    enabled: ['en', 'de']
  },

  features: {
    products: true,
    configurator: true,
    materials: true,
    projects: true,
    manufacturers: true,
    faq: true,
    presetSwitcher: true // small preset switch in the demo bar (only rendered while demoMode is true)
  },

  hero: {
    image: 'assets/images/hero-villa.svg',
    alt: {
      en: 'Modern villa terrace with panoramic sliding glazing and thin aluminium frames at dusk',
      de: 'Moderne Villenterrasse mit Panorama-Schiebeverglasung und schlanken Aluminiumrahmen in der Dämmerung'
    }
  },

  /* Technical showcase. Leave values empty to show the generic wording.
     Only enter figures that are certified for the client's real systems. */
  technical: {
    image: 'assets/images/profile-section.svg',
    specs: { thermal: '', acoustic: '', security: '', durability: '' },
    // e.g. { glazing: 'Uw 0.8 W/m²K', thermalBreak: '', profile: '', chambers: '' }
    annotations: { glazing: '', thermalBreak: '', profile: '', chambers: '' }
  },

  cta: { image: 'assets/images/cta-interior.svg' },

  /* Quote flow. In demo mode nothing is ever sent.
     Live mode: POST JSON to `endpoint`; without endpoint a mailto: link is prepared. */
  quote: { endpoint: '' },

  seo: {
    siteUrl: '', // e.g. https://www.client.de — needed for canonical / OG absolute URLs
    title: { en: '', de: '' }, // empty → generated from translations.meta.title
    description: { en: '', de: '' },
    ogImage: 'assets/images/hero-villa.svg',
    twitterCard: 'summary_large_image',
    /* Landing-page architecture for later. Enable a slug only once a real page exists —
       category links then point to it instead of filtering the range on the homepage. */
    pages: {
      windows: { path: '/windows', enabled: false },
      doors: { path: '/doors', enabled: false },
      'sliding-doors': { path: '/sliding-doors', enabled: false },
      facades: { path: '/facades', enabled: false },
      'aluminium-windows': { path: '/aluminium-windows', enabled: false },
      'pvc-windows': { path: '/pvc-windows', enabled: false },
      'timber-windows': { path: '/timber-windows', enabled: false }
    }
  }
};
