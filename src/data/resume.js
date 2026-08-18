/**
 * Single source of truth for every piece of content on the site.
 * Everything here is transcribed from BaseerKhan-Resume.pdf.
 */

export const profile = {
  name: "Muhammad Baseer Khan",
  shortName: "Baseer Khan",
  initials: "MBK",
  title: "Sr. Software Engineer",
  roles: [
    "Sr. Software Engineer",
    "Full-Stack Developer",
    "Agentic AI Developer",
    "Data Science Practitioner",
  ],
  tagline: "Full-Stack Development · Agentic AI · Applied Data Science",
  experienceYears: "9+",
  location: "Islamabad, Pakistan",
  address: "Flat C-21, NPCC Colony, Jhelum Road, G-8/4, Islamabad",
  phone: "+92 345 9275557",
  phoneHref: "tel:+923459275557",
  email: "baxeerkhan@gmail.com",
  linkedin: "https://www.linkedin.com/in/baseerx/",
  github: "https://github.com/baseerx",
  resumeFile: "./Muhammad-Baseer-Khan-Resume.pdf",
  photo: "./profile.png",
  avatar: "./avatar.png",
  available: true,
  summary:
    "Senior Full Stack Developer with 9+ years of experience and a strong specialization in Artificial Intelligence and applied Data Science, backed by a Master's in Data Science and a Bachelor's in Computer Science. My recent work centers on Agentic AI, Retrieval-Augmented Generation (RAG), and machine learning–driven automation, complemented by solid foundations in data analysis and scalable software engineering alongside foundation models in forecasting. I am keen to build on this experience through doctoral research and contribute meaningfully to advanced work in the field.",
};

export const stats = [
  { value: 9, suffix: "+", label: "Years of Experience" },
  { value: 14, suffix: "+", label: "Projects Delivered" },
  { value: 5, suffix: "", label: "Awards & Commendations" },
  { value: 2, suffix: "", label: "Master's Degrees" },
];

export const highlights = [
  {
    icon: "Brain",
    title: "Agentic AI & RAG",
    body: "Chatbot and workflow automation with Google ADK and LangChain, MCP servers and locally hosted models via Ollama.",
  },
  {
    icon: "LineChart",
    title: "Applied Data Science",
    body: "EDA and KDD with Pandas, NumPy and scikit-learn; marginal-price analysis with machine learning and foundation models.",
  },
  {
    icon: "Layers",
    title: "Full-Stack Engineering",
    body: "Vue.js, React and Nuxt/Next front ends over Python FastAPI, Express.js, Laravel and .NET Core services.",
  },
  {
    icon: "Server",
    title: "DevOps & Delivery",
    body: "IIS deployments on Windows Server, Python apps run as Windows services, and pipelines automating every build.",
  },
];

export const experience = [
  {
    id: "ismo",
    company: "Independent System & Market Operator (MOE)",
    role: "Assistant Director — Software Development",
    period: "February 2025 — Present",
    start: "2025-02",
    location: "Islamabad, PK",
    type: "Full-time",
    current: true,
    blurb:
      "Building the AI and data platform for Pakistan's independent system and market operator.",
    points: [
      "Web development using Python backend frameworks plus Express.js APIs, with front ends in Vue.js and React.js styled with Tailwind CSS.",
      "Building fast, production-ready APIs with the Python FastAPI framework.",
      "EDA and KDD using Pandas and NumPy alongside the scikit-learn library.",
      "Analytics and reporting with Matplotlib, Seaborn and Plotly.",
      "Agentic AI utilisation through MCP servers and Ollama-based local model hosting.",
      "Chatbot automation built on the Agentic AI frameworks Google ADK and LangChain.",
      "RAG techniques applied to automation workflows using Google ADK and LangChain.",
      "DevOps on Windows Server using IIS together with Windows services.",
      "Pipelines that automate server build and deployment.",
      "Running and managing Python framework applications as services on Windows servers.",
    ],
    tech: [
      "Python",
      "FastAPI",
      "Google ADK",
      "LangChain",
      "MCP",
      "Ollama",
      "Vue.js",
      "React.js",
      "Tailwind CSS",
      "Express.js",
      "Pandas",
      "scikit-learn",
      "IIS",
    ],
  },
  {
    id: "ntdc",
    company: "National Transmission & Dispatch Company (WAPDA)",
    role: "Assistant Director (Sr. Software Developer)",
    period: "February 2019 — February 2025",
    start: "2019-02",
    location: "Islamabad, PK",
    type: "Full-time",
    current: false,
    blurb:
      "Owned nationally critical portals used by IPPs, the board of directors and thousands of employees.",
    points: [
      "Development and maintenance of the System Operator Data Exchange Portal with IPPs — a highly important web application handling multiple IPPs at national scale.",
      "EDA and KDD on marginal price data using cutting-edge data science techniques alongside machine learning and foundation models.",
      "Development, maintenance and support of the Internal Portal that automates internal office work.",
      "Development of dashboards presenting critical information such as thermal, wind and nuclear power plant data through responsive real-time charts.",
      "Support, development and maintenance of the Training Portal — several modules for training employees, running their skill-set exams and maintaining service records, with real-time result and grade generation for every employee.",
      "Board of Directors management system handling high-priority agenda points submitted for approval, notifying relevant departments about meetings and reporting progress on previous events.",
      "NTDC main website maintenance and support, including the fetching of key information from various DISCOs and other ministry departments.",
    ],
    tech: [
      ".NET Core",
      "MVC",
      "Oracle 11g",
      "SQL Server",
      "jQuery",
      "Vue.js",
      "Bootstrap",
      "Machine Learning",
      "Foundation Models",
    ],
  },
  {
    id: "artziii",
    company: "Artziii",
    role: "Full Stack / AI Developer",
    period: "February 2024 — September 2024",
    start: "2024-02",
    location: "Oregon — Washington, USA",
    type: "Contract",
    current: false,
    blurb: "An AI-first publishing product — roughly 90% of its feature set is AI driven.",
    points: [
      "Highly engaging product filled with AI-based features and ChatGPT integration for automatic book generation.",
      "PDF-to-EPUB converter built as a Flask Python API.",
      "A range of image- and text-based AI features.",
      "Hosting and pipeline-based integration on an AWS EC2 instance.",
    ],
    tech: ["Python", "Flask", "OpenAI API", "AWS EC2", "CI/CD"],
  },
  {
    id: "chalant",
    company: "Chalant Ventures",
    role: "Frontend Developer",
    period: "December 2023 — August 2024",
    start: "2023-12",
    location: "Los Angeles, USA",
    type: "Contract",
    current: false,
    blurb: "A portfolio of marketing and lead-generation sites built on a Jamstack pipeline.",
    points: [
      "Frontend development and deployment using the Hugo framework alongside Tailwind CSS.",
      "Widget integration and CloudCannon pipelines via GitHub.",
      "Several field products under my responsibility for development and maintenance.",
    ],
    tech: ["Hugo", "Tailwind CSS", "CloudCannon", "GitHub Actions", "JavaScript"],
  },
  {
    id: "ppn",
    company: "Pickleball Players Network",
    role: "Full Stack Developer (Part-time)",
    period: "November 2020 — February 2023",
    start: "2020-11",
    location: "Los Angeles, USA",
    type: "Part-time",
    current: false,
    blurb: "A US-backed platform affiliated with multiple pickleball exchanges.",
    points: [
      "PPN is backed by a US-based client affiliated with multiple pickleball exchanges.",
      "External paid API integrations using Laravel HTTP requests, surfaced on the frontend.",
      "Highly responsive frontend design using Bootstrap 4 and core CSS.",
      "Stripe payment gateway integration through the Laravel Cashier package.",
      "Development of REST APIs using the PHP framework Laravel 8.",
    ],
    tech: ["Laravel 8", "PHP", "Stripe", "Laravel Cashier", "Bootstrap 4", "REST APIs"],
  },
  {
    id: "ahq",
    company: "Air Force Headquarters (AHQ)",
    role: "Software Engineer",
    period: "September 2017 — February 2019",
    start: "2017-09",
    location: "Islamabad, PK",
    type: "Full-time",
    current: false,
    blurb: "Defence software with strict reliability and confidentiality requirements.",
    points: [
      "Development of a web-based Air Defence Control System covering jet movements and mission-related information.",
      "Research and development introducing cutting-edge technologies into running modules, including web and machine-learning based components.",
      "Development of custom libraries for reuse across internal development projects.",
    ],
    tech: ["ASP.NET", "C#", "SQL Server", "JavaScript", "Machine Learning"],
  },
];

export const projects = [
  {
    name: "SDXP — SO Data Exchange Portal",
    url: null,
    category: "Enterprise",
    org: "NTDC",
    description:
      "National-scale data exchange portal between the System Operator and Independent Power Producers.",
    tech: [".NET Core", "Oracle", "Dashboards"],
    featured: true,
  },
  {
    name: "NICE — News Intelligence Collection Exchange",
    url: null,
    category: "AI",
    org: "ISMO",
    flagship: true,
    description:
      "Flagship agentic AI intelligence platform for Pakistan's power sector — autonomous collection, tagging, sentiment scoring and automated executive briefs. Backed by an ISMO technical confirmation letter.",
    tech: ["Google ADK", "LangChain", "RAG", "Python", "Agentic AI"],
    featured: true,
  },
  {
    name: "Artziii",
    url: "https://app.artiziii.com",
    category: "AI",
    org: "Artziii",
    description:
      "AI-first publishing app: ChatGPT-driven book generation, PDF-to-EPUB conversion and image/text AI tools.",
    tech: ["Flask", "OpenAI", "AWS EC2"],
    featured: true,
  },
  {
    name: "Pickleball Players Network",
    url: "https://pickleballplayersnetwork.com/",
    category: "Web",
    org: "PPN",
    description:
      "Community platform with paid API integrations and Stripe billing via Laravel Cashier.",
    tech: ["Laravel 8", "Stripe", "Bootstrap 4"],
    featured: true,
  },
  {
    name: "NTDC Corporate Website",
    url: "https://www.ntdc.gov.pk/",
    category: "Enterprise",
    org: "NTDC",
    description:
      "Public-facing national utility website aggregating information from DISCOs and ministry departments.",
    tech: ["Web", "CMS", "Integrations"],
    featured: false,
  },
  {
    name: "CS / Board of Directors Portal",
    url: "https://csbod.ntdc.com.pk/",
    category: "Enterprise",
    org: "NTDC",
    description:
      "Board management system for agenda points, approvals, meeting notifications and progress tracking.",
    tech: [".NET Core", "SQL Server", "Workflow"],
    featured: false,
  },
  {
    name: "TSG Training Portal",
    url: "https://www.tsgportal.ntdc.pk/",
    category: "Enterprise",
    org: "NTDC",
    description:
      "Training platform with online skill-set exams, real-time results, grading and service records.",
    tech: ["Exams Engine", "Reporting", "MVC"],
    featured: false,
  },
  {
    name: "NTDC Internal Portal",
    url: "https://iportal.ntdc.com.pk/",
    category: "Enterprise",
    org: "NTDC",
    description: "Internal office automation portal used across departments.",
    tech: ["MVC", "Oracle", "Automation"],
    featured: false,
  },
  {
    name: "Fixed Asset Management",
    url: "https://fixedasset.ntdc.com.pk",
    category: "Enterprise",
    org: "NTDC",
    description: "Asset registry and tracking system for organisation-wide fixed assets.",
    tech: ["MVC", "SQL Server"],
    featured: false,
  },
  {
    name: "My Psych Degree",
    url: "https://mypsychdegree.com/",
    category: "Web",
    org: "Chalant Ventures",
    description: "Education lead-generation site built on the Hugo + CloudCannon pipeline.",
    tech: ["Hugo", "Tailwind CSS", "CloudCannon"],
    featured: false,
  },
  {
    name: "Top Trade Schools",
    url: "https://toptradeschools.com/",
    category: "Web",
    org: "Chalant Ventures",
    description: "Trade-school discovery portal with widget integrations and automated deploys.",
    tech: ["Hugo", "Tailwind CSS", "CloudCannon"],
    featured: false,
  },
  {
    name: "Vet Career Schools",
    url: "https://vetcareerschools.com/",
    category: "Web",
    org: "Chalant Ventures",
    description: "Veterinary careers directory delivered on the same Jamstack stack.",
    tech: ["Hugo", "Tailwind CSS", "CloudCannon"],
    featured: false,
  },
  {
    name: "Pops Pool Service",
    url: "https://popspoolservice.com/",
    category: "Web",
    org: "Chalant Ventures",
    description: "Service-business marketing site with fast static delivery.",
    tech: ["Hugo", "Tailwind CSS"],
    featured: false,
  },
  {
    name: "Duuupe",
    url: "https://duuupe.com/",
    category: "Web",
    org: "Chalant Ventures",
    description: "Product discovery site maintained as part of the Chalant product portfolio.",
    tech: ["Hugo", "Tailwind CSS"],
    featured: false,
  },
];

export const skillGroups = [
  {
    title: "Frontend",
    icon: "Palette",
    accent: "brand",
    skills: [
      { name: "Vue.js", level: 95 },
      { name: "React.js", level: 92 },
      { name: "Next.js / Nuxt.js", level: 86 },
      { name: "JavaScript (ES6+)", level: 94 },
      { name: "Tailwind CSS / Bootstrap", level: 93 },
      { name: "jQuery", level: 90 },
      { name: "Hugo", level: 82 },
    ],
  },
  {
    title: "Backend & AI",
    icon: "Cpu",
    accent: "brand-3",
    skills: [
      { name: "Python & Agentic AI", level: 94 },
      { name: "FastAPI / Flask", level: 90 },
      { name: "Express.js / Node.js", level: 88 },
      { name: "Laravel & Core PHP", level: 90 },
      { name: ".NET Core / MVC", level: 85 },
      { name: "LangChain & Google ADK", level: 88 },
      { name: "RAG & MCP Servers", level: 86 },
    ],
  },
  {
    title: "Data & Databases",
    icon: "Database",
    accent: "brand-2",
    skills: [
      { name: "Pandas / NumPy", level: 92 },
      { name: "scikit-learn", level: 87 },
      { name: "Matplotlib / Seaborn / Plotly", level: 89 },
      { name: "MySQL / SQL Server", level: 90 },
      { name: "Oracle 11g (Express Edition)", level: 84 },
      { name: "MongoDB", level: 83 },
    ],
  },
];

export const tools = [
  "VS Code",
  "PhpStorm",
  "WebStorm",
  "PyCharm",
  "Visual Studio",
  "Sublime Text",
  "Notepad++",
  "GitHub Desktop",
  "Google Colab",
  "Microsoft Copilot",
  "IIS",
  "AWS EC2",
];

export const education = [
  {
    degree: "MS in Data Science",
    honour: "Silver Medalist",
    institution: "Air University, Islamabad",
    period: "April 2025",
    location: "Islamabad, PK",
    note: "Thesis-track programme covering machine learning, forecasting with foundation models and knowledge discovery.",
  },
  {
    degree: "Master in Computer Science",
    honour: null,
    institution: "Quaid-e-Azam University, Islamabad",
    period: "September 2017",
    location: "Islamabad, PK",
    note: "Core computer science foundations — algorithms, databases, distributed systems and software engineering.",
  },
];

export const achievements = [
  {
    title: "Employee of the Year Award",
    year: "2020",
    issuer: "National Transmission & Dispatch Company",
    icon: "Trophy",
  },
  {
    title: "Excellent Performance Certificate",
    year: "2020",
    issuer: "National Transmission & Dispatch Company",
    icon: "Medal",
  },
  {
    title: "Appreciation Letter",
    year: "2021",
    issuer: "TSG Training Centre",
    icon: "BadgeCheck",
  },
  {
    title: "Appreciation Letter",
    year: "2025",
    issuer: "NPCC",
    icon: "Award",
  },
  {
    title: "Technical Confirmation & Support Letter — NICE",
    year: "2026",
    issuer: "Independent System & Market Operator (ISMO)",
    icon: "BadgeCheck",
  },
];

export const languages = [
  { name: "English", level: "Professional", value: 90 },
  { name: "Urdu", level: "Native", value: 100 },
  { name: "Pashto", level: "Native", value: 100 },
];

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "nice", label: "NICE" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/**
 * NICE — the flagship agentic AI platform, plus the ISMO Technical Confirmation
 * and Support Letter that independently backs the contribution.
 * Sources: ISMO/2026/Dir.Communications/6581 dated 29 June 2026, and the
 * ISMO Executive Brief (reporting period 01–07 Aug 2026) produced by NICE.
 */
export const flagship = {
  id: "nice",
  acronym: "NICE",
  name: "News Intelligence Collection Exchange",
  org: "Independent System & Market Operator (ISMO)",
  status: "In-house · Production",
  positioning:
    "One of Pakistan's most advanced agentic AI platforms built for the power sector — an in-house digital intelligence system that organises, verifies and makes structured use of large volumes of media, policy, regulatory and sector-related information.",
  summary:
    "NICE turns the unstructured noise around Pakistan's power sector — news, policy movement, regulatory notifications and public discourse — into a verified, structured and searchable intelligence base. Autonomous agents collect and categorise coverage, score its tone, benchmark every institution mentioned, and assemble the findings into an executive brief that decision-makers can act on. I led the technical design, development and implementation: full-stack build, interface, database handling, system functionality and user access flows.",
  role: "Technical design · Development · Implementation",
  tech: [
    "Python",
    "Agentic AI",
    "Google ADK",
    "LangChain",
    "RAG",
    "MCP Servers",
    "Ollama",
    "FastAPI",
    "Vue.js",
    "Tailwind CSS",
  ],
  coreFunctions: [
    {
      icon: "Newspaper",
      title: "Autonomous Collection",
      body: "Continuously ingests large volumes of media, policy, regulatory and sector-related information across the power sector, policy environment and public discourse.",
    },
    {
      icon: "Tags",
      title: "Agentic Categorisation",
      body: "AI agents classify unstructured coverage against a controlled tag taxonomy, converting free-form reporting into structured, queryable records.",
    },
    {
      icon: "Gauge",
      title: "Sentiment & Perception Scoring",
      body: "Scores every item positive, neutral or negative, then rolls the balance into a Public Confidence Index and a Government Reputation Score tracked over time.",
    },
    {
      icon: "Users",
      title: "Author Intelligence",
      body: "Profiles journalists and commentators by volume, tone split and influence — surfacing the high-impact voices worth engaging and the consistently critical ones.",
    },
    {
      icon: "Building2",
      title: "Institutional Benchmarking",
      body: "Compares mention volume against reputation score across ISMO, NTDC, DISCOs, NEPRA, CPPA-G, PPIB, the Power Division and private IPPs.",
    },
    {
      icon: "SearchCheck",
      title: "Human-in-the-Loop Verification",
      body: "Structured analyst review sits between collection and publication, so the platform assists judgement on what is verified rather than replacing it.",
    },
    {
      icon: "FileText",
      title: "Automated Executive Briefs",
      body: "Assembles the periodic brief end to end — executive summary, top three insights, sentiment breakdown and the themes driving positive and adverse coverage.",
    },
    {
      icon: "Brain",
      title: "Institutional Knowledge Base",
      body: "Retains a searchable record of coverage, positions and developments, improving internal knowledge management across reporting periods.",
    },
    {
      icon: "Radar",
      title: "Early Signal Detection",
      body: "Flags emerging narratives, knowledge gaps and reputational risk early enough for proactive clarification instead of reactive damage control.",
    },
  ],
  signals: [
    { label: "Public Confidence Index", value: "57%" },
    { label: "Government Reputation Score", value: "57%" },
    { label: "Sentiment split", value: "41 / 21 / 38" },
    { label: "Institutions benchmarked", value: "8" },
  ],
  signalsNote:
    "Indicative outputs from an ISMO Executive Brief generated by NICE for the 01–07 Aug 2026 reporting period.",
  endorsement: {
    title: "Technical Confirmation & Support Letter",
    subject: "Mr. Muhammad Baseer Khan's role in the development of NICE",
    reference: "ISMO/2026/Dir.Communications/6581",
    date: "29 June 2026",
    issuer: "Directorate of Communications",
    organisation: "Independent System & Market Operator (ISMO) of Pakistan",
    issuerNote: "Originator of the NICE concept and functional direction",
    quotes: [
      "Mr. Baseer Khan played a significant role in translating the concept into a workable digital platform.",
      "His work reflected a strong understanding of modern software development practices and the ability to convert a policy and communication-oriented idea into a functional technology product.",
      "Mr. Baseer Khan has also demonstrated relevant experience in agentic AI development and AI-assisted system design.",
    ],
    contributions: [
      "Full-stack development work",
      "Interface development",
      "Database handling",
      "System functionality",
      "User access flows",
      "Technical structuring for internal use",
    ],
  },
};
