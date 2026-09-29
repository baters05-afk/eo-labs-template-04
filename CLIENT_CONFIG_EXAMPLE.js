/*
 * EXAMPLE client configuration — not loaded by the site.
 * Copy to /data/client.override.js (or generate one in /admin) and edit.
 * Fictional company and placeholder contact data: replace everything before going live.
 *
 * Rules: objects are deep-merged into the defaults, arrays REPLACE the default lists.
 */
window.EO_OVERRIDE = {
  siteConfig: {
    demoMode: false,
    preset: 'warm-stone',

    company: {
      name: 'Fensterbau Nord GmbH',
      shortName: 'Fensterbau Nord',
      legalName: 'Fensterbau Nord GmbH',
      description: { en: 'Windows, doors and sliding systems, planned and installed in northern Germany.', de: 'Fenster, Türen und Schiebesysteme – geplant und montiert in Norddeutschland.' },
      logo: 'assets/client/logo.svg',
      logoMono: true,
      favicon: 'assets/client/favicon.svg'
    },

    branding: {           // null / omitted = keep preset value
      accent: '#8C6A45',
      primary: '#22262A'
    },

    contact: {
      phone: '+49 000 0000000',
      email: 'info@example.de',
      whatsapp: '+49 000 0000000',
      address: 'Musterstraße 1, 00000 Musterstadt',
      serviceArea: ['DE', 'NL']
    },
    social: { instagram: 'https://www.instagram.com/example', linkedin: '', youtube: '' },
    legal: { privacy: '/datenschutz', terms: '', cookies: '' },

    languages: { default: 'de', enabled: ['de', 'en'] },
    features: { configurator: true, materials: true, projects: true, manufacturers: true, faq: true, presetSwitcher: false },

    hero: {
      image: 'assets/client/hero.jpg',
      alt: { de: 'Neubau mit bodentiefen Aluminium-Schiebetüren im Abendlicht', en: 'New build with floor-to-ceiling aluminium sliding doors at dusk' }
    },

    // Only certified values. Empty = generic wording is shown.
    technical: {
      specs: { thermal: 'Uw ab 0,8 W/m²K (System X)', acoustic: '', security: 'RC2 optional', durability: '' },
      annotations: { glazing: '', thermalBreak: '', profile: '', chambers: '' }
    },

    quote: { endpoint: 'https://example.de/api/quote' },

    seo: {
      siteUrl: 'https://www.example.de',
      title: { de: 'Fensterbau Nord – Fenster, Türen & Schiebesysteme', en: 'Fensterbau Nord – Windows, Doors & Sliding Systems' },
      description: { de: 'Fenster und Türen aus Aluminium, Holz und PVC – Beratung, Lieferung und Montage in Norddeutschland.', en: 'Aluminium, timber and PVC windows and doors – consultation, supply and installation in northern Germany.' },
      ogImage: 'assets/client/og.jpg'
    }
  },

  projects: [
    {
      id: 'haus-am-deich',
      title: { de: 'Haus am Deich', en: 'House by the dyke' },
      category: { de: 'Wohnen', en: 'Residential' },
      location: 'Husum',
      images: [{ src: 'assets/client/projects/deich-1.jpg', alt: { de: 'Fassade mit großen Schiebetüren', en: 'Facade with large sliding doors' } }],
      material: ['aluminium'],
      description: { de: 'Hebe-Schiebetüren in Anthrazit.', en: 'Lift-and-slide doors in anthracite.' },
      active: true, demo: false, featured: true
    }
  ],

  manufacturers: [
    { name: 'Example Systems', logo: 'assets/client/manufacturers/example.svg', url: 'https://example.com', active: true }
  ],

  // Optional: override single UI strings
  translations: {
    de: { hero: { title: 'Gebaut\nfür den Norden.' } }
  }
};
