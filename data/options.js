/* Selectable options shared by the configurator and the quote flow. */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};
EO.defaults.options = {
  glass: [
    { id: 'standard', title: { en: 'Standard', de: 'Standard' }, description: { en: 'Double glazing for everyday use', de: 'Zweifachverglasung für den Alltag' } },
    { id: 'low-e', title: { en: 'Low-E', de: 'Low-E' }, description: { en: 'Coated for better insulation', de: 'Beschichtet für bessere Dämmung' } },
    { id: 'solar', title: { en: 'Solar control', de: 'Sonnenschutz' }, description: { en: 'Reduces heat gain in sunny rooms', de: 'Reduziert Wärmeeintrag in sonnigen Räumen' } },
    { id: 'privacy', title: { en: 'Privacy', de: 'Sichtschutz' }, description: { en: 'Satin or switchable finishes', de: 'Satinierte oder schaltbare Varianten' } }
  ],
  projectTypes: [
    { id: 'new-build', title: { en: 'New build', de: 'Neubau' } },
    { id: 'renovation', title: { en: 'Renovation', de: 'Sanierung' } },
    { id: 'commercial', title: { en: 'Commercial', de: 'Gewerbe' } }
  ],
  countries: [
    { id: 'DE', title: { en: 'Germany', de: 'Deutschland' } },
    { id: 'AT', title: { en: 'Austria', de: 'Österreich' } },
    { id: 'CH', title: { en: 'Switzerland', de: 'Schweiz' } },
    { id: 'BE', title: { en: 'Belgium', de: 'Belgien' } },
    { id: 'NL', title: { en: 'Netherlands', de: 'Niederlande' } },
    { id: 'LU', title: { en: 'Luxembourg', de: 'Luxemburg' } },
    { id: 'FR', title: { en: 'France', de: 'Frankreich' } },
    { id: 'other', title: { en: 'Other', de: 'Andere' } }
  ]
};
