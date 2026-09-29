/* finishes[].color is any CSS background value (colour, gradient, wood-grain pattern). */
window.EO = window.EO || {};
EO.defaults = EO.defaults || {};
(function () {
  const wood = (a, b) => `repeating-linear-gradient(90deg, ${a} 0 7px, ${b} 7px 10px)`;
  EO.defaults.materials = [
    {
      id: 'aluminium',
      title: { en: 'Aluminium', de: 'Aluminium' },
      subtitle: { en: 'Anodised & powder-coated', de: 'Eloxiert & pulverbeschichtet' },
      description: { en: 'Slim sightlines and large formats for contemporary architecture.', de: 'Schlanke Ansichten und große Formate für zeitgenössische Architektur.' },
      finishes: [
        { id: 'natural', name: { en: 'Anodised natural', de: 'Natur eloxiert' }, color: 'linear-gradient(135deg,#d6d6d3,#9d9d9a)' },
        { id: 'anthracite', name: { en: 'Anthracite', de: 'Anthrazit' }, color: '#3a3d40' },
        { id: 'black', name: { en: 'Deep black', de: 'Tiefschwarz' }, color: '#141414' },
        { id: 'white', name: { en: 'Pure white', de: 'Reinweiß' }, color: '#e9e9e5' },
        { id: 'bronze', name: { en: 'Bronze', de: 'Bronze' }, color: 'linear-gradient(135deg,#7a6650,#54442f)' }
      ],
      features: [
        { en: 'Slim profile sightlines', de: 'Schlanke Profilansichten' },
        { en: 'Large-format capability', de: 'Große Formate möglich' },
        { en: 'Low maintenance', de: 'Pflegeleicht' }
      ],
      image: ''
    },
    {
      id: 'timber',
      title: { en: 'Timber', de: 'Holz' },
      subtitle: { en: 'Natural & contemporary', de: 'Natürlich & zeitgemäß' },
      description: { en: 'Warm, natural surfaces from light oak to smoked tones.', de: 'Warme, natürliche Oberflächen von hellem Eichenholz bis zu geräucherten Tönen.' },
      finishes: [
        { id: 'oak', name: { en: 'Natural oak', de: 'Eiche natur' }, color: wood('#c9a26c', '#bd9660') },
        { id: 'ash', name: { en: 'Light ash', de: 'Esche hell' }, color: wood('#dcc8a6', '#d1bb96') },
        { id: 'walnut', name: { en: 'Walnut', de: 'Nussbaum' }, color: wood('#5d412c', '#523a27') },
        { id: 'smoked', name: { en: 'Smoked oak', de: 'Eiche geräuchert' }, color: wood('#3d3129', '#33291f') }
      ],
      features: [
        { en: 'Natural material', de: 'Natürlicher Werkstoff' },
        { en: 'Warm surface feel', de: 'Warme Haptik' },
        { en: 'Refinishable', de: 'Aufarbeitbar' }
      ],
      image: ''
    },
    {
      id: 'pvc',
      title: { en: 'PVC', de: 'PVC' },
      subtitle: { en: 'Durable & versatile', de: 'Langlebig & vielseitig' },
      description: { en: 'A practical all-rounder for renovation and new builds.', de: 'Ein praktischer Allrounder für Sanierung und Neubau.' },
      finishes: [
        { id: 'white', name: { en: 'White', de: 'Weiß' }, color: '#f1f1ee' },
        { id: 'cream', name: { en: 'Cream', de: 'Creme' }, color: '#e6ddc6' },
        { id: 'anthracite', name: { en: 'Anthracite foil', de: 'Anthrazit-Folie' }, color: '#3b3e42' },
        { id: 'oak-foil', name: { en: 'Oak-effect foil', de: 'Eiche-Dekor' }, color: wood('#a98259', '#9d774f') }
      ],
      features: [
        { en: 'Practical maintenance', de: 'Unkomplizierte Pflege' },
        { en: 'Multi-chamber profiles', de: 'Mehrkammerprofile' },
        { en: 'Wide finish range', de: 'Große Dekorauswahl' }
      ],
      image: ''
    },
    {
      id: 'composite',
      title: { en: 'Composite', de: 'Verbund' },
      subtitle: { en: 'Modern performance', de: 'Moderne Leistung' },
      description: { en: 'Combined materials for demanding conditions and refined looks.', de: 'Kombinierte Werkstoffe für anspruchsvolle Bedingungen und hochwertige Optik.' },
      finishes: [
        { id: 'slate', name: { en: 'Slate', de: 'Schiefer' }, color: 'linear-gradient(135deg,#565a5d,#3d4144)' },
        { id: 'stone', name: { en: 'Stone', de: 'Stein' }, color: 'linear-gradient(135deg,#9a958a,#7c776d)' },
        { id: 'bronze', name: { en: 'Bronze', de: 'Bronze' }, color: 'linear-gradient(135deg,#7b664d,#5a4830)' },
        { id: 'sand', name: { en: 'Sand', de: 'Sand' }, color: 'linear-gradient(135deg,#cfc3aa,#b9ac91)' }
      ],
      features: [
        { en: 'Two materials, one system', de: 'Zwei Werkstoffe, ein System' },
        { en: 'Weather-side protection', de: 'Wetterseitiger Schutz' },
        { en: 'Refined interior look', de: 'Hochwertige Innenoptik' }
      ],
      image: ''
    }
  ];
})();
