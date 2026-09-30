/* Selectable options shared by the configurator and the quote flow. */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};
/* glass[].visual drives the small glazing diagram in the configurator. */
EO.defaults.options = {
  glass: [
    { id: 'standard', visual: { panes: 2, tint: '', coating: false }, overlay: 'rgba(180, 200, 205, 0.02)', note: { en: 'Clear glazing', de: 'Klare Verglasung' }, title: { en: 'Standard', de: 'Standard' }, description: { en: 'Double glazing for everyday use', de: 'Zweifachverglasung für den Alltag' } },
    { id: 'low-e', visual: { panes: 2, tint: '', coating: true }, overlay: 'rgba(130, 155, 160, 0.08)', note: { en: 'Better thermal insulation', de: 'Bessere Wärmedämmung' }, title: { en: 'Low-E', de: 'Low-E' }, description: { en: 'Coated for better insulation', de: 'Beschichtet für bessere Dämmung' } },
    { id: 'solar', visual: { panes: 2, tint: 'rgba(120,150,140,.55)', coating: true }, overlay: 'rgba(75, 70, 60, 0.12)', note: { en: 'Reduces solar heat gain', de: 'Reduziert den Sonneneintrag' }, title: { en: 'Solar control', de: 'Sonnenschutz' }, description: { en: 'Reduces heat gain in sunny rooms', de: 'Reduziert Wärmeeintrag in sonnigen Räumen' } },
    { id: 'privacy', visual: { panes: 2, tint: 'rgba(240,240,236,.75)', coating: false }, overlay: 'rgba(240, 240, 236, 0.10)', effect: 'frosted', note: { en: 'Frosted for privacy', de: 'Satiniert für Sichtschutz' }, title: { en: 'Privacy', de: 'Sichtschutz' }, description: { en: 'Satin or switchable finishes', de: 'Satinierte oder schaltbare Varianten' } }
  ],
  projectTypes: [
    { id: 'residential', image: {"src":"assets/photos/project-1-1440.jpg","srcset":"assets/photos/project-1-640.jpg 640w, assets/photos/project-1-960.jpg 960w, assets/photos/project-1-1440.jpg 1440w","sources":[{"type":"image/avif","srcset":"assets/photos/project-1-640.avif 640w, assets/photos/project-1-960.avif 960w, assets/photos/project-1-1440.avif 1440w"},{"type":"image/webp","srcset":"assets/photos/project-1-640.webp 640w, assets/photos/project-1-960.webp 960w, assets/photos/project-1-1440.webp 1440w"}],"width":1440,"height":960}, title: { en: 'Residential', de: 'Wohnen' } },
    { id: 'renovation', image: {"src":"assets/photos/project-2-1440.jpg","srcset":"assets/photos/project-2-640.jpg 640w, assets/photos/project-2-960.jpg 960w, assets/photos/project-2-1440.jpg 1440w","sources":[{"type":"image/avif","srcset":"assets/photos/project-2-640.avif 640w, assets/photos/project-2-960.avif 960w, assets/photos/project-2-1440.avif 1440w"},{"type":"image/webp","srcset":"assets/photos/project-2-640.webp 640w, assets/photos/project-2-960.webp 960w, assets/photos/project-2-1440.webp 1440w"}],"width":1440,"height":960}, title: { en: 'Renovation', de: 'Sanierung' } },
    { id: 'commercial', image: {"src":"assets/photos/project-3-1440.jpg","srcset":"assets/photos/project-3-640.jpg 640w, assets/photos/project-3-960.jpg 960w, assets/photos/project-3-1440.jpg 1440w","sources":[{"type":"image/avif","srcset":"assets/photos/project-3-640.avif 640w, assets/photos/project-3-960.avif 960w, assets/photos/project-3-1440.avif 1440w"},{"type":"image/webp","srcset":"assets/photos/project-3-640.webp 640w, assets/photos/project-3-960.webp 960w, assets/photos/project-3-1440.webp 1440w"}],"width":1440,"height":960}, title: { en: 'Commercial', de: 'Gewerbe' } }
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
