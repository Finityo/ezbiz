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

export const generateLicenseChecklist = (): jsPDF => {
  const doc = createDocument();
  const { marginLeft, marginTop, contentWidth } = PDF_LAYOUT;
  
  // Cover page
  addCoverPage(doc, 'Business License Checklist', 'State-by-State License and Permit Requirements');
  
  // Page 2: Introduction
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  let y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Federal License Requirements', y);
  
  y = addParagraph(doc, `Most businesses don't need a federal license, but certain regulated industries require federal permits or licenses. Operating without required federal licenses can result in severe penalties.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Industries Requiring Federal Licenses', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Industry', 'Regulatory Agency', 'License/Permit']],
    body: [
      ['Alcohol (manufacturing, import, wholesale)', 'TTB (Treasury)', 'Federal Basic Permit'],
      ['Firearms & Ammunition', 'ATF', 'Federal Firearms License (FFL)'],
      ['Aviation', 'FAA', 'Various certifications'],
      ['Radio/TV Broadcasting', 'FCC', 'Broadcast License'],
      ['Transportation (interstate)', 'DOT', 'USDOT Number, MC Number'],
      ['Agriculture (certain products)', 'USDA', 'Varies by product'],
      ['Drug Manufacturing', 'FDA', 'Drug Establishment Registration'],
      ['Mining & Drilling', 'Various', 'Permits vary by type'],
      ['Fish & Wildlife', 'FWS', 'Import/Export licenses'],
      ['Nuclear Energy', 'NRC', 'Nuclear Licenses'],
    ],
    headStyles: {
      fillColor: [PDF_COLORS.slateNavy.r, PDF_COLORS.slateNavy.g, PDF_COLORS.slateNavy.b],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [PDF_COLORS.darkText.r, PDF_COLORS.darkText.g, PDF_COLORS.darkText.b],
    },
    alternateRowStyles: {
      fillColor: [PDF_COLORS.lightGray.r, PDF_COLORS.lightGray.g, PDF_COLORS.lightGray.b],
    },
    margin: { left: marginLeft },
    tableWidth: contentWidth,
  });
  
  y = (doc as any).lastAutoTable.finalY + 10;
  
  y = addTipBox(doc, '💡 SBA Resource', 'The U.S. Small Business Administration (sba.gov) provides a comprehensive guide to federal licensing requirements. Search for your industry to determine if any federal licenses apply.', y);
  
  // Page 3-6: State Requirements
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'State-Specific License Requirements', y);
  
  y = addParagraph(doc, `State licensing requirements vary significantly. Below are requirements for the most popular states for business formation. Always verify current requirements with your state's business licensing office.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'California', y);
  
  y = addBulletPoint(doc, 'General Business License: Required by most cities/counties. Fees vary by location and business type.', y);
  y = addBulletPoint(doc, 'Seller\'s Permit: Required if selling tangible goods. Apply through California CDTFA.', y);
  y = addBulletPoint(doc, 'Professional Licenses: Required for 200+ professions through DCA.', y);
  y = addBulletPoint(doc, 'California Contractors License (CSLB): Required for construction work over $500.', y);
  y = addBulletPoint(doc, 'CalChamber License Search: calchamber.com/california-business-licenses', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Texas', y);
  
  y = addBulletPoint(doc, 'No General State Business License: Texas doesn\'t require a general business license.', y);
  y = addBulletPoint(doc, 'Sales Tax Permit: Required if selling taxable items. Free through Texas Comptroller.', y);
  y = addBulletPoint(doc, 'Professional Licenses: Managed by TDLR and specific boards.', y);
  y = addBulletPoint(doc, 'Local Permits: Check with your city and county for local requirements.', y);
  y = addBulletPoint(doc, 'TDLR License Search: tdlr.texas.gov', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Florida', y);
  
  y = addBulletPoint(doc, 'General Business Tax Receipt: Required by county/city. Known as "Occupational License."', y);
  y = addBulletPoint(doc, 'Sales Tax Certificate: Required if selling tangible goods. Apply through DOR.', y);
  y = addBulletPoint(doc, 'DBPR Licenses: Professional licenses through Department of Business & Professional Regulation.', y);
  y = addBulletPoint(doc, 'Sunbiz Registration: Register with Division of Corporations for entity types.', y);
  
  // New page for more states
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSubsectionHeader(doc, 'New York', y);
  
  y = addBulletPoint(doc, 'NYC Business Certificate: Required for Manhattan businesses (varies by borough).', y);
  y = addBulletPoint(doc, 'Sales Tax Certificate of Authority: Required if selling taxable goods/services.', y);
  y = addBulletPoint(doc, 'Professional Licenses: Managed by Office of the Professions (OP).', y);
  y = addBulletPoint(doc, 'Local Licenses: NYC requires specific licenses for many businesses.', y);
  y = addBulletPoint(doc, 'NY License Center: businessexpress.ny.gov', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Delaware', y);
  
  y = addBulletPoint(doc, 'Business License: Required for most businesses operating in Delaware.', y);
  y = addBulletPoint(doc, 'Gross Receipts Tax: Monthly filing required for Delaware businesses.', y);
  y = addBulletPoint(doc, 'Professional Licenses: Through Division of Professional Regulation.', y);
  y = addBulletPoint(doc, 'One Stop Business Portal: onestop.delaware.gov', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Wyoming', y);
  
  y = addBulletPoint(doc, 'No General State Business License: Wyoming is business-friendly with minimal licensing.', y);
  y = addBulletPoint(doc, 'Sales Tax License: Required only if you have nexus in Wyoming.', y);
  y = addBulletPoint(doc, 'Professional Licenses: Check with specific licensing boards.', y);
  y = addBulletPoint(doc, 'Local Requirements: Minimal in most areas.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Nevada', y);
  
  y = addBulletPoint(doc, 'State Business License: Required for all businesses ($200 initial, $200 annual renewal).', y);
  y = addBulletPoint(doc, 'Sales Tax Permit: Required if selling tangible goods.', y);
  y = addBulletPoint(doc, 'Professional Licenses: Various boards regulate different professions.', y);
  y = addBulletPoint(doc, 'Silver Flume Portal: nvsilverflume.gov', y);
  
  // Page 5: Local Permits
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Local Permits and Registrations', y);
  
  y = addParagraph(doc, `In addition to state requirements, most localities (cities, counties, townships) have their own licensing requirements. These are often the first licenses you need to obtain.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Common Local Requirements', y);
  
  y = addBulletPoint(doc, 'Business License/Tax Certificate: A general permit to operate within the jurisdiction. Usually renewed annually.', y);
  y = addBulletPoint(doc, 'Zoning Permit: Confirms your business location is properly zoned for your type of business.', y);
  y = addBulletPoint(doc, 'Building Permit: Required for construction, renovation, or change of use.', y);
  y = addBulletPoint(doc, 'Fire Department Permit: Required for businesses open to the public, especially retail, restaurants, and assembly.', y);
  y = addBulletPoint(doc, 'Health Department Permit: Required for food service, childcare, pools, and health-related businesses.', y);
  y = addBulletPoint(doc, 'Sign Permit: Often required before installing business signage.', y);
  y = addBulletPoint(doc, 'Alarm Permit: Required if you have a monitored security system.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Home-Based Business Permits', y);
  
  y = addParagraph(doc, `If operating from home, you may need:`, y);
  
  y = addBulletPoint(doc, 'Home Occupation Permit: Allows business activities in residential zones with restrictions.', y);
  y = addBulletPoint(doc, 'HOA Approval: If in a homeowners association, check covenants for business restrictions.', y);
  y = addBulletPoint(doc, 'Landlord Permission: If renting, your lease may prohibit or restrict business use.', y);
  
  y += 5;
  y = addTipBox(doc, '🏛️ Where to Apply', 'Contact your city clerk\'s office or county business license department. Many jurisdictions now offer online applications through their official websites. Search "[Your City] business license" to find the appropriate office.', y);
  
  // Page 6: Professional Licensing
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Professional Licensing Requirements', y);
  
  y = addParagraph(doc, `Many professions require state-issued licenses before you can legally practice. These licenses typically require specific education, examinations, and ongoing continuing education.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Commonly Licensed Professions', y);
  
  autoTable(doc, {
    startY: y,
    head: [['Category', 'Examples']],
    body: [
      ['Healthcare', 'Physicians, Nurses, Dentists, Pharmacists, Physical Therapists, Psychologists'],
      ['Legal', 'Attorneys, Paralegals (some states)'],
      ['Financial', 'CPAs, Financial Advisors, Insurance Agents, Real Estate Agents'],
      ['Construction', 'General Contractors, Electricians, Plumbers, HVAC Technicians'],
      ['Personal Services', 'Barbers, Cosmetologists, Massage Therapists, Estheticians'],
      ['Education', 'Teachers, Tutors (some states), Childcare Workers'],
      ['Engineering/Architecture', 'Engineers, Architects, Surveyors, Interior Designers'],
      ['Trades', 'Auto Mechanics, Home Inspectors, Pest Control, Locksmiths'],
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
  
  y = addSubsectionHeader(doc, 'Typical Licensing Process', y);
  
  y = addNumberedItem(doc, 1, 'Meet educational requirements (degree, training program, apprenticeship)', y);
  y = addNumberedItem(doc, 2, 'Complete any required experience hours', y);
  y = addNumberedItem(doc, 3, 'Pass the required examination(s)', y);
  y = addNumberedItem(doc, 4, 'Submit application with fees and background check', y);
  y = addNumberedItem(doc, 5, 'Maintain license through continuing education and renewals', y);
  
  // Page 7: Industry-Specific
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Industry-Specific Permits', y);
  
  y = addParagraph(doc, `Certain industries have specialized permit requirements beyond general business licenses. Here are the most common industry-specific requirements:`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Food & Beverage', y);
  
  y = addBulletPoint(doc, 'Food Handler\'s Permit: Required for all employees handling food.', y);
  y = addBulletPoint(doc, 'Food Establishment License: Health department approval to operate.', y);
  y = addBulletPoint(doc, 'Liquor License: Required to sell alcohol; often limited availability.', y);
  y = addBulletPoint(doc, 'Cottage Food Permit: For selling homemade food products (restrictions apply).', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Retail', y);
  
  y = addBulletPoint(doc, 'Seller\'s Permit/Sales Tax License: Required to collect sales tax.', y);
  y = addBulletPoint(doc, 'Resale Certificate: Allows purchasing inventory tax-free for resale.', y);
  y = addBulletPoint(doc, 'Weights and Measures: If selling by weight (grocery, etc.).', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Transportation', y);
  
  y = addBulletPoint(doc, 'USDOT Number: Required for commercial vehicles in interstate commerce.', y);
  y = addBulletPoint(doc, 'Motor Carrier (MC) Number: Required for for-hire carriers.', y);
  y = addBulletPoint(doc, 'Commercial Driver\'s License (CDL): For drivers of large vehicles.', y);
  y = addBulletPoint(doc, 'IFTA License: For interstate fuel tax reporting.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Childcare', y);
  
  y = addBulletPoint(doc, 'Childcare Facility License: Required for daycare centers and programs.', y);
  y = addBulletPoint(doc, 'Background Checks: Required for all staff working with children.', y);
  y = addBulletPoint(doc, 'CPR/First Aid Certification: Required for staff.', y);
  
  // Page 8: Sales Tax
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Sales Tax Registration', y);
  
  y = addParagraph(doc, `If you sell taxable goods or services, you'll need to register for sales tax collection in each state where you have "nexus." Understanding your sales tax obligations is critical for compliance.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'What Creates Sales Tax Nexus', y);
  
  y = addBulletPoint(doc, 'Physical Presence: Office, warehouse, store, employees, or inventory in a state.', y);
  y = addBulletPoint(doc, 'Economic Nexus: Exceeding sales thresholds (typically $100,000 or 200 transactions).', y);
  y = addBulletPoint(doc, 'Click-Through Nexus: Relationships with in-state affiliates driving sales.', y);
  y = addBulletPoint(doc, 'Marketplace Nexus: Selling through platforms like Amazon may shift nexus.', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'States Without Sales Tax', y);
  
  y = addParagraph(doc, `These five states have no state sales tax:`, y);
  
  y = addBulletPoint(doc, 'Alaska (but localities may have local sales taxes)', y);
  y = addBulletPoint(doc, 'Delaware', y);
  y = addBulletPoint(doc, 'Montana', y);
  y = addBulletPoint(doc, 'New Hampshire', y);
  y = addBulletPoint(doc, 'Oregon', y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Registration Process', y);
  
  y = addNumberedItem(doc, 1, 'Determine which states you have nexus in', y);
  y = addNumberedItem(doc, 2, 'Register with each state\'s Department of Revenue', y);
  y = addNumberedItem(doc, 3, 'Obtain your Sales Tax Permit/Certificate of Authority', y);
  y = addNumberedItem(doc, 4, 'Configure your point-of-sale to collect proper rates', y);
  y = addNumberedItem(doc, 5, 'File and remit sales tax on the required schedule', y);
  
  y += 5;
  y = addTipBox(doc, '💻 Sales Tax Software', 'Consider using sales tax automation software like Avalara, TaxJar, or similar services. These tools automatically calculate rates, track nexus, and file returns in multiple states.', y);
  
  // Page 9: Renewal Schedule
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Renewal Schedules and Deadlines', y);
  
  y = addParagraph(doc, `Keeping track of license renewals is essential. Operating with an expired license can result in penalties, business suspension, or loss of the ability to conduct business.`, y);
  
  y += 5;
  y = addSubsectionHeader(doc, 'Typical Renewal Frequencies', y);
  
  autoTable(doc, {
    startY: y,
    head: [['License Type', 'Typical Renewal', 'Notes']],
    body: [
      ['State Business License', 'Annual', 'Often tied to fiscal year or anniversary'],
      ['Local Business License', 'Annual', 'Usually January or anniversary date'],
      ['Professional License', '1-3 years', 'CE requirements often apply'],
      ['Sales Tax Permit', 'Varies', 'Some states require periodic renewal'],
      ['Health Department Permit', 'Annual', 'Inspection may be required'],
      ['Fire Department Permit', 'Annual', 'Annual inspection typically required'],
      ['Contractor\'s License', '2-4 years', 'CE and insurance verification'],
      ['Liquor License', 'Annual', 'Often December 31 deadline'],
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
  
  y = addSubsectionHeader(doc, 'Renewal Best Practices', y);
  
  y = addBulletPoint(doc, 'Create a Calendar: Set up reminders 60 and 30 days before each deadline.', y);
  y = addBulletPoint(doc, 'Keep Contact Info Current: Ensure licensing agencies have your current address.', y);
  y = addBulletPoint(doc, 'Budget for Fees: Many renewals require payment of fees.', y);
  y = addBulletPoint(doc, 'Complete CE Early: Don\'t wait until the last minute for continuing education.', y);
  y = addBulletPoint(doc, 'Maintain Insurance: Many licenses require proof of current insurance.', y);
  y = addBulletPoint(doc, 'File Annual Reports: State business registrations require annual/biennial reports.', y);
  
  y += 5;
  y = addTipBox(doc, '📅 Let Us Help', 'EZ BIZ FILE SERVICE offers compliance monitoring services. We\'ll track your deadlines and remind you before renewals are due, ensuring you never miss a critical filing date.', y);
  
  // Master Checklist Page
  doc.addPage();
  addPageHeader(doc, 'License Checklist');
  y = marginTop + 10;
  
  y = addSectionHeader(doc, 'Master Business License Checklist', y);
  
  y = addParagraph(doc, `Use this checklist to track the licenses and permits your business needs:`, y);
  
  y += 5;
  
  const checklistItems = [
    'Federal licenses (if applicable to your industry)',
    'State business license (if required)',
    'State seller\'s permit / sales tax certificate',
    'State professional license (if applicable)',
    'City/county business license',
    'Zoning approval or permit',
    'Building permit (if renovating)',
    'Fire department permit',
    'Health department permit (if applicable)',
    'Sign permit',
    'Alarm permit (if applicable)',
    'Home occupation permit (if home-based)',
    'Employer registration (EIN, state withholding)',
    'Workers\' compensation insurance',
    'Business insurance (general liability)',
    'Industry-specific permits',
  ];
  
  checklistItems.forEach((item) => {
    y = checkNewPage(doc, y, 12);
    if (y === marginTop) {
      addPageHeader(doc, 'License Checklist');
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
  y = addParagraph(doc, `Need help determining which licenses apply to your specific business? Contact EZ BIZ FILE SERVICE for a personalized consultation.`, y);
  
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
