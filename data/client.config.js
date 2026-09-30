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
      "src": "assets/photos/hero-1440.jpg",
      "srcset": "assets/photos/hero-640.jpg 640w, assets/photos/hero-960.jpg 960w, assets/photos/hero-1440.jpg 1440w, assets/photos/hero-1920.jpg 1920w",
      "sources": [
        {
          "type": "image/avif",
          "srcset": "assets/photos/hero-640.avif 640w, assets/photos/hero-960.avif 960w, assets/photos/hero-1440.avif 1440w, assets/photos/hero-1920.avif 1920w"
        },
        {
          "type": "image/webp",
          "srcset": "assets/photos/hero-640.webp 640w, assets/photos/hero-960.webp 960w, assets/photos/hero-1440.webp 1440w, assets/photos/hero-1920.webp 1920w"
        }
      ],
      "width": 1440,
      "height": 588
    },
    "imageMobile": {
      "src": "assets/photos/hero-mobile-960.jpg",
      "srcset": "assets/photos/hero-mobile-640.jpg 640w, assets/photos/hero-mobile-960.jpg 960w",
      "sources": [
        {
          "type": "image/avif",
          "srcset": "assets/photos/hero-mobile-640.avif 640w, assets/photos/hero-mobile-960.avif 960w"
        },
        {
          "type": "image/webp",
          "srcset": "assets/photos/hero-mobile-640.webp 640w, assets/photos/hero-mobile-960.webp 960w"
        }
      ],
      "width": 960,
      "height": 1280
    },
    "focal": "70% 50%",
    "alt": {
      "en": "Two-storey modern villa with floor-to-ceiling black aluminium glazing and an infinity pool at dusk",
      "de": "Zweigeschossige moderne Villa mit raumhoher Verglasung in schwarzen Aluminiumprofilen und Infinity-Pool in der Dämmerung"
    }
  },
  "technical": {
    "image": {
      "src": "assets/photos/profile-1440.jpg",
      "srcset": "assets/photos/profile-640.jpg 640w, assets/photos/profile-960.jpg 960w, assets/photos/profile-1440.jpg 1440w",
      "sources": [
        {
          "type": "image/avif",
          "srcset": "assets/photos/profile-640.avif 640w, assets/photos/profile-960.avif 960w, assets/photos/profile-1440.avif 1440w"
        },
        {
          "type": "image/webp",
          "srcset": "assets/photos/profile-640.webp 640w, assets/photos/profile-960.webp 960w, assets/photos/profile-1440.webp 1440w"
        }
      ],
      "width": 1440,
      "height": 960
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
    },
    "points": {
      "glazing": {
        "x": "58%",
        "y": "22.5%"
      },
      "profile": {
        "x": "65.5%",
        "y": "40%"
      },
      "thermalBreak": {
        "x": "55%",
        "y": "53%"
      },
      "chambers": {
        "x": "64%",
        "y": "73%"
      }
    }
  },
  "cta": {
    "image": {
      "src": "assets/photos/cta-1440.jpg",
      "srcset": "assets/photos/cta-640.jpg 640w, assets/photos/cta-960.jpg 960w, assets/photos/cta-1440.jpg 1440w",
      "sources": [
        {
          "type": "image/avif",
          "srcset": "assets/photos/cta-640.avif 640w, assets/photos/cta-960.avif 960w, assets/photos/cta-1440.avif 1440w"
        },
        {
          "type": "image/webp",
          "srcset": "assets/photos/cta-640.webp 640w, assets/photos/cta-960.webp 960w, assets/photos/cta-1440.webp 1440w"
        }
      ],
      "width": 1440,
      "height": 720
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
    "ogImage": "assets/photos/hero-1440.jpg",
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
      "image": {
        "src": "assets/photos/cat-windows-960.jpg",
        "srcset": "assets/photos/cat-windows-640.jpg 640w, assets/photos/cat-windows-960.jpg 960w",
        "sources": [
          {
            "type": "image/avif",
            "srcset": "assets/photos/cat-windows-640.avif 640w, assets/photos/cat-windows-960.avif 960w"
          },
          {
            "type": "image/webp",
            "srcset": "assets/photos/cat-windows-640.webp 640w, assets/photos/cat-windows-960.webp 960w"
          }
        ],
        "width": 960,
        "height": 1200
      },
      "alt": {
        "en": "Large fixed window with slim black frame overlooking a lake and mountains",
        "de": "Großes Festfenster mit schlankem schwarzem Rahmen und Blick auf See und Berge"
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
      ],
      "preview": {
        "position": "50% 50%"
      }
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
      "image": {
        "src": "assets/photos/cat-doors-960.jpg",
        "srcset": "assets/photos/cat-doors-640.jpg 640w, assets/photos/cat-doors-960.jpg 960w",
        "sources": [
          {
            "type": "image/avif",
            "srcset": "assets/photos/cat-doors-640.avif 640w, assets/photos/cat-doors-960.avif 960w"
          },
          {
            "type": "image/webp",
            "srcset": "assets/photos/cat-doors-640.webp 640w, assets/photos/cat-doors-960.webp 960w"
          }
        ],
        "width": 960,
        "height": 1200
      },
      "alt": {
        "en": "Pivot entrance door in dark aluminium with slim glazed side lights in a stone wall",
        "de": "Aluminium-Haustür in Anthrazit mit schmalen Glasseitenteilen in einer Steinwand"
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
      ],
      "preview": {
        "position": "50% 60%"
      }
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
      "image": {
        "src": "assets/photos/cat-sliding-960.jpg",
        "srcset": "assets/photos/cat-sliding-640.jpg 640w, assets/photos/cat-sliding-960.jpg 960w",
        "sources": [
          {
            "type": "image/avif",
            "srcset": "assets/photos/cat-sliding-640.avif 640w, assets/photos/cat-sliding-960.avif 960w"
          },
          {
            "type": "image/webp",
            "srcset": "assets/photos/cat-sliding-640.webp 640w, assets/photos/cat-sliding-960.webp 960w"
          }
        ],
        "width": 960,
        "height": 1200
      },
      "alt": {
        "en": "Large-format sliding glass wall opening onto a terrace and pool",
        "de": "Großformatige Glas-Schiebewand zur Terrasse und zum Pool"
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
      ],
      "preview": {
        "position": "50% 50%"
      }
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
      "image": {
        "src": "assets/photos/cat-facades-960.jpg",
        "srcset": "assets/photos/cat-facades-640.jpg 640w, assets/photos/cat-facades-960.jpg 960w",
        "sources": [
          {
            "type": "image/avif",
            "srcset": "assets/photos/cat-facades-640.avif 640w, assets/photos/cat-facades-960.avif 960w"
          },
          {
            "type": "image/webp",
            "srcset": "assets/photos/cat-facades-640.webp 640w, assets/photos/cat-facades-960.webp 960w"
          }
        ],
        "width": 960,
        "height": 1200
      },
      "alt": {
        "en": "Glazed facade with slim black mullions on a two-storey building at dusk",
        "de": "Verglaste Fassade mit schlanken schwarzen Pfosten an einem zweigeschossigen Gebäude in der Dämmerung"
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
      ],
      "preview": {
        "position": "50% 50%"
      }
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
          "color": "#A7A7A3",
          "previewImage": null
        },
        {
          "id": "anthracite",
          "name": {
            "en": "Anthracite",
            "de": "Anthrazit"
          },
          "color": "#383B3D",
          "previewImage": null
        },
        {
          "id": "black",
          "name": {
            "en": "Deep black",
            "de": "Tiefschwarz"
          },
          "color": "#151515",
          "previewImage": null
        },
        {
          "id": "white",
          "name": {
            "en": "Pure white",
            "de": "Reinweiß"
          },
          "color": "#E8E5DE",
          "previewImage": null
        },
        {
          "id": "bronze",
          "name": {
            "en": "Bronze",
            "de": "Bronze"
          },
          "color": "#6C5846",
          "previewImage": null
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
      "image": "",
      "defaultFinish": "anthracite",
      "swatch": "linear-gradient(135deg,#7d8184 0%,#3a3d40 48%,#65696c 100%)"
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
          "color": "repeating-linear-gradient(90deg, #c9a26c 0 7px, #bd9660 7px 10px)",
          "previewImage": null
        },
        {
          "id": "ash",
          "name": {
            "en": "Light ash",
            "de": "Esche hell"
          },
          "color": "repeating-linear-gradient(90deg, #dcc8a6 0 7px, #d1bb96 7px 10px)",
          "previewImage": null
        },
        {
          "id": "walnut",
          "name": {
            "en": "Walnut",
            "de": "Nussbaum"
          },
          "color": "repeating-linear-gradient(90deg, #5d412c 0 7px, #523a27 7px 10px)",
          "previewImage": null
        },
        {
          "id": "smoked",
          "name": {
            "en": "Smoked oak",
            "de": "Eiche geräuchert"
          },
          "color": "repeating-linear-gradient(90deg, #3d3129 0 7px, #33291f 7px 10px)",
          "previewImage": null
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
      "image": "",
      "defaultFinish": "oak",
      "swatch": "repeating-linear-gradient(90deg, #c9a26c 0 7px, #bd9660 7px 10px)"
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
          "color": "#EFEDE8",
          "previewImage": null
        },
        {
          "id": "cream",
          "name": {
            "en": "Cream",
            "de": "Creme"
          },
          "color": "#e6ddc6",
          "previewImage": null
        },
        {
          "id": "anthracite",
          "name": {
            "en": "Anthracite foil",
            "de": "Anthrazit-Folie"
          },
          "color": "#383B3D",
          "previewImage": null
        },
        {
          "id": "oak-foil",
          "name": {
            "en": "Oak-effect foil",
            "de": "Eiche-Dekor"
          },
          "color": "repeating-linear-gradient(90deg, #a98259 0 7px, #9d774f 7px 10px)",
          "previewImage": null
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
      "image": "",
      "defaultFinish": "white",
      "swatch": "linear-gradient(135deg,#f0efeb,#d7d6d2)"
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
          "color": "linear-gradient(135deg,#565a5d,#3d4144)",
          "previewImage": null
        },
        {
          "id": "stone",
          "name": {
            "en": "Stone",
            "de": "Stein"
          },
          "color": "linear-gradient(135deg,#9a958a,#7c776d)",
          "previewImage": null
        },
        {
          "id": "bronze",
          "name": {
            "en": "Bronze",
            "de": "Bronze"
          },
          "color": "linear-gradient(135deg,#7b664d,#5a4830)",
          "previewImage": null
        },
        {
          "id": "sand",
          "name": {
            "en": "Sand",
            "de": "Sand"
          },
          "color": "linear-gradient(135deg,#cfc3aa,#b9ac91)",
          "previewImage": null
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
      "image": "",
      "defaultFinish": "slate",
      "swatch": "linear-gradient(135deg,#5b5f61 0%,#33373a 50%,#8d8a80 100%)"
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
          "src": "assets/photos/project-1-1440.jpg",
          "srcset": "assets/photos/project-1-640.jpg 640w, assets/photos/project-1-960.jpg 960w, assets/photos/project-1-1440.jpg 1440w",
          "sources": [
            {
              "type": "image/avif",
              "srcset": "assets/photos/project-1-640.avif 640w, assets/photos/project-1-960.avif 960w, assets/photos/project-1-1440.avif 1440w"
            },
            {
              "type": "image/webp",
              "srcset": "assets/photos/project-1-640.webp 640w, assets/photos/project-1-960.webp 960w, assets/photos/project-1-1440.webp 1440w"
            }
          ],
          "width": 1440,
          "height": 960,
          "alt": {
            "en": "Demo image: lakeside villa with pool and floor-to-ceiling glazing",
            "de": "Demobild: Villa am See mit Pool und raumhoher Verglasung"
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
          "src": "assets/photos/project-2-1440.jpg",
          "srcset": "assets/photos/project-2-640.jpg 640w, assets/photos/project-2-960.jpg 960w, assets/photos/project-2-1440.jpg 1440w",
          "sources": [
            {
              "type": "image/avif",
              "srcset": "assets/photos/project-2-640.avif 640w, assets/photos/project-2-960.avif 960w, assets/photos/project-2-1440.avif 1440w"
            },
            {
              "type": "image/webp",
              "srcset": "assets/photos/project-2-640.webp 640w, assets/photos/project-2-960.webp 960w, assets/photos/project-2-1440.webp 1440w"
            }
          ],
          "width": 1440,
          "height": 960,
          "alt": {
            "en": "Demo image: timber-clad villa with large corner glazing at dusk",
            "de": "Demobild: holzverkleidete Villa mit großer Eckverglasung in der Dämmerung"
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
          "src": "assets/photos/project-3-1440.jpg",
          "srcset": "assets/photos/project-3-640.jpg 640w, assets/photos/project-3-960.jpg 960w, assets/photos/project-3-1440.jpg 1440w",
          "sources": [
            {
              "type": "image/avif",
              "srcset": "assets/photos/project-3-640.avif 640w, assets/photos/project-3-960.avif 960w, assets/photos/project-3-1440.avif 1440w"
            },
            {
              "type": "image/webp",
              "srcset": "assets/photos/project-3-640.webp 640w, assets/photos/project-3-960.webp 960w, assets/photos/project-3-1440.webp 1440w"
            }
          ],
          "width": 1440,
          "height": 960,
          "alt": {
            "en": "Demo image: stone and glass residence with balcony glazing at dusk",
            "de": "Demobild: Wohnhaus aus Stein und Glas mit Balkonverglasung in der Dämmerung"
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
