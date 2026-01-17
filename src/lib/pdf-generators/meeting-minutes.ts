import jsPDF from "jspdf";
import { addCoverPage, addHeader, addFooter, BRAND_COLORS } from "../pdf-utils";

export const generateMeetingMinutes = (): jsPDF => {
  const doc = new jsPDF();
  let currentPage = 1;

  // Cover Page
  addCoverPage(doc, "Meeting Minutes", "Template Document");
  
  // Organizational Meeting Minutes
  doc.addPage();
  currentPage++;
  addHeader(doc, "Organizational Meeting Minutes");
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  let y = 50;
  
  doc.setFont("helvetica", "bold");
  doc.text("MINUTES OF THE ORGANIZATIONAL MEETING", 20, y);
  y += 8;
  doc.text("OF THE BOARD OF DIRECTORS", 20, y);
  y += 15;
  
  doc.setFont("helvetica", "normal");
  doc.text("of", 95, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Corporation Name)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Meeting details
  doc.setFont("helvetica", "bold");
  doc.text("Date:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.line(35, y, 100, y);
  y += 12;
  
  doc.setFont("helvetica", "bold");
  doc.text("Time:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.line(35, y, 100, y);
  y += 12;
  
  doc.setFont("helvetica", "bold");
  doc.text("Place:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.line(35, y, 180, y);
  y += 20;
  
  // Present section
  doc.setFont("helvetica", "bold");
  doc.text("PRESENT:", 20, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  doc.text("The following directors were present at the meeting:", 20, y);
  y += 10;
  
  for (let i = 0; i < 4; i++) {
    doc.setDrawColor(...BRAND_COLORS.bronze);
    doc.line(25, y, 180, y);
    y += 12;
  }
  y += 10;
  
  // Call to Order
  doc.setFont("helvetica", "bold");
  doc.text("CALL TO ORDER:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const callText = doc.splitTextToSize(
    "The meeting was called to order by _________________ at _______ o'clock. It was determined that a quorum of directors was present and that the meeting was duly convened.",
    170
  );
  doc.text(callText, 20, y);
  
  addFooter(doc, currentPage);

  // Organizational Meeting continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Organizational Meeting Minutes (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Election of Officers
  doc.setFont("helvetica", "bold");
  doc.text("ELECTION OF OFFICERS:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const electionText = doc.splitTextToSize(
    "Upon motion duly made, seconded, and unanimously carried, the following persons were elected to serve as officers of the Corporation until the next annual meeting of shareholders:",
    170
  );
  doc.text(electionText, 20, y);
  y += electionText.length * 6 + 10;
  
  // Officer positions
  const officers = [
    { position: "President", name: "" },
    { position: "Vice President", name: "" },
    { position: "Secretary", name: "" },
    { position: "Treasurer", name: "" }
  ];
  
  officers.forEach((officer) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${officer.position}:`, 25, y);
    doc.setDrawColor(...BRAND_COLORS.bronze);
    doc.line(70, y, 180, y);
    y += 12;
  });
  y += 10;
  
  // Banking Resolution
  doc.setFont("helvetica", "bold");
  doc.text("BANKING RESOLUTION:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const bankingText = doc.splitTextToSize(
    "Upon motion duly made, seconded, and unanimously carried, it was RESOLVED that the Corporation open a business checking account at:",
    170
  );
  doc.text(bankingText, 20, y);
  y += bankingText.length * 6 + 8;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Bank Name and Address)", 85, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  const signatoryText = doc.splitTextToSize(
    "and that the following officers be authorized as signatories on the account:",
    170
  );
  doc.text(signatoryText, 20, y);
  y += signatoryText.length * 6 + 8;
  
  for (let i = 0; i < 2; i++) {
    doc.line(25, y, 180, y);
    y += 12;
  }
  
  addFooter(doc, currentPage);

  // Organizational Meeting continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Organizational Meeting Minutes (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Fiscal Year
  doc.setFont("helvetica", "bold");
  doc.text("FISCAL YEAR:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("Upon motion duly made, seconded, and unanimously carried, it was RESOLVED", 20, y);
  y += 6;
  doc.text("that the fiscal year of the Corporation shall end on:", 20, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Month and Day)", 50, y + 4);
  y += 20;
  
  // Stock Issuance
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("ISSUANCE OF STOCK:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const stockText = doc.splitTextToSize(
    "Upon motion duly made, seconded, and unanimously carried, it was RESOLVED that the Corporation issue the following shares of stock:",
    170
  );
  doc.text(stockText, 20, y);
  y += stockText.length * 6 + 10;
  
  // Stock table
  doc.setDrawColor(...BRAND_COLORS.navy);
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y, 170, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Shareholder Name", 25, y + 7);
  doc.text("Shares", 100, y + 7);
  doc.text("Consideration", 140, y + 7);
  y += 10;
  
  for (let i = 0; i < 4; i++) {
    doc.rect(20, y, 170, 12);
    doc.line(95, y, 95, y + 12);
    doc.line(135, y, 135, y + 12);
    y += 12;
  }
  y += 15;
  
  // S Corporation Election
  doc.setFont("helvetica", "bold");
  doc.text("S CORPORATION ELECTION (if applicable):", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.rect(25, y - 4, 5, 5);
  doc.text("Upon motion duly made, seconded, and unanimously carried, it was", 35, y);
  y += 6;
  doc.text("RESOLVED that the Corporation elect to be treated as an S Corporation", 35, y);
  y += 6;
  doc.text("for federal income tax purposes by filing IRS Form 2553.", 35, y);
  
  addFooter(doc, currentPage);

  // Annual Meeting Minutes Template
  doc.addPage();
  currentPage++;
  addHeader(doc, "Annual Meeting Minutes Template");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("MINUTES OF THE ANNUAL MEETING OF SHAREHOLDERS", 20, y);
  y += 15;
  
  doc.setFont("helvetica", "normal");
  doc.text("of", 95, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Corporation Name)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Meeting details
  doc.setFont("helvetica", "bold");
  doc.text("Date:", 20, y);
  doc.line(35, y, 100, y);
  doc.text("Time:", 110, y);
  doc.line(125, y, 180, y);
  y += 12;
  
  doc.text("Place:", 20, y);
  doc.line(35, y, 180, y);
  y += 15;
  
  // Shareholders Present
  doc.text("SHAREHOLDERS PRESENT:", 20, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(...BRAND_COLORS.navy);
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y, 170, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Name", 25, y + 7);
  doc.text("Shares", 100, y + 7);
  doc.text("In Person / Proxy", 140, y + 7);
  y += 10;
  
  for (let i = 0; i < 4; i++) {
    doc.rect(20, y, 170, 10);
    doc.line(95, y, 95, y + 10);
    doc.line(135, y, 135, y + 10);
    y += 10;
  }
  y += 15;
  
  // Quorum
  doc.setFont("helvetica", "bold");
  doc.text("QUORUM:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const quorumText = doc.splitTextToSize(
    "The Secretary reported that shareholders representing _____ shares were present in person or by proxy, constituting a quorum for the transaction of business.",
    170
  );
  doc.text(quorumText, 20, y);
  
  addFooter(doc, currentPage);

  // Annual Meeting continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Annual Meeting Minutes (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Previous Minutes
  doc.setFont("helvetica", "bold");
  doc.text("APPROVAL OF PREVIOUS MINUTES:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const prevMinText = doc.splitTextToSize(
    "Upon motion duly made, seconded, and unanimously carried, the minutes of the previous annual meeting were approved as presented.",
    170
  );
  doc.text(prevMinText, 20, y);
  y += prevMinText.length * 6 + 10;
  
  // Financial Report
  doc.setFont("helvetica", "bold");
  doc.text("FINANCIAL REPORT:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const finText = doc.splitTextToSize(
    "The Treasurer presented the financial report for the fiscal year, showing:",
    170
  );
  doc.text(finText, 20, y);
  y += finText.length * 6 + 8;
  
  doc.text("Total Revenue: $", 25, y);
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(70, y, 130, y);
  y += 10;
  
  doc.text("Total Expenses: $", 25, y);
  doc.line(72, y, 130, y);
  y += 10;
  
  doc.text("Net Income: $", 25, y);
  doc.line(60, y, 130, y);
  y += 15;
  
  // Election of Directors
  doc.setFont("helvetica", "bold");
  doc.text("ELECTION OF DIRECTORS:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const dirText = doc.splitTextToSize(
    "The following persons were nominated and elected to serve as directors until the next annual meeting:",
    170
  );
  doc.text(dirText, 20, y);
  y += dirText.length * 6 + 8;
  
  for (let i = 0; i < 4; i++) {
    doc.line(25, y, 180, y);
    y += 10;
  }
  y += 10;
  
  // Other Business
  doc.setFont("helvetica", "bold");
  doc.text("OTHER BUSINESS:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.rect(20, y, 170, 30);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Describe any other business discussed)", 70, y + 15);
  
  addFooter(doc, currentPage);

  // Special Meeting Minutes Template
  doc.addPage();
  currentPage++;
  addHeader(doc, "Special Meeting Minutes Template");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("MINUTES OF A SPECIAL MEETING OF THE BOARD OF DIRECTORS", 20, y);
  y += 15;
  
  doc.setFont("helvetica", "normal");
  doc.text("of", 95, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Corporation Name)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Meeting details
  doc.setFont("helvetica", "bold");
  doc.text("Date:", 20, y);
  doc.line(35, y, 100, y);
  doc.text("Time:", 110, y);
  doc.line(125, y, 180, y);
  y += 12;
  
  doc.text("Place:", 20, y);
  doc.line(35, y, 180, y);
  y += 15;
  
  // Purpose
  doc.text("PURPOSE OF MEETING:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.rect(20, y, 170, 25);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(State the specific purpose for which the meeting was called)", 50, y + 12);
  y += 35;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Notice
  doc.setFont("helvetica", "bold");
  doc.text("NOTICE:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const noticeText = doc.splitTextToSize(
    "Notice of the meeting was duly given to all directors at least two (2) days prior to the meeting, or notice was waived by all directors.",
    170
  );
  doc.text(noticeText, 20, y);
  y += noticeText.length * 6 + 10;
  
  // Directors Present
  doc.setFont("helvetica", "bold");
  doc.text("DIRECTORS PRESENT:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  for (let i = 0; i < 3; i++) {
    doc.setDrawColor(...BRAND_COLORS.bronze);
    doc.line(25, y, 180, y);
    y += 10;
  }
  
  addFooter(doc, currentPage);

  // Special Meeting continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Special Meeting Minutes (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  // Resolutions
  doc.setFont("helvetica", "bold");
  doc.text("RESOLUTIONS ADOPTED:", 20, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  const resText = "Upon motion duly made, seconded, and unanimously carried, the following resolution was adopted:";
  doc.text(resText, 20, y);
  y += 12;
  
  doc.setFont("helvetica", "bold");
  doc.text("RESOLVED, that", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.rect(20, y, 170, 50);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(State the resolution in detail)", 75, y + 25);
  y += 65;
  
  // Adjournment
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("ADJOURNMENT:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("There being no further business, the meeting was adjourned at _______ o'clock.", 20, y);
  y += 25;
  
  // Signature
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("Secretary", 55, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.text("Date:", 20, y);
  doc.line(35, y, 100, y);
  
  addFooter(doc, currentPage);

  // Written Consent in Lieu of Meeting
  doc.addPage();
  currentPage++;
  addHeader(doc, "Written Consent in Lieu of Meeting");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("UNANIMOUS WRITTEN CONSENT OF THE BOARD OF DIRECTORS", 20, y);
  y += 8;
  doc.text("IN LIEU OF A MEETING", 20, y);
  y += 15;
  
  doc.setFont("helvetica", "normal");
  doc.text("of", 95, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Corporation Name)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  const consentIntro = doc.splitTextToSize(
    "The undersigned, being all of the directors of the above-named Corporation, hereby consent to and adopt the following resolutions without a meeting, pursuant to the Bylaws of the Corporation and applicable state law:",
    170
  );
  doc.text(consentIntro, 20, y);
  y += consentIntro.length * 6 + 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("RESOLVED, that", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.rect(20, y, 170, 40);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(State the resolution)", 80, y + 20);
  y += 55;
  
  // Signature blocks
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("DIRECTORS:", 20, y);
  y += 12;
  
  for (let i = 1; i <= 3; i++) {
    doc.setDrawColor(...BRAND_COLORS.bronze);
    doc.line(20, y, 100, y);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND_COLORS.bronze);
    doc.text("Signature", 55, y + 4);
    
    doc.line(120, y, 180, y);
    doc.text("Date", 145, y + 4);
    y += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.line(20, y, 100, y);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND_COLORS.bronze);
    doc.text("Print Name", 55, y + 4);
    y += 18;
    
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_COLORS.text);
  }
  
  addFooter(doc, currentPage);

  return doc;
};
