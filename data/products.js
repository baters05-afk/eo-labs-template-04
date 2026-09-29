/* categories = the four homepage tiles; products = the filterable range below them.
   product.category must match a category id, product.material must match material ids.
   specs stays empty in demo mode — add certified values only for real client products. */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};

EO.defaults.categories = [
  {
    id: 'windows', pageSlug: 'windows',
    title: { en: 'Windows', de: 'Fenster' },
    tagline: { en: 'Maximum daylight.\nSuperior thermal performance.', de: 'Maximales Tageslicht.\nHervorragende Wärmedämmung.' },
    image: 'assets/images/cat-windows.svg',
    alt: { en: 'Large window with a thin black frame framing a mountain view', de: 'Großes Fenster mit schmalem schwarzem Rahmen und Bergblick' },
    active: true
  },
  {
    id: 'doors', pageSlug: 'doors',
    title: { en: 'Doors', de: 'Türen' },
    tagline: { en: 'Security, design\nand long-lasting quality.', de: 'Sicherheit, Design\nund langlebige Qualität.' },
    image: 'assets/images/cat-doors.svg',
    alt: { en: 'Dark entrance door with a slim side light set in a stone wall', de: 'Dunkle Haustür mit schmalem Seitenlicht in einer Steinwand' },
    active: true
  },
  {
    id: 'sliding', pageSlug: 'sliding-doors',
    title: { en: 'Sliding Systems', de: 'Schiebesysteme' },
    tagline: { en: 'Seamless indoor-outdoor\nliving.', de: 'Nahtloses Wohnen\ndrinnen und draußen.' },
    image: 'assets/images/cat-sliding.svg',
    alt: { en: 'Wide sliding glass wall opening onto a landscape at golden hour', de: 'Breite Glas-Schiebewand mit Blick in die Landschaft zur goldenen Stunde' },
    active: true
  },
  {
    id: 'facades', pageSlug: 'facades',
    title: { en: 'Facades', de: 'Fassaden' },
    tagline: { en: 'Architectural solutions\nfor larger projects.', de: 'Architektonische Lösungen\nfür größere Projekte.' },
    image: 'assets/images/cat-facades.svg',
    alt: { en: 'Glazed apartment facade with warm-lit windows at dusk', de: 'Verglaste Wohnfassade mit warm beleuchteten Fenstern in der Dämmerung' },
    active: true
  }
];

EO.defaults.products = [
  {
    id: 'aluminium-window', category: 'windows',
    title: { en: 'Aluminium Windows', de: 'Aluminiumfenster' },
    description: { en: 'Slim frames and generous glass areas for modern buildings.', de: 'Schlanke Rahmen und großzügige Glasflächen für moderne Gebäude.' },
    images: [], material: ['aluminium'],
    features: [{ en: 'Slim sightlines', de: 'Schlanke Ansichten' }, { en: 'Tilt & turn or fixed', de: 'Dreh-Kipp oder fest' }],
    specs: {}, active: true
  },
  {
    id: 'pvc-window', category: 'windows',
    title: { en: 'PVC Windows', de: 'Kunststofffenster' },
    description: { en: 'Practical, well-insulated windows for renovation and new builds.', de: 'Praktische, gut gedämmte Fenster für Sanierung und Neubau.' },
    images: [], material: ['pvc'],
    features: [{ en: 'Multi-chamber profile', de: 'Mehrkammerprofil' }, { en: 'Many finishes', de: 'Viele Dekore' }],
    specs: {}, active: true
  },
  {
    id: 'timber-window', category: 'windows',
    title: { en: 'Timber Windows', de: 'Holzfenster' },
    description: { en: 'Natural surfaces with a warm, architectural character.', de: 'Natürliche Oberflächen mit warmem, architektonischem Charakter.' },
    images: [], material: ['timber'],
    features: [{ en: 'Oak, ash, walnut', de: 'Eiche, Esche, Nussbaum' }, { en: 'Refinishable', de: 'Aufarbeitbar' }],
    specs: {}, active: true
  },
  {
    id: 'composite-window', category: 'windows',
    title: { en: 'Composite Windows', de: 'Verbundfenster' },
    description: { en: 'Two materials combined for durable exteriors and refined interiors.', de: 'Zwei Werkstoffe kombiniert für langlebige Außenseiten und hochwertige Innenräume.' },
    images: [], material: ['composite'],
    features: [{ en: 'Weather-side protection', de: 'Wetterseitiger Schutz' }, { en: 'Refined interior', de: 'Hochwertige Innenseite' }],
    specs: {}, active: true
  },
  {
    id: 'aluminium-door', category: 'doors',
    title: { en: 'Aluminium Entrance Doors', de: 'Aluminium-Haustüren' },
    description: { en: 'Flat, minimal entrance doors with concealed hardware options.', de: 'Flächige, minimalistische Haustüren mit verdeckten Beschlägen.' },
    images: [], material: ['aluminium'],
    features: [{ en: 'Flush panels', de: 'Flächenbündige Füllungen' }, { en: 'Security options', de: 'Sicherheitsoptionen' }],
    specs: {}, active: true
  },
  {
    id: 'timber-door', category: 'doors',
    title: { en: 'Timber Doors', de: 'Holztüren' },
    description: { en: 'Solid, characterful doors in natural and contemporary finishes.', de: 'Massive Türen mit Charakter in natürlichen und zeitgemäßen Oberflächen.' },
    images: [], material: ['timber'],
    features: [{ en: 'Natural finishes', de: 'Natürliche Oberflächen' }, { en: 'Side lights', de: 'Seitenteile' }],
    specs: {}, active: true
  },
  {
    id: 'aluminium-sliding', category: 'sliding',
    title: { en: 'Aluminium Sliding Systems', de: 'Aluminium-Schiebesysteme' },
    description: { en: 'Lift-and-slide and pocket systems for wide panoramic openings.', de: 'Hebe-Schiebe- und Taschensysteme für breite Panoramaöffnungen.' },
    images: [], material: ['aluminium'],
    features: [{ en: 'Wide openings', de: 'Große Öffnungsbreiten' }, { en: 'Low threshold', de: 'Niedrige Schwelle' }],
    specs: {}, active: true
  },
  {
    id: 'pvc-sliding', category: 'sliding',
    title: { en: 'PVC Sliding Doors', de: 'Kunststoff-Schiebetüren' },
    description: { en: 'Practical terrace doors with smooth-running sashes.', de: 'Praktische Terrassentüren mit leichtgängigen Flügeln.' },
    images: [], material: ['pvc'],
    features: [{ en: 'Smooth running', de: 'Leichtgängig' }, { en: 'Renovation friendly', de: 'Sanierungsgeeignet' }],
    specs: {}, active: true
  },
  {
    id: 'glass-facade', category: 'facades',
    title: { en: 'Glazed Facades', de: 'Glasfassaden' },
    description: { en: 'Post-and-beam and unitised facade systems for larger buildings.', de: 'Pfosten-Riegel- und Elementfassaden für größere Gebäude.' },
    images: [], material: ['aluminium'],
    features: [{ en: 'Post-and-beam', de: 'Pfosten-Riegel' }, { en: 'Custom engineering', de: 'Individuelle Planung' }],
    specs: {}, active: true
  },
  {
    id: 'composite-facade', category: 'facades',
    title: { en: 'Composite Facade Elements', de: 'Verbund-Fassadenelemente' },
    description: { en: 'Combined-material elements for demanding architecture.', de: 'Elemente aus kombinierten Werkstoffen für anspruchsvolle Architektur.' },
    images: [], material: ['composite'],
    features: [{ en: 'Combined materials', de: 'Kombinierte Werkstoffe' }, { en: 'Custom sizes', de: 'Sondermaße' }],
    specs: {}, active: true
  }
];
