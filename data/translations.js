/*
 * UI copy. Add a language by adding a block (e.g. translations.nl) and listing the
 * code in siteConfig.languages.enabled — no component changes needed.
 * Missing keys fall back to English. Content lists (products, projects …) carry their
 * own {en, de, nl…} objects and fall back the same way.
 * "\n" becomes a line break in headings.  {name} = company short name.
 */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};

EO.defaults.translations = {
  en: {
    langName: 'English',
    meta: {
      title: '{company} — Aluminium, PVC & Timber Windows and Doors',
      description: 'Aluminium, timber and PVC windows, doors, sliding systems and facades for modern residential and commercial architecture. Configure your selection and request a quote.',
      ogAlt: 'Modern villa with panoramic glazing and thin aluminium frames'
    },
    brand: { tagline: 'Windows & Doors' },
    nav: {
      products: 'Products', materials: 'Materials', projects: 'Projects', about: 'About', faq: 'FAQ', contact: 'Contact',
      skip: 'Skip to content', menu: 'Menu', close: 'Close', main: 'Main navigation', language: 'Language'
    },
    btn: { quote: 'Request a quote', explore: 'Explore systems', details: 'Explore technical details', viewAll: 'View all projects', exploreMaterials: 'Explore all materials', configure: 'Configure', continue: 'Continue', back: 'Back', next: 'Next' },
    demo: {
      label: 'Demo template', notReal: 'Not a real company', preset: 'Preset',
      contactPlaceholder: 'Added when the site goes live',
      imagery: 'Demo imagery / Sample presentation',
      sample: 'Demo imagery', simulation: 'Simulation mode — nothing is sent.'
    },
    hero: {
      eyebrow: 'Modern windows & doors for\nexceptional spaces',
      title: 'Built around\nthe view.',
      text: 'Aluminium, timber and PVC windows, doors and sliding systems for modern residential and commercial architecture.',
      tags: 'Windows / Doors / Sliding systems / Facades'
    },
    products: {
      eyebrow: 'Products', title: 'The range.', text: 'Choose a category or filter by material.',
      all: 'All', category: 'Category', material: 'Material', count: '{n} systems', none: 'No systems match this filter.',
      filterLabel: 'Filter products'
    },
    precision: {
      eyebrow: 'Engineered for a higher standard',
      title: 'Precision\nin every detail.',
      text: 'Our systems combine architectural design with advanced engineering — a considered balance of insulation, security and durability.',
      thermal: 'Thermal performance', acoustic: 'Acoustic performance', security: 'Security', durability: 'Durability',
      thermalGeneric: 'High thermal performance', acousticGeneric: 'Enhanced acoustic comfort', securityGeneric: 'Security options available', durabilityGeneric: 'Designed for demanding climates',
      glazing: 'Triple glazing', thermalBreak: 'Thermal break', profile: 'Aluminium profile', chambers: 'Multi-chamber design',
      glazingGeneric: '', thermalBreakGeneric: 'Maximum efficiency', profileGeneric: 'Slim and strong', chambersGeneric: 'For superior insulation',
      alt: 'Technical cross-section of an aluminium window profile with triple glazing, thermal break and multiple chambers',
      legend: 'Profile details'
    },
    projects: {
      eyebrow: 'Selected projects', title: 'Real spaces.\nLasting value.',
      text: 'From private residences to commercial buildings, our windows and doors become part of exceptional architecture.',
      demoText: 'Sample presentation. These are demo visuals, not completed client projects.',
      open: 'Open project gallery', gallery: 'Project gallery', prev: 'Previous image', next: 'Next image', close: 'Close gallery', of: 'of'
    },
    materials: {
      eyebrow: 'Premium materials & finishes', title: 'Materials\nthat last.',
      text: 'A curated selection of aluminium, PVC, timber and composite finishes — designed for modern architecture and demanding environments.',
      finishes: 'Finishes', configureWith: 'Configure in {material}', swatchLabel: 'Finish'
    },
    manufacturers: { eyebrow: 'Systems we work with', title: 'Partner brands' },
    config: {
      eyebrow: 'Configurator', title: 'Shape your\nselection.',
      text: 'Five quick choices give us a clear starting point for your quote. No drawings required.',
      steps: { product: 'Product', material: 'Material', finish: 'Finish', glass: 'Glass', project: 'Project' },
      prompts: { product: 'What do you need?', material: 'Which material?', finish: 'Choose a finish', glass: 'Glass type', project: 'Project type' },
      stepOf: 'Step {n} of {total}',
      summary: 'Your selection', preview: 'Selection preview', previewEmpty: 'Choose a product to see it here.', empty: 'Not selected yet',
      unavailable: 'Not available for this product', chooseFirst: 'Choose a material first.',
      hint: 'You can change any choice at any time.', edit: 'Change'
    },
    about: {
      eyebrow: 'About', title: 'Planned with\nprecision.',
      text: '{company} supplies window, door and glazing systems for architects, builders and homeowners.',
      demoNote: 'In a live site this section carries the real company story and credentials.',
      steps: [
        { title: 'Consult', text: 'We clarify architecture, use and budget together.' },
        { title: 'Specify', text: 'Systems, materials and glazing are matched to the building.' },
        { title: 'Install', text: 'Delivery and installation are planned around your schedule.' }
      ]
    },
    faq: { eyebrow: 'FAQ', title: 'Good to know.' },
    cta: {
      eyebrow: 'Your project starts here', title: 'Get a tailored\nrecommendation.',
      text: "Tell us about your project and we'll suggest the right window, door or glazing solution.",
      note: 'Free. No obligation.',
      alt: 'Interior with a lounge chair in front of a floor-to-ceiling glass wall overlooking a lake'
    },
    footer: {
      text: 'A flexible, premium template for European windows and doors companies. Replace with your own content, products and contacts.',
      products: 'Products', company: 'Company', contact: 'Contact', follow: 'Follow',
      phone: 'Phone', email: 'Email', whatsapp: 'WhatsApp', address: 'Address', service: 'Service area',
      rights: 'All rights reserved.', privacy: 'Privacy', terms: 'Terms', cookies: 'Cookie settings', demoNote: 'Demo template. Not a real company.'
    },
    quote: {
      title: 'Request a quote', stepOf: 'Step {n} of {total}', back: 'Back', next: 'Next', submit: 'Send request', submitDemo: 'Finish demo', close: 'Close', recap: 'Your configuration',
      steps: {
        product: 'Which product?', material: 'Which material?', project: 'Project type', size: 'Approximate size',
        quantity: 'Quantity', installation: 'Installation required?', location: 'Location', contact: 'Contact details'
      },
      short: { product: 'Product', material: 'Material', project: 'Project type', size: 'Size', quantity: 'Quantity', installation: 'Installation', location: 'Location', glass: 'Glass', finish: 'Finish' },
      width: 'Width (mm)', height: 'Height (mm)', sizeUnknown: "I don't know the size yet",
      quantityLabel: 'Number of units', decrease: 'Decrease quantity', increase: 'Increase quantity',
      notSure: 'Not sure yet', yes: 'Yes, please', no: 'No, supply only', undecided: 'Undecided',
      postcode: 'Postcode', country: 'Country',
      name: 'Name', email: 'Email', phone: 'Phone (optional)', message: 'Message (optional)',
      consent: 'I agree that my details are used to answer this request.',
      consentDemo: 'Demo mode: your details stay in this browser tab and are never sent.',
      errors: { required: 'Please make a selection.', size: 'Enter width and height, or tick the box.', quantity: 'Enter a quantity between 1 and 99.', postcode: 'Enter a postcode.', name: 'Enter your name.', email: 'Enter a valid email address.', consent: 'Please confirm to continue.' },
      demoDoneTitle: 'Demo complete', demoDone: 'No personal information has been submitted.',
      doneTitle: 'Thank you.', done: 'Your request has been sent. We will get back to you shortly.',
      failTitle: 'Could not send.', fail: 'Please try again or contact us directly.',
      mailto: 'Open email to send', restart: 'Start over', sending: 'Sending…'
    }
  },

  de: {
    langName: 'Deutsch',
    meta: {
      title: '{company} — Fenster und Türen aus Aluminium, PVC & Holz',
      description: 'Fenster, Türen, Schiebesysteme und Fassaden aus Aluminium, Holz und PVC für moderne Wohn- und Gewerbearchitektur. Auswahl konfigurieren und Angebot anfragen.',
      ogAlt: 'Moderne Villa mit Panoramaverglasung und schlanken Aluminiumrahmen'
    },
    brand: { tagline: 'Fenster & Türen' },
    nav: {
      products: 'Produkte', materials: 'Materialien', projects: 'Projekte', about: 'Über uns', faq: 'FAQ', contact: 'Kontakt',
      skip: 'Zum Inhalt springen', menu: 'Menü', close: 'Schließen', main: 'Hauptnavigation', language: 'Sprache'
    },
    btn: { quote: 'Angebot anfragen', explore: 'Systeme entdecken', details: 'Technische Details ansehen', viewAll: 'Alle Projekte ansehen', exploreMaterials: 'Alle Materialien ansehen', configure: 'Konfigurieren', continue: 'Weiter', back: 'Zurück', next: 'Weiter' },
    demo: {
      label: 'Demo-Vorlage', notReal: 'Kein echtes Unternehmen', preset: 'Preset',
      contactPlaceholder: 'Wird bei Livegang ergänzt',
      imagery: 'Demobilder / Beispielpräsentation',
      sample: 'Demobild', simulation: 'Simulationsmodus – es wird nichts gesendet.'
    },
    hero: {
      eyebrow: 'Moderne Fenster & Türen für\nbesondere Räume',
      title: 'Gebaut\num die Aussicht.',
      text: 'Fenster, Türen und Schiebesysteme aus Aluminium, Holz und PVC für moderne Wohn- und Gewerbearchitektur.',
      tags: 'Fenster / Türen / Schiebesysteme / Fassaden'
    },
    products: {
      eyebrow: 'Produkte', title: 'Das Sortiment.', text: 'Wählen Sie eine Kategorie oder filtern Sie nach Material.',
      all: 'Alle', category: 'Kategorie', material: 'Material', count: '{n} Systeme', none: 'Keine Systeme für diesen Filter.',
      filterLabel: 'Produkte filtern'
    },
    precision: {
      eyebrow: 'Entwickelt für höchste Ansprüche',
      title: 'Präzision\nin jedem Detail.',
      text: 'Unsere Systeme verbinden architektonisches Design mit moderner Technik – eine durchdachte Balance aus Dämmung, Sicherheit und Langlebigkeit.',
      thermal: 'Wärmedämmleistung', acoustic: 'Schallschutz', security: 'Sicherheit', durability: 'Langlebigkeit',
      thermalGeneric: 'Hohe Wärmedämmleistung', acousticGeneric: 'Mehr akustischer Komfort', securityGeneric: 'Sicherheitsoptionen verfügbar', durabilityGeneric: 'Für anspruchsvolles Klima entwickelt',
      glazing: 'Dreifachverglasung', thermalBreak: 'Thermische Trennung', profile: 'Aluminiumprofil', chambers: 'Mehrkammer-Design',
      glazingGeneric: '', thermalBreakGeneric: 'Maximale Effizienz', profileGeneric: 'Schlank und stabil', chambersGeneric: 'Für bessere Dämmung',
      alt: 'Technischer Querschnitt eines Aluminium-Fensterprofils mit Dreifachverglasung, thermischer Trennung und mehreren Kammern',
      legend: 'Profildetails'
    },
    projects: {
      eyebrow: 'Ausgewählte Projekte', title: 'Echte Räume.\nBleibender Wert.',
      text: 'Von Privathäusern bis zu Gewerbebauten – unsere Fenster und Türen werden Teil besonderer Architektur.',
      demoText: 'Beispielpräsentation. Dies sind Demobilder, keine realisierten Kundenprojekte.',
      open: 'Projektgalerie öffnen', gallery: 'Projektgalerie', prev: 'Vorheriges Bild', next: 'Nächstes Bild', close: 'Galerie schließen', of: 'von'
    },
    materials: {
      eyebrow: 'Hochwertige Materialien & Oberflächen', title: 'Materialien,\ndie bleiben.',
      text: 'Eine kuratierte Auswahl an Aluminium-, PVC-, Holz- und Verbundoberflächen – für moderne Architektur und anspruchsvolle Umgebungen.',
      finishes: 'Oberflächen', configureWith: 'In {material} konfigurieren', swatchLabel: 'Oberfläche'
    },
    manufacturers: { eyebrow: 'Systeme, mit denen wir arbeiten', title: 'Partnermarken' },
    config: {
      eyebrow: 'Konfigurator', title: 'Stellen Sie Ihre\nAuswahl zusammen.',
      text: 'Fünf schnelle Entscheidungen geben uns einen klaren Ausgangspunkt für Ihr Angebot. Ohne Zeichnungen.',
      steps: { product: 'Produkt', material: 'Material', finish: 'Oberfläche', glass: 'Glas', project: 'Projekt' },
      prompts: { product: 'Was benötigen Sie?', material: 'Welches Material?', finish: 'Oberfläche wählen', glass: 'Glasart', project: 'Projektart' },
      stepOf: 'Schritt {n} von {total}',
      summary: 'Ihre Auswahl', preview: 'Vorschau der Auswahl', previewEmpty: 'Wählen Sie ein Produkt, um es hier zu sehen.', empty: 'Noch nicht gewählt',
      unavailable: 'Für dieses Produkt nicht verfügbar', chooseFirst: 'Bitte zuerst ein Material wählen.',
      hint: 'Sie können jede Auswahl jederzeit ändern.', edit: 'Ändern'
    },
    about: {
      eyebrow: 'Über uns', title: 'Mit Präzision\ngeplant.',
      text: '{company} liefert Fenster-, Tür- und Glassysteme für Architekten, Bauherren und Eigentümer.',
      demoNote: 'Auf einer Live-Seite steht hier die echte Unternehmensgeschichte mit Referenzen.',
      steps: [
        { title: 'Beraten', text: 'Wir klären Architektur, Nutzung und Budget gemeinsam.' },
        { title: 'Spezifizieren', text: 'Systeme, Materialien und Verglasung werden auf das Gebäude abgestimmt.' },
        { title: 'Montieren', text: 'Lieferung und Montage werden nach Ihrem Zeitplan geplant.' }
      ]
    },
    faq: { eyebrow: 'FAQ', title: 'Gut zu wissen.' },
    cta: {
      eyebrow: 'Ihr Projekt beginnt hier', title: 'Erhalten Sie eine\nindividuelle Empfehlung.',
      text: 'Erzählen Sie uns von Ihrem Projekt – wir schlagen die passende Fenster-, Tür- oder Verglasungslösung vor.',
      note: 'Kostenlos. Unverbindlich.',
      alt: 'Wohnraum mit Loungesessel vor einer raumhohen Glaswand mit Seeblick'
    },
    footer: {
      text: 'Eine flexible, hochwertige Vorlage für europäische Fenster- und Türenunternehmen. Ersetzen Sie Inhalte, Produkte und Kontakte durch Ihre eigenen.',
      products: 'Produkte', company: 'Unternehmen', contact: 'Kontakt', follow: 'Folgen',
      phone: 'Telefon', email: 'E-Mail', whatsapp: 'WhatsApp', address: 'Adresse', service: 'Einsatzgebiet',
      rights: 'Alle Rechte vorbehalten.', privacy: 'Datenschutz', terms: 'AGB', cookies: 'Cookie-Einstellungen', demoNote: 'Demo-Vorlage. Kein echtes Unternehmen.'
    },
    quote: {
      title: 'Angebot anfragen', stepOf: 'Schritt {n} von {total}', back: 'Zurück', next: 'Weiter', submit: 'Anfrage senden', submitDemo: 'Demo beenden', close: 'Schließen', recap: 'Ihre Konfiguration',
      steps: {
        product: 'Welches Produkt?', material: 'Welches Material?', project: 'Projektart', size: 'Ungefähre Größe',
        quantity: 'Menge', installation: 'Montage erforderlich?', location: 'Standort', contact: 'Kontaktdaten'
      },
      short: { product: 'Produkt', material: 'Material', project: 'Projekt', size: 'Größe', quantity: 'Menge', installation: 'Montage', location: 'Standort', glass: 'Glas', finish: 'Oberfläche' },
      width: 'Breite (mm)', height: 'Höhe (mm)', sizeUnknown: 'Die Größe ist mir noch nicht bekannt',
      quantityLabel: 'Anzahl der Einheiten', decrease: 'Menge verringern', increase: 'Menge erhöhen',
      notSure: 'Noch unsicher', yes: 'Ja, bitte', no: 'Nein, nur Lieferung', undecided: 'Noch offen',
      postcode: 'Postleitzahl', country: 'Land',
      name: 'Name', email: 'E-Mail', phone: 'Telefon (optional)', message: 'Nachricht (optional)',
      consent: 'Ich bin einverstanden, dass meine Angaben zur Beantwortung dieser Anfrage verwendet werden.',
      consentDemo: 'Demo-Modus: Ihre Angaben bleiben in diesem Browser-Tab und werden nie gesendet.',
      errors: { required: 'Bitte treffen Sie eine Auswahl.', size: 'Geben Sie Breite und Höhe ein oder setzen Sie den Haken.', quantity: 'Geben Sie eine Menge zwischen 1 und 99 ein.', postcode: 'Geben Sie eine Postleitzahl ein.', name: 'Geben Sie Ihren Namen ein.', email: 'Geben Sie eine gültige E-Mail-Adresse ein.', consent: 'Bitte bestätigen Sie, um fortzufahren.' },
      demoDoneTitle: 'Demo abgeschlossen', demoDone: 'Es wurden keine personenbezogenen Daten übermittelt.',
      doneTitle: 'Vielen Dank.', done: 'Ihre Anfrage wurde gesendet. Wir melden uns in Kürze.',
      failTitle: 'Senden nicht möglich.', fail: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
      mailto: 'E-Mail zum Senden öffnen', restart: 'Von vorn beginnen', sending: 'Wird gesendet…'
    }
  }
};
