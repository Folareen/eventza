export const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IE', name: 'Ireland' },
    { code: 'SG', name: 'Singapore' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'SE', name: 'Sweden' },
    { code: 'FI', name: 'Finland' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'DK', name: 'Denmark' },
    { code: 'NO', name: 'Norway' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'NG', name: 'Nigeria' }
];

export const STATES: Record<string, string[]> = {
    US: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    GB: [
        'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    CA: [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
    ],
    AU: [
        'New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia', 'Australian Capital Territory', 'Northern Territory'
    ],
    DE: [
        'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
    ],
    FR: [
        'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d’Azur'
    ],
    IE: [
        'Leinster', 'Munster', 'Connacht', 'Ulster'
    ],
    SG: [
        'Central Singapore', 'North East', 'North West', 'South East', 'South West'
    ],
    NL: [
        'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg', 'North Brabant', 'North Holland', 'Overijssel', 'South Holland', 'Utrecht', 'Zeeland'
    ],
    ES: [
        'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands', 'Cantabria', 'Castile and León', 'Castilla-La Mancha', 'Catalonia', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia', 'Navarre', 'Valencian Community'
    ],
    IT: [
        'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont', 'Sardinia', 'Sicily', 'Trentino-South Tyrol', 'Tuscany', 'Umbria', 'Veneto'
    ],
    SE: [
        'Blekinge', 'Dalarna', 'Gotland', 'Gävleborg', 'Halland', 'Jämtland', 'Jönköping', 'Kalmar', 'Kronoberg', 'Norrbotten', 'Örebro', 'Östergötland', 'Skåne', 'Södermanland', 'Stockholm', 'Uppsala', 'Värmland', 'Västerbotten', 'Västernorrland', 'Västmanland', 'Västra Götaland'
    ],
    FI: [
        'Åland', 'Central Finland', 'Central Ostrobothnia', 'Eastern Finland', 'Finland Proper', 'Kainuu', 'Kymenlaakso', 'Lapland', 'North Karelia', 'Northern Ostrobothnia', 'Northern Savonia', 'Ostrobothnia', 'Päijänne Tavastia', 'Pirkanmaa', 'Satakunta', 'South Karelia', 'Southern Ostrobothnia', 'Southern Savonia', 'Uusimaa', 'Varsinais-Suomi'
    ],
    NZ: [
        'Auckland', 'Bay of Plenty', 'Canterbury', 'Gisborne', 'Hawke’s Bay', 'Manawatu-Wanganui', 'Marlborough', 'Nelson', 'Northland', 'Otago', 'Southland', 'Taranaki', 'Tasman', 'Waikato', 'Wellington', 'West Coast'
    ],
    BE: [
        'Antwerp', 'East Flanders', 'Flemish Brabant', 'Hainaut', 'Liège', 'Limburg', 'Luxembourg', 'Namur', 'Walloon Brabant', 'West Flanders'
    ],
    AT: [
        'Burgenland', 'Carinthia', 'Lower Austria', 'Upper Austria', 'Salzburg', 'Styria', 'Tyrol', 'Vorarlberg', 'Vienna'
    ],
    DK: [
        'Capital Region', 'Central Denmark', 'North Denmark', 'Region Zealand', 'Southern Denmark'
    ],
    NO: [
        'Akershus', 'Aust-Agder', 'Buskerud', 'Finnmark', 'Hedmark', 'Hordaland', 'Møre og Romsdal', 'Nordland', 'Oppland', 'Oslo', 'Rogaland', 'Sogn og Fjordane', 'Telemark', 'Troms', 'Trøndelag', 'Vest-Agder', 'Vestfold', 'Østfold'
    ],
    CH: [
        'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 'Lucerne', 'Neuchâtel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 'Solothurn', 'St. Gallen', 'Thurgau', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'
    ],
    PT: [
        'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisbon', 'Portalegre', 'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Madeira', 'Azores'
    ],
    NG: [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT (Abuja)'
    ]
};
