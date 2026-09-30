/* Selectable options shared by the configurator and the quote flow. */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};
/* glass[].visual drives the small glazing diagram in the configurator. */
EO.defaults.options = {
  glass: [
    { id: 'standard', visual: { panes: 2, tint: '', coating: false }, title: { en: 'Standard', de: 'Standard' }, description: { en: 'Double glazing for everyday use', de: 'Zweifachverglasung für den Alltag' } },
    { id: 'low-e', visual: { panes: 2, tint: '', coating: true }, title: { en: 'Low-E', de: 'Low-E' }, description: { en: 'Coated for better insulation', de: 'Beschichtet für bessere Dämmung' } },
    { id: 'solar', visual: { panes: 2, tint: 'rgba(120,150,140,.55)', coating: true }, title: { en: 'Solar control', de: 'Sonnenschutz' }, description: { en: 'Reduces heat gain in sunny rooms', de: 'Reduziert Wärmeeintrag in sonnigen Räumen' } },
    { id: 'privacy', visual: { panes: 2, tint: 'rgba(240,240,236,.75)', coating: false }, title: { en: 'Privacy', de: 'Sichtschutz' }, description: { en: 'Satin or switchable finishes', de: 'Satinierte oder schaltbare Varianten' } }
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
