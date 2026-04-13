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
  setFillColor,
} from '../pdf-utils';

export const generateLLCGuide = (): jsPDF => {
  const doc = createDocument();
  const { marginLeft, marginTop, contentWidth, pageHeight, marginBottom } = PDF_LAYOUT;
  
  // Cover page
  addCoverPage(doc, 'LLC Formation Guide', 'Complete Guide to Limited Liability Company Formation');
  
  // Track total pages for footer (we'll update this later)
  let currentPage = 1;
  
  // Page 2: Introduction
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  let y = marginTop + 10;
  
  y = addSectionHeader(doc, 'What is an LLC?', y);
  
  y = addParagraph(doc, `A Limited Liability Company (LLC) is a flexible business structure that combines the liability protection of a corporation with the tax benefits and operational simplicity of a partnership. LLCs have become one of the most popular business structures in the United States, and for good reason.`, y);
  
  y = addParagraph(doc, `An LLC is a separate legal entity from its owners (called "members"). This separation provides crucial liability protection, meaning your personal assets—your home, car, and savings—are generally protected from business debts and lawsuits against the company.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Key Characteristics of an LLC', y);
  
  y = addBulletPoint(doc, 'Limited Liability Protection: Members are typically not personally liable for the company\'s debts or legal obligations.', y);
  y = addBulletPoint(doc, 'Pass-Through Taxation: By default, LLC profits and losses "pass through" to members\' personal tax returns, avoiding double taxation.', y);
  y = addBulletPoint(doc, 'Flexible Management: LLCs can be managed by members or by appointed managers, allowing for various organizational structures.', y);
  y = addBulletPoint(doc, 'Fewer Formalities: Unlike corporations, LLCs have fewer ongoing compliance requirements and less paperwork.', y);
  y = addBulletPoint(doc, 'Credibility: Operating as an LLC adds professionalism and credibility to your business.', y);
  
  y += 5;
  y = addTipBox(doc, '💡 Pro Tip', 'An LLC is ideal for small to medium businesses that want liability protection without the complexity of a corporation. Most solo entrepreneurs and partnerships choose LLCs for their simplicity and flexibility.', y);
  
  // Page 3: LLC vs Other Structures
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'LLC vs Other Business Structures', y);
  
  y = addParagraph(doc, `Choosing the right business structure is one of the most important decisions you'll make as an entrepreneur. Each structure has its own advantages and disadvantages regarding liability protection, taxation, and operational requirements.`, y);
  
  y += 5;
  
  // Comparison table
  autoTable(doc, {
    startY: y,
    head: [['Feature', 'LLC', 'Sole Proprietorship', 'Corporation', 'Partnership']],
    body: [
      ['Liability Protection', 'Yes', 'No', 'Yes', 'Limited'],
      ['Pass-Through Taxation', 'Default (optional)', 'Yes', 'No (unless S-Corp)', 'Yes'],
      ['Management Flexibility', 'High', 'Highest', 'Low', 'Moderate'],
      ['Paperwork Requirements', 'Moderate', 'Minimal', 'Extensive', 'Moderate'],
      ['Ongoing Compliance', 'Moderate', 'Minimal', 'Extensive', 'Moderate'],
      ['Raising Capital', 'Moderate', 'Difficult', 'Easiest', 'Moderate'],
      ['Self-Employment Tax', 'Yes (typically)', 'Yes', 'No (for S-Corp)', 'Yes'],
      ['Number of Owners', 'Unlimited', 'One', 'Unlimited', '2+'],
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
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
    },
    margin: { left: marginLeft },
    tableWidth: contentWidth,
  });
  
  y = (doc as any).lastAutoTable.finalY + 10;
  
  y = addSubsectionHeader(doc, 'When to Choose an LLC', y);
  y = addParagraph(doc, `An LLC is often the best choice when you want liability protection but don't need the formal structure of a corporation. It's particularly well-suited for:`, y);
  
  y = addBulletPoint(doc, 'Small business owners seeking personal asset protection', y);
  y = addBulletPoint(doc, 'Real estate investors wanting to separate properties from personal liability', y);
  y = addBulletPoint(doc, 'Freelancers and consultants looking for credibility and protection', y);
  y = addBulletPoint(doc, 'Family businesses wanting flexible ownership arrangements', y);
  
  // Page 4-5: Choosing the Right State
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Choosing the Right State', y);
  
  y = addParagraph(doc, `While you can form an LLC in any state, the decision of where to incorporate can significantly impact your taxes, privacy, and ongoing costs. Here's what you need to consider:`, y);
  
  y += 3;
  y = addSubsectionHeader(doc, 'Home State vs. Other States', y);
  
  y = addParagraph(doc, `For most small businesses, forming an LLC in your home state (where you conduct business) is the best choice. If you form in another state, you'll likely need to register as a "foreign LLC" in your home state anyway, doubling your fees and compliance requirements.`, y);
  
  y = addTipBox(doc, '💡 When Other States Make Sense', 'Consider forming in another state if you operate in multiple states, value privacy (Wyoming), want business-friendly courts (Delaware), or have specific tax optimization needs (Nevada). Consult with a tax advisor for complex situations.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Popular States for LLC Formation', y);
  
  autoTable(doc, {
    startY: y,
    head: [['State', 'Filing Fee', 'Annual Fee', 'Key Benefits']],
    body: [
      ['Delaware', '$90', '$300', 'Business-friendly courts, privacy, established case law'],
      ['Wyoming', '$100', '$60', 'No state income tax, strong asset protection, privacy'],
      ['Nevada', '$425', '$350', 'No state income tax, strong privacy protections'],
      ['Florida', '$125', '$138.75', 'No state income tax, growing business hub'],
      ['Texas', '$300', '$0', 'No state income tax, business-friendly environment'],
      ['California', '$70', '$800+', 'Large market access (required for CA businesses)'],
      ['New York', '$200', '$25', 'Major financial center, established business law'],
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
  
  // Page 6-7: Formation Process
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Step-by-Step Formation Process', y);
  
  y = addParagraph(doc, `Forming an LLC involves several key steps. While the process varies slightly by state, the following guide covers the essential steps for most jurisdictions:`, y);
  
  y += 5;
  
  y = addNumberedItem(doc, 1, 'Choose Your LLC Name: Your business name must be unique in your state and typically must include "LLC" or "Limited Liability Company." Check availability through your state\'s Secretary of State website.', y);
  
  y = addNumberedItem(doc, 2, 'Designate a Registered Agent: Every LLC must have a registered agent—a person or company authorized to receive legal documents on behalf of your business. The agent must have a physical address in the state of formation.', y);
  
  y = addNumberedItem(doc, 3, 'File Articles of Organization: This is the official document that creates your LLC. It typically includes your business name, registered agent information, and sometimes the names of members or managers.', y);
  
  y = addNumberedItem(doc, 4, 'Create an Operating Agreement: While not always legally required, an operating agreement is essential. It outlines ownership percentages, member responsibilities, profit distribution, and procedures for adding or removing members.', y);
  
  y = addNumberedItem(doc, 5, 'Obtain an EIN: An Employer Identification Number (EIN) is your business\'s tax ID. You\'ll need it to open a business bank account, hire employees, and file taxes. Apply for free at IRS.gov.', y);
  
  y = checkNewPage(doc, y, 60);
  if (y === marginTop) {
    currentPage++;
    addPageHeader(doc, 'LLC Formation Guide');
    y = marginTop + 10;
  }
  
  y = addNumberedItem(doc, 6, 'Open a Business Bank Account: Keep personal and business finances separate by opening a dedicated business account. This is crucial for maintaining liability protection.', y);
  
  y = addNumberedItem(doc, 7, 'Register for State Taxes: Depending on your business activities, you may need to register for state sales tax, employer withholding, or other tax obligations.', y);
  
  y = addNumberedItem(doc, 8, 'Obtain Necessary Licenses and Permits: Research and obtain any federal, state, or local licenses required for your industry and location.', y);
  
  y += 5;
  y = addTipBox(doc, '⏱️ Timeline', 'Most states process LLC filings within 5-10 business days. Expedited processing is usually available for an additional fee. EZ BIZ FILE SERVICE can help ensure your filing is completed correctly the first time.', y);
  
  // Page 8-9: Operating Agreement
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Operating Agreement Essentials', y);
  
  y = addParagraph(doc, `An operating agreement is the internal document that governs how your LLC will be run. Even for single-member LLCs, having an operating agreement is strongly recommended because it:`, y);
  
  y = addBulletPoint(doc, 'Establishes your LLC as a separate legal entity, strengthening liability protection', y);
  y = addBulletPoint(doc, 'Defines the rights and responsibilities of all members', y);
  y = addBulletPoint(doc, 'Prevents disputes by clearly outlining procedures', y);
  y = addBulletPoint(doc, 'May be required for opening bank accounts or obtaining financing', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Key Provisions to Include', y);
  
  y = addBulletPoint(doc, 'Ownership Structure: Percentage ownership for each member and any capital contributions made.', y);
  y = addBulletPoint(doc, 'Profit and Loss Distribution: How profits and losses will be divided among members (doesn\'t have to match ownership percentages).', y);
  y = addBulletPoint(doc, 'Management Structure: Whether the LLC is member-managed or manager-managed, and decision-making procedures.', y);
  y = addBulletPoint(doc, 'Voting Rights: How votes are allocated and what decisions require member approval.', y);
  y = addBulletPoint(doc, 'Transfer of Membership: Rules for selling or transferring membership interests.', y);
  y = addBulletPoint(doc, 'Dissolution Procedures: How the LLC can be dissolved and assets distributed.', y);
  
  y += 5;
  y = addTipBox(doc, '⚖️ Legal Note', 'Some states (like California, New York, and Missouri) legally require an operating agreement. Even where not required, having one protects your limited liability status and provides clarity for all members.', y);
  
  // Page 10-11: Tax Implications
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Tax Elections and Implications', y);
  
  y = addParagraph(doc, `One of the LLC's greatest advantages is tax flexibility. By default, LLCs are "pass-through" entities, but you can elect different tax treatments to optimize your situation:`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Default Tax Classifications', y);
  
  y = addBulletPoint(doc, 'Single-Member LLC: Taxed as a sole proprietorship (disregarded entity). All income/losses reported on Schedule C of your personal return.', y);
  y = addBulletPoint(doc, 'Multi-Member LLC: Taxed as a partnership. The LLC files an informational return (Form 1065), and each member receives a K-1 to report on their personal return.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Optional Tax Elections', y);
  
  y = addParagraph(doc, `LLCs can elect to be taxed as a corporation, which may provide tax advantages in certain situations:`, y);
  
  y = addBulletPoint(doc, 'C Corporation Election: File Form 8832. The LLC pays corporate tax on profits. May be beneficial for retaining earnings in the business.', y);
  y = addBulletPoint(doc, 'S Corporation Election: File Form 2553. Pass-through taxation with potential self-employment tax savings. Popular for profitable LLCs.', y);
  
  y += 5;
  y = addTipBox(doc, '💰 S-Corp Tax Strategy', 'If your LLC earns over $40,000+ in annual profit, electing S-Corp status could save you thousands in self-employment taxes. As an S-Corp, you pay yourself a "reasonable salary" (subject to payroll taxes) and take remaining profits as distributions (not subject to self-employment tax).', y);
  
  y = checkNewPage(doc, y, 50);
  if (y === marginTop) {
    currentPage++;
    addPageHeader(doc, 'LLC Formation Guide');
    y = marginTop + 10;
  }
  
  y = addSubsectionHeader(doc, 'Important Tax Forms', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Form', 'Purpose', 'Due Date']],
    body: [
      ['Form 1040, Schedule C', 'Single-member LLC income/expenses', 'April 15'],
      ['Form 1065', 'Multi-member LLC partnership return', 'March 15'],
      ['Schedule K-1', 'Member\'s share of income/deductions', 'With Form 1065'],
      ['Form 8832', 'Entity classification election', 'Varies'],
      ['Form 2553', 'S Corporation election', '75 days from formation'],
      ['Form 941', 'Quarterly payroll taxes (if employees)', 'Quarterly'],
      ['Form 1099-NEC', 'Contractor payments over $600', 'January 31'],
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
  
  // Page 12-13: Ongoing Compliance
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Ongoing Compliance Requirements', y);
  
  y = addParagraph(doc, `Maintaining your LLC requires ongoing attention to various compliance requirements. Failing to meet these obligations can result in penalties, loss of good standing, or even dissolution of your LLC.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Annual Requirements', y);
  
  y = addBulletPoint(doc, 'Annual Report: Most states require LLCs to file an annual (or biennial) report with updated business information. Fees range from $0 to $800+ depending on the state.', y);
  y = addBulletPoint(doc, 'Franchise Tax: Some states (like California, Texas, and Delaware) impose annual franchise or LLC taxes regardless of income.', y);
  y = addBulletPoint(doc, 'Registered Agent: Maintain a registered agent in your state of formation. Update this information if your agent changes.', y);
  y = addBulletPoint(doc, 'Business Licenses: Renew any state, local, or professional licenses as required.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Ongoing Best Practices', y);
  
  y = addBulletPoint(doc, 'Separate Finances: Never mix personal and business funds. This "piercing the corporate veil" can eliminate your liability protection.', y);
  y = addBulletPoint(doc, 'Document Major Decisions: Keep records of important business decisions, especially those involving member consent.', y);
  y = addBulletPoint(doc, 'Update Operating Agreement: Amend your operating agreement when membership changes or business circumstances evolve.', y);
  y = addBulletPoint(doc, 'Maintain Insurance: Consider general liability, professional liability, and other insurance appropriate for your industry.', y);
  
  y += 5;
  y = addTipBox(doc, '📅 Set Calendar Reminders', 'Missing deadlines can result in penalties or administrative dissolution. Set annual reminders for your annual report due date, tax deadlines, and license renewals. Better yet, let EZ BIZ FILE SERVICE handle your compliance so you can focus on running your business.', y);
  
  // Page 14: Checklist
  doc.addPage();
  currentPage++;
  addPageHeader(doc, 'LLC Formation Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'LLC Formation Checklist', y);
  
  y = addParagraph(doc, `Use this checklist to track your progress through the LLC formation process:`, y);
  
  const checklistItems = [
    'Research and choose your LLC name',
    'Verify name availability with your state',
    'Choose your state of formation',
    'Identify a registered agent',
    'Prepare and file Articles of Organization',
    'Pay state filing fee',
    'Create your Operating Agreement',
    'Apply for an EIN from the IRS',
    'Open a business bank account',
    'Register for state tax accounts (if applicable)',
    'Obtain business licenses and permits',
    'Set up bookkeeping and accounting system',
    'Consider business insurance options',
    'Calendar annual report and tax deadlines',
  ];
  
  y += 5;
  
  // Draw checkbox style list
  checklistItems.forEach((item, index) => {
    y = checkNewPage(doc, y, 12);
    if (y === marginTop) {
      currentPage++;
      addPageHeader(doc, 'LLC Formation Guide');
      y = marginTop + 10;
    }
    
    // Draw checkbox
    doc.setLineWidth(0.5);
    doc.setDrawColor(PDF_COLORS.slateNavy.r, PDF_COLORS.slateNavy.g, PDF_COLORS.slateNavy.b);
    doc.rect(marginLeft, y - 4, 5, 5);
    
    // Item text
    doc.setFontSize(PDF_FONTS.body);
    doc.setFont('helvetica', 'normal');
    setColor(doc, PDF_COLORS.darkText);
    doc.text(item, marginLeft + 10, y);
    
    y += 10;
  });
  
  y += 5;
  y = addSubsectionHeader(doc, 'Next Steps', y);
  y = addParagraph(doc, `Ready to form your LLC? EZ BIZ FILE SERVICE can handle the entire process for you—from filing your Articles of Organization to obtaining your EIN. Visit ezbiz-fs.com to get started today, or contact us for a free consultation.`, y);
  
  // About page
  addAboutPage(doc);
  currentPage++;
  
  // Now add footers to all pages except cover and about
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i < totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i - 1, totalPages - 2);
  }
  
  return doc;
};
