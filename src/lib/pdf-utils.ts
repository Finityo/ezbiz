import jsPDF from 'jspdf';

// Brand colors in RGB format for jsPDF
export const PDF_COLORS = {
  slateNavy: { r: 42, g: 53, b: 71 },
  warmBronze: { r: 196, g: 154, b: 90 },
  warmWhite: { r: 250, g: 249, b: 246 },
  lightGray: { r: 245, g: 244, b: 241 },
  darkText: { r: 30, g: 30, b: 30 },
  mediumText: { r: 100, g: 100, b: 100 },
};

// PDF dimensions and margins
export const PDF_LAYOUT = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  marginLeft: 20,
  marginRight: 20,
  marginTop: 25,
  marginBottom: 20,
  contentWidth: 170, // pageWidth - marginLeft - marginRight
};

// Font sizes
export const PDF_FONTS = {
  title: 28,
  subtitle: 16,
  h1: 20,
  h2: 16,
  h3: 14,
  body: 11,
  small: 9,
  footer: 8,
};

// Set color helper
export const setColor = (doc: jsPDF, color: { r: number; g: number; b: number }) => {
  doc.setTextColor(color.r, color.g, color.b);
};

export const setFillColor = (doc: jsPDF, color: { r: number; g: number; b: number }) => {
  doc.setFillColor(color.r, color.g, color.b);
};

export const setDrawColor = (doc: jsPDF, color: { r: number; g: number; b: number }) => {
  doc.setDrawColor(color.r, color.g, color.b);
};

// Add page number and footer
export const addFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
  const { pageWidth, pageHeight, marginLeft, marginBottom } = PDF_LAYOUT;
  
  // Bronze line above footer
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, pageHeight - marginBottom - 5, pageWidth - marginLeft, pageHeight - marginBottom - 5);
  
  // Footer text
  doc.setFontSize(PDF_FONTS.footer);
  setColor(doc, PDF_COLORS.mediumText);
  doc.setFont('helvetica', 'normal');
  
  // Left side - company name
  doc.text('EZ BIZ FILE SERVICE', marginLeft, pageHeight - marginBottom);
  
  // Center - website
  const websiteText = 'ezbiz-fs.com';
  const websiteWidth = doc.getTextWidth(websiteText);
  doc.text(websiteText, (pageWidth - websiteWidth) / 2, pageHeight - marginBottom);
  
  // Right side - page number
  const pageText = `Page ${pageNum} of ${totalPages}`;
  const pageTextWidth = doc.getTextWidth(pageText);
  doc.text(pageText, pageWidth - marginLeft - pageTextWidth, pageHeight - marginBottom);
};

// Add section header with bronze accent
export const addSectionHeader = (doc: jsPDF, text: string, y: number): number => {
  const { marginLeft, contentWidth } = PDF_LAYOUT;
  
  // Section title
  doc.setFontSize(PDF_FONTS.h1);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.slateNavy);
  doc.text(text, marginLeft, y);
  
  // Bronze underline
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.setLineWidth(1);
  doc.line(marginLeft, y + 3, marginLeft + contentWidth, y + 3);
  
  return y + 12; // Return new Y position
};

// Add subsection header
export const addSubsectionHeader = (doc: jsPDF, text: string, y: number): number => {
  const { marginLeft } = PDF_LAYOUT;
  
  doc.setFontSize(PDF_FONTS.h2);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.slateNavy);
  doc.text(text, marginLeft, y);
  
  return y + 8;
};

// Add paragraph text with word wrap
export const addParagraph = (doc: jsPDF, text: string, y: number, options?: { indent?: number }): number => {
  const { marginLeft, contentWidth } = PDF_LAYOUT;
  const indent = options?.indent || 0;
  
  doc.setFontSize(PDF_FONTS.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.darkText);
  
  const lines = doc.splitTextToSize(text, contentWidth - indent);
  doc.text(lines, marginLeft + indent, y);
  
  return y + (lines.length * 5) + 3;
};

// Add bullet point
export const addBulletPoint = (doc: jsPDF, text: string, y: number): number => {
  const { marginLeft, contentWidth } = PDF_LAYOUT;
  
  doc.setFontSize(PDF_FONTS.body);
  doc.setFont('helvetica', 'normal');
  
  // Bronze bullet
  setFillColor(doc, PDF_COLORS.warmBronze);
  doc.circle(marginLeft + 3, y - 1.5, 1.5, 'F');
  
  // Text
  setColor(doc, PDF_COLORS.darkText);
  const lines = doc.splitTextToSize(text, contentWidth - 12);
  doc.text(lines, marginLeft + 10, y);
  
  return y + (lines.length * 5) + 2;
};

// Add numbered item
export const addNumberedItem = (doc: jsPDF, num: number, text: string, y: number): number => {
  const { marginLeft, contentWidth } = PDF_LAYOUT;
  
  doc.setFontSize(PDF_FONTS.body);
  
  // Number in bronze
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text(`${num}.`, marginLeft, y);
  
  // Text
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.darkText);
  const lines = doc.splitTextToSize(text, contentWidth - 12);
  doc.text(lines, marginLeft + 10, y);
  
  return y + (lines.length * 5) + 3;
};

// Add tip/callout box
export const addTipBox = (doc: jsPDF, title: string, text: string, y: number): number => {
  const { marginLeft, contentWidth } = PDF_LAYOUT;
  
  doc.setFontSize(PDF_FONTS.body);
  const lines = doc.splitTextToSize(text, contentWidth - 20);
  const boxHeight = (lines.length * 5) + 15;
  
  // Background
  setFillColor(doc, { r: 250, g: 245, b: 235 }); // Light bronze tint
  doc.rect(marginLeft, y - 5, contentWidth, boxHeight, 'F');
  
  // Left border accent
  setFillColor(doc, PDF_COLORS.warmBronze);
  doc.rect(marginLeft, y - 5, 3, boxHeight, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text(title, marginLeft + 8, y + 2);
  
  // Text
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.darkText);
  doc.text(lines, marginLeft + 8, y + 10);
  
  return y + boxHeight + 5;
};

// Check if we need a new page
export const checkNewPage = (doc: jsPDF, currentY: number, neededSpace: number = 30): number => {
  const { pageHeight, marginBottom, marginTop } = PDF_LAYOUT;
  
  if (currentY + neededSpace > pageHeight - marginBottom) {
    doc.addPage();
    return marginTop;
  }
  
  return currentY;
};

// Add cover page
export const addCoverPage = (doc: jsPDF, title: string, subtitle: string) => {
  const { pageWidth, pageHeight } = PDF_LAYOUT;
  
  // Full page slate navy background
  setFillColor(doc, PDF_COLORS.slateNavy);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Decorative bronze line at top
  setFillColor(doc, PDF_COLORS.warmBronze);
  doc.rect(0, 40, pageWidth, 2, 'F');
  
  // Title
  doc.setFontSize(PDF_FONTS.title);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.warmWhite);
  
  const titleLines = doc.splitTextToSize(title, 160);
  const titleY = pageHeight / 2 - 20;
  titleLines.forEach((line: string, index: number) => {
    const titleWidth = doc.getTextWidth(line);
    doc.text(line, (pageWidth - titleWidth) / 2, titleY + (index * 12));
  });
  
  // Decorative bronze line
  setFillColor(doc, PDF_COLORS.warmBronze);
  const lineY = titleY + (titleLines.length * 12) + 10;
  doc.rect(pageWidth / 2 - 40, lineY, 80, 1.5, 'F');
  
  // Subtitle
  doc.setFontSize(PDF_FONTS.subtitle);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.warmBronze);
  
  const subtitleLines = doc.splitTextToSize(subtitle, 140);
  subtitleLines.forEach((line: string, index: number) => {
    const subtitleWidth = doc.getTextWidth(line);
    doc.text(line, (pageWidth - subtitleWidth) / 2, lineY + 15 + (index * 8));
  });
  
  // Company name at bottom
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.warmWhite);
  const companyName = 'EZ BIZ FILE SERVICE';
  const companyWidth = doc.getTextWidth(companyName);
  doc.text(companyName, (pageWidth - companyWidth) / 2, pageHeight - 50);
  
  // Website
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.warmBronze);
  const website = 'ezbiz-fs.com';
  const websiteWidth = doc.getTextWidth(website);
  doc.text(website, (pageWidth - websiteWidth) / 2, pageHeight - 40);
  
  // Decorative bronze line at bottom
  setFillColor(doc, PDF_COLORS.warmBronze);
  doc.rect(0, pageHeight - 25, pageWidth, 2, 'F');
};

// Add header for content pages
export const addPageHeader = (doc: jsPDF, documentTitle: string) => {
  const { marginLeft, pageWidth, marginRight } = PDF_LAYOUT;
  
  // Company name
  doc.setFontSize(PDF_FONTS.small);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text('EZ BIZ FILE SERVICE', marginLeft, 12);
  
  // Document title on the right
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.mediumText);
  const titleWidth = doc.getTextWidth(documentTitle);
  doc.text(documentTitle, pageWidth - marginRight - titleWidth, 12);
  
  // Thin line under header
  setDrawColor(doc, PDF_COLORS.lightGray);
  doc.setLineWidth(0.3);
  doc.line(marginLeft, 16, pageWidth - marginRight, 16);
};

// Add about page (last page)
export const addAboutPage = (doc: jsPDF) => {
  doc.addPage();
  
  const { marginLeft, pageWidth, pageHeight, contentWidth, marginTop } = PDF_LAYOUT;
  let y = marginTop + 20;
  
  // Title
  doc.setFontSize(PDF_FONTS.h1);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.slateNavy);
  const title = 'About EZ BIZ FILE SERVICE';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, y);
  
  // Bronze line
  setFillColor(doc, PDF_COLORS.warmBronze);
  doc.rect((pageWidth - 60) / 2, y + 5, 60, 1.5, 'F');
  
  y += 25;
  
  // Description
  const aboutText = `EZ BIZ FILE SERVICE combines old-fashioned integrity with modern efficiency to help entrepreneurs and business owners navigate the complexities of business formation. Our team of experienced professionals has helped thousands of businesses get started on the right foot.

We believe that starting a business should be simple, transparent, and affordable. That's why we offer straightforward pricing with no hidden fees, expert guidance at every step, and a commitment to getting your filings done right the first time.

Whether you're forming an LLC, incorporating a business, or need ongoing compliance support, we're here to help you succeed.`;
  
  doc.setFontSize(PDF_FONTS.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.darkText);
  
  const lines = doc.splitTextToSize(aboutText, contentWidth - 20);
  doc.text(lines, marginLeft + 10, y);
  
  y += lines.length * 5 + 20;
  
  // Services box
  setFillColor(doc, PDF_COLORS.lightGray);
  doc.rect(marginLeft, y - 5, contentWidth, 50, 'F');
  
  doc.setFontSize(PDF_FONTS.h3);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.slateNavy);
  doc.text('Our Services Include:', marginLeft + 10, y + 5);
  
  const services = [
    'LLC Formation & Registration',
    'Corporation Formation (C-Corp, S-Corp)',
    'Registered Agent Services',
    'Operating Agreements & Bylaws',
    'EIN/Tax ID Applications',
    'Annual Report Filing',
  ];
  
  doc.setFontSize(PDF_FONTS.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.darkText);
  
  let serviceY = y + 15;
  services.forEach((service, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const xPos = marginLeft + 10 + (col * 85);
    setFillColor(doc, PDF_COLORS.warmBronze);
    doc.circle(xPos + 2, serviceY + (row * 8) - 1.5, 1, 'F');
    setColor(doc, PDF_COLORS.darkText);
    doc.text(service, xPos + 7, serviceY + (row * 8));
  });
  
  y += 70;
  
  // CTA Box
  setFillColor(doc, PDF_COLORS.slateNavy);
  doc.rect(marginLeft, y, contentWidth, 35, 'F');
  
  doc.setFontSize(PDF_FONTS.h2);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.warmWhite);
  const ctaTitle = 'Ready to Start Your Business?';
  const ctaTitleWidth = doc.getTextWidth(ctaTitle);
  doc.text(ctaTitle, (pageWidth - ctaTitleWidth) / 2, y + 12);
  
  doc.setFontSize(PDF_FONTS.body);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.warmBronze);
  const ctaText = 'Visit ezbiz-fs.com or call us today for a free consultation';
  const ctaTextWidth = doc.getTextWidth(ctaText);
  doc.text(ctaText, (pageWidth - ctaTextWidth) / 2, y + 24);
  
  // Footer
  setFillColor(doc, PDF_COLORS.warmBronze);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setFontSize(PDF_FONTS.small);
  doc.setFont('helvetica', 'normal');
  setColor(doc, PDF_COLORS.slateNavy);
  const copyright = `© ${new Date().getFullYear()} EZ BIZ FILE SERVICE. All rights reserved.`;
  const copyrightWidth = doc.getTextWidth(copyright);
  doc.text(copyright, (pageWidth - copyrightWidth) / 2, pageHeight - 8);
};

// Create a new document with standard settings
export const createDocument = (): jsPDF => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
};

// Add table of contents
export const addTableOfContents = (
  doc: jsPDF, 
  items: Array<{ title: string; page: number }>
): number => {
  const { marginLeft, contentWidth } = PDF_LAYOUT;
  let y = 50;
  
  // Title
  doc.setFontSize(PDF_FONTS.h1);
  doc.setFont('helvetica', 'bold');
  setColor(doc, PDF_COLORS.slateNavy);
  doc.text('Table of Contents', marginLeft, y);
  
  // Bronze underline
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.setLineWidth(1);
  doc.line(marginLeft, y + 3, marginLeft + 60, y + 3);
  
  y += 20;
  
  items.forEach((item) => {
    doc.setFontSize(PDF_FONTS.body);
    doc.setFont('helvetica', 'normal');
    setColor(doc, PDF_COLORS.darkText);
    doc.text(item.title, marginLeft, y);
    
    // Page number aligned right
    const pageText = String(item.page);
    const pageWidth = doc.getTextWidth(pageText);
    doc.text(pageText, marginLeft + contentWidth - pageWidth, y);
    
    // Dotted line between title and page
    setDrawColor(doc, PDF_COLORS.mediumText);
    const titleWidth = doc.getTextWidth(item.title);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(marginLeft + titleWidth + 5, y - 1, marginLeft + contentWidth - pageWidth - 5, y - 1);
    doc.setLineDashPattern([], 0);
    
    y += 8;
  });
  
  return y;
};
