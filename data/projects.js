/* Reference projects. Entries with demo:true are hidden automatically when demoMode is false.
   { id, title:{}, category:{}, location, images:[{src, alt:{}}|"path"], material:[], description:{}, active, demo, featured } */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};
EO.defaults.projects = [
  {
    id: 'sample-residence',
    title: { en: 'Sample residence', de: 'Beispielresidenz' },
    category: { en: 'Residential', de: 'Wohnen' },
    location: '',
    images: [
      { src: 'assets/images/project-lake-house.svg', alt: { en: 'Demo image: lakeside house with a long glazed volume and pool at dusk', de: 'Demobild: Haus am See mit langem Glaskörper und Pool in der Dämmerung' } },
      { src: 'assets/images/project-lake-house-2.svg', alt: { en: 'Demo image: glazed lakeside house at golden hour', de: 'Demobild: verglastes Haus am See zur goldenen Stunde' } }
    ],
    material: ['aluminium'],
    description: { en: 'Sample presentation — panoramic sliding systems in slim aluminium frames.', de: 'Beispielpräsentation – Panorama-Schiebesysteme in schlanken Aluminiumrahmen.' },
    active: true, demo: true, featured: true
  },
  {
    id: 'concept-villa',
    title: { en: 'Concept project', de: 'Konzeptprojekt' },
    category: { en: 'Residential', de: 'Wohnen' },
    location: '',
    images: [
      { src: 'assets/images/project-villa.svg', alt: { en: 'Demo image: timber-clad villa with large glazing in soft light', de: 'Demobild: holzverkleidete Villa mit großer Verglasung im weichen Licht' } },
      { src: 'assets/images/project-villa-2.svg', alt: { en: 'Demo image: timber-clad villa with pool in daylight', de: 'Demobild: holzverkleidete Villa mit Pool bei Tageslicht' } }
    ],
    material: ['timber', 'aluminium'],
    description: { en: 'Sample presentation — timber facade with large fixed glazing.', de: 'Beispielpräsentation – Holzfassade mit großflächiger Festverglasung.' },
    active: true, demo: true, featured: true
  },
  {
    id: 'demo-apartments',
    title: { en: 'Demo project', de: 'Demoprojekt' },
    category: { en: 'Residential / Commercial', de: 'Wohnen / Gewerbe' },
    location: '',
    images: [
      { src: 'assets/images/project-apartments.svg', alt: { en: 'Demo image: apartment building with glazed balconies at dusk', de: 'Demobild: Wohngebäude mit verglasten Balkonen in der Dämmerung' } },
      { src: 'assets/images/project-apartments-2.svg', alt: { en: 'Demo image: apartment block facade with warm lit windows', de: 'Demobild: Fassade eines Wohnblocks mit warm beleuchteten Fenstern' } }
    ],
    material: ['aluminium', 'composite'],
    description: { en: 'Sample presentation — window and facade elements for a multi-storey building.', de: 'Beispielpräsentation – Fenster- und Fassadenelemente für ein mehrgeschossiges Gebäude.' },
    active: true, demo: true, featured: true
  }
];
