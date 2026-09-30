/*
 * CLIENT CONFIG — the single file EO Labs edits for every new client.
 *
 *   company · branding · contact · serviceAreas · socials · hero · seo · languages · features
 *   categories · products · materials · projects · manufacturers · faq
 *
 * UI wording lives in data/translations.js; selectable options (glass, project types, countries)
 * in data/options.js. Everything is read from here — no client data is hard-coded in components.
 *
 * demoMode:true  → demo template: noindex, no invented contacts, quote sends nothing.
 * themePreset    → "black-frame" | "warm-stone" | "minimal-white"  (css/presets.css)
 * branding.*     → optional colour overrides (null = preset value)
 * hero.image / imageMobile → string or { src, width, height, srcset, sources:[{type,srcset}] } (AVIF/WebP)
 * categories[].availableMaterials / availableFinishes / availableGlass drive the configurator.
 *
 * After editing run:  node tools/build.js   (regenerates crawler-visible HTML for every language)
 */
window.EO = window.EO || {};
EO.client = {
  "demoMode": true,
  "themePreset": "black-frame",
  "company": {
    "name": "EO Labs Windows & Doors",
    "shortName": "EO Labs",
    "legalName": "",
    "description": {
      "en": "",
      "de": ""
    },
    "logo": "assets/icons/logo.svg",
    "logoMono": true,
    "favicon": "assets/icons/favicon.svg"
  },
  "branding": {
    "primary": null,
    "secondary": null,
    "accent": null,
    "black": null,
    "textDark": null,
    "textLight": null,
    "muted": null
  },
  "contact": {
    "phone": "",
    "email": "",
    "whatsapp": "",
    "address": ""
  },
  "serviceAreas": [
    "DE",
    "AT",
    "CH",
    "BE",
    "NL"
  ],
  "socials": {
    "instagram": "",
    "linkedin": "",
    "youtube": ""
  },
  "legal": {
    "privacy": "",
    "terms": "",
    "cookies": ""
  },
  "languages": {
    "default": "en",
    "enabled": [
      "en",
      "de"
    ]
  },
  "features": {
    "products": true,
    "configurator": true,
    "materials": true,
    "projects": true,
    "manufacturers": true,
    "faq": true,
    "presetSwitcher": true
  },
  "hero": {
    "image": {
      "src": "assets/images/hero-villa.svg",
      "width": 1920,
      "height": 1080
    },
    "imageMobile": null,
    "focal": "62% 50%",
    "alt": {
      "en": "Modern villa terrace with panoramic sliding glazing and thin aluminium frames at dusk",
      "de": "Moderne Villenterrasse mit Panorama-Schiebeverglasung und schlanken Aluminiumrahmen in der Dämmerung"
    }
  },
  "technical": {
    "image": {
      "src": "assets/images/profile-section.svg",
      "width": 1300,
      "height": 1250
    },
    "specs": {
      "thermal": "",
      "acoustic": "",
      "security": "",
      "durability": ""
    },
    "annotations": {
      "glazing": "",
      "thermalBreak": "",
      "profile": "",
      "chambers": ""
    }
  },
  "cta": {
    "image": {
      "src": "assets/images/cta-interior.svg",
      "width": 1200,
      "height": 1300
    }
  },
  "quote": {
    "endpoint": ""
  },
  "seo": {
    "siteUrl": "",
    "title": {
      "en": "",
      "de": ""
    },
    "description": {
      "en": "",
      "de": ""
    },
    "ogImage": "assets/images/hero-villa.svg",
    "twitterCard": "summary_large_image",
    "pages": {
      "windows": {
        "path": "/windows",
        "enabled": false
      },
      "doors": {
        "path": "/doors",
        "enabled": false
      },
      "sliding-doors": {
        "path": "/sliding-doors",
        "enabled": false
      },
      "facades": {
        "path": "/facades",
        "enabled": false
      },
      "aluminium-windows": {
        "path": "/aluminium-windows",
        "enabled": false
      },
      "pvc-windows": {
        "path": "/pvc-windows",
        "enabled": false
      },
      "timber-windows": {
        "path": "/timber-windows",
        "enabled": false
      }
    },
    "demoTitle": {
      "en": "Windows & Doors Website Template — EO Labs Demo",
      "de": "Fenster & Türen Website-Template — EO Labs Demo"
    },
    "demoDescription": {
      "en": "Demo of a premium website template for windows, doors, aluminium and sliding systems companies. Not a real company.",
      "de": "Demo einer hochwertigen Website-Vorlage für Fenster-, Türen- und Aluminiumsystem-Unternehmen. Kein echtes Unternehmen."
    }
  },
  "categories": [
    {
      "id": "windows",
      "pageSlug": "windows",
      "title": {
        "en": "Windows",
        "de": "Fenster"
      },
      "tagline": {
        "en": "Maximum daylight.\nSuperior thermal performance.",
        "de": "Maximales Tageslicht.\nHervorragende Wärmedämmung."
      },
      "image": "assets/images/cat-windows.svg",
      "alt": {
        "en": "Large window with a thin black frame framing a mountain view",
        "de": "Großes Fenster mit schmalem schwarzem Rahmen und Bergblick"
      },
      "active": true,
      "availableMaterials": [
        "aluminium",
        "pvc",
        "timber",
        "composite"
      ],
      "availableGlass": [
        "standard",
        "low-e",
        "solar",
        "privacy"
      ]
    },
    {
      "id": "doors",
      "pageSlug": "doors",
      "title": {
        "en": "Doors",
        "de": "Türen"
      },
      "tagline": {
        "en": "Security, design\nand long-lasting quality.",
        "de": "Sicherheit, Design\nund langlebige Qualität."
      },
      "image": "assets/images/cat-doors.svg",
      "alt": {
        "en": "Dark entrance door with a slim side light set in a stone wall",
        "de": "Dunkle Haustür mit schmalem Seitenlicht in einer Steinwand"
      },
      "active": true,
      "availableMaterials": [
        "aluminium",
        "timber"
      ],
      "availableFinishes": {
        "aluminium": [
          "anthracite",
          "black",
          "bronze"
        ],
        "timber": [
          "oak",
          "walnut",
          "smoked"
        ]
      },
      "availableGlass": [
        "standard",
        "low-e",
        "privacy"
      ]
    },
    {
      "id": "sliding",
      "pageSlug": "sliding-doors",
      "title": {
        "en": "Sliding Systems",
        "de": "Schiebesysteme"
      },
      "tagline": {
        "en": "Seamless indoor-outdoor\nliving.",
        "de": "Nahtloses Wohnen\ndrinnen und draußen."
      },
      "image": "assets/images/cat-sliding.svg",
      "alt": {
        "en": "Wide sliding glass wall opening onto a landscape at golden hour",
        "de": "Breite Glas-Schiebewand mit Blick in die Landschaft zur goldenen Stunde"
      },
      "active": true,
      "availableMaterials": [
        "aluminium",
        "pvc"
      ],
      "availableFinishes": {
        "aluminium": [
          "anthracite",
          "black",
          "white"
        ],
        "pvc": [
          "white",
          "anthracite"
        ]
      },
      "availableGlass": [
        "low-e",
        "solar",
        "standard"
      ]
    },
    {
      "id": "facades",
      "pageSlug": "facades",
      "title": {
        "en": "Facades",
        "de": "Fassaden"
      },
      "tagline": {
        "en": "Architectural solutions\nfor larger projects.",
        "de": "Architektonische Lösungen\nfür größere Projekte."
      },
      "image": "assets/images/cat-facades.svg",
      "alt": {
        "en": "Glazed apartment facade with warm-lit windows at dusk",
        "de": "Verglaste Wohnfassade mit warm beleuchteten Fenstern in der Dämmerung"
      },
      "active": true,
      "availableMaterials": [
        "aluminium",
        "composite"
      ],
      "availableFinishes": {
        "aluminium": [
          "natural",
          "anthracite",
          "black",
          "bronze"
        ],
        "composite": [
          "slate",
          "stone",
          "bronze"
        ]
      },
      "availableGlass": [
        "low-e",
        "solar",
        "privacy"
      ]
    }
  ],
  "products": [
    {
      "id": "aluminium-window",
      "category": "windows",
      "title": {
        "en": "Aluminium Windows",
        "de": "Aluminiumfenster"
      },
      "description": {
        "en": "Slim frames and generous glass areas for modern buildings.",
        "de": "Schlanke Rahmen und großzügige Glasflächen für moderne Gebäude."
      },
      "images": [],
      "material": [
        "aluminium"
      ],
      "features": [
        {
          "en": "Slim sightlines",
          "de": "Schlanke Ansichten"
        },
        {
          "en": "Tilt & turn or fixed",
          "de": "Dreh-Kipp oder fest"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "pvc-window",
      "category": "windows",
      "title": {
        "en": "PVC Windows",
        "de": "Kunststofffenster"
      },
      "description": {
        "en": "Practical, well-insulated windows for renovation and new builds.",
        "de": "Praktische, gut gedämmte Fenster für Sanierung und Neubau."
      },
      "images": [],
      "material": [
        "pvc"
      ],
      "features": [
        {
          "en": "Multi-chamber profile",
          "de": "Mehrkammerprofil"
        },
        {
          "en": "Many finishes",
          "de": "Viele Dekore"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "timber-window",
      "category": "windows",
      "title": {
        "en": "Timber Windows",
        "de": "Holzfenster"
      },
      "description": {
        "en": "Natural surfaces with a warm, architectural character.",
        "de": "Natürliche Oberflächen mit warmem, architektonischem Charakter."
      },
      "images": [],
      "material": [
        "timber"
      ],
      "features": [
        {
          "en": "Oak, ash, walnut",
          "de": "Eiche, Esche, Nussbaum"
        },
        {
          "en": "Refinishable",
          "de": "Aufarbeitbar"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "composite-window",
      "category": "windows",
      "title": {
        "en": "Composite Windows",
        "de": "Verbundfenster"
      },
      "description": {
        "en": "Two materials combined for durable exteriors and refined interiors.",
        "de": "Zwei Werkstoffe kombiniert für langlebige Außenseiten und hochwertige Innenräume."
      },
      "images": [],
      "material": [
        "composite"
      ],
      "features": [
        {
          "en": "Weather-side protection",
          "de": "Wetterseitiger Schutz"
        },
        {
          "en": "Refined interior",
          "de": "Hochwertige Innenseite"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "aluminium-door",
      "category": "doors",
      "title": {
        "en": "Aluminium Entrance Doors",
        "de": "Aluminium-Haustüren"
      },
      "description": {
        "en": "Flat, minimal entrance doors with concealed hardware options.",
        "de": "Flächige, minimalistische Haustüren mit verdeckten Beschlägen."
      },
      "images": [],
      "material": [
        "aluminium"
      ],
      "features": [
        {
          "en": "Flush panels",
          "de": "Flächenbündige Füllungen"
        },
        {
          "en": "Security options",
          "de": "Sicherheitsoptionen"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "timber-door",
      "category": "doors",
      "title": {
        "en": "Timber Doors",
        "de": "Holztüren"
      },
      "description": {
        "en": "Solid, characterful doors in natural and contemporary finishes.",
        "de": "Massive Türen mit Charakter in natürlichen und zeitgemäßen Oberflächen."
      },
      "images": [],
      "material": [
        "timber"
      ],
      "features": [
        {
          "en": "Natural finishes",
          "de": "Natürliche Oberflächen"
        },
        {
          "en": "Side lights",
          "de": "Seitenteile"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "aluminium-sliding",
      "category": "sliding",
      "title": {
        "en": "Aluminium Sliding Systems",
        "de": "Aluminium-Schiebesysteme"
      },
      "description": {
        "en": "Lift-and-slide and pocket systems for wide panoramic openings.",
        "de": "Hebe-Schiebe- und Taschensysteme für breite Panoramaöffnungen."
      },
      "images": [],
      "material": [
        "aluminium"
      ],
      "features": [
        {
          "en": "Wide openings",
          "de": "Große Öffnungsbreiten"
        },
        {
          "en": "Low threshold",
          "de": "Niedrige Schwelle"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "pvc-sliding",
      "category": "sliding",
      "title": {
        "en": "PVC Sliding Doors",
        "de": "Kunststoff-Schiebetüren"
      },
      "description": {
        "en": "Practical terrace doors with smooth-running sashes.",
        "de": "Praktische Terrassentüren mit leichtgängigen Flügeln."
      },
      "images": [],
      "material": [
        "pvc"
      ],
      "features": [
        {
          "en": "Smooth running",
          "de": "Leichtgängig"
        },
        {
          "en": "Renovation friendly",
          "de": "Sanierungsgeeignet"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "glass-facade",
      "category": "facades",
      "title": {
        "en": "Glazed Facades",
        "de": "Glasfassaden"
      },
      "description": {
        "en": "Post-and-beam and unitised facade systems for larger buildings.",
        "de": "Pfosten-Riegel- und Elementfassaden für größere Gebäude."
      },
      "images": [],
      "material": [
        "aluminium"
      ],
      "features": [
        {
          "en": "Post-and-beam",
          "de": "Pfosten-Riegel"
        },
        {
          "en": "Custom engineering",
          "de": "Individuelle Planung"
        }
      ],
      "specs": {},
      "active": true
    },
    {
      "id": "composite-facade",
      "category": "facades",
      "title": {
        "en": "Composite Facade Elements",
        "de": "Verbund-Fassadenelemente"
      },
      "description": {
        "en": "Combined-material elements for demanding architecture.",
        "de": "Elemente aus kombinierten Werkstoffen für anspruchsvolle Architektur."
      },
      "images": [],
      "material": [
        "composite"
      ],
      "features": [
        {
          "en": "Combined materials",
          "de": "Kombinierte Werkstoffe"
        },
        {
          "en": "Custom sizes",
          "de": "Sondermaße"
        }
      ],
      "specs": {},
      "active": true
    }
  ],
  "materials": [
    {
      "id": "aluminium",
      "title": {
        "en": "Aluminium",
        "de": "Aluminium"
      },
      "subtitle": {
        "en": "Anodised & powder-coated",
        "de": "Eloxiert & pulverbeschichtet"
      },
      "description": {
        "en": "Slim sightlines and large formats for contemporary architecture.",
        "de": "Schlanke Ansichten und große Formate für zeitgenössische Architektur."
      },
      "finishes": [
        {
          "id": "natural",
          "name": {
            "en": "Anodised natural",
            "de": "Natur eloxiert"
          },
          "color": "linear-gradient(135deg,#d6d6d3,#9d9d9a)"
        },
        {
          "id": "anthracite",
          "name": {
            "en": "Anthracite",
            "de": "Anthrazit"
          },
          "color": "#3a3d40"
        },
        {
          "id": "black",
          "name": {
            "en": "Deep black",
            "de": "Tiefschwarz"
          },
          "color": "#141414"
        },
        {
          "id": "white",
          "name": {
            "en": "Pure white",
            "de": "Reinweiß"
          },
          "color": "#e9e9e5"
        },
        {
          "id": "bronze",
          "name": {
            "en": "Bronze",
            "de": "Bronze"
          },
          "color": "linear-gradient(135deg,#7a6650,#54442f)"
        }
      ],
      "features": [
        {
          "en": "Slim profile sightlines",
          "de": "Schlanke Profilansichten"
        },
        {
          "en": "Large-format capability",
          "de": "Große Formate möglich"
        },
        {
          "en": "Low maintenance",
          "de": "Pflegeleicht"
        }
      ],
      "image": ""
    },
    {
      "id": "timber",
      "title": {
        "en": "Timber",
        "de": "Holz"
      },
      "subtitle": {
        "en": "Natural & contemporary",
        "de": "Natürlich & zeitgemäß"
      },
      "description": {
        "en": "Warm, natural surfaces from light oak to smoked tones.",
        "de": "Warme, natürliche Oberflächen von hellem Eichenholz bis zu geräucherten Tönen."
      },
      "finishes": [
        {
          "id": "oak",
          "name": {
            "en": "Natural oak",
            "de": "Eiche natur"
          },
          "color": "repeating-linear-gradient(90deg, #c9a26c 0 7px, #bd9660 7px 10px)"
        },
        {
          "id": "ash",
          "name": {
            "en": "Light ash",
            "de": "Esche hell"
          },
          "color": "repeating-linear-gradient(90deg, #dcc8a6 0 7px, #d1bb96 7px 10px)"
        },
        {
          "id": "walnut",
          "name": {
            "en": "Walnut",
            "de": "Nussbaum"
          },
          "color": "repeating-linear-gradient(90deg, #5d412c 0 7px, #523a27 7px 10px)"
        },
        {
          "id": "smoked",
          "name": {
            "en": "Smoked oak",
            "de": "Eiche geräuchert"
          },
          "color": "repeating-linear-gradient(90deg, #3d3129 0 7px, #33291f 7px 10px)"
        }
      ],
      "features": [
        {
          "en": "Natural material",
          "de": "Natürlicher Werkstoff"
        },
        {
          "en": "Warm surface feel",
          "de": "Warme Haptik"
        },
        {
          "en": "Refinishable",
          "de": "Aufarbeitbar"
        }
      ],
      "image": ""
    },
    {
      "id": "pvc",
      "title": {
        "en": "PVC",
        "de": "PVC"
      },
      "subtitle": {
        "en": "Durable & versatile",
        "de": "Langlebig & vielseitig"
      },
      "description": {
        "en": "A practical all-rounder for renovation and new builds.",
        "de": "Ein praktischer Allrounder für Sanierung und Neubau."
      },
      "finishes": [
        {
          "id": "white",
          "name": {
            "en": "White",
            "de": "Weiß"
          },
          "color": "#f1f1ee"
        },
        {
          "id": "cream",
          "name": {
            "en": "Cream",
            "de": "Creme"
          },
          "color": "#e6ddc6"
        },
        {
          "id": "anthracite",
          "name": {
            "en": "Anthracite foil",
            "de": "Anthrazit-Folie"
          },
          "color": "#3b3e42"
        },
        {
          "id": "oak-foil",
          "name": {
            "en": "Oak-effect foil",
            "de": "Eiche-Dekor"
          },
          "color": "repeating-linear-gradient(90deg, #a98259 0 7px, #9d774f 7px 10px)"
        }
      ],
      "features": [
        {
          "en": "Practical maintenance",
          "de": "Unkomplizierte Pflege"
        },
        {
          "en": "Multi-chamber profiles",
          "de": "Mehrkammerprofile"
        },
        {
          "en": "Wide finish range",
          "de": "Große Dekorauswahl"
        }
      ],
      "image": ""
    },
    {
      "id": "composite",
      "title": {
        "en": "Composite",
        "de": "Verbund"
      },
      "subtitle": {
        "en": "Modern performance",
        "de": "Moderne Leistung"
      },
      "description": {
        "en": "Combined materials for demanding conditions and refined looks.",
        "de": "Kombinierte Werkstoffe für anspruchsvolle Bedingungen und hochwertige Optik."
      },
      "finishes": [
        {
          "id": "slate",
          "name": {
            "en": "Slate",
            "de": "Schiefer"
          },
          "color": "linear-gradient(135deg,#565a5d,#3d4144)"
        },
        {
          "id": "stone",
          "name": {
            "en": "Stone",
            "de": "Stein"
          },
          "color": "linear-gradient(135deg,#9a958a,#7c776d)"
        },
        {
          "id": "bronze",
          "name": {
            "en": "Bronze",
            "de": "Bronze"
          },
          "color": "linear-gradient(135deg,#7b664d,#5a4830)"
        },
        {
          "id": "sand",
          "name": {
            "en": "Sand",
            "de": "Sand"
          },
          "color": "linear-gradient(135deg,#cfc3aa,#b9ac91)"
        }
      ],
      "features": [
        {
          "en": "Two materials, one system",
          "de": "Zwei Werkstoffe, ein System"
        },
        {
          "en": "Weather-side protection",
          "de": "Wetterseitiger Schutz"
        },
        {
          "en": "Refined interior look",
          "de": "Hochwertige Innenoptik"
        }
      ],
      "image": ""
    }
  ],
  "projects": [
    {
      "id": "sample-residence",
      "title": {
        "en": "Sample Residence",
        "de": "Beispielresidenz"
      },
      "category": {
        "en": "Residential",
        "de": "Wohnen"
      },
      "location": "",
      "images": [
        {
          "src": "assets/images/project-lake-house.svg",
          "alt": {
            "en": "Demo image: lakeside house with a long glazed volume and pool at dusk",
            "de": "Demobild: Haus am See mit langem Glaskörper und Pool in der Dämmerung"
          }
        },
        {
          "src": "assets/images/project-lake-house-2.svg",
          "alt": {
            "en": "Demo image: glazed lakeside house at golden hour",
            "de": "Demobild: verglastes Haus am See zur goldenen Stunde"
          }
        }
      ],
      "material": [
        "aluminium"
      ],
      "description": {
        "en": "Sample presentation — panoramic sliding systems in slim aluminium frames.",
        "de": "Beispielpräsentation – Panorama-Schiebesysteme in schlanken Aluminiumrahmen."
      },
      "active": true,
      "demo": true,
      "featured": true
    },
    {
      "id": "concept-villa",
      "title": {
        "en": "Concept Villa",
        "de": "Konzeptvilla"
      },
      "category": {
        "en": "Residential",
        "de": "Wohnen"
      },
      "location": "",
      "images": [
        {
          "src": "assets/images/project-villa.svg",
          "alt": {
            "en": "Demo image: timber-clad villa with large glazing in soft light",
            "de": "Demobild: holzverkleidete Villa mit großer Verglasung im weichen Licht"
          }
        },
        {
          "src": "assets/images/project-villa-2.svg",
          "alt": {
            "en": "Demo image: timber-clad villa with pool in daylight",
            "de": "Demobild: holzverkleidete Villa mit Pool bei Tageslicht"
          }
        }
      ],
      "material": [
        "timber",
        "aluminium"
      ],
      "description": {
        "en": "Sample presentation — timber facade with large fixed glazing.",
        "de": "Beispielpräsentation – Holzfassade mit großflächiger Festverglasung."
      },
      "active": true,
      "demo": true,
      "featured": true
    },
    {
      "id": "demo-apartments",
      "title": {
        "en": "Demo Commercial Project",
        "de": "Demo-Gewerbeprojekt"
      },
      "category": {
        "en": "Residential / Commercial",
        "de": "Wohnen / Gewerbe"
      },
      "location": "",
      "images": [
        {
          "src": "assets/images/project-apartments.svg",
          "alt": {
            "en": "Demo image: apartment building with glazed balconies at dusk",
            "de": "Demobild: Wohngebäude mit verglasten Balkonen in der Dämmerung"
          }
        },
        {
          "src": "assets/images/project-apartments-2.svg",
          "alt": {
            "en": "Demo image: apartment block facade with warm lit windows",
            "de": "Demobild: Fassade eines Wohnblocks mit warm beleuchteten Fenstern"
          }
        }
      ],
      "material": [
        "aluminium",
        "composite"
      ],
      "description": {
        "en": "Sample presentation — window and facade elements for a multi-storey building.",
        "de": "Beispielpräsentation – Fenster- und Fassadenelemente für ein mehrgeschossiges Gebäude."
      },
      "active": true,
      "demo": true,
      "featured": true
    }
  ],
  "manufacturers": [],
  "faq": [
    {
      "id": "materials",
      "question": {
        "en": "Which material is right for my project?",
        "de": "Welches Material passt zu meinem Projekt?"
      },
      "answer": {
        "en": "It depends on the architecture, the budget and the maintenance you are comfortable with. Aluminium suits slim sightlines and large formats, timber brings warmth, PVC is a practical all-rounder and composite combines several strengths. We are happy to compare options for your building.",
        "de": "Das hängt von Architektur, Budget und Pflegeaufwand ab. Aluminium eignet sich für schlanke Ansichten und große Formate, Holz bringt Wärme, PVC ist ein praktischer Allrounder und Verbundlösungen vereinen mehrere Stärken. Wir vergleichen gern die Optionen für Ihr Gebäude."
      },
      "active": true
    },
    {
      "id": "quote",
      "question": {
        "en": "How does a quote request work?",
        "de": "Wie läuft eine Angebotsanfrage ab?"
      },
      "answer": {
        "en": "Choose the product, material and project type, add approximate sizes and your location, then leave your contact details. You will receive a tailored recommendation before anything is decided.",
        "de": "Wählen Sie Produkt, Material und Projektart, ergänzen Sie ungefähre Maße und Ihren Standort und hinterlassen Sie Ihre Kontaktdaten. Sie erhalten eine individuelle Empfehlung, bevor etwas entschieden wird."
      },
      "active": true
    },
    {
      "id": "installation",
      "question": {
        "en": "Can installation be included?",
        "de": "Kann die Montage enthalten sein?"
      },
      "answer": {
        "en": "The quote flow asks whether installation is required so the proposal can cover supply only or supply and installation.",
        "de": "Im Anfrageprozess geben Sie an, ob Montage benötigt wird – so kann das Angebot Lieferung allein oder Lieferung und Montage umfassen."
      },
      "active": true
    },
    {
      "id": "sizes",
      "question": {
        "en": "Do I need exact measurements?",
        "de": "Brauche ich exakte Maße?"
      },
      "answer": {
        "en": "No. Approximate sizes are enough for a first recommendation. Exact dimensions are confirmed later on site or from your plans.",
        "de": "Nein. Für eine erste Empfehlung genügen ungefähre Maße. Exakte Maße werden später vor Ort oder anhand Ihrer Pläne bestätigt."
      },
      "active": true
    }
  ]
};
