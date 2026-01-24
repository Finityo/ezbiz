import jsPDF from "jspdf";
import { 
  addCoverPage, 
  addPageHeader, 
  addFooter, 
  addTableOfContents,
  PDF_COLORS,
  PDF_LAYOUT,
  setColor,
  setDrawColor,
  setFillColor
} from "../pdf-utils";

export const generateLLCOperatingAgreement = (): jsPDF => {
  const doc = new jsPDF();
  const totalPages = 12;
  let currentPage = 1;

  // Cover Page
  addCoverPage(doc, "LLC Operating Agreement", "Template Document");
  
  // Table of Contents
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Table of Contents");
  
  const tocItems = [
    { title: "Article I: Formation", page: 3 },
    { title: "Article II: Name and Principal Office", page: 3 },
    { title: "Article III: Purpose", page: 4 },
    { title: "Article IV: Members", page: 4 },
    { title: "Article V: Capital Contributions", page: 5 },
    { title: "Article VI: Profits and Losses", page: 6 },
    { title: "Article VII: Management", page: 7 },
    { title: "Article VIII: Meetings", page: 8 },
    { title: "Article IX: Transfer of Interests", page: 9 },
    { title: "Article X: Dissolution", page: 10 },
    { title: "Article XI: General Provisions", page: 11 },
    { title: "Signature Page", page: 12 },
  ];
  
  addTableOfContents(doc, tocItems);
  addFooter(doc, currentPage, totalPages);

  // Article I: Formation
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article I: Formation");
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  let y = 50;
  
  doc.setFont("helvetica", "bold");
  doc.text("1.1 Formation", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const formationText = "This Limited Liability Company Operating Agreement (the \"Agreement\") is entered into as of:";
  doc.text(formationText, 20, y);
  y += 10;
  
  // Fillable field
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.setLineWidth(0.5);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Date)", 55, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.text("by and among the Members listed in Exhibit A attached hereto.", 20, y);
  y += 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("1.2 Articles of Organization", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const articlesText = doc.splitTextToSize(
    "The Company was formed by filing Articles of Organization with the Secretary of State of the State of:",
    170
  );
  doc.text(articlesText, 20, y);
  y += 10;
  
  // State fillable field
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(State of Formation)", 50, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.text("on the following date:", 20, y);
  y += 8;
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Filing Date)", 55, y + 4);
  
  addFooter(doc, currentPage, totalPages);

  // Article II: Name and Principal Office
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article II: Name and Principal Office");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("2.1 Name", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The name of the Company shall be:", 20, y);
  y += 10;
  
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Company Name, LLC)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.setFont("helvetica", "bold");
  doc.text("2.2 Principal Office", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The principal office of the Company shall be located at:", 20, y);
  y += 10;
  
  // Address fields
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Street Address)", 90, y + 4);
  y += 15;
  
  doc.line(20, y, 100, y);
  doc.text("(City)", 55, y + 4);
  
  doc.line(110, y, 140, y);
  doc.text("(State)", 120, y + 4);
  
  doc.line(150, y, 180, y);
  doc.text("(ZIP)", 160, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.setFont("helvetica", "bold");
  doc.text("2.3 Registered Agent", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Registered Agent for service of process shall be:", 20, y);
  y += 10;
  
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Registered Agent Name)", 85, y + 4);
  y += 15;
  
  doc.line(20, y, 180, y);
  doc.text("(Registered Agent Address)", 85, y + 4);
  
  addFooter(doc, currentPage, totalPages);

  // Article III: Purpose
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article III: Purpose");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("3.1 Purpose", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const purposeText = doc.splitTextToSize(
    "The Company is organized for the purpose of engaging in any lawful business activity for which a limited liability company may be organized under the laws of the State of formation, including but not limited to:",
    170
  );
  doc.text(purposeText, 20, y);
  y += purposeText.length * 6 + 10;
  
  // Purpose description field
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.rect(20, y, 170, 40);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Describe the primary business purpose)", 75, y + 20);
  y += 55;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.setFont("helvetica", "bold");
  doc.text("3.2 Powers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const powersText = doc.splitTextToSize(
    "The Company shall have all powers necessary and convenient to carry out its purposes, including the power to own, lease, and dispose of property; to enter into contracts; to borrow money and issue notes and other obligations; and to conduct any and all business activities permitted by law.",
    170
  );
  doc.text(powersText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article IV: Members
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article IV: Members");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("4.1 Initial Members", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The initial Members of the Company, their addresses, and ownership percentages are:", 20, y);
  y += 15;
  
  // Member table
  setDrawColor(doc, PDF_COLORS.slateNavy);
  setFillColor(doc, { r: 240, g: 240, b: 240 });
  doc.rect(20, y, 170, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Member Name", 25, y + 7);
  doc.text("Address", 80, y + 7);
  doc.text("Ownership %", 150, y + 7);
  y += 10;
  
  // Empty rows for members
  for (let i = 0; i < 4; i++) {
    doc.rect(20, y, 170, 12);
    doc.line(75, y, 75, y + 12);
    doc.line(145, y, 145, y + 12);
    y += 12;
  }
  y += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("4.2 Admission of New Members", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const admissionText = doc.splitTextToSize(
    "New Members may be admitted to the Company only with the unanimous written consent of all existing Members, and upon such terms and conditions as the Members may determine.",
    170
  );
  doc.text(admissionText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article V: Capital Contributions
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article V: Capital Contributions");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("5.1 Initial Capital Contributions", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("Each Member shall make an initial capital contribution as follows:", 20, y);
  y += 15;
  
  // Capital contribution table
  setDrawColor(doc, PDF_COLORS.slateNavy);
  setFillColor(doc, { r: 240, g: 240, b: 240 });
  doc.rect(20, y, 170, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Member Name", 25, y + 7);
  doc.text("Contribution Type", 80, y + 7);
  doc.text("Value ($)", 155, y + 7);
  y += 10;
  
  for (let i = 0; i < 4; i++) {
    doc.rect(20, y, 170, 12);
    doc.line(75, y, 75, y + 12);
    doc.line(145, y, 145, y + 12);
    y += 12;
  }
  y += 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("5.2 Additional Contributions", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const additionalText = doc.splitTextToSize(
    "No Member shall be required to make any additional capital contribution to the Company. However, additional contributions may be made with the consent of all Members.",
    170
  );
  doc.text(additionalText, 20, y);
  y += additionalText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("5.3 Capital Accounts", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const capitalText = doc.splitTextToSize(
    "A separate capital account shall be maintained for each Member. Each Member's capital account shall be credited with their capital contributions and share of profits, and debited with their share of losses and distributions.",
    170
  );
  doc.text(capitalText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article VI: Profits and Losses
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article VI: Profits and Losses");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("6.1 Allocation of Profits and Losses", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const allocationText = doc.splitTextToSize(
    "The profits and losses of the Company shall be allocated among the Members in proportion to their respective ownership percentages, unless otherwise agreed in writing by all Members.",
    170
  );
  doc.text(allocationText, 20, y);
  y += allocationText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("6.2 Distributions", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const distText = doc.splitTextToSize(
    "Distributions of available cash shall be made at such times and in such amounts as determined by the Members. Distributions shall be made to the Members in proportion to their ownership percentages.",
    170
  );
  doc.text(distText, 20, y);
  y += distText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("6.3 Tax Elections", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Company shall be taxed as (check one):", 20, y);
  y += 12;
  
  // Checkboxes
  doc.rect(25, y - 4, 5, 5);
  doc.text("Disregarded Entity (single-member LLC)", 35, y);
  y += 10;
  
  doc.rect(25, y - 4, 5, 5);
  doc.text("Partnership (multi-member LLC default)", 35, y);
  y += 10;
  
  doc.rect(25, y - 4, 5, 5);
  doc.text("S Corporation (Form 2553 election)", 35, y);
  y += 10;
  
  doc.rect(25, y - 4, 5, 5);
  doc.text("C Corporation (Form 8832 election)", 35, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article VII: Management
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article VII: Management");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("7.1 Management Structure", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Company shall be (check one):", 20, y);
  y += 12;
  
  doc.rect(25, y - 4, 5, 5);
  doc.text("Member-Managed: All Members participate in management decisions", 35, y);
  y += 10;
  
  doc.rect(25, y - 4, 5, 5);
  doc.text("Manager-Managed: Management is delegated to one or more Managers", 35, y);
  y += 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("7.2 Managers (if Manager-Managed)", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The initial Manager(s) of the Company shall be:", 20, y);
  y += 10;
  
  // Manager fields
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Manager Name)", 90, y + 4);
  y += 15;
  
  doc.line(20, y, 180, y);
  doc.text("(Manager Name)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.setFont("helvetica", "bold");
  doc.text("7.3 Voting", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const votingText = doc.splitTextToSize(
    "Unless otherwise specified in this Agreement, decisions requiring Member approval shall be made by Members holding more than fifty percent (50%) of the ownership interests.",
    170
  );
  doc.text(votingText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article VIII: Meetings
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article VIII: Meetings");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("8.1 Annual Meeting", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const annualText = doc.splitTextToSize(
    "An annual meeting of the Members shall be held on the following date each year, or on such other date as the Members may agree:",
    170
  );
  doc.text(annualText, 20, y);
  y += annualText.length * 6 + 8;
  
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(Annual Meeting Date)", 50, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  doc.setFont("helvetica", "bold");
  doc.text("8.2 Special Meetings", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const specialText = doc.splitTextToSize(
    "Special meetings may be called by any Member upon reasonable notice to all other Members. Notice shall specify the purpose of the meeting.",
    170
  );
  doc.text(specialText, 20, y);
  y += specialText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("8.3 Action Without Meeting", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const actionText = doc.splitTextToSize(
    "Any action that may be taken at a meeting of Members may be taken without a meeting if a consent in writing, setting forth the action to be taken, is signed by Members holding the requisite voting power.",
    170
  );
  doc.text(actionText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article IX: Transfer of Interests
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article IX: Transfer of Interests");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("9.1 Restrictions on Transfer", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const transferText = doc.splitTextToSize(
    "No Member may sell, assign, transfer, or otherwise dispose of all or any portion of their membership interest without the prior written consent of all other Members.",
    170
  );
  doc.text(transferText, 20, y);
  y += transferText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("9.2 Right of First Refusal", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const rofrText = doc.splitTextToSize(
    "Before any Member may transfer their interest, they must first offer it to the other Members at the same price and on the same terms as any bona fide third-party offer.",
    170
  );
  doc.text(rofrText, 20, y);
  y += rofrText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("9.3 Permitted Transfers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const permittedText = doc.splitTextToSize(
    "Notwithstanding the foregoing, a Member may transfer their interest to a trust for the benefit of the Member's family members without consent of other Members, provided the transferee agrees to be bound by this Agreement.",
    170
  );
  doc.text(permittedText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article X: Dissolution
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article X: Dissolution");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("10.1 Events of Dissolution", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Company shall be dissolved upon the occurrence of any of the following:", 20, y);
  y += 10;
  
  const dissolutionEvents = [
    "The unanimous written consent of all Members",
    "The entry of a decree of judicial dissolution",
    "Any event that makes it unlawful to continue the business",
    "The death, retirement, or bankruptcy of a Member (unless continued by remaining Members)"
  ];
  
  dissolutionEvents.forEach((event, index) => {
    doc.text(`${index + 1}. ${event}`, 25, y);
    y += 8;
  });
  y += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("10.2 Winding Up", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const windingText = doc.splitTextToSize(
    "Upon dissolution, the Company shall be wound up and its assets distributed in the following order: first, to creditors; second, to Members for their capital contributions; and third, to Members in proportion to their ownership percentages.",
    170
  );
  doc.text(windingText, 20, y);
  
  addFooter(doc, currentPage, totalPages);

  // Article XI: General Provisions
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Article XI: General Provisions");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("11.1 Entire Agreement", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const entireText = doc.splitTextToSize(
    "This Agreement constitutes the entire agreement among the Members and supersedes all prior agreements and understandings.",
    170
  );
  doc.text(entireText, 20, y);
  y += entireText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("11.2 Amendments", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const amendText = doc.splitTextToSize(
    "This Agreement may be amended only by a written instrument signed by all Members.",
    170
  );
  doc.text(amendText, 20, y);
  y += amendText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("11.3 Governing Law", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("This Agreement shall be governed by the laws of the State of:", 20, y);
  y += 10;
  
  setDrawColor(doc, PDF_COLORS.warmBronze);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  setColor(doc, PDF_COLORS.warmBronze);
  doc.text("(State)", 55, y + 4);
  
  addFooter(doc, currentPage, totalPages);

  // Signature Page
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Signature Page");
  
  y = 50;
  doc.setFontSize(11);
  setColor(doc, PDF_COLORS.darkText);
  
  doc.setFont("helvetica", "bold");
  doc.text("IN WITNESS WHEREOF, the undersigned Members have executed this", 20, y);
  y += 6;
  doc.text("Operating Agreement as of the date first written above.", 20, y);
  y += 20;
  
  // Signature blocks
  for (let i = 0; i < 3; i++) {
    doc.setFont("helvetica", "bold");
    doc.text(`Member ${i + 1}:`, 20, y);
    y += 15;
    
    setDrawColor(doc, PDF_COLORS.warmBronze);
    doc.line(20, y, 100, y);
    doc.setFontSize(8);
    setColor(doc, PDF_COLORS.warmBronze);
    doc.text("Signature", 55, y + 4);
    
    doc.line(120, y, 180, y);
    doc.text("Date", 145, y + 4);
    y += 15;
    
    doc.setFontSize(11);
    doc.line(20, y, 100, y);
    doc.setFontSize(8);
    doc.text("Printed Name", 50, y + 4);
    y += 25;
    
    doc.setFontSize(11);
    setColor(doc, PDF_COLORS.darkText);
  }
  
  addFooter(doc, currentPage, totalPages);

  return doc;
};
