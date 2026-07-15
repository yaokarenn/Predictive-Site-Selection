import { Neighborhood, Landmark, DiningSpot } from "../types";

export const NYC_NEIGHBORHOODS: Neighborhood[] = [
  // --- MANHATTAN ---
  {
    id: "wash-heights",
    name: "Washington Heights",
    borough: "Manhattan",
    polygonPoints: [[400, 70], [440, 70], [450, 100], [450, 160], [410, 160]],
    centroid: { x: 428, y: 115 },
    description: "Perched on the highest natural point in Manhattan, Washington Heights features hilly terrain, historic parks, and a vibrant Dominican culture.",
    keyAesthetics: ["Steep hills", "Art Deco apartments", "Lively street music", "Salsa & Bachata beats"],
    keyStats: {
      vibe: "Energetic, cultural & community-centric",
      character: "Dominican-American heritage with profound historical roots",
      historicNotes: "Home to Fort Washington, which played a pivotal role in the American Revolutionary War."
    },
    landmarks: [
      {
        id: "the-cloisters",
        name: "The Met Cloisters",
        description: "A branch of the Met Museum dedicated to medieval European art and architecture, constructed from parts of medieval French monasteries.",
        yearBuilt: "1938",
        iconType: "culture",
        coordinates: { x: 415, y: 90 },
        funFact: "The stones were shipped from Europe piece-by-piece and reassembled at Fort Tryon Park.",
        category: "culture"
      },
      {
        id: "little-red-lighthouse",
        name: "Little Red Lighthouse",
        description: "A tiny, century-old lighthouse nestled directly underneath the majestic George Washington Bridge.",
        yearBuilt: "1889",
        iconType: "monument",
        coordinates: { x: 402, y: 120 },
        funFact: "It was immortalized in a classic 1942 children's book and saved from demolition by public outcry.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Malecon",
        type: "Dominican / Caribbean",
        specialty: "El Malecon Roasted Chicken & Mofongo",
        rating: 4.6,
        priceRange: "$$",
        description: "An uptown institution celebrated for its superb, garlic-infused Dominican comfort food and exceptionally juicy rotisserie chicken.",
        coordinates: { x: 430, y: 140 }
      }
    ],
    greenSpaces: [
      {
        name: "Fort Tryon Park",
        description: "A gorgeous scenic park with dramatic Hudson River views, heather gardens, and the winding paths of Upper Manhattan.",
        coordinates: { x: 420, y: 100 }
      }
    ]
  },
  {
    id: "harlem",
    name: "Harlem",
    borough: "Manhattan",
    polygonPoints: [[410, 160], [455, 160], [465, 230], [415, 230]],
    centroid: { x: 435, y: 195 },
    description: "A global epicenter of Black culture, political activism, and creative expression, Harlem is famous for jazz clubs, historic brownstones, and southern soul food.",
    keyAesthetics: ["Brownstones with stoops", "Historic theaters", "Soul food kitchen aromas", "Jazz heritage houses"],
    keyStats: {
      vibe: "Soulful, historic & artistically pioneering",
      character: "The cradle of the 1920s Harlem Renaissance",
      historicNotes: "Harlem is famed for launching careers of jazz pioneers like Duke Ellington, Billie Holiday, and Ella Fitzgerald."
    },
    landmarks: [
      {
        id: "apollo-theater",
        name: "Apollo Theater",
        description: "An legendary, world-famous venue that was crucial for the emergence of Jazz, Swing, Bebop, Soul, R&B, and Hip-Hop.",
        yearBuilt: "1914",
        iconType: "culture",
        coordinates: { x: 440, y: 195 },
        funFact: "Its 'Amateur Night' launched the star-studded careers of Jimi Hendrix, Ella Fitzgerald, and Lauryn Hill.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Amy Ruth's",
        type: "Southern Soul Food",
        specialty: "Chicken and Waffles ('The Rev. Al Sharpton')",
        rating: 4.5,
        priceRange: "$$",
        description: "Famed globally for served-fresh chicken and waffles named after notable African-American political and cultural figures.",
        coordinates: { x: 438, y: 210 }
      },
      {
        name: "Sylvia's",
        type: "Southern Comfort",
        specialty: "World-Famous Bar-B-Que Ribs & Collard Greens",
        rating: 4.4,
        priceRange: "$$",
        description: "Known affectionately as the 'Queen of Soul Food,' hosting politicians, celebrities, and locals since 1962.",
        coordinates: { x: 445, y: 185 }
      }
    ],
    greenSpaces: [
      {
        name: "Marcus Garvey Park",
        description: "Features a monumental historic fire watchtower and acts as a cultural center for drum circles and summer theater.",
        coordinates: { x: 450, y: 180 }
      }
    ]
  },
  {
    id: "central-park",
    name: "Central Park",
    borough: "Manhattan",
    polygonPoints: [[440, 230], [465, 230], [465, 320], [440, 320]],
    centroid: { x: 452, y: 275 },
    description: "The emerald crown Jewel of NYC, Central Park is a massive 843-acre masterpiece of landscape architecture, offering a quiet oasis in the center of modern Manhattan.",
    keyAesthetics: ["Winding paths", "Reflective lakes", "Stone bridges", "Horse carriages", "Sweeping meadows"],
    keyStats: {
      vibe: "Serene, monumental, and picturesque",
      character: "Designed by Frederick Law Olmsted and Calvert Vaux in 1858",
      historicNotes: "The first public landscaped park in any major United States city, requiring over 500,000 trees."
    },
    landmarks: [
      {
        id: "bethesda-fountain",
        name: "Bethesda Fountain & Terrace",
        description: "A magnificent neoclassical terrace looking over the Central Park lake, featuring the 'Angel of the Waters' statue.",
        yearBuilt: "1873",
        iconType: "monument",
        coordinates: { x: 452, y: 275 },
        funFact: "The fountain was built to celebrate the pure public water system supplied by the Croton Aqueduct in NYC.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Tavern on the Green",
        type: "American Contemporary",
        specialty: "Roasted Lamb Rack & Grilled Ribeye",
        rating: 4.3,
        priceRange: "$$$$",
        description: "An iconic restaurant housed in a former nineteenth-century sheep-fold, featuring a sparkling outdoor courtyard.",
        coordinates: { x: 442, y: 290 }
      }
    ],
    greenSpaces: [
      {
        name: "The Great Lawn",
        description: "A wide, legendary 55-acre green pasture that serves as the perfect spot for sunbathing, picnics, and free concerts.",
        coordinates: { x: 452, y: 260 }
      },
      {
        name: "The Ramble",
        description: "A densely wooded, 36-acre wild woodland with paths popular for birdwatching and tranquil walks.",
        coordinates: { x: 455, y: 270 }
      }
    ]
  },
  {
    id: "upper-west-side",
    name: "Upper West Side",
    borough: "Manhattan",
    polygonPoints: [[415, 230], [440, 230], [440, 320], [410, 320]],
    centroid: { x: 425, y: 275 },
    description: "A residential neighborhood with an intellectual, literary, and artistic spirit. Famous for cultural hubs, spectacular pre-war architecture, and direct access to two waterfront parks.",
    keyAesthetics: ["Pre-war brownstones", "Gilded-age landmarks", "Scholarly cafes", "Dog walkers"],
    keyStats: {
      vibe: "Cultured, relaxed & sophisticated",
      character: "Home to many musicians, actors, writers, and academics",
      historicNotes: "Developed rapidly following the completion of the 9th Avenue Elevated subway train."
    },
    landmarks: [
      {
        id: "amnh",
        name: "Museum of Natural History",
        description: "One of the largest museums in the world, containing over 34 million specimens of plants, animals, fossils, and minerals.",
        yearBuilt: "1869",
        iconType: "culture",
        coordinates: { x: 428, y: 260 },
        funFact: "The real skeleton of the blue whale suspended in the Milstein Hall of Ocean Life weighs a massive 21,000 pounds.",
        category: "culture"
      },
      {
        id: "lincoln-center",
        name: "Lincoln Center",
        description: "A major 16.3-acre complex of performing arts, hosting the Metropolitan Opera, NYC Ballet, and NY Philharmonic.",
        yearBuilt: "1962",
        iconType: "culture",
        coordinates: { x: 422, y: 305 },
        funFact: "Leonard Bernstein and the New York Philharmonic gave the inaugural concert in Philarmonic Hall.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Barney Greengrass",
        type: "Jewish Appetizing",
        specialty: "Scrambled Eggs with lox and onions, Sturgeon",
        rating: 4.7,
        priceRange: "$$$",
        description: "Known affectionately as 'The Sturgeon King' on the Upper West Side, this classic deli has carved smoked fish legends since 1908.",
        coordinates: { x: 420, y: 250 }
      }
    ],
    greenSpaces: [
      {
        name: "Riverside Park",
        description: "A majestic waterfront park designed by Olmsted, stretching four miles along the scenic Hudson River.",
        coordinates: { x: 412, y: 280 }
      }
    ]
  },
  {
    id: "upper-east-side",
    name: "Upper East Side",
    borough: "Manhattan",
    polygonPoints: [[465, 230], [490, 230], [480, 320], [465, 320]],
    centroid: { x: 477, y: 275 },
    description: "An upscale, elegant neighborhood lined with stylish townhouses, designer fashion boutiques on Madison Avenue, and 'Museum Mile' along Fifth Avenue.",
    keyAesthetics: ["Elegantly dressed doormen", "Fine-art galleries", "Madison Av boutiques", "Ivy-covered townhouses"],
    keyStats: {
      vibe: "Prestigious, calm & museum-rich",
      character: "The classic gilded-age 'Millionaires' Row' of old New York",
      historicNotes: "Lined with magnificent historic mansions built by the Astors, Vanderbilts, and Carnegies."
    },
    landmarks: [
      {
        id: "the-met",
        name: "Metropolitan Museum of Art",
        description: "The largest art museum in the Americas, with over 2 million works spanning 5,000 years of global human history.",
        yearBuilt: "1870",
        iconType: "culture",
        coordinates: { x: 470, y: 260 },
        funFact: "It houses an entire ancient Egyptian Temple—The Temple of Dendur—which was saved from rising Nile waters.",
        category: "culture"
      },
      {
        id: "guggenheim",
        name: "Guggenheim Museum",
        description: "An architectural marvel by Frank Lloyd Wright, featuring an elegant spiral design hosting a rare modern art collection.",
        yearBuilt: "1959",
        iconType: "culture",
        coordinates: { x: 474, y: 245 },
        funFact: "The museum's circular ramp was designed to allow visitors to view art while descending comfortably.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Cafe Sabarsky",
        type: "Austrian Viennese",
        specialty: "Sieler Sachertorte & Wiener Schnitzel",
        rating: 4.6,
        priceRange: "$$$",
        description: "Housed inside the beautiful Neue Galerie museum, this café recreates the elegant turn-of-the-century Viennese intellectual coffee house.",
        coordinates: { x: 473, y: 255 }
      }
    ],
    greenSpaces: [
      {
        name: "Carl Schurz Park",
        description: "A gorgeous, peaceful neighborhood park overlooking the turbulent East River rapids, home to Gracie Mansion.",
        coordinates: { x: 485, y: 275 }
      }
    ]
  },
  {
    id: "chelsea-hk",
    name: "Chelsea & Hell's Kitchen",
    borough: "Manhattan",
    polygonPoints: [[410, 320], [445, 320], [440, 420], [395, 420]],
    centroid: { x: 420, y: 370 },
    description: "Chelsea is the modern heartbeat of the global contemporary art world, featuring high-line parks, historic shipping packing houses, and rich LGBTQ+ culture, while Hell's Kitchen boasts eclectic food rows.",
    keyAesthetics: ["High Line greenery", "Industrial iron lofts", "Global food smell", "Art warehouse galleries"],
    keyStats: {
      vibe: "Creative, artistic, culinary & inclusive",
      character: "Formally industrial docks turned into a global capital of art",
      historicNotes: "Chelsea was NYC's early movie filming center before Hollywood claimed the spotlight."
    },
    landmarks: [
      {
        id: "the-high-line",
        name: "The High Line",
        description: "A elevated, 1.45-mile public linear park built on an abandoned, historic elevated New York Central Railroad spur line.",
        yearBuilt: "2009",
        iconType: "park",
        coordinates: { x: 405, y: 390 },
        funFact: "The plants were specifically chosen to echo the wild, self-seeded flora that grew on the tracks over decades of disuse.",
        category: "nature"
      },
      {
        id: "chelsea-market",
        name: "Chelsea Market",
        description: "A mammoth food hall and shopping complex occupying the historic, former industrial National Biscuit Company factory.",
        yearBuilt: "1890",
        iconType: "food",
        coordinates: { x: 410, y: 410 },
        funFact: "The Oreo cookie was originally invented, baked, and packaged inside this exact building in 1912.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Los Tacos No. 1",
        type: "Mexican Street Food",
        specialty: "Adobada Pork Tacos on homemade corn tortillas",
        rating: 4.8,
        priceRange: "$",
        description: "Unanimously called some of NYC's absolute best tacos, served in a bustling, standing-room-only kitchen space inside Chelsea Market.",
        coordinates: { x: 412, y: 408 }
      }
    ],
    greenSpaces: [
      {
        name: "Hudson River Park",
        description: "A scenic waterfront park running along Manhattan's west side, offering kayak docks, fields, and paths.",
        coordinates: { x: 398, y: 360 }
      }
    ]
  },
  {
    id: "midtown",
    name: "Midtown & Flatiron",
    borough: "Manhattan",
    polygonPoints: [[445, 320], [480, 320], [470, 420], [440, 420]],
    centroid: { x: 457, y: 370 },
    description: "The commercial and tourist core of New York City. Strutting majestic skyscrapers, massive office towers, Times Square lights, Broadway theater, and iconic architectural structures.",
    keyAesthetics: ["Yellow cabs", "Blinding LED screens", "Suited professionals", "Soaring glass towers"],
    keyStats: {
      vibe: "High-octane, dazzling & fast-paced",
      character: "The quintessential image of the NYC 'City That Never Sleeps'",
      historicNotes: "Formed when the city's theater and business districts shifted north from lower Manhattan during the late 19th century."
    },
    landmarks: [
      {
        id: "empire-state",
        name: "Empire State Building",
        description: "The world's most famous Art Deco skyscraper, rising 1,454 feet at 34th Street, a global symbol of ambition.",
        yearBuilt: "1931",
        iconType: "building",
        coordinates: { x: 450, y: 390 },
        funFact: "It was built in just 410 days during the Great Depression, opening ahead of schedule and under budget.",
        category: "landmark"
      },
      {
        id: "times-square",
        name: "Times Square",
        description: "The glowing commercial intersection, famously called 'The Crossroads of the World,' bathed in neon animation.",
        yearBuilt: "1904",
        iconType: "culture",
        coordinates: { x: 446, y: 345 },
        funFact: "It was named Longacre Square until the New York Times moved its grand headquarters to the newly built Times Tower.",
        category: "landmark"
      },
      {
        id: "grand-central",
        name: "Grand Central Terminal",
        description: "A historic, beautiful Beaux-Arts rail terminal featuring a celestial zodiac ceiling and massive brass clocks.",
        yearBuilt: "1913",
        iconType: "building",
        coordinates: { x: 462, y: 360 },
        funFact: "The celestial sky map on the main ceiling is painted backwards relative to the real sky (due to a historical map error).",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Keens Steakhouse",
        type: "Historic Steakhouse",
        specialty: "Legendary Mutton Chop & Prime dry-aged porterhouse",
        rating: 4.7,
        priceRange: "$$$$",
        description: "The second-oldest steakhouse in NYC, founded in 1885, featuring the world's largest collection of churchwarden clay pipes.",
        coordinates: { x: 452, y: 380 }
      }
    ],
    greenSpaces: [
      {
        name: "Bryant Park",
        description: "A scenic 'outdoor reading room' behind the NY Public Library, famous for French bistro tables, winter ice rinks, and lush lawns.",
        coordinates: { x: 455, y: 365 }
      }
    ]
  },
  {
    id: "greenwich-soho",
    name: "Greenwich Village & SoHo",
    borough: "Manhattan",
    polygonPoints: [[395, 420], [450, 420], [445, 510], [405, 510]],
    centroid: { x: 422, y: 465 },
    description: "The historical crucible of counterculture, bohemian literature, and social rights. Renowned for winding cobblestone alleys, charming cafes, and SoHo's majestic cast-iron industrial facades.",
    keyAesthetics: ["Cobblestone paths", "Ivy facades", "Sidewalk jazz clubs", "Cast-iron fire escapes"],
    keyStats: {
      vibe: "Charming, artistic & trendsetting",
      character: "The historical epicentre of the Beat Generation and Gay Rights Movement",
      historicNotes: "Greenwich Village's grid deviates from the 1811 street grid commission, preserving its old radial farmlands."
    },
    landmarks: [
      {
        id: "stonewall-inn",
        name: "The Stonewall Inn",
        description: "A historic pub and National Monument, site of the 1969 Stonewall riots which launched the modern LGBTQ+ rights movement.",
        yearBuilt: "1969",
        iconType: "culture",
        coordinates: { x: 418, y: 460 },
        funFact: "It is the first United States National Monument dedicated solely to LGBTQ+ civil rights history.",
        category: "culture"
      },
      {
        id: "washington-sq-arch",
        name: "Washington Square Arch",
        description: "A magnificent marble triumphal arch anchoring Washington Square Park, dedicated to George Washington.",
        yearBuilt: "1892",
        iconType: "monument",
        coordinates: { x: 430, y: 470 },
        funFact: "The arch was designed by Stanford White to replace a temporary wooden arch built to celebrate Washington's inauguration centennial.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Joe's Pizza",
        type: "Classic NYC Pizza Slices",
        specialty: "Plain cheese or Pepperoni Folded Slice",
        rating: 4.8,
        priceRange: "$",
        description: "Established in 1975 by Joe Pozzuoli, this tiny shop is universally recognized as the absolute gold standard for classic street pizza.",
        coordinates: { x: 423, y: 465 }
      }
    ],
    greenSpaces: [
      {
        name: "Washington Square Park",
        description: "A lively public park crowded with chess matches, street performance, artists, and collegiate energy.",
        coordinates: { x: 430, y: 472 }
      }
    ]
  },
  {
    id: "east-village-les",
    name: "East Village & Lower East Side",
    borough: "Manhattan",
    polygonPoints: [[450, 420], [475, 420], [465, 510], [445, 510]],
    centroid: { x: 457, y: 465 },
    description: "Historically the immigrant gateway to America, this cultural landscape birthed Punk Rock, Indie art, and experimental theater. Now a buzzing district of speakeasies, street murals, and historic delis.",
    keyAesthetics: ["Street art murals", "Tattoo parlors", "Dimly lit speakeasies", "Vintage shops", "Tenements"],
    keyStats: {
      vibe: "Gritty, trendy, retro & vibrant",
      character: "Jewish, German, Ukrainian, and Puerto Rican immigrant heritage",
      historicNotes: "Birthed legendary cultural movements including Punk Rock (CBGB) and the Nuyorican Poets Café."
    },
    landmarks: [
      {
        id: "tenement-museum",
        name: "Tenement Museum",
        description: "Two historic, preserved tenement buildings hosting guided tours of real apartments of families who lived there between 1863 and 1935.",
        yearBuilt: "1988",
        iconType: "culture",
        coordinates: { x: 458, y: 485 },
        funFact: "The museum was founded after a historian discovered long-locked, dust-covered apartments untouched since the Depression.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Katz's Delicatessen",
        type: "Jewish Delicatessen",
        specialty: "Legendary Pastrami on Rye with yellow mustard & pickles",
        rating: 4.7,
        priceRange: "$$$",
        description: "Founded in 1888, this world-renowned deli hand-carves legendary pastrami and brisket sandwiches in a nostalgic fluorescent-lit room.",
        coordinates: { x: 456, y: 475 }
      }
    ],
    greenSpaces: [
      {
        name: "Tompkins Square Park",
        description: "A sprawling neighborhood square hosting local community action, street markets, and NYC's oldest dog run.",
        coordinates: { x: 462, y: 455 }
      }
    ]
  },
  {
    id: "fidi",
    name: "Financial District",
    borough: "Manhattan",
    polygonPoints: [[405, 510], [465, 510], [440, 570], [415, 560]],
    centroid: { x: 435, y: 535 },
    description: "The historical landing point of Dutch New Amsterdam, now the towering financial capillary of the global economy. Defined by narrow canyons of stone and massive historical trading monuments.",
    keyAesthetics: ["Deep shadows", "Cobblestones of Dutch lanes", "Suits & Tourists", "Waterfront views"],
    keyStats: {
      vibe: "Intense, historic & waterfront-crisp",
      character: "The birthplace of modern New York and the US stock market",
      historicNotes: "Wall Street was named after a physical wooden wall erected by the Dutch in 1653 to defend the settlement."
    },
    landmarks: [
      {
        id: "one-wtc",
        name: "One World Trade Center",
        description: "The tallest skyscraper in the Western Hemisphere, soaring to a symbolic height of 1,776 feet as a beacon of resilience.",
        yearBuilt: "2014",
        iconType: "building",
        coordinates: { x: 420, y: 525 },
        funFact: "Its structural height—1,776 feet—stands specifically to commemorate the year the United States Declaration of Independence was signed.",
        category: "landmark"
      },
      {
        id: "charging-bull",
        name: "Charging Bull",
        description: "A bronze, 3.5-ton sculpture in Bowling Green symbolizing aggressive, optimistic financial prosperity.",
        yearBuilt: "1889",
        iconType: "monument",
        coordinates: { x: 432, y: 550 },
        funFact: "The artist dropped it off illegally in front of the Stock Exchange as 'guerrilla art' during the dead of night in 1989.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Delmonico's",
        type: "Fine American Dining",
        specialty: "Delmonico Ribeye Steak & Baked Alaska",
        rating: 4.5,
        priceRange: "$$$$",
        description: "Established in 1837 as the nation's very first fine-dining institution with printed menus and tablecloths.",
        coordinates: { x: 438, y: 545 }
      }
    ],
    greenSpaces: [
      {
        name: "The Battery",
        description: "A gorgeous 25-acre waterfront green overlooking NY Harbor with spectacular monument views of Lady Liberty.",
        coordinates: { x: 425, y: 565 }
      }
    ]
  },

  // --- BROOKLYN ---
  {
    id: "williamsburg",
    name: "Williamsburg & Greenpoint",
    borough: "Brooklyn",
    polygonPoints: [[485, 420], [530, 420], [540, 480], [480, 480]],
    centroid: { x: 510, y: 450 },
    description: "The creative, cultural, and indie music mecca of Brooklyn. Features converted factory lofts, rooftop bars, thriving boutiques, and magnificent views of the Manhattan skyline.",
    keyAesthetics: ["Warehouse facades", "Art murals", "Bicycle lanes", "Espresso bars", "Thrift shoppers"],
    keyStats: {
      vibe: "Cool, creative & avant-garde",
      character: "Formally industrial docks and polish immigrant rows turned indie",
      historicNotes: "Home to a long-established Hasidic Jewish community alongside Polish and modern artistic families."
    },
    landmarks: [
      {
        id: "williamsburg-bridge",
        name: "Williamsburg Bridge",
        description: "A magnificent steel suspension bridge that, when opened, was the longest suspension bridge in the world.",
        yearBuilt: "1903",
        iconType: "bridge",
        coordinates: { x: 488, y: 468 },
        funFact: "It was built with over 17,500 miles of steel wire to bundle and weave the support cables.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Peter Luger",
        type: "Classic Steakhouse",
        specialty: "USDA Prime Porterhouse Steak for Two",
        rating: 4.6,
        priceRange: "$$$$",
        description: "The dry-aged steak legend operating since 1887, sporting rustic beer-hall wood decor and strict cash-only dining.",
        coordinates: { x: 495, y: 470 }
      },
      {
        name: "L'Industrie Pizzeria",
        type: "Artisanal Pizza",
        specialty: "Burrata & Fig Jam Pizza Slice",
        rating: 4.9,
        priceRange: "$$",
        description: "A modern sensation combining classic Brooklyn crust with gourmet Italian ingredients like fresh burrata.",
        coordinates: { x: 508, y: 450 }
      }
    ],
    greenSpaces: [
      {
        name: "Marsha P. Johnson State Park",
        description: "A scenic waterfront state park offering panoramic sunset views across the East River.",
        coordinates: { x: 490, y: 435 }
      }
    ]
  },
  {
    id: "dumbo-heights",
    name: "DUMBO & Brooklyn Heights",
    borough: "Brooklyn",
    polygonPoints: [[470, 520], [510, 510], [510, 550], [470, 550]],
    centroid: { x: 490, y: 535 },
    description: "Famous for dramatic cobblestone streets, industrial red-brick facades, tech startups, and the legendary brownstone Promenade of Brooklyn Heights.",
    keyAesthetics: ["Manhattan Bridge frames", "Belgian blocks", "Brownstone rows", "Skyline water parks"],
    keyStats: {
      vibe: "Scenic, romantic & historic",
      character: "DUMBO stands for 'Down Under the Manhattan Bridge Overpass'",
      historicNotes: "Brooklyn Heights was the first neighborhood in NYC to be protected under the landmarks preservation act."
    },
    landmarks: [
      {
        id: "brooklyn-bridge",
        name: "Brooklyn Bridge",
        description: "A legendary, soaring hybrid cable-stayed/suspension bridge linking the boroughs of Manhattan and Brooklyn.",
        yearBuilt: "1883",
        iconType: "bridge",
        coordinates: { x: 476, y: 530 },
        funFact: "To prove the bridge's safety shortly after opening, legendary showman P.T. Barnum led 21 elephants across.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Juliana's",
        type: "Coal-Fired Pizza",
        specialty: "Margherita Pizza with fresh mozzarella & hot honey",
        rating: 4.7,
        priceRange: "$$",
        description: "Run by pizza legend Patsy Grimaldi, turning out crisp coal-oven pies directly under the Brooklyn Bridge path.",
        coordinates: { x: 480, y: 525 }
      }
    ],
    greenSpaces: [
      {
        name: "Brooklyn Bridge Park",
        description: "An extraordinary 85-acre riverfront park stretching under the bridges, with sports piers and playgrounds.",
        coordinates: { x: 475, y: 540 }
      }
    ]
  },
  {
    id: "downtown-brooklyn",
    name: "Downtown Brooklyn",
    borough: "Brooklyn",
    polygonPoints: [[510, 510], [560, 510], [560, 570], [510, 570]],
    centroid: { x: 535, y: 540 },
    description: "The bustling civic and commercial center of Brooklyn, featuring modern residential skyscrapers, shopping districts, transit hubs, and a buzzing academic community.",
    keyAesthetics: ["Tall glass condos", "Courtyard cafes", "Subway buskers", "Buzzing avenues"],
    keyStats: {
      vibe: "Urban, fast-paced & commercial",
      character: "The third largest commercial business district in NYC",
      historicNotes: "Underwent massive rezoning in 2004, causing a boom in residential skyscraper heights."
    },
    landmarks: [
      {
        id: "barclays-center",
        name: "Barclays Center",
        description: "A beautiful, futuristic dark steel arena, home to the Brooklyn Nets and major music tours.",
        yearBuilt: "2012",
        iconType: "stadium",
        coordinates: { x: 542, y: 565 },
        funFact: "Its weathered-rust steel facade was designed to mimic the earthy color of Brooklyn's historic brownstones.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Junior's Restaurant",
        type: "Classic Diner",
        specialty: "Our Famous No. 1 New York Plain Cheesecake",
        rating: 4.5,
        priceRange: "$$",
        description: "Since 1950, this hyper-nostalgic diner has baked the undisputed, cream-cheese heavy champion of NYC cheesecakes.",
        coordinates: { x: 528, y: 535 }
      }
    ],
    greenSpaces: [
      {
        name: "Fort Greene Park",
        description: "Brooklyn's first official park, designed by Olmsted, containing the massive Prison Ship Martyrs Monument.",
        coordinates: { x: 550, y: 530 }
      }
    ]
  },
  {
    id: "park-slope",
    name: "Park Slope & Prospect Heights",
    borough: "Brooklyn",
    polygonPoints: [[510, 570], [560, 570], [550, 640], [500, 640]],
    centroid: { x: 525, y: 605 },
    description: "A neighborhood characterized by beautifully preserved brownstones, tree-lined quiet avenues, indie bookstores, and rich access to Prospect Park.",
    keyAesthetics: ["Lush leafy canopies", "Stroller-filled walks", "Historic brownstones", "Organic food co-ops"],
    keyStats: {
      vibe: "Stately, warm & family-friendly",
      character: "A national historic district boasting prime civil war era design",
      historicNotes: "Consistently ranked as one of the most desirable, high-living-quality neighborhoods in America."
    },
    landmarks: [
      {
        id: "brooklyn-museum",
        name: "Brooklyn Museum",
        description: "NYC's second largest art museum, holding over 1.5 million works from ancient Egyptian to contemporary feminist art.",
        yearBuilt: "1895",
        iconType: "culture",
        coordinates: { x: 545, y: 620 },
        funFact: "The grand Beaux-Arts building was designed by McKim, Mead & White, who also designed the original Penn Station.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Chuko",
        type: "Modern Ramen Shop",
        specialty: "Garlic Garlic Ramen with roasted pork & soft egg",
        rating: 4.6,
        priceRange: "$$",
        description: "Inventive, flavorful bowls of ramen served alongside delicious spiced wings in a minimalist wood room.",
        coordinates: { x: 540, y: 595 }
      }
    ],
    greenSpaces: [
      {
        name: "Prospect Park",
        description: "A magnificent 526-acre park with a massive meadow, zoo, and the only natural forest left in Brooklyn.",
        coordinates: { x: 535, y: 630 }
      }
    ]
  },
  {
    id: "coney-island",
    name: "Coney Island",
    borough: "Brooklyn",
    polygonPoints: [[500, 740], [620, 740], [600, 800], [490, 790]],
    centroid: { x: 545, y: 765 },
    description: "NYC's legendary seaside escape. Famed for its historic wooden boardwalk, classic vintage steel roller coasters, wide ocean beaches, and iconic hot dogs.",
    keyAesthetics: ["Carnival neon", "Salty sea breeze", "Screaming ride-goers", "Retro boardwalk wood"],
    keyStats: {
      vibe: "Hyper-nostalgic, festive & whimsical",
      character: "The historic birthplace of the American amusement park",
      historicNotes: "Coney Island was once a physical island until the marshy creek was filled, connecting it to Brooklyn."
    },
    landmarks: [
      {
        id: "cyclone",
        name: "Coney Island Cyclone",
        description: "An extremely historic, vintage wooden roller coaster that has operated continuously since the roaring twenties.",
        yearBuilt: "1927",
        iconType: "stadium",
        coordinates: { x: 550, y: 775 },
        funFact: "Aviator Charles Lindbergh once said riding the Cyclone was 'more exciting than flying solo across the Atlantic.'",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "Nathan's Famous",
        type: "Classic Hot Dogs",
        specialty: "Original beef hot dog & crinkle-cut fries",
        rating: 4.4,
        priceRange: "$",
        description: "The legendary corner hot-dog stand that started a global empire and hosts the world-famous Hot Dog Eating Contest every 4th of July.",
        coordinates: { x: 540, y: 770 }
      }
    ],
    greenSpaces: [
      {
        name: "Coney Island Beach & Boardwalk",
        description: "Three miles of sandy Atlantic coastline with an iconic, beautiful wooden boardwalk.",
        coordinates: { x: 560, y: 785 }
      }
    ]
  },

  // --- QUEENS ---
  {
    id: "astoria-lic",
    name: "Astoria & Long Island City",
    borough: "Queens",
    polygonPoints: [[495, 320], [560, 320], [540, 410], [485, 410]],
    centroid: { x: 518, y: 365 },
    description: "Astoria is a gorgeous neighborhood famous for Greek heritage, beer gardens, and movie studios, while Long Island City (LIC) features tall waterfront skyscrapers and modern art centers.",
    keyAesthetics: ["Rooftop cityscapes", "Industrial brick vaults", "Greek bakery aromas", "Modern sculpture lawns"],
    keyStats: {
      vibe: "Trendy, multicultural & creative",
      character: "The center of Greek life in NYC alongside rapid modern high-rise development",
      historicNotes: "Home to Kaufman Astoria Studios, built in 1920, where many classic silent movies were shot."
    },
    landmarks: [
      {
        id: "moma-ps1",
        name: "MoMA PS1",
        description: "One of the oldest and largest non-profit contemporary art institutions in the US, housed in a former public school.",
        yearBuilt: "1971",
        iconType: "culture",
        coordinates: { x: 505, y: 395 },
        funFact: "The museum preserves its old classroom architecture, displaying cutting-edge art inside historic locker and boiler rooms.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Taverna Kyclades",
        type: "Traditional Greek Seafood",
        specialty: "Grilled Octopus & Lemon Potatoes",
        rating: 4.7,
        priceRange: "$$$",
        description: "The gold standard for Greek dining in Astoria, serving ultra-fresh simply grilled seafood drizzled with high-grade olive oil.",
        coordinates: { x: 520, y: 340 }
      }
    ],
    greenSpaces: [
      {
        name: "Gantry Plaza State Park",
        description: "A gorgeous 12-acre riverfront oasis in LIC, featuring massive 1920s overhead gantries and sweeping Midtown views.",
        coordinates: { x: 495, y: 385 }
      },
      {
        name: "Astoria Park",
        description: "Nestled between the Triborough and Hell Gate Bridges, featuring the oldest and largest public pool in NYC.",
        coordinates: { x: 510, y: 330 }
      }
    ]
  },
  {
    id: "flushing-corona",
    name: "Flushing & Corona",
    borough: "Queens",
    polygonPoints: [[700, 320], [780, 320], [760, 420], [680, 400]],
    centroid: { x: 730, y: 370 },
    description: "A vibrant, massive culinary world and cultural center, Flushing features one of the largest and most authentic Chinatowns in the world, while Corona is steeped in jazz and Latin heritage.",
    keyAesthetics: ["Bilingual neon logos", "Bubble tea cafes", "Tennis court grunts", "Dumpling cart queues"],
    keyStats: {
      vibe: "Diverse, bustling & culturally rich",
      character: "A global epicentre of immigrants with over 150 languages spoken",
      historicNotes: "Hosted both of New York's historic World's Fairs (1939 and 1964) at Flushing Meadows-Corona Park."
    },
    landmarks: [
      {
        id: "unisphere",
        name: "The Unisphere",
        description: "A monumental 12-story-tall spherical steel sculpture of the Earth, built as the theme icon for the 1964 World's Fair.",
        yearBuilt: "1964",
        iconType: "monument",
        coordinates: { x: 715, y: 380 },
        funFact: "It was built by the US Steel Corporation and stands precisely over the spot where the 1939 World's Fair structure stood.",
        category: "landmark"
      },
      {
        id: "louis-armstrong-house",
        name: "Louis Armstrong House",
        description: "The preserved, modest brick home of jazz titan Louis Armstrong and his wife Lucille, now a historic museum.",
        yearBuilt: "1943",
        iconType: "culture",
        coordinates: { x: 695, y: 360 },
        funFact: "Armstrong recorded hundreds of casual conversational cassettes and trumpet practices inside this exact Queens den.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Golden Shopping Mall",
        type: "Sichuan / Xi'an Street Food",
        specialty: "Hand-Pulled Lamb Cumin Noodles (Xi'an Famous Foods)",
        rating: 4.6,
        priceRange: "$",
        description: "A legendary basement food court where the globally-renowned 'Xi'an Famous Foods' chain originally started.",
        coordinates: { x: 745, y: 350 }
      }
    ],
    greenSpaces: [
      {
        name: "Flushing Meadows Park",
        description: "A sprawling metropolitan park twice the size of Central Park, housing the Unisphere and Queens Museum.",
        coordinates: { x: 710, y: 395 }
      }
    ]
  },

  // --- THE BRONX ---
  {
    id: "south-bronx",
    name: "South Bronx & Mott Haven",
    borough: "The Bronx",
    polygonPoints: [[460, 100], [540, 100], [530, 160], [465, 160]],
    centroid: { x: 495, y: 130 },
    description: "The historical homeland and cradle of Hip-Hop culture. Today, it combines grit, industrial lofts, legendary murals, and Yankee-centered athletic devotion.",
    keyAesthetics: ["Street tag murals", "Hip-hop soundblocks", "Subway steel rails", "Yankee caps"],
    keyStats: {
      vibe: "Resilient, passionate & raw",
      character: "The legendary birthplace of Hip-Hop music on August 11, 1973",
      historicNotes: "Began rapid industrial development in the late 19th Century with the iron-works boom."
    },
    landmarks: [
      {
        id: "yankee-stadium",
        name: "Yankee Stadium",
        description: "The grand, multi-million dollar stadium home of the 27-time World Series champion New York Yankees.",
        yearBuilt: "2009",
        iconType: "stadium",
        coordinates: { x: 488, y: 145 },
        funFact: "The stadium's structural limestone facade echoes the historic 'House that Ruth Built' constructed in 1923.",
        category: "landmark"
      }
    ],
    diningSpots: [
      {
        name: "1520 Sedgwick Ave Cafe",
        type: "American Classic",
        specialty: "DJ Kool Herc Burger & Hip Hop Fries",
        rating: 4.4,
        priceRange: "$$",
        description: "A cozy neighborhood café nearby the official historical birthplace of hip-hop music, decorated with historic flyers.",
        coordinates: { x: 475, y: 125 }
      }
    ],
    greenSpaces: [
      {
        name: "St. Mary's Park",
        description: "The largest park in the South Bronx, offering sports courts and lush leafy hills.",
        coordinates: { x: 512, y: 145 }
      }
    ]
  },
  {
    id: "bronx-park-fordham",
    name: "Fordham & Bronx Park",
    borough: "The Bronx",
    polygonPoints: [[470, 10], [550, 10], [550, 100], [470, 100]],
    centroid: { x: 510, y: 55 },
    description: "Home to magnificent collegiate Gothic architecture (Fordham University), beautiful botanical greenhouses, the legendary Bronx Zoo, and real 'Little Italy' on Arthur Avenue.",
    keyAesthetics: ["Gothic stone arches", "Botanical glasshouses", "Italian cheese loops", "Zoo trumpets"],
    keyStats: {
      vibe: "Academic, natural, historic & delicious",
      character: "Features the real 'Arthur Avenue'—widely called the absolute truest Little Italy in NYC",
      historicNotes: "Edgar Allan Poe spent his final years (1846-1849) writing inside a tiny cottage in Fordham."
    },
    landmarks: [
      {
        id: "bronx-zoo",
        name: "The Bronx Zoo",
        description: "The largest metropolitan zoo in the United States, spanning 265 acres of naturalistic animal habitats.",
        yearBuilt: "1899",
        iconType: "park",
        coordinates: { x: 535, y: 70 },
        funFact: "It is internationally famous for pioneering cageless natural enclosures for big cats and gorilla reserves.",
        category: "landmark"
      },
      {
        id: "nybg",
        name: "New York Botanical Garden",
        description: "A National Historic Landmark containing over 1 million living botanical specimens inside Victorian glass greenhouses.",
        yearBuilt: "1891",
        iconType: "park",
        coordinates: { x: 520, y: 40 },
        funFact: "It preserves 50 acres of the original, untouched old-growth oak forest that once covered Manhattan and the Bronx.",
        category: "nature"
      }
    ],
    diningSpots: [
      {
        name: "Zero Otto Nove",
        type: "Neapolitan Italian",
        specialty: "Butternut Squash Pizza",
        rating: 4.7,
        priceRange: "$$$",
        description: "Located on legendary Arthur Ave, this restaurant serves incredible Neapolitan wood-fired wood pizzas in a rustic courtyard.",
        coordinates: { x: 502, y: 65 }
      }
    ],
    greenSpaces: [
      {
        name: "Bronx Park",
        description: "A scenic park enclosing the Bronx River, featuring botanical paths and winding trails.",
        coordinates: { x: 528, y: 55 }
      }
    ]
  },

  // --- STATEN ISLAND ---
  {
    id: "st-george-north",
    name: "Staten Island North Shore",
    borough: "Staten Island",
    polygonPoints: [[140, 620], [210, 620], [200, 700], [130, 700]],
    centroid: { x: 170, y: 660 },
    description: "The scenic entry point to Staten Island, featuring Victorian houses, seaside hills, rich botanical cultural centers, and the famous Staten Island Ferry terminal.",
    keyAesthetics: ["Sailing white boats", "Victorian porches", "Seagull cries", "Waterfront walkways"],
    keyStats: {
      vibe: "Victorian, maritime & slower-paced",
      character: "The historic landing port for travelers crossing the NY Harbor",
      historicNotes: "Home to Snug Harbor—once a grand 19th Century retirement house for real sailors."
    },
    landmarks: [
      {
        id: "si-ferry",
        name: "Staten Island Ferry Terminal",
        description: "The bustling terminal supplying the legendary, free, 25-minute orange passenger boat ride across New York Harbor.",
        yearBuilt: "1905",
        iconType: "airport", // boat icon placeholder
        coordinates: { x: 195, y: 645 },
        funFact: "The ferry runs 24 hours a day, 365 days a year, serving over 22 million riders annually.",
        category: "landmark"
      },
      {
        id: "snug-harbor",
        name: "Snug Harbor Cultural Center",
        description: "A monumental 83-acre botanical park showcasing grand Greek Revival buildings and a tranquil Chinese Scholar's Garden.",
        yearBuilt: "1833",
        iconType: "culture",
        coordinates: { x: 160, y: 635 },
        funFact: "Snug Harbor was established as the nation's absolute first home for elderly 'aged, decrepit, and worn-out' sailors.",
        category: "culture"
      }
    ],
    diningSpots: [
      {
        name: "Sri Lanka Garden",
        type: "Sri Lankan Cuisine",
        specialty: "Black Pork Curry & Hopper Crêpes",
        rating: 4.6,
        priceRange: "$$",
        description: "A tiny culinary gem celebrating Staten Island's unique, vibrant Sri Lankan community—one of the largest outside Asia.",
        coordinates: { x: 178, y: 670 }
      }
    ],
    greenSpaces: [
      {
        name: "Snug Harbor Botanical Gardens",
        description: "A magical oasis with rose gardens, sensory paths, and a walled authentic Suzhou-style Chinese garden.",
        coordinates: { x: 155, y: 650 }
      }
    ]
  }
];

// Combine all landmarks dynamically for global search and rendering
export const ALL_LANDMARKS: Landmark[] = NYC_NEIGHBORHOODS.flatMap(n => n.landmarks);
export const ALL_DINING: DiningSpot[] = NYC_NEIGHBORHOODS.flatMap(n => n.diningSpots);
export const ALL_PARKS = NYC_NEIGHBORHOODS.flatMap(n => n.greenSpaces.map(g => ({
  name: g.name,
  description: g.description,
  coordinates: g.coordinates,
  borough: n.borough,
  neighborhoodId: n.id
})));
