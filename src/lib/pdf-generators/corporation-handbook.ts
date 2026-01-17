import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  createDocument,
  addCoverPage,
  addPageHeader,
  addFooter,
  addSectionHeader,
  addSubsectionHeader,
  addParagraph,
  addBulletPoint,
  addNumberedItem,
  addTipBox,
  addAboutPage,
  checkNewPage,
  PDF_COLORS,
  PDF_LAYOUT,
  PDF_FONTS,
  setColor,
} from '../pdf-utils';

export const generateCorporationHandbook = (): jsPDF => {
  const doc = createDocument();
  const { marginLeft, marginTop, contentWidth } = PDF_LAYOUT;
  
  // Cover page
  addCoverPage(doc, 'Corporation Formation Handbook', 'Everything You Need to Know About Incorporating Your Business');
  
  // Page 2: Introduction
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  let y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Understanding Corporations', y);
  
  y = addParagraph(doc, `A corporation is a legal entity that is separate and distinct from its owners (shareholders). It is one of the oldest and most recognized business structures, offering strong liability protection, credibility, and unique advantages for raising capital.`, y);
  
  y = addParagraph(doc, `When you incorporate, you create an entity that can own property, enter contracts, sue and be sued, and conduct business—all independently of its owners. This separation is the foundation of the corporation's primary benefit: limited liability.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Key Characteristics', y);
  
  y = addBulletPoint(doc, 'Separate Legal Entity: The corporation exists independently of its shareholders, directors, and officers.', y);
  y = addBulletPoint(doc, 'Limited Liability: Shareholders\' personal assets are protected from corporate debts and liabilities.', y);
  y = addBulletPoint(doc, 'Perpetual Existence: A corporation continues to exist even if ownership changes or shareholders pass away.', y);
  y = addBulletPoint(doc, 'Transferable Ownership: Shares can be bought, sold, or transferred (subject to any restrictions).', y);
  y = addBulletPoint(doc, 'Formal Structure: Corporations have defined roles—shareholders, directors, and officers—with specific responsibilities.', y);
  
  y += 5;
  y = addTipBox(doc, '💼 When to Incorporate', 'Corporations are ideal for businesses planning to raise investment capital, those wanting to offer employee stock options, companies planning to go public eventually, or businesses in industries where the corporate structure is expected or preferred.', y);
  
  // Page 3-4: C Corp vs S Corp
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'C Corporation vs S Corporation', y);
  
  y = addParagraph(doc, `The two main types of corporations are C Corporations and S Corporations. The primary difference lies in how they are taxed. Understanding this distinction is crucial for making the right choice for your business.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'C Corporation Overview', y);
  
  y = addParagraph(doc, `A C Corporation is the "default" corporation. It is a separate taxpaying entity, meaning the corporation itself pays federal income tax on its profits. When those profits are distributed to shareholders as dividends, the shareholders also pay tax on that income—this is often called "double taxation."`, y);
  
  y = addBulletPoint(doc, 'Taxed at corporate tax rate (currently 21% federal)', y);
  y = addBulletPoint(doc, 'No restrictions on number or type of shareholders', y);
  y = addBulletPoint(doc, 'Can have multiple classes of stock', y);
  y = addBulletPoint(doc, 'Preferred structure for venture capital investment', y);
  y = addBulletPoint(doc, 'Retained earnings taxed at corporate rate (potentially lower than personal rates)', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'S Corporation Overview', y);
  
  y = addParagraph(doc, `An S Corporation is a corporation that has elected special tax status with the IRS. Instead of paying corporate income tax, profits and losses "pass through" to shareholders' personal tax returns—similar to partnerships and LLCs.`, y);
  
  y = addBulletPoint(doc, 'Pass-through taxation avoids double taxation', y);
  y = addBulletPoint(doc, 'Limited to 100 shareholders, all must be U.S. citizens or residents', y);
  y = addBulletPoint(doc, 'Only one class of stock allowed', y);
  y = addBulletPoint(doc, 'Can reduce self-employment taxes through salary/distribution split', y);
  y = addBulletPoint(doc, 'Requires reasonable salary to shareholder-employees', y);
  
  // Comparison table
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSubsectionHeader(doc, 'Detailed Comparison', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Feature', 'C Corporation', 'S Corporation']],
    body: [
      ['Taxation', 'Double taxation (corporate + personal)', 'Pass-through (personal only)'],
      ['Federal Tax Rate', '21% corporate rate', 'Individual rates (up to 37%)'],
      ['Max Shareholders', 'Unlimited', '100'],
      ['Shareholder Types', 'Any (individuals, entities, non-U.S.)', 'U.S. citizens/residents only'],
      ['Stock Classes', 'Multiple classes allowed', 'Single class only'],
      ['VC/PE Investment', 'Preferred', 'Complicated'],
      ['Retained Earnings', 'Taxed at corporate rate', 'Taxed to shareholders'],
      ['Self-Employment Tax', 'On salaries only', 'On salaries only'],
      ['Fringe Benefits', 'Fully deductible', 'Limited for 2%+ shareholders'],
      ['Formation Complexity', 'Moderate', 'Moderate + IRS election'],
    ],
    headStyles: {
      fillColor: [PDF_COLORS.slateNavy.r, PDF_COLORS.slateNavy.g, PDF_COLORS.slateNavy.b],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [PDF_COLORS.darkText.r, PDF_COLORS.darkText.g, PDF_COLORS.darkText.b],
    },
    alternateRowStyles: {
      fillColor: [PDF_COLORS.lightGray.r, PDF_COLORS.lightGray.g, PDF_COLORS.lightGray.b],
    },
    margin: { left: marginLeft },
    tableWidth: contentWidth,
  });
  
  y = (doc as any).lastAutoTable.finalY + 10;
  
  y = addTipBox(doc, '🎯 Which Should You Choose?', 'Choose C-Corp if you plan to seek venture capital, want to reinvest profits at lower corporate rates, or need multiple stock classes. Choose S-Corp if you want pass-through taxation, have fewer than 100 U.S.-based shareholders, and want to save on self-employment taxes.', y);
  
  // Page 5: Professional Corporations
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Professional Corporation Requirements', y);
  
  y = addParagraph(doc, `A Professional Corporation (PC or PLLC) is a special type of corporation formed by licensed professionals such as doctors, lawyers, accountants, architects, and engineers. Many states require these professionals to form a PC rather than a standard corporation.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Key Characteristics of Professional Corporations', y);
  
  y = addBulletPoint(doc, 'All shareholders must be licensed professionals in the same field', y);
  y = addBulletPoint(doc, 'Provides liability protection from business debts and other shareholders\' malpractice', y);
  y = addBulletPoint(doc, 'Does NOT protect against your own professional malpractice', y);
  y = addBulletPoint(doc, 'Subject to state licensing board oversight', y);
  y = addBulletPoint(doc, 'May have restrictions on transferring shares', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Professions Typically Requiring PCs', y);
  
  y = addBulletPoint(doc, 'Medical professionals (physicians, dentists, chiropractors)', y);
  y = addBulletPoint(doc, 'Legal professionals (attorneys, paralegals in some states)', y);
  y = addBulletPoint(doc, 'Accountants and CPAs', y);
  y = addBulletPoint(doc, 'Architects and engineers', y);
  y = addBulletPoint(doc, 'Veterinarians', y);
  y = addBulletPoint(doc, 'Therapists and counselors', y);
  
  y += 5;
  y = addTipBox(doc, '⚠️ Important Note', 'Professional Corporation requirements vary significantly by state and profession. Before forming a PC, check with your state licensing board to understand specific requirements, restrictions, and whether a PC is mandatory for your profession.', y);
  
  // Page 6-7: Board and Officers
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Board of Directors and Officers', y);
  
  y = addParagraph(doc, `Corporations have a formal management structure with distinct roles and responsibilities. Understanding these roles is essential for proper corporate governance.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Corporate Structure Hierarchy', y);
  
  y = addNumberedItem(doc, 1, 'Shareholders: The owners of the corporation. They elect the board of directors and vote on major corporate decisions.', y);
  y = addNumberedItem(doc, 2, 'Board of Directors: Elected by shareholders to oversee the corporation. They set company policy, make major decisions, and appoint officers.', y);
  y = addNumberedItem(doc, 3, 'Officers: Appointed by the board to manage day-to-day operations. Typical officers include CEO, CFO, Secretary, and Treasurer.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Board of Directors Responsibilities', y);
  
  y = addBulletPoint(doc, 'Set overall corporate strategy and direction', y);
  y = addBulletPoint(doc, 'Appoint, evaluate, and compensate executive officers', y);
  y = addBulletPoint(doc, 'Approve major transactions, contracts, and financial decisions', y);
  y = addBulletPoint(doc, 'Ensure legal and regulatory compliance', y);
  y = addBulletPoint(doc, 'Protect shareholder interests (fiduciary duty)', y);
  y = addBulletPoint(doc, 'Oversee financial reporting and auditing', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Common Officer Positions', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Position', 'Responsibilities']],
    body: [
      ['Chief Executive Officer (CEO)', 'Overall management, strategic vision, represents company externally'],
      ['President', 'Day-to-day operations, may be same person as CEO'],
      ['Chief Financial Officer (CFO)', 'Financial planning, reporting, risk management'],
      ['Secretary', 'Corporate records, meeting minutes, official filings'],
      ['Treasurer', 'Cash management, financial accounts, investments'],
      ['Vice President(s)', 'Specific departments or functions as assigned'],
    ],
    headStyles: {
      fillColor: [PDF_COLORS.slateNavy.r, PDF_COLORS.slateNavy.g, PDF_COLORS.slateNavy.b],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [PDF_COLORS.darkText.r, PDF_COLORS.darkText.g, PDF_COLORS.darkText.b],
    },
    alternateRowStyles: {
      fillColor: [PDF_COLORS.lightGray.r, PDF_COLORS.lightGray.g, PDF_COLORS.lightGray.b],
    },
    margin: { left: marginLeft },
    tableWidth: contentWidth,
  });
  
  // Page 8-9: Corporate Bylaws
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Corporate Bylaws and Governance', y);
  
  y = addParagraph(doc, `Corporate bylaws are the internal rules that govern how your corporation operates. While the Articles of Incorporation create the corporation, the bylaws define how it will be run. Every corporation should have comprehensive bylaws in place.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Essential Bylaw Provisions', y);
  
  y = addBulletPoint(doc, 'Corporate Purpose and Powers: The general purpose of the corporation and scope of activities.', y);
  y = addBulletPoint(doc, 'Shareholder Meetings: When and how annual and special meetings are held, notice requirements, quorum rules.', y);
  y = addBulletPoint(doc, 'Voting Procedures: How votes are conducted, proxy voting rules, and what actions require shareholder approval.', y);
  y = addBulletPoint(doc, 'Board of Directors: Number of directors, election procedures, terms, meeting requirements, and removal procedures.', y);
  y = addBulletPoint(doc, 'Officers: Titles, duties, election/appointment, and removal procedures.', y);
  y = addBulletPoint(doc, 'Stock Provisions: Classes of stock, transfer restrictions, certificates, and record-keeping.', y);
  y = addBulletPoint(doc, 'Dividends: How and when dividends may be declared and paid.', y);
  y = addBulletPoint(doc, 'Indemnification: Protection for directors and officers from liability.', y);
  y = addBulletPoint(doc, 'Amendment Procedures: How the bylaws can be changed.', y);
  
  y += 5;
  y = addTipBox(doc, '📋 Corporate Formalities', 'Maintaining proper corporate formalities—regular board meetings, documented minutes, separate finances—is essential for preserving your liability protection. Courts may "pierce the corporate veil" if you fail to treat the corporation as a separate entity.', y);
  
  // Page 10-11: Stock
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Stock Issuance and Ownership', y);
  
  y = addParagraph(doc, `Stock represents ownership in a corporation. Understanding how to properly issue and manage stock is fundamental to running a corporation. Mistakes in this area can have serious legal and tax consequences.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Authorized vs. Issued Shares', y);
  
  y = addBulletPoint(doc, 'Authorized Shares: The maximum number of shares your corporation can issue, as specified in the Articles of Incorporation.', y);
  y = addBulletPoint(doc, 'Issued Shares: Shares that have actually been sold or given to shareholders.', y);
  y = addBulletPoint(doc, 'Outstanding Shares: Issued shares that are currently held by shareholders (excludes treasury stock).', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Types of Stock', y);
  
  y = addBulletPoint(doc, 'Common Stock: Standard ownership shares with voting rights and residual claim on assets.', y);
  y = addBulletPoint(doc, 'Preferred Stock: Priority in dividends and liquidation; often has limited/no voting rights.', y);
  y = addBulletPoint(doc, 'Convertible Stock: Can be converted into another type of stock (usually preferred to common).', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Issuing Stock: Key Considerations', y);
  
  y = addNumberedItem(doc, 1, 'Valuation: Determine the fair market value of shares. For startups, this often requires a 409A valuation.', y);
  y = addNumberedItem(doc, 2, 'Securities Laws: Stock sales must comply with federal (SEC) and state securities laws. Exemptions exist for small offerings.', y);
  y = addNumberedItem(doc, 3, 'Stock Certificates: Issue physical or electronic certificates documenting ownership.', y);
  y = addNumberedItem(doc, 4, 'Cap Table: Maintain an accurate capitalization table showing all shareholders and their holdings.', y);
  y = addNumberedItem(doc, 5, 'Stock Ledger: Keep a corporate stock ledger recording all stock transactions.', y);
  
  y += 5;
  y = addTipBox(doc, '💡 Founder Vesting', 'Even founders should consider vesting schedules (typically 4 years with 1-year cliff). This protects the company if a founder leaves early and is often required by investors.', y);
  
  // Page 12-13: Tax Implications
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Tax Implications and Elections', y);
  
  y = addParagraph(doc, `Corporate taxation is complex and varies significantly based on your corporation type, state of incorporation, and business activities. Understanding your tax obligations is essential for compliance and optimization.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'C Corporation Taxation', y);
  
  y = addBulletPoint(doc, 'Corporate Tax Rate: C Corps pay a flat 21% federal income tax on profits.', y);
  y = addBulletPoint(doc, 'Double Taxation: Dividends paid to shareholders are taxed again at individual rates (qualified dividend rates: 0%, 15%, or 20%).', y);
  y = addBulletPoint(doc, 'Retained Earnings: Profits kept in the company are only taxed at the corporate rate—potentially beneficial for reinvestment.', y);
  y = addBulletPoint(doc, 'Fringe Benefits: Many fringe benefits (health insurance, etc.) are fully deductible for the corporation.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'S Corporation Taxation', y);
  
  y = addBulletPoint(doc, 'Pass-Through: S Corp income passes through to shareholders\' personal returns (no corporate-level tax).', y);
  y = addBulletPoint(doc, 'Qualified Business Income Deduction: Shareholders may deduct up to 20% of their share of S Corp income.', y);
  y = addBulletPoint(doc, 'Reasonable Compensation: The IRS requires shareholder-employees to receive "reasonable" salaries—subject to payroll taxes.', y);
  y = addBulletPoint(doc, 'Distributions: Distributions beyond salary are not subject to self-employment tax—a key S Corp advantage.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Making the S Corp Election', y);
  
  y = addParagraph(doc, `To be treated as an S Corporation, you must file Form 2553 with the IRS. Key requirements and timing:`, y);
  
  y = addBulletPoint(doc, 'File within 75 days of formation for immediate effect, or by March 15 for the following tax year.', y);
  y = addBulletPoint(doc, 'All shareholders must consent to the election.', y);
  y = addBulletPoint(doc, 'You must meet all S Corp eligibility requirements (100 shareholders max, U.S. shareholders only, one stock class).', y);
  
  // Page 14: Delaware
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Delaware Incorporation Benefits', y);
  
  y = addParagraph(doc, `Delaware is often called the "corporate capital of America." Over 60% of Fortune 500 companies and the majority of venture-backed startups incorporate there. Understanding why can help you decide if Delaware is right for your business.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Why Delaware?', y);
  
  y = addBulletPoint(doc, 'Court of Chancery: A specialized business court with expert judges (no juries) that provides predictable, quick resolution of corporate disputes.', y);
  y = addBulletPoint(doc, 'Established Case Law: Over 200 years of corporate law provides clear guidance on governance issues.', y);
  y = addBulletPoint(doc, 'Business-Friendly Laws: Delaware\'s General Corporation Law is regularly updated to meet modern business needs.', y);
  y = addBulletPoint(doc, 'Privacy: Directors\' and officers\' names don\'t need to be listed in public filings.', y);
  y = addBulletPoint(doc, 'Investor Familiarity: VCs and investors are comfortable with Delaware corporations and their governance.', y);
  y = addBulletPoint(doc, 'No State Income Tax on Out-of-State Business: If you don\'t operate in Delaware, you won\'t pay Delaware income tax.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Delaware Costs', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Item', 'Cost']],
    body: [
      ['Filing Fee (minimum)', '$89'],
      ['Annual Franchise Tax (minimum)', '$175'],
      ['Registered Agent (annual)', '$50-300'],
      ['Foreign Qualification (if operating in another state)', 'Varies by state'],
    ],
    headStyles: {
      fillColor: [PDF_COLORS.slateNavy.r, PDF_COLORS.slateNavy.g, PDF_COLORS.slateNavy.b],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [PDF_COLORS.darkText.r, PDF_COLORS.darkText.g, PDF_COLORS.darkText.b],
    },
    alternateRowStyles: {
      fillColor: [PDF_COLORS.lightGray.r, PDF_COLORS.lightGray.g, PDF_COLORS.lightGray.b],
    },
    margin: { left: marginLeft },
    tableWidth: contentWidth,
  });
  
  y = (doc as any).lastAutoTable.finalY + 10;
  
  y = addTipBox(doc, '🎯 Is Delaware Right for You?', 'Delaware makes the most sense if you\'re seeking venture capital, planning to go public, or want maximum legal predictability. For small businesses operating primarily in one state, incorporating in your home state is often simpler and more cost-effective.', y);
  
  // Page 15: Compliance
  doc.addPage();
  addPageHeader(doc, 'Corporation Handbook');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Ongoing Compliance Obligations', y);
  
  y = addParagraph(doc, `Corporations have more ongoing compliance requirements than other business structures. Failing to maintain proper compliance can result in penalties, loss of good standing, or even dissolution.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Annual Requirements', y);
  
  y = addBulletPoint(doc, 'Annual Report: Most states require an annual report with current company information and a filing fee.', y);
  y = addBulletPoint(doc, 'Franchise Tax: Many states impose annual franchise or corporate taxes. Delaware\'s franchise tax is based on authorized shares or assumed par value capital.', y);
  y = addBulletPoint(doc, 'Annual Shareholder Meeting: Corporations must hold at least one shareholder meeting per year.', y);
  y = addBulletPoint(doc, 'Board Meetings: The board should meet regularly (quarterly is common) and document decisions in minutes.', y);
  y = addBulletPoint(doc, 'Registered Agent: Maintain a registered agent in your state of incorporation.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Record-Keeping Requirements', y);
  
  y = addBulletPoint(doc, 'Corporate Minutes: Document all board and shareholder meetings.', y);
  y = addBulletPoint(doc, 'Resolutions: Record major corporate decisions in formal resolutions.', y);
  y = addBulletPoint(doc, 'Stock Ledger: Maintain accurate records of all stock issuances and transfers.', y);
  y = addBulletPoint(doc, 'Financial Records: Keep detailed financial statements and tax records.', y);
  y = addBulletPoint(doc, 'Corporate Documents: Retain Articles of Incorporation, Bylaws, and any amendments.', y);
  
  y += 5;
  y = addTipBox(doc, '📁 Corporate Minute Book', 'Keep all corporate records in an organized "minute book" or digital equivalent. This should include your Articles of Incorporation, Bylaws, stock certificates and ledger, meeting minutes, and major contracts. Having organized records demonstrates proper corporate governance.', y);
  
  // About page
  addAboutPage(doc);
  
  // Add footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i < totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i - 1, totalPages - 2);
  }
  
  return doc;
};
