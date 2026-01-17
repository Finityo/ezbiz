import jsPDF from "jspdf";
import { addCoverPage, addHeader, addFooter, BRAND_COLORS, addTableOfContents } from "../pdf-utils";

export const generateCorporateBylaws = (): jsPDF => {
  const doc = new jsPDF();
  let currentPage = 1;

  // Cover Page
  addCoverPage(doc, "Corporate Bylaws", "Template Document");
  
  // Table of Contents
  doc.addPage();
  currentPage++;
  addHeader(doc, "Table of Contents");
  
  const tocItems = [
    { title: "Article I: Offices", page: 3 },
    { title: "Article II: Shareholders", page: 3 },
    { title: "Article III: Board of Directors", page: 5 },
    { title: "Article IV: Officers", page: 7 },
    { title: "Article V: Stock Certificates", page: 9 },
    { title: "Article VI: Corporate Records", page: 10 },
    { title: "Article VII: Indemnification", page: 11 },
    { title: "Article VIII: Amendments", page: 12 },
    { title: "Adoption Certificate", page: 13 },
  ];
  
  addTableOfContents(doc, tocItems);
  addFooter(doc, currentPage);

  // Article I: Offices
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article I: Offices");
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  let y = 50;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 1.1 - Principal Office", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The principal office of the Corporation shall be located at:", 20, y);
  y += 10;
  
  // Fillable fields
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Street Address)", 90, y + 4);
  y += 15;
  
  doc.line(20, y, 80, y);
  doc.text("(City)", 45, y + 4);
  
  doc.line(90, y, 130, y);
  doc.text("(State)", 105, y + 4);
  
  doc.line(140, y, 180, y);
  doc.text("(ZIP Code)", 155, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("Section 1.2 - Other Offices", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const otherOfficesText = doc.splitTextToSize(
    "The Corporation may have such other offices, either within or without the State of incorporation, as the Board of Directors may designate or as the business of the Corporation may require from time to time.",
    170
  );
  doc.text(otherOfficesText, 20, y);
  y += otherOfficesText.length * 6 + 15;
  
  // Article II begins on same page
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_COLORS.navy);
  doc.text("ARTICLE II: SHAREHOLDERS", 20, y);
  y += 12;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("Section 2.1 - Annual Meeting", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The annual meeting of shareholders shall be held on:", 20, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 120, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Day and Month - e.g., \"the third Tuesday of March\")", 30, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.text("at the hour of:", 20, y);
  doc.line(55, y, 100, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Time)", 72, y + 4);
  
  addFooter(doc, currentPage);

  // Article II continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article II: Shareholders (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 2.2 - Special Meetings", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const specialMeetingsText = doc.splitTextToSize(
    "Special meetings of the shareholders may be called by the President, by the Board of Directors, or by shareholders holding not less than one-tenth of the shares entitled to vote at such meeting.",
    170
  );
  doc.text(specialMeetingsText, 20, y);
  y += specialMeetingsText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 2.3 - Notice of Meetings", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const noticeText = doc.splitTextToSize(
    "Written notice stating the place, day, and hour of the meeting shall be delivered not less than ten (10) nor more than sixty (60) days before the date of the meeting, either personally or by mail, to each shareholder of record entitled to vote at such meeting.",
    170
  );
  doc.text(noticeText, 20, y);
  y += noticeText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 2.4 - Quorum", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const quorumText = doc.splitTextToSize(
    "A majority of the outstanding shares entitled to vote, represented in person or by proxy, shall constitute a quorum at any meeting of shareholders. If a quorum is present, the affirmative vote of the majority of the shares represented shall be the act of the shareholders.",
    170
  );
  doc.text(quorumText, 20, y);
  y += quorumText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 2.5 - Voting", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const votingText = doc.splitTextToSize(
    "Each outstanding share shall be entitled to one vote on each matter submitted to a vote at a meeting of shareholders. A shareholder may vote either in person or by proxy executed in writing by the shareholder.",
    170
  );
  doc.text(votingText, 20, y);
  
  addFooter(doc, currentPage);

  // Article III: Board of Directors
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article III: Board of Directors");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.1 - General Powers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const powersText = doc.splitTextToSize(
    "The business and affairs of the Corporation shall be managed by its Board of Directors, which may exercise all corporate powers and do all lawful acts and things that are not prohibited by law, the Articles of Incorporation, or these Bylaws.",
    170
  );
  doc.text(powersText, 20, y);
  y += powersText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.2 - Number and Term", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The number of directors shall be:", 20, y);
  y += 8;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 50, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Number)", 30, y + 4);
  y += 12;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  const termText = doc.splitTextToSize(
    "Directors shall be elected at the annual meeting of shareholders and shall hold office until the next annual meeting and until their successors are elected and qualified.",
    170
  );
  doc.text(termText, 20, y);
  y += termText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.3 - Initial Directors", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The initial Directors of the Corporation shall be:", 20, y);
  y += 12;
  
  // Director table
  doc.setDrawColor(...BRAND_COLORS.navy);
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y, 170, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Director Name", 25, y + 7);
  doc.text("Address", 100, y + 7);
  y += 10;
  
  for (let i = 0; i < 5; i++) {
    doc.rect(20, y, 170, 12);
    doc.line(95, y, 95, y + 12);
    y += 12;
  }
  
  addFooter(doc, currentPage);

  // Article III continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article III: Board of Directors (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.4 - Regular Meetings", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const regularText = doc.splitTextToSize(
    "Regular meetings of the Board of Directors may be held without notice at such time and place as shall from time to time be determined by the Board.",
    170
  );
  doc.text(regularText, 20, y);
  y += regularText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.5 - Special Meetings", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const specialText = doc.splitTextToSize(
    "Special meetings of the Board may be called by the President or any two directors on at least two days' notice to each director.",
    170
  );
  doc.text(specialText, 20, y);
  y += specialText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.6 - Quorum", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const boardQuorumText = doc.splitTextToSize(
    "A majority of the directors shall constitute a quorum for the transaction of business. The act of the majority of the directors present at a meeting at which a quorum is present shall be the act of the Board of Directors.",
    170
  );
  doc.text(boardQuorumText, 20, y);
  y += boardQuorumText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 3.7 - Compensation", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const compText = doc.splitTextToSize(
    "Directors may receive such compensation for their services as may be determined by resolution of the Board. Directors may also be reimbursed for expenses incurred in attending meetings.",
    170
  );
  doc.text(compText, 20, y);
  
  addFooter(doc, currentPage);

  // Article IV: Officers
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article IV: Officers");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 4.1 - Officers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const officersText = doc.splitTextToSize(
    "The officers of the Corporation shall consist of a President, a Secretary, and a Treasurer, each of whom shall be elected by the Board of Directors. The Board may also elect such other officers as it may deem necessary.",
    170
  );
  doc.text(officersText, 20, y);
  y += officersText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 4.2 - Initial Officers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The initial officers of the Corporation shall be:", 20, y);
  y += 12;
  
  // Officer positions
  const officerPositions = ["President", "Vice President", "Secretary", "Treasurer"];
  
  officerPositions.forEach((position) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${position}:`, 20, y);
    doc.setDrawColor(...BRAND_COLORS.bronze);
    doc.line(65, y, 180, y);
    y += 12;
  });
  y += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 4.3 - President", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const presidentText = doc.splitTextToSize(
    "The President shall be the principal executive officer of the Corporation. The President shall preside at all meetings of the shareholders and the Board of Directors and shall have general supervision of the business of the Corporation.",
    170
  );
  doc.text(presidentText, 20, y);
  
  addFooter(doc, currentPage);

  // Article IV continued
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article IV: Officers (continued)");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 4.4 - Secretary", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const secretaryText = doc.splitTextToSize(
    "The Secretary shall keep the minutes of all meetings of shareholders and directors; give all notices; have custody of the corporate seal; and maintain all corporate records. The Secretary shall perform such other duties as may be assigned by the President or the Board.",
    170
  );
  doc.text(secretaryText, 20, y);
  y += secretaryText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 4.5 - Treasurer", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const treasurerText = doc.splitTextToSize(
    "The Treasurer shall have charge and custody of all funds of the Corporation; maintain accurate financial records; deposit all moneys in the name of the Corporation; and render financial statements to the Board as required.",
    170
  );
  doc.text(treasurerText, 20, y);
  y += treasurerText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 4.6 - Removal", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const removalText = doc.splitTextToSize(
    "Any officer may be removed by the Board of Directors whenever in its judgment the best interests of the Corporation would be served thereby.",
    170
  );
  doc.text(removalText, 20, y);
  
  addFooter(doc, currentPage);

  // Article V: Stock Certificates
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article V: Stock Certificates");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 5.1 - Certificates", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const certText = doc.splitTextToSize(
    "Certificates representing shares of the Corporation shall be signed by the President and the Secretary and shall be sealed with the corporate seal. Each certificate shall state the name of the Corporation, that it is organized under the laws of the State of incorporation, the name of the person to whom issued, and the number and class of shares represented.",
    170
  );
  doc.text(certText, 20, y);
  y += certText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 5.2 - Authorized Shares", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Corporation is authorized to issue:", 20, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 80, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Number)", 45, y + 4);
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.text("shares of Common Stock, par value $", 85, y);
  doc.line(175, y, 190, y);
  y += 15;
  
  doc.line(20, y, 80, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Number)", 45, y + 4);
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.text("shares of Preferred Stock, par value $", 85, y);
  doc.line(180, y, 190, y);
  y += 20;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 5.3 - Transfer of Shares", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const transferText = doc.splitTextToSize(
    "Shares of stock shall be transferable only on the books of the Corporation by the holder thereof in person or by attorney, upon surrender of the certificate representing such shares properly endorsed.",
    170
  );
  doc.text(transferText, 20, y);
  
  addFooter(doc, currentPage);

  // Article VI: Corporate Records
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article VI: Corporate Records");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 6.1 - Records to be Kept", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Corporation shall keep at its principal office:", 20, y);
  y += 10;
  
  const records = [
    "Minutes of all meetings of shareholders and directors",
    "A record of all actions taken by shareholders or directors without a meeting",
    "A record of all actions taken by a committee of the Board",
    "Appropriate accounting records",
    "A record of shareholders including names, addresses, and number of shares",
    "The Articles of Incorporation and all amendments thereto",
    "These Bylaws and all amendments thereto"
  ];
  
  records.forEach((record, index) => {
    doc.text(`${index + 1}. ${record}`, 25, y);
    y += 8;
  });
  y += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 6.2 - Inspection of Records", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const inspectionText = doc.splitTextToSize(
    "Any shareholder may inspect and copy the corporate records upon written request and for any proper purpose.",
    170
  );
  doc.text(inspectionText, 20, y);
  
  addFooter(doc, currentPage);

  // Article VII: Indemnification
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article VII: Indemnification");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 7.1 - Indemnification of Directors and Officers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const indemnText = doc.splitTextToSize(
    "The Corporation shall indemnify any director or officer who was or is a party to any proceeding by reason of the fact that such person is or was a director or officer of the Corporation, against expenses, judgments, fines, and amounts paid in settlement actually and reasonably incurred, if such person acted in good faith and in a manner reasonably believed to be in the best interests of the Corporation.",
    170
  );
  doc.text(indemnText, 20, y);
  y += indemnText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 7.2 - Advancement of Expenses", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const advanceText = doc.splitTextToSize(
    "Expenses incurred by a director or officer in defending any proceeding may be paid by the Corporation in advance of the final disposition of such proceeding upon receipt of an undertaking to repay such amount if it shall be determined that such person is not entitled to indemnification.",
    170
  );
  doc.text(advanceText, 20, y);
  y += advanceText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 7.3 - Insurance", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const insuranceText = doc.splitTextToSize(
    "The Corporation may purchase and maintain insurance on behalf of any person who is or was a director, officer, employee, or agent of the Corporation against any liability asserted against such person.",
    170
  );
  doc.text(insuranceText, 20, y);
  
  addFooter(doc, currentPage);

  // Article VIII: Amendments
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article VIII: Amendments");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 8.1 - Amendment by Board", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const boardAmendText = doc.splitTextToSize(
    "These Bylaws may be altered, amended, or repealed, and new Bylaws may be adopted, by the Board of Directors at any regular or special meeting of the Board.",
    170
  );
  doc.text(boardAmendText, 20, y);
  y += boardAmendText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Section 8.2 - Amendment by Shareholders", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const shareAmendText = doc.splitTextToSize(
    "Shareholders may also alter, amend, or repeal these Bylaws at any annual or special meeting of shareholders, provided that notice of the proposed amendment is included in the notice of the meeting.",
    170
  );
  doc.text(shareAmendText, 20, y);
  
  addFooter(doc, currentPage);

  // Adoption Certificate
  doc.addPage();
  currentPage++;
  addHeader(doc, "Certificate of Adoption");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  const adoptionIntro = doc.splitTextToSize(
    "The undersigned, being all of the initial directors of the Corporation, hereby adopt the foregoing Bylaws as the Bylaws of the Corporation.",
    170
  );
  doc.text(adoptionIntro, 20, y);
  y += adoptionIntro.length * 6 + 10;
  
  doc.text("Corporation Name:", 20, y);
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(60, y, 180, y);
  y += 15;
  
  doc.text("Date of Adoption:", 20, y);
  doc.line(60, y, 120, y);
  y += 25;
  
  // Signature blocks
  doc.setFont("helvetica", "bold");
  doc.text("DIRECTORS:", 20, y);
  y += 15;
  
  for (let i = 1; i <= 5; i++) {
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
    y += 20;
    
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_COLORS.text);
  }
  
  addFooter(doc, currentPage);

  return doc;
};
