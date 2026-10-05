/**
 * Single source of truth for every piece of copy on the site.
 * Nothing here is invented — it is transcribed from Rahma Jlassi's CV.
 * Any value that is decorative (charts, abstract readouts) lives in
 * `decorative` below and is explicitly labelled as illustrative in the UI.
 */

export const identity = {
  firstName: 'Rahma',
  lastName: 'Jlassi',
  fullName: 'Rahma Jlassi',
  monogram: 'RJ',
  title: 'Business Analyst',
  discipline: 'Data & Performance Insights',
  tagline: 'Turning raw data into decisions.',
  location: 'Sousse, Tunisia',
  relocation: 'Open to relocation',
  phone: '+216 24 719 976',
  phoneHref: 'tel:+21624719976',
  email: 'rahmawjlassi@gmail.com',
  emailHref: 'mailto:rahmawjlassi@gmail.com',
  linkedin: 'linkedin.com/in/rahma-jlassi',
  linkedinHref: 'https://www.linkedin.com/in/rahma-jlassi/',
  cv: {
    label: 'Download CV',
    href: '/cv/Rahma-Jlassi-CV.pdf',
    fileName: 'Rahma-Jlassi-CV.pdf',
  },
}

export const seo = {
  title: 'Rahma Jlassi — Business Analyst | Data & Performance Insights',
  description:
    'Rahma Jlassi, Business Analyst in Sousse, Tunisia. 3+ years turning raw data into decisions that move revenue with Power BI, DAX data modelling, Python data cleaning and executive-ready reporting. Ozeol’s Best Business Analyst of the Year 2025.',
}

export const availability = {
  status: 'Open to relocation',
  detail: 'Available for new opportunities',
}

export const hero = {
  eyebrow: 'Business Analyst',
  role: ['Data', 'Analysis', 'Performance'],
  lede: 'I turn raw data into decisions that move revenue — building the models, dashboards and executive reporting that make performance visible.',
  primary: 'See the journey',
  secondary: 'Download CV',
  meta: [
    ['Based in', 'Sousse, Tunisia'],
    ['Focus', 'Data & Performance'],
    ['Experience', '3+ years'],
  ],
}

/* ------------------------------------------------------------------ award -- */

export const award = {
  year: '2025',
  kicker: 'Ozeol · Internal recognition',
  title: ['Best Business', 'Analyst of the Year'],
  note: 'Awarded during her tenure as Junior Business Analyst at Ozeol — a promotion from junior to top performer in under two years.',
}

/* ---------------------------------------------------------------- profile -- */

export const profile = {
  eyebrow: 'Profile',
  title: 'From raw data to meaningful decisions.',
  lede: 'Business Analyst with 3+ years of experience turning raw data into decisions that move revenue.',
  body: 'My background spans hospitality revenue management and business analysis. I design and maintain Power BI data models with DAX, clean and validate large datasets with Python, and deliver reporting that executives actually act on. I am a fast learner who thrives on building dashboards and insights that get attention.',
  terms: [
    ['Data', 'Raw inputs from bookings, channels, operations and reporting requests.'],
    ['Insights', 'Patterns pulled out of those inputs and framed as a business question.'],
    ['Performance', 'KPIs tracked over time, with a single source of truth behind them.'],
    ['Decisions', 'Pricing, inventory and reporting choices made on the evidence.'],
  ],
  method: 'How a question becomes a report',
  methodSteps: [
    ['Listen', 'The business question arrives before the data does.'],
    ['Model', 'The question is translated into a structured data model.'],
    ['Measure', 'DAX measures define the metric once, so everyone sees the same number.'],
    ['Validate', 'Python cleans and validates the inputs so the output can be trusted.'],
    ['Report', 'A dashboard or executive-ready report that answers the question.'],
  ],
  readouts: [
    ['3+', 'years in analysis'],
    ['2', 'roles in revenue & data'],
    ['1', 'source of truth'],
  ],
  signatureTools: ['Power BI', 'DAX', 'Python', 'Data Modelling', 'Executive Reporting'],
}

/* ----------------------------------------------- signature pipeline stages -- */
/* The conceptual chain that defines her method. Conceptual, not a claim. */

export const pipeline = [
  {
    key: 'collect',
    label: 'COLLECT',
    title: 'It starts with the question.',
    body: 'Every engagement opens on a business question, not a dataset. Bookings, channel data, operational exports — the raw material is whatever the decision needs.',
    tags: ['Business question', 'Raw inputs', 'Reporting requests'],
  },
  {
    key: 'clean',
    label: 'CLEAN',
    title: 'Signals become structure.',
    body: 'Large datasets get cleaned, structured and validated with Python, so downstream numbers can be trusted before anyone builds a chart on them.',
    tags: ['Python', 'Data cleaning', 'Validation'],
  },
  {
    key: 'model',
    label: 'MODEL',
    title: 'Structure becomes a model.',
    body: 'Advanced Power BI data models built with DAX. Relationships, measures and dimensions designed so key metrics hold together as one source of truth.',
    tags: ['Power BI', 'Data modelling', 'DAX'],
  },
  {
    key: 'analyze',
    label: 'ANALYSE',
    title: 'The model starts talking.',
    body: 'Measures are compared, trends are read, and outliers surface. Revenue performance, rate parity, demand and channel behaviour are read the same way every time.',
    tags: ['Performance analysis', 'Forecasting', 'Benchmarking'],
  },
  {
    key: 'visualize',
    label: 'VISUALISE',
    title: 'Insights become visible.',
    body: 'Dashboards and executive-ready reporting. Designed to be read in seconds by the people who have to act on them, not just by the people who built them.',
    tags: ['Data visualisation', 'Power BI reports', 'Executive reporting'],
  },
  {
    key: 'decide',
    label: 'DECIDE',
    title: 'Then someone decides.',
    body: 'Pricing, inventory and channel choices follow the evidence. Lower manual reporting time, better data reliability, faster turnaround — the point of the whole chain.',
    tags: ['Decision making', 'Revenue impact', 'Single source of truth'],
  },
]

/* -------------------------------------------------------------- experience -- */

export const experience = [
  {
    id: 'ozoel-ba',
    when: '2026 — Present',
    year: '2026',
    role: 'Confirmed Business Analyst',
    org: 'Ozeol',
    type: 'Business Analysis',
    summary:
      'Owns the end-to-end reporting and analysis workflows, from the first business question to the executive report that answers it.',
    points: [
      'Own end-to-end reporting and analysis workflows.',
      'Translate business questions into structured, decision-ready insights.',
      'Design and maintain advanced Power BI data models using DAX.',
      'Build a single source of truth for key business metrics.',
      'Use Python to clean, structure and validate large datasets.',
      'Improve data reliability and reduce manual reporting time.',
    ],
  },
  {
    id: 'ozoel-junior',
    when: '2023 — 2026',
    year: '2023',
    role: 'Junior Business Analyst',
    org: 'Ozeol',
    type: 'Business Analysis',
    summary:
      'Moved from junior to top performer: awarded Best Business Analyst of the Year 2025 while building and maintaining the reporting layer.',
    points: [
      'Built and maintained Power BI reports and dashboards.',
      'Applied data modelling and DAX to shape reliable metrics.',
      'Surfaced actionable business insights from operational data.',
      'Cleaned and prepared data using Python.',
      'Improved accuracy and turnaround time across reporting.',
    ],
    milestone: { year: '2025', label: 'Best Business Analyst of the Year' },
  },
  {
    id: 'riadh-revenue',
    when: '2022 — 2023',
    year: '2022',
    role: 'Revenue Manager',
    org: 'Riadh Palms Resort and Spa',
    type: 'Hospitality Revenue',
    summary:
      'Where the commercial instinct came from: pricing, inventory and channel decisions driven by booking data rather than gut feel.',
    points: [
      'Analyzed sales and booking data.',
      'Optimized pricing strategies.',
      'Worked on revenue maximization across segments.',
      'Managed OTA and Channel Manager platforms.',
      'Ensured rate parity and availability accuracy.',
      'Created Power BI performance reports.',
      'Conducted competitive benchmarking and demand forecasting.',
      'Supported pricing and inventory decisions.',
    ],
  },
  {
    id: 'riadh-intern',
    when: '2022',
    year: '2022',
    role: 'E-Commerce Management Intern',
    org: 'Riadh Palms Resort and Spa',
    type: 'Hospitality Revenue',
    summary:
      'Supported hotel e-commerce management activities. The internship led directly to a full-time Revenue Manager role.',
    points: [
      'Supported hotel e-commerce management activities.',
      'Experience directly led to a full-time Revenue Manager opportunity.',
    ],
  },
]

export const careerMarkers = [
  { year: '2022', label: 'E-Commerce Management Intern', note: 'Riadh Palms Resort and Spa' },
  { year: '2022 — 2023', label: 'Revenue Manager', note: 'Riadh Palms Resort and Spa' },
  { year: '2023 — 2026', label: 'Junior Business Analyst', note: 'Ozeol' },
  { year: '2025', label: 'Best Business Analyst of the Year', note: 'Ozeol', highlight: true },
  { year: '2026 — Present', label: 'Confirmed Business Analyst', note: 'Ozeol' },
]

/* ------------------------------------------------------------------ skills -- */

export const skillChains = [
  {
    id: 'bi',
    kicker: 'Reporting stack',
    nodes: ['Power BI', 'Data Modelling', 'DAX', 'Reporting', 'Business Insight'],
  },
  {
    id: 'python',
    kicker: 'Data trust',
    nodes: ['Python', 'Data Cleaning', 'Data Validation', 'Reliable Data'],
  },
  {
    id: 'revenue',
    kicker: 'Commercial lens',
    nodes: ['Revenue Management', 'Competitive Benchmarking', 'Demand Forecasting', 'Pricing'],
  },
]

export const skillIndex = [
  { group: 'Analytics & reporting', items: ['Power BI', 'Data Visualization & Reporting', 'Executive Reporting'] },
  { group: 'Data engineering', items: ['Data Modeling & DAX', 'Python', 'Data Cleaning', 'Advanced Excel'] },
  { group: 'Business analysis', items: ['Business Analysis', 'Demand Forecasting', 'Competitive Benchmarking'] },
  { group: 'Commercial', items: ['Revenue Management', 'OTA / Channel Manager'] },
]

export const toolset = [
  'Power BI',
  'DAX',
  'Python',
  'Data Modeling',
  'Advanced Excel',
  'Data Visualization',
  'Revenue Management',
  'Demand Forecasting',
  'Competitive Benchmarking',
  'Channel Manager',
  'OTA Platforms',
]

/* --------------------------------------------------------------- education -- */

export const education = [
  {
    years: '2020 — 2022',
    degree: "Master's Degree",
    field: 'Hotel and Tourism Management',
    school: 'ISG Sousse',
  },
  {
    years: '2017 — 2019',
    degree: "Master's Degree",
    field: 'Entrepreneurship and International Development',
    school: 'IHEC Sousse',
  },
  {
    years: '2014 — 2017',
    degree: "Bachelor's Degree",
    field: 'Business Administration',
    school: 'IHEC Sousse',
  },
]

export const languages = [
  { label: 'Arabic', level: 'Native', filled: 5, of: 5 },
  { label: 'French', level: 'Fluent', filled: 4, of: 5 },
  { label: 'English', level: 'Fluent', filled: 4, of: 5 },
]

/* ----------------------------------------------------------------- contact -- */

export const contact = {
  eyebrow: 'Contact',
  title: ['Have a business', 'question?'],
  titleAccent: "Let's find the insight.",
  note: 'Open to relocation, and open to a role where the reporting has to hold up in front of a decision-maker.',
  channels: [
    { label: 'Email', value: identity.email, href: identity.emailHref, copy: true },
    { label: 'Phone', value: identity.phone, href: identity.phoneHref },
    { label: 'LinkedIn', value: identity.linkedin, href: identity.linkedinHref, external: true },
    { label: 'Location', value: `${identity.location} · ${identity.relocation}` },
  ],
}

export const nav = [
  { id: 'top', label: 'Home' },
  { id: 'profile', label: 'About' },
  { id: 'journey', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

/* ------------------------------------------------------------- decorative -- */
/**
 * Purely illustrative geometry. These are NOT metrics, KPIs or achievements.
 * They exist to give the data-graphics section something to draw.
 */
export const decorative = {
  note: 'Illustrative visualisation — not a performance figure.',
  sparkline: [38, 44, 41, 52, 49, 58, 55, 63, 61, 72, 69, 78, 74, 83, 88, 84, 92, 96],
  bars: [34, 52, 41, 66, 58, 74, 63, 81, 70, 88, 76, 94],
  axis: ['Q1', 'Q2', 'Q3', 'Q4'],
  fieldPoints: 26,
  scannerSweep: true,
}
