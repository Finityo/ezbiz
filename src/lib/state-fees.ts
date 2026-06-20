// State filing fees for LLC and Corporation formations
// Updated for 2026 — verified against Secretary of State websites
// These are government fees charged by each state

export const STATE_FILING_FEES: Record<string, number> = {
  "Alabama": 165,
  "Alaska": 250,
  "Arizona": 50,
  "Arkansas": 50,
  "California": 75,
  "Colorado": 50,
  "Connecticut": 175,
  "Delaware": 140,
  "District Of Columbia": 220,
  "Florida": 155,
  "Georgia": 100,
  "Hawaii": 50,
  "Idaho": 100,
  "Illinois": 500,
  "Indiana": 90,
  "Iowa": 50,
  "Kansas": 160,
  "Kentucky": 55,
  "Louisiana": 100,
  "Maine": 175,
  "Maryland": 155,
  "Massachusetts": 520,
  "Michigan": 50,
  "Minnesota": 160,
  "Mississippi": 50,
  "Missouri": 50,
  "Montana": 70,
  "Nebraska": 120,
  "Nevada": 425,
  "New Hampshire": 100,
  "New Jersey": 125,
  "New Mexico": 50,
  "New York": 210,
  "North Carolina": 125,
  "North Dakota": 135,
  "Ohio": 125,
  "Oklahoma": 104,
  "Oregon": 100,
  "Pennsylvania": 125,
  "Rhode Island": 150,
  "South Carolina": 110,
  "South Dakota": 150,
  "Tennessee": 325,
  "Texas": 300,
  "Utah": 72,
  "Vermont": 125,
  "Virginia": 104,
  "Washington": 200,
  "West Virginia": 132,
  "Wisconsin": 130,
  "Wyoming": 103,
};

// Corporation filing fees by state (2026)
export const STATE_CORP_FILING_FEES: Record<string, number> = {
  "Alabama": 200,
  "Alaska": 250,
  "Arizona": 60,
  "Arkansas": 50,
  "California": 100,
  "Colorado": 50,
  "Connecticut": 250,
  "Delaware": 89,
  "District Of Columbia": 220,
  "Florida": 70,
  "Georgia": 100,
  "Hawaii": 50,
  "Idaho": 100,
  "Illinois": 175,
  "Indiana": 90,
  "Iowa": 50,
  "Kansas": 90,
  "Kentucky": 40,
  "Louisiana": 75,
  "Maine": 145,
  "Maryland": 120,
  "Massachusetts": 275,
  "Michigan": 60,
  "Minnesota": 160,
  "Mississippi": 50,
  "Missouri": 58,
  "Montana": 70,
  "Nebraska": 60,
  "Nevada": 75,
  "New Hampshire": 100,
  "New Jersey": 125,
  "New Mexico": 100,
  "New York": 125,
  "North Carolina": 125,
  "North Dakota": 100,
  "Ohio": 125,
  "Oklahoma": 50,
  "Oregon": 100,
  "Pennsylvania": 125,
  "Rhode Island": 230,
  "South Carolina": 135,
  "South Dakota": 150,
  "Tennessee": 100,
  "Texas": 300,
  "Utah": 70,
  "Vermont": 125,
  "Virginia": 75,
  "Washington": 200,
  "West Virginia": 100,
  "Wisconsin": 100,
  "Wyoming": 100,
};

// 2-letter USPS abbreviation → full state name used as map key.
const STATE_ABBR_TO_NAME: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District Of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
  PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

/** Accept either "Texas" or "TX" and return the canonical map key. */
const normalizeStateKey = (state: string): string => {
  if (!state) return "";
  const trimmed = state.trim();
  if (trimmed.length === 2) {
    return STATE_ABBR_TO_NAME[trimmed.toUpperCase()] || trimmed;
  }
  // Title-case match against the maps' keys.
  return trimmed.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getStateFee = (state: string): number => {
  return STATE_FILING_FEES[normalizeStateKey(state)] || 100;
};

export const getCorpStateFee = (state: string): number => {
  return STATE_CORP_FILING_FEES[normalizeStateKey(state)] || 100;
};
