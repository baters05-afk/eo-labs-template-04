/* Generic, claim-free answers. Replace with the client's real terms
   (lead times, warranty, service area) before going live. */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};
EO.defaults.faq = [
  {
    id: 'materials',
    question: { en: 'Which material is right for my project?', de: 'Welches Material passt zu meinem Projekt?' },
    answer: {
      en: 'It depends on the architecture, the budget and the maintenance you are comfortable with. Aluminium suits slim sightlines and large formats, timber brings warmth, PVC is a practical all-rounder and composite combines several strengths. We are happy to compare options for your building.',
      de: 'Das hängt von Architektur, Budget und Pflegeaufwand ab. Aluminium eignet sich für schlanke Ansichten und große Formate, Holz bringt Wärme, PVC ist ein praktischer Allrounder und Verbundlösungen vereinen mehrere Stärken. Wir vergleichen gern die Optionen für Ihr Gebäude.'
    },
    active: true
  },
  {
    id: 'quote',
    question: { en: 'How does a quote request work?', de: 'Wie läuft eine Angebotsanfrage ab?' },
    answer: {
      en: 'Choose the product, material and project type, add approximate sizes and your location, then leave your contact details. You will receive a tailored recommendation before anything is decided.',
      de: 'Wählen Sie Produkt, Material und Projektart, ergänzen Sie ungefähre Maße und Ihren Standort und hinterlassen Sie Ihre Kontaktdaten. Sie erhalten eine individuelle Empfehlung, bevor etwas entschieden wird.'
    },
    active: true
  },
  {
    id: 'installation',
    question: { en: 'Can installation be included?', de: 'Kann die Montage enthalten sein?' },
    answer: {
      en: 'The quote flow asks whether installation is required so the proposal can cover supply only or supply and installation.',
      de: 'Im Anfrageprozess geben Sie an, ob Montage benötigt wird – so kann das Angebot Lieferung allein oder Lieferung und Montage umfassen.'
    },
    active: true
  },
  {
    id: 'sizes',
    question: { en: 'Do I need exact measurements?', de: 'Brauche ich exakte Maße?' },
    answer: {
      en: 'No. Approximate sizes are enough for a first recommendation. Exact dimensions are confirmed later on site or from your plans.',
      de: 'Nein. Für eine erste Empfehlung genügen ungefähre Maße. Exakte Maße werden später vor Ort oder anhand Ihrer Pläne bestätigt.'
    },
    active: true
  }
];
