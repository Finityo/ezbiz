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

export const generateTaxGuide = (): jsPDF => {
  const doc = createDocument();
  const { marginLeft, marginTop, contentWidth } = PDF_LAYOUT;
  
  // Cover page
  addCoverPage(doc, 'Business Tax Election Guide', 'Understanding Your Tax Options and Obligations');
  
  // Page 2: Introduction
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  let y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Default Tax Classifications', y);
  
  y = addParagraph(doc, `When you form a business entity, the IRS automatically assigns a default tax classification based on your structure. Understanding these defaults—and your options to change them—is essential for tax optimization.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Default Classifications by Entity Type', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Entity Type', 'Default IRS Classification', 'How Taxed']],
    body: [
      ['Sole Proprietorship', 'Sole Proprietorship', 'Schedule C on personal return'],
      ['Single-Member LLC', 'Disregarded Entity', 'Same as Sole Proprietorship'],
      ['Multi-Member LLC', 'Partnership', 'Form 1065 + Schedule K-1'],
      ['C Corporation', 'C Corporation', 'Form 1120 (corporate tax)'],
      ['S Corporation', 'S Corporation (with election)', 'Form 1120-S + Schedule K-1'],
      ['General Partnership', 'Partnership', 'Form 1065 + Schedule K-1'],
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
  
  y = addTipBox(doc, '💡 Key Insight', 'LLCs are unique in that they can choose to be taxed as a sole proprietorship, partnership, S corporation, or C corporation. This flexibility is one of the LLC\'s greatest advantages.', y);
  
  // Page 3-4: S Corporation Election
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'S Corporation Election Process', y);
  
  y = addParagraph(doc, `The S Corporation election allows eligible businesses to enjoy pass-through taxation while potentially reducing self-employment taxes. This is one of the most powerful tax strategies available to small business owners.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Eligibility Requirements', y);
  
  y = addBulletPoint(doc, 'Be a domestic corporation or eligible LLC', y);
  y = addBulletPoint(doc, 'Have no more than 100 shareholders', y);
  y = addBulletPoint(doc, 'All shareholders must be individuals, certain trusts, or estates (not partnerships or corporations)', y);
  y = addBulletPoint(doc, 'All shareholders must be U.S. citizens or permanent residents', y);
  y = addBulletPoint(doc, 'Have only one class of stock (voting rights differences are allowed)', y);
  y = addBulletPoint(doc, 'Cannot be an ineligible corporation (certain banks, insurance companies, etc.)', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'How to Make the Election', y);
  
  y = addNumberedItem(doc, 1, 'Complete IRS Form 2553: All shareholders must sign the form consenting to the S Corp election.', y);
  y = addNumberedItem(doc, 2, 'File with the IRS: Submit Form 2553 to the appropriate IRS service center.', y);
  y = addNumberedItem(doc, 3, 'File Within Deadline: Submit no later than 2 months and 15 days (75 days) after the beginning of the tax year for which the election is to take effect.', y);
  y = addNumberedItem(doc, 4, 'Confirm Acceptance: The IRS will send a determination letter (CP261) confirming your S Corp status.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Important Deadlines', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Situation', 'Deadline']],
    body: [
      ['New corporation/LLC wanting S Corp status immediately', '75 days from formation'],
      ['Existing entity wanting S Corp status next year', 'March 15 of the year you want it to begin'],
      ['Missed deadline (late election relief)', 'Within 3 years and 75 days if requirements met'],
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
  
  y = addTipBox(doc, '⚠️ Reasonable Compensation', 'S Corp shareholder-employees MUST receive "reasonable compensation" for services performed. The IRS scrutinizes S Corps that pay minimal salaries to avoid payroll taxes. Base your salary on industry norms, experience, and time committed to the business.', y);
  
  // Page 5: LLC Tax Options
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'LLC Tax Election Options', y);
  
  y = addParagraph(doc, `LLCs have remarkable tax flexibility. You can accept the default classification or elect to be taxed as a different type of entity. The right choice depends on your specific financial situation and goals.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Option 1: Default Classification (No Election Needed)', y);
  
  y = addBulletPoint(doc, 'Single-Member LLC: Taxed as sole proprietorship. Report income on Schedule C.', y);
  y = addBulletPoint(doc, 'Multi-Member LLC: Taxed as partnership. File Form 1065 and issue K-1s.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Option 2: C Corporation Election (Form 8832)', y);
  
  y = addParagraph(doc, `Electing C Corporation status subjects the LLC to corporate income tax. This may benefit businesses that:`, y);
  
  y = addBulletPoint(doc, 'Want to retain significant earnings in the business at the 21% corporate rate', y);
  y = addBulletPoint(doc, 'Plan to reinvest profits rather than distribute them', y);
  y = addBulletPoint(doc, 'Need certain corporate fringe benefits', y);
  y = addBulletPoint(doc, 'Are preparing for venture capital investment', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Option 3: S Corporation Election (Form 2553)', y);
  
  y = addParagraph(doc, `The S Corp election is often the most tax-efficient option for profitable LLCs. Benefits include:`, y);
  
  y = addBulletPoint(doc, 'Pass-through taxation (avoiding double taxation)', y);
  y = addBulletPoint(doc, 'Self-employment tax savings on distributions', y);
  y = addBulletPoint(doc, 'Potential 20% Qualified Business Income (QBI) deduction', y);
  
  y += 5;
  y = addTipBox(doc, '📊 When S Corp Makes Sense', 'Generally, an S Corp election becomes beneficial when net profits exceed $40,000-$50,000 annually. Below this threshold, the additional payroll costs and compliance complexity may outweigh the tax savings. Consult a tax professional for your specific situation.', y);
  
  // Page 6: Pass-Through vs Corporate
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Pass-Through vs Corporate Taxation', y);
  
  y = addParagraph(doc, `The fundamental question in business taxation is whether to use "pass-through" taxation (where business income flows to your personal return) or "corporate" taxation (where the business pays its own taxes).`, y);
  
  y += 5;
  
  autoTable(doc, {
    startY: y,
    head: [['Aspect', 'Pass-Through (LLC, S Corp, Partnership)', 'Corporate (C Corp)']],
    body: [
      ['Federal Tax Rate', 'Individual rates (10%-37%)', 'Flat 21%'],
      ['Double Taxation', 'No', 'Yes (on dividends)'],
      ['QBI Deduction (20%)', 'May qualify', 'Not available'],
      ['Self-Employment Tax', 'Yes (except S Corp distributions)', 'No (only on salary)'],
      ['Loss Deductions', 'Can offset personal income', 'Carried forward only'],
      ['Retained Earnings', 'Taxed to owners regardless', 'Only taxed at corporate rate'],
      ['Fringe Benefits', 'Limited for 2%+ owners', 'Fully deductible'],
      ['Raising Capital', 'More complex', 'Preferred by investors'],
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
  
  y = addSubsectionHeader(doc, 'Choosing the Right Structure', y);
  
  y = addParagraph(doc, `Consider pass-through taxation when:`, y);
  y = addBulletPoint(doc, 'You\'re in a lower tax bracket than the corporate rate', y);
  y = addBulletPoint(doc, 'You need to use business losses to offset other income', y);
  y = addBulletPoint(doc, 'You plan to distribute most profits to owners', y);
  
  y = addParagraph(doc, `Consider corporate taxation when:`, y);
  y = addBulletPoint(doc, 'You\'re in a high personal tax bracket and want to retain earnings', y);
  y = addBulletPoint(doc, 'You\'re seeking venture capital or institutional investment', y);
  y = addBulletPoint(doc, 'You want maximum fringe benefit deductions', y);
  
  // Page 7: Self-Employment Tax
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Self-Employment Tax Implications', y);
  
  y = addParagraph(doc, `Self-employment (SE) tax is the Social Security and Medicare tax for self-employed individuals. At 15.3% of net earnings (12.4% Social Security + 2.9% Medicare), it represents a significant tax burden. Understanding how different structures affect SE tax is crucial.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'SE Tax by Entity Type', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Entity Type', 'SE Tax Treatment']],
    body: [
      ['Sole Proprietorship', 'All net profit subject to SE tax'],
      ['Single-Member LLC (default)', 'All net profit subject to SE tax'],
      ['Partnership/Multi-Member LLC', 'Generally all distributive share subject to SE tax'],
      ['S Corporation', 'Only salary subject to SE tax; distributions are NOT'],
      ['C Corporation', 'Only salary subject to payroll taxes; dividends are NOT'],
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
  
  y = addSubsectionHeader(doc, 'The S Corp Tax Savings Strategy', y);
  
  y = addParagraph(doc, `The S Corp election's primary benefit is the ability to split income between salary (subject to payroll taxes) and distributions (not subject to SE tax). Example:`, y);
  
  y = addBulletPoint(doc, 'LLC earning $100,000: Full amount subject to 15.3% SE tax = ~$14,130 in SE tax', y);
  y = addBulletPoint(doc, 'Same LLC as S Corp: Pay $60,000 salary + $40,000 distribution = ~$9,180 in payroll taxes', y);
  y = addBulletPoint(doc, 'Potential savings: ~$4,950 per year', y);
  
  y += 5;
  y = addTipBox(doc, '⚠️ IRS Scrutiny Warning', 'The IRS actively audits S Corps that pay unreasonably low salaries. Your salary should reflect what you would pay an employee to do the same work. Typically, allocating 50-70% of profits as salary is a safer approach than minimizing salary.', y);
  
  // Page 8: Quarterly Payments
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Quarterly Estimated Payments', y);
  
  y = addParagraph(doc, `Unlike employees who have taxes withheld from paychecks, business owners typically must pay taxes quarterly through estimated tax payments. Failure to make these payments can result in penalties.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Who Must Pay Quarterly', y);
  
  y = addBulletPoint(doc, 'Sole proprietors, partners, and LLC members', y);
  y = addBulletPoint(doc, 'S Corp shareholders (on K-1 income not covered by salary withholding)', y);
  y = addBulletPoint(doc, 'Anyone expecting to owe $1,000+ in taxes after subtracting withholding', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Payment Deadlines', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Period', 'Due Date']],
    body: [
      ['Q1 (January 1 - March 31)', 'April 15'],
      ['Q2 (April 1 - May 31)', 'June 15'],
      ['Q3 (June 1 - August 31)', 'September 15'],
      ['Q4 (September 1 - December 31)', 'January 15 (following year)'],
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
  
  y = addSubsectionHeader(doc, 'Calculating Your Payments', y);
  
  y = addParagraph(doc, `You can generally avoid penalties by paying whichever is less:`, y);
  
  y = addBulletPoint(doc, '100% of last year\'s total tax (110% if AGI exceeded $150,000)', y);
  y = addBulletPoint(doc, '90% of current year\'s tax', y);
  
  y += 5;
  y = addTipBox(doc, '💡 Payment Methods', 'Pay estimated taxes through IRS Direct Pay (irs.gov/directpay), EFTPS (eftps.gov), credit/debit card, or by mailing Form 1040-ES with a check. Direct Pay and EFTPS are free; card payments have processing fees.', y);
  
  // Page 9: Form 2553
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Form 2553 Filing Requirements', y);
  
  y = addParagraph(doc, `Form 2553, "Election by a Small Business Corporation," is the document you file with the IRS to elect S Corporation status. Completing it correctly and on time is essential.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Required Information', y);
  
  y = addBulletPoint(doc, 'Corporation/LLC name, address, and EIN', y);
  y = addBulletPoint(doc, 'Date and state of incorporation/formation', y);
  y = addBulletPoint(doc, 'Tax year election date', y);
  y = addBulletPoint(doc, 'Shareholder consent signatures (all shareholders must sign)', y);
  y = addBulletPoint(doc, 'Each shareholder\'s name, address, SSN, ownership percentage, and tax year end', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Common Mistakes to Avoid', y);
  
  y = addBulletPoint(doc, 'Missing the 75-day deadline for new entities', y);
  y = addBulletPoint(doc, 'Failing to get all shareholder signatures', y);
  y = addBulletPoint(doc, 'Incorrect EIN or entity information', y);
  y = addBulletPoint(doc, 'Not filing with the correct IRS service center', y);
  y = addBulletPoint(doc, 'Forgetting to file a state S Corp election (required in some states)', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Where to File', y);
  
  y = addParagraph(doc, `Mail or fax Form 2553 to the IRS service center for your state. You can find the correct address in the Form 2553 instructions at irs.gov. Keep a copy of everything you submit.`, y);
  
  y += 5;
  y = addTipBox(doc, '📝 Late Election Relief', 'If you missed the deadline, you may qualify for late election relief under Rev. Proc. 2013-30. You must have intended to be an S Corp, failed to file on time due to reasonable cause, and have been treating the entity as an S Corp (filing 1120-S, etc.). Submit late elections with a statement explaining the reason for the delay.', y);
  
  // Page 10: State Considerations
  doc.addPage();
  addPageHeader(doc, 'Tax Election Guide');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'State Tax Considerations', y);
  
  y = addParagraph(doc, `Federal tax elections don't automatically apply at the state level. Each state has its own tax rules for business entities, and some require separate S Corp elections.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'States Requiring Separate S Corp Election', y);
  
  y = addParagraph(doc, `The following states require you to file a separate state-level S Corporation election:`, y);
  
  y = addBulletPoint(doc, 'New York (Form CT-6)', y);
  y = addBulletPoint(doc, 'New Jersey (automatic unless CBT-2553 filed to opt out)', y);
  y = addBulletPoint(doc, 'Arkansas (Form AR1103)', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'States That Don\'t Recognize S Corps', y);
  
  y = addParagraph(doc, `These states tax S Corps similarly to C Corps, though they may offer reduced rates:`, y);
  
  y = addBulletPoint(doc, 'California: 1.5% franchise tax on net income (minimum $800)', y);
  y = addBulletPoint(doc, 'New Hampshire: Business Profits Tax applies', y);
  y = addBulletPoint(doc, 'Tennessee: Franchise and excise taxes apply', y);
  y = addBulletPoint(doc, 'Texas: Franchise tax applies', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'No State Income Tax States', y);
  
  y = addParagraph(doc, `These states have no state income tax, which can be advantageous for business owners:`, y);
  
  y = addBulletPoint(doc, 'Alaska, Florida, Nevada, South Dakota, Texas, Washington, Wyoming', y);
  y = addBulletPoint(doc, 'Tennessee and New Hampshire (no tax on wages/business income)', y);
  
  y += 5;
  y = addTipBox(doc, '🗺️ Multi-State Operations', 'If you operate in multiple states, you may need to file returns and pay taxes in each state where you have "nexus" (a tax connection). Nexus can be established through physical presence, employees, significant sales, or other factors. Consult a tax professional for multi-state tax planning.', y);
  
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
