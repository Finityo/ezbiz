export const DBA_COPY = {
  hero: {
    badge: "Trade Name Registration",
    headline: "DBA Filing Service",
    subheadline: 'Register your "Doing Business As" name and build your brand identity',
    description: "Also known as a trade name, fictitious name, or assumed name. Start operating under your chosen business name quickly and affordably.",
    ctaPrimary: "File Your DBA",
    ctaSecondary: "Free Consultation",
  },
  whatIs: {
    heading: "What Is a DBA?",
    paragraphs: [
      'A <strong class="text-foreground">DBA (Doing Business As)</strong> is a registered trade name that allows a person or business entity to conduct business under a name different from their legal name. DBAs are also commonly called fictitious business names, assumed names, or trade names.',
      'For example, if your legal name is "John Smith" and you want to operate a landscaping business called "Green Thumb Landscaping," you would file a DBA to legally use that business name. Similarly, if you have an LLC called "Smith Holdings LLC" but want to operate a coffee shop under the name "Morning Brew Cafe," you would file a DBA.',
      '<strong class="text-foreground">Important:</strong> A DBA does not create a new legal entity or provide liability protection. It is simply a registration that allows you to do business under a different name while remaining legally the same person or entity.',
    ],
    does: [
      "Allows you to legally operate under a different name",
      "Enables opening bank accounts in your business name",
      "Creates a public record of business ownership",
      "Satisfies state/local legal requirements",
    ],
    doesNot: [
      "Does NOT create a separate legal entity",
      "Does NOT provide liability protection",
      "Does NOT give exclusive trademark rights",
      "Does NOT change your tax status",
    ],
  },
  whoNeeds: {
    heading: "Who Needs a DBA?",
    subheading: "Various types of individuals and business entities can benefit from filing a DBA",
    items: [
      { title: "Sole Proprietors", description: "Individuals who want to operate under a business name rather than their personal legal name.", example: "John Smith operating as 'Smith Consulting Services'" },
      { title: "Partnerships", description: "Partners who want to use a trade name instead of listing all partners' names.", example: "Smith & Jones operating as 'Metro Law Group'" },
      { title: "LLCs", description: "Limited liability companies that want to market products or services under a different brand.", example: "ABC Holdings LLC operating as 'Downtown Coffee Shop'" },
      { title: "Corporations", description: "Companies creating divisions, subsidiaries, or separate brand identities.", example: "XYZ Corporation operating as 'QuickShip Delivery'" },
    ],
  },
  benefits: {
    heading: "Benefits of Filing a DBA",
    subheading: "A DBA offers several advantages for entrepreneurs and businesses",
    items: [
      { title: "Brand Identity", description: "Create a professional business name that resonates with your target market, separate from your personal or legal entity name." },
      { title: "Banking Flexibility", description: "Open business bank accounts and accept payments under your DBA name, keeping finances organized." },
      { title: "Marketing Power", description: "Build brand recognition and market your services under a memorable, industry-appropriate name." },
      { title: "Multiple Brands", description: "Operate multiple business lines under different names without forming separate legal entities." },
      { title: "Legal Compliance", description: "Meet state and local requirements for businesses operating under assumed names." },
      { title: "Low Cost", description: "Establish a professional business presence at a fraction of the cost of forming an LLC or corporation." },
    ],
  },
  drawbacks: {
    heading: "Limitations to Consider",
    subheading: "Understand what a DBA cannot do before deciding if it is right for you",
    items: [
      { title: "No Liability Protection", description: "A DBA does not create a separate legal entity. You remain personally liable for all business debts and obligations.", severity: "high" as const },
      { title: "No Exclusive Rights", description: "Filing a DBA does not guarantee exclusive use of the name. Others may use similar names if not trademarked.", severity: "medium" as const },
      { title: "Renewal Requirements", description: "Most states require periodic renewal (typically every 5 years), with fees and paperwork.", severity: "low" as const },
      { title: "Publication Costs", description: "Some states require publishing your DBA in local newspapers, which adds to the total cost.", severity: "low" as const },
    ],
  },
  formationSteps: {
    heading: "How to File a DBA",
    subheading: "The DBA filing process varies by state but generally follows these steps",
    steps: [
      { step: 1, title: "Choose Your DBA Name", description: "Select a name that represents your business, is not already in use, and complies with state naming rules.", timeline: "Same day" },
      { step: 2, title: "Search Name Availability", description: "Check county and state records to ensure your desired name is not already registered by another business.", timeline: "1-2 days" },
      { step: 3, title: "File DBA Registration", description: "Submit your DBA filing with the appropriate county clerk or state agency, along with required fees.", timeline: "1-2 weeks" },
      { step: 4, title: "Publish Notice (If Required)", description: "Some states require publishing your DBA in a local newspaper for a specified period.", timeline: "2-4 weeks" },
      { step: 5, title: "Obtain Business Licenses", description: "Apply for any required local business licenses and permits to operate under your DBA.", timeline: "1-2 weeks" },
    ],
  },
  stateVariations: {
    heading: "DBA Requirements by State",
    subheading: "Requirements vary significantly by state. Here are some examples:",
    items: [
      { state: "California", filedWith: "County Clerk", publication: "Required", renewal: "5 years" },
      { state: "Texas", filedWith: "County Clerk", publication: "Not Required", renewal: "10 years" },
      { state: "New York", filedWith: "County Clerk", publication: "Required", renewal: "None (perpetual)" },
      { state: "Florida", filedWith: "State (Sunbiz)", publication: "Not Required", renewal: "None (perpetual)" },
      { state: "Illinois", filedWith: "County Clerk", publication: "Not Required", renewal: "5 years" },
    ],
    footnote: "Requirements change frequently. Contact us for current requirements in your state.",
  },
  comparison: {
    heading: "DBA vs. Other Business Structures",
    subheading: "Understand how a DBA compares to forming a separate business entity",
  },
  faq: {
    heading: "Frequently Asked Questions",
    subheading: "Get answers to common questions about DBA filings",
    items: [
      { question: "What is the difference between a DBA and an LLC?", answer: "A DBA (Doing Business As) is simply a registered trade name that allows you to operate under a name different from your legal name. It does not create a new legal entity or provide liability protection. An LLC (Limited Liability Company) is a separate legal entity that provides personal liability protection, separating your personal assets from business debts. If liability protection is important, consider forming an LLC and then filing a DBA for the LLC if you want to operate under a different name." },
      { question: "Do I need a DBA if I have an LLC?", answer: "You only need a DBA for your LLC if you want to operate under a name different from your registered LLC name. For example, if your LLC is registered as 'ABC Holdings LLC' but you want to market a restaurant as 'Downtown Bistro,' you would file a DBA. If you are happy operating under your LLC's registered name, no DBA is needed." },
      { question: "How long does it take to get a DBA?", answer: "The timeline varies by state and county. In most cases, you can file a DBA within 1-2 business days. However, if your state requires newspaper publication (like California or New York), the total process can take 4-6 weeks. States without publication requirements typically complete the process in 1-2 weeks." },
      { question: "Does a DBA give me trademark protection?", answer: "No, a DBA registration does not provide trademark protection. A DBA only registers your business name with local or state authorities for legal and tax purposes. To protect your business name from being used by others nationwide, you would need to file for a federal trademark with the USPTO. We recommend conducting a trademark search before investing heavily in branding." },
      { question: "Can I have multiple DBAs?", answer: "Yes, a single person or business entity can register multiple DBAs. This is common for entrepreneurs who operate several different business lines or brands. Each DBA typically requires a separate filing and fee. For example, a marketing consultant might operate 'Smith Marketing' for B2B clients and 'Creative Co' for small business clients." },
      { question: "What happens if I do not renew my DBA?", answer: "If you fail to renew your DBA before it expires, your registration becomes inactive. This means you may lose the right to use that business name, and someone else could register it. Additionally, you may face penalties or need to re-file as a new application. Some states do not require renewal (perpetual registration), while others require renewal every 5-10 years." },
    ],
  },
  cta: {
    heading: "Ready to File Your DBA?",
    subheading: "Establish your brand identity and start operating under your chosen business name. We handle the paperwork so you can focus on your business.",
    ctaPrimary: "File Your DBA Today",
    ctaSecondary: "Schedule Free Consultation",
    footnote: "DBA Filing — $89 + state/county filing fees",
  },
} as const;

export const EIN_COPY = {
  hero: {
    headline: "EIN Number Service",
    subheadline: "Get your Federal Tax ID Number (EIN) fast and hassle-free",
    ctaPrimary: "Get Your EIN Today",
  },
  whatIs: {
    heading: "What is an EIN?",
    description: "An Employer Identification Number (EIN), also known as a Federal Tax ID Number, is a unique nine-digit number assigned by the IRS to identify your business for tax purposes.",
    format: "XX-XXXXXXX",
    formatNote: "Your EIN is a permanent number that stays with your business throughout its lifetime.",
  },
  whoNeeds: {
    heading: "Who Needs an EIN?",
    items: [
      "Businesses with employees",
      "LLCs with multiple members",
      "All corporations and partnerships",
      "Sole proprietors who want to separate business and personal finances",
      "Businesses opening bank accounts",
      "Companies applying for business licenses",
    ],
  },
  benefitCards: [
    { title: "Business Banking", description: "Required to open business bank accounts and establish business credit" },
    { title: "Privacy Protection", description: "Protects your Social Security Number from business use" },
    { title: "Tax Compliance", description: "Required for business tax filings and IRS correspondence" },
    { title: "Instant Results", description: "Get your EIN immediately upon successful application" },
  ],
  benefits: {
    heading: "Benefits of Having an EIN",
    items: [
      "Required for business bank accounts",
      "Needed to hire employees",
      "Protects your Social Security Number",
      "Required for business tax filings",
      "Necessary for business credit applications",
      "Professional credibility with vendors",
    ],
  },
  process: {
    heading: "EIN Application Process",
    howWeHelp: "How We Help",
    steps: [
      "Verify your business entity type",
      "Gather required business information",
      "Complete IRS Form SS-4 application",
      "Submit application to the IRS",
      "Receive your EIN immediately",
    ],
    requiredInfo: {
      heading: "Required Information",
      items: [
        "Legal business name",
        "Business entity type",
        "Principal business address",
        "Responsible party information",
        "Reason for applying",
      ],
    },
  },
  pricing: {
    heading: "EIN Services",
    standard: {
      name: "EIN Online Filing — $89",
      description: "Get your EIN quickly and efficiently",
      price: "$89",
      features: ["IRS Form SS-4 preparation", "Direct IRS submission", "Same-day processing", "Email confirmation"],
    },
    express: {
      name: "Express EIN Service",
      description: "Priority processing with additional support",
      price: "$149",
      features: ["Everything in Standard", "Priority processing", "Expedited delivery", "Dedicated support specialist", "Banking resolution included"],
    },
  },
  faq: {
    heading: "Frequently Asked Questions",
    items: [
      { question: "How long does it take to get an EIN?", answer: "With our service, you can receive your EIN the same day your application is processed by the IRS." },
      { question: "Is an EIN free from the IRS?", answer: "Yes, the IRS doesn't charge for EINs. Our fee covers the preparation, submission, and professional service." },
      { question: "Can I apply for an EIN myself?", answer: "Yes, but our service ensures accuracy, saves time, and provides ongoing support for your business needs." },
      { question: "Do I need an EIN for my LLC?", answer: "Single-member LLCs don't require an EIN unless they have employees or elect corporate tax treatment." },
      { question: "Can I change my EIN later?", answer: "EINs are permanent. You'd only get a new one if your business structure fundamentally changes." },
      { question: "What if my application is rejected?", answer: "We'll work with you to correct any issues and resubmit your application at no additional charge." },
    ],
  },
  cta: {
    heading: "Get Your EIN Today",
    subheading: "Don't let paperwork slow down your business. Get your Federal Tax ID Number quickly and professionally.",
    ctaPrimary: "Start Application",
    ctaSecondary: "Free Consultation",
  },
} as const;

export const REGISTERED_AGENT_COPY = {
  hero: {
    badge: "Required in All 50 States",
    headline: "Professional Registered Agent Service",
    subheadline: "Protect your privacy and ensure compliance with our reliable registered agent service. We accept legal documents and maintain your business in good standing.",
    ctaPrimary: "Get Started - $149/year",
    ctaSecondary: "Learn More",
    badges: ["All 50 States Available", "Privacy Protection", "Compliance Guaranteed"],
  },
  whatIs: {
    heading: "What is a Registered Agent?",
    description: "A registered agent is a person or company designated to receive important legal documents on behalf of your business entity.",
    requirements: [
      { label: "Legal Requirement", description: "Every LLC and corporation must have a registered agent" },
      { label: "Business Hours", description: "Must be available during normal business hours" },
      { label: "Physical Address", description: "Must have a physical address in the state of incorporation" },
    ],
    documentsHandled: [
      "Lawsuit summons and complaints",
      "Tax notices and correspondence",
      "Annual report notices",
      "Government compliance notices",
      "Legal process service",
      "Official state correspondence",
    ],
  },
  benefits: {
    heading: "Benefits of Professional Service",
    subheading: "Why choose a professional registered agent service over serving yourself",
    items: [
      { title: "Privacy Protection", description: "Keep your personal address private from public business records" },
      { title: "Reliable Service", description: "Professional acceptance of important legal documents during business hours" },
      { title: "Compliance Assured", description: "Meet state requirements and maintain good standing" },
      { title: "Document Management", description: "Secure storage and quick access to all registered agent documents" },
    ],
    services: [
      "Accept service of process",
      "Receive official state correspondence",
      "Forward legal documents promptly",
      "Maintain compliance records",
      "Annual report reminders",
      "Document scanning and storage",
      "Email and mail forwarding",
      "Business hours availability",
    ],
    whyNotSelf: [
      { label: "Privacy Concerns", description: "Your personal address becomes public record" },
      { label: "Availability Issues", description: "Must be available during business hours" },
      { label: "Professional Image", description: "Legal documents served at your business" },
      { label: "Compliance Risk", description: "Missing documents can result in penalties" },
    ],
  },
  pricing: {
    heading: "Choose Your Service Level",
    subheading: "Professional registered agent service with transparent annual pricing",
    packages: [
      {
        name: "Standard Service",
        price: "$149",
        period: "per year",
        description: "Professional registered agent service",
        features: ["Accept service of process", "Forward legal documents", "Email notifications", "Document scanning", "Business hours coverage", "Online account access"],
        popular: false,
      },
      {
        name: "Premium Service",
        price: "$199",
        period: "per year",
        description: "Enhanced service with compliance support",
        features: ["Everything in Standard Service", "Annual report filing reminders", "Compliance calendar", "Priority document processing", "Phone support", "Document storage (5 years)"],
        popular: true,
      },
    ],
  },
  cta: {
    heading: "Protect Your Privacy Today",
    subheading: "Don't risk missing important legal documents or exposing your personal address. Choose professional registered agent service.",
    ctaPrimary: "Get Started - $149/year",
    ctaSecondary: "Free Consultation",
  },
} as const;

export const ANNUAL_REPORT_COPY = {
  hero: {
    headline: "Annual Report Filing Service",
    subheadline: "Stay compliant with state requirements. We handle your annual report filings on time, every time.",
    ctaPrimary: "File Annual Report Now",
  },
  whatIs: {
    heading: "What is an Annual Report?",
    description: "An annual report is a required filing that updates your state about your business's current information, including business address, registered agent, and ownership details. Most states require this filing to maintain your business's good standing status.",
    warning: "Failing to file your annual report can result in late fees, penalties, or even dissolution of your business entity.",
  },
  features: [
    { title: "Track Deadlines", description: "We monitor your state's filing deadlines and remind you before they're due." },
    { title: "Complete Filing", description: "We prepare and file your annual report with all required information." },
    { title: "Guaranteed Compliance", description: "Stay in good standing with your state and avoid penalties or dissolution." },
  ],
  stateRequirements: {
    heading: "State-Specific Requirements",
    items: [
      { title: "Filing Frequency", description: "Most states require annual reports yearly, but some require biennial (every two years) filings." },
      { title: "Due Dates", description: "Due dates vary by state - some align with your formation date, others have fixed calendar dates." },
      { title: "Filing Fees", description: "State fees range from $0 to $800+ depending on your state and business type." },
      { title: "Required Information", description: "Typically includes business address, registered agent details, member/officer names, and business activities." },
    ],
  },
  service: {
    heading: "Our Annual Report Service",
    items: [
      { title: "Deadline Monitoring", description: "We track your filing deadlines and send advance reminders." },
      { title: "Form Preparation", description: "We prepare your annual report with accurate, up-to-date information." },
      { title: "State Filing", description: "We submit your report directly to the state on your behalf." },
      { title: "Confirmation & Records", description: "Receive filed copies and state confirmation for your records." },
    ],
    ctaPrimary: "Get Started with Annual Report Filing",
  },
} as const;

export const COMPLIANCE_COPY = {
  hero: {
    headline: "Business Compliance Services",
    subheadline: "Stay compliant, avoid penalties, and protect your business with our comprehensive compliance solutions.",
    ctaPrimary: "Get Compliance Consultation",
  },
  why: {
    heading: "Why Business Compliance Matters",
    description: "Maintaining business compliance isn't just about avoiding penalties—it's about protecting your business, maintaining good standing, and ensuring you can operate without interruption. From annual reports to registered agent services, we help you stay on top of all requirements.",
    items: [
      { title: "Avoid Penalties", description: "Late or missing filings can result in fines, dissolution, or loss of legal protections." },
      { title: "Maintain Good Standing", description: "Keep your business in good standing to access banking, contracts, and licenses." },
    ],
  },
  services: {
    heading: "Our Compliance Services",
    items: [
      { title: "Annual Report Filing", description: "We track deadlines and file your required annual or biennial reports with the state to keep your business in good standing.", link: "/annual-report", linkText: "Learn More" },
      { title: "Registered Agent Service", description: "Professional registered agent service in all 50 states. We receive legal documents and service of process on your behalf.", link: "/registered-agent", linkText: "Learn More" },
      { title: "Compliance Alerts", description: "Receive timely reminders for filing deadlines, renewals, and other state requirements so you never miss a critical date.", link: "/consultation", linkText: "Get Started" },
      { title: "Business License Assistance", description: "Get help identifying and obtaining the business licenses and permits required for your industry and location.", link: "/consultation", linkText: "Get Started" },
    ],
  },
  stateRequirements: {
    heading: "State-Specific Compliance Requirements",
    description: "Each state has unique compliance requirements and deadlines. Our experts know the rules for all 50 states and will ensure your business meets every requirement.",
    items: [
      { title: "Annual/Biennial Reports", description: "Due dates, fees, and requirements vary by state and entity type." },
      { title: "Registered Agent", description: "Required in your state of formation and any states where you're registered." },
      { title: "Foreign Qualification", description: "Register in additional states where you conduct business." },
      { title: "Business Licenses", description: "Local, state, and federal licenses based on your business activities." },
    ],
  },
  cta: {
    heading: "Need Help with Compliance?",
    subheading: "Our compliance experts are here to help you understand your obligations and ensure your business stays in good standing. Schedule a consultation to discuss your specific needs.",
    ctaPrimary: "Schedule Free Consultation",
  },
} as const;
