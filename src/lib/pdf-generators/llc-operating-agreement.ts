import jsPDF from "jspdf";
import { addCoverPage, addHeader, addFooter, BRAND_COLORS, addTableOfContents } from "../pdf-utils";

export const generateLLCOperatingAgreement = (): jsPDF => {
  const doc = new jsPDF();
  let currentPage = 1;

  // Cover Page
  addCoverPage(doc, "LLC Operating Agreement", "Template Document");
  
  // Table of Contents
  doc.addPage();
  currentPage++;
  addHeader(doc, "Table of Contents");
  
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
  addFooter(doc, currentPage);

  // Article I: Formation
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article I: Formation");
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  let y = 50;
  
  doc.setFont("helvetica", "bold");
  doc.text("1.1 Formation", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const formationText = "This Limited Liability Company Operating Agreement (the \"Agreement\") is entered into as of:";
  doc.text(formationText, 20, y);
  y += 10;
  
  // Fillable field
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.setLineWidth(0.5);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Date)", 55, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
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
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(State of Formation)", 50, y + 4);
  y += 15;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.text("on the following date:", 20, y);
  y += 8;
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Filing Date)", 55, y + 4);
  
  addFooter(doc, currentPage);

  // Article II: Name and Principal Office
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article II: Name and Principal Office");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("2.1 Name", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The name of the Company shall be:", 20, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Company Name, LLC)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("2.2 Principal Office", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The principal office of the Company shall be located at:", 20, y);
  y += 10;
  
  // Address fields
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
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
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("2.3 Registered Agent", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Registered Agent for service of process shall be:", 20, y);
  y += 10;
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Registered Agent Name)", 85, y + 4);
  y += 15;
  
  doc.line(20, y, 180, y);
  doc.text("(Registered Agent Address)", 85, y + 4);
  
  addFooter(doc, currentPage);

  // Article III: Purpose
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article III: Purpose");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
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
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.rect(20, y, 170, 40);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Describe the primary business purpose)", 75, y + 20);
  y += 55;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("3.2 Powers", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const powersText = doc.splitTextToSize(
    "The Company shall have all powers necessary and convenient to carry out its purposes, including the power to own, lease, and dispose of property; to enter into contracts; to borrow money and issue notes and other obligations; and to conduct any and all business activities permitted by law.",
    170
  );
  doc.text(powersText, 20, y);
  
  addFooter(doc, currentPage);

  // Article IV: Members
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article IV: Members");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("4.1 Initial Members", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The initial Members of the Company, their addresses, and ownership percentages are:", 20, y);
  y += 15;
  
  // Member table
  doc.setDrawColor(...BRAND_COLORS.navy);
  doc.setFillColor(240, 240, 240);
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
  
  addFooter(doc, currentPage);

  // Article V: Capital Contributions
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article V: Capital Contributions");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("5.1 Initial Capital Contributions", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("Each Member shall make an initial capital contribution as follows:", 20, y);
  y += 15;
  
  // Capital contribution table
  doc.setDrawColor(...BRAND_COLORS.navy);
  doc.setFillColor(240, 240, 240);
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
  
  addFooter(doc, currentPage);

  // Article VI: Profits and Losses
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article VI: Profits and Losses");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
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
  
  addFooter(doc, currentPage);

  // Article VII: Management
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article VII: Management");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
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
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 180, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Manager Name)", 90, y + 4);
  y += 15;
  
  doc.line(20, y, 180, y);
  doc.text("(Manager Name)", 90, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("7.3 Voting", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const votingText = doc.splitTextToSize(
    "Unless otherwise specified in this Agreement, decisions requiring Member approval shall be made by Members holding more than fifty percent (50%) of the ownership interests.",
    170
  );
  doc.text(votingText, 20, y);
  
  addFooter(doc, currentPage);

  // Article VIII: Meetings
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article VIII: Meetings");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
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
  
  doc.setDrawColor(...BRAND_COLORS.bronze);
  doc.line(20, y, 100, y);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLORS.bronze);
  doc.text("(Annual Meeting Date)", 50, y + 4);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
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
  
  addFooter(doc, currentPage);

  // Article IX: Transfer of Interests
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article IX: Transfer of Interests");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("9.1 Restrictions on Transfer", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const transferText = doc.splitTextToSize(
    "No Member may sell, assign, transfer, or encumber all or any part of their membership interest without the prior written consent of all other Members.",
    170
  );
  doc.text(transferText, 20, y);
  y += transferText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("9.2 Right of First Refusal", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const rofrText = doc.splitTextToSize(
    "If a Member receives a bona fide offer to purchase their interest and wishes to accept it, they must first offer to sell their interest to the remaining Members on the same terms and conditions.",
    170
  );
  doc.text(rofrText, 20, y);
  y += rofrText.length * 6 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("9.3 Death or Incapacity", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  const deathText = doc.splitTextToSize(
    "Upon the death or incapacity of a Member, their interest shall pass to their estate or legal representative. The remaining Members shall have the option to purchase such interest at fair market value.",
    170
  );
  doc.text(deathText, 20, y);
  
  addFooter(doc, currentPage);

  // Article X: Dissolution
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article X: Dissolution");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  doc.setFont("helvetica", "bold");
  doc.text("10.1 Events of Dissolution", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.text("The Company shall be dissolved upon the occurrence of any of the following:", 20, y);
  y += 10;
  
  const dissolutionEvents = [
    "The unanimous written agreement of all Members to dissolve the Company",
    "The sale or disposition of all or substantially all of the Company's assets",
    "The entry of a decree of judicial dissolution",
    "Any other event causing dissolution under state law"
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
    "Upon dissolution, the Company's affairs shall be wound up and its assets liquidated. The proceeds shall be applied first to pay creditors, then to Members in proportion to their capital accounts.",
    170
  );
  doc.text(windingText, 20, y);
  
  addFooter(doc, currentPage);

  // Article XI: General Provisions
  doc.addPage();
  currentPage++;
  addHeader(doc, "Article XI: General Provisions");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  const generalProvisions = [
    {
      title: "11.1 Amendments",
      text: "This Agreement may be amended only by a written instrument signed by all Members."
    },
    {
      title: "11.2 Governing Law",
      text: "This Agreement shall be governed by and construed in accordance with the laws of the State of formation."
    },
    {
      title: "11.3 Entire Agreement",
      text: "This Agreement constitutes the entire agreement among the Members and supersedes all prior agreements and understandings."
    },
    {
      title: "11.4 Severability",
      text: "If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect."
    },
    {
      title: "11.5 Counterparts",
      text: "This Agreement may be executed in counterparts, each of which shall be deemed an original."
    }
  ];
  
  generalProvisions.forEach((provision) => {
    doc.setFont("helvetica", "bold");
    doc.text(provision.title, 20, y);
    y += 8;
    
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(provision.text, 170);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 10;
  });
  
  addFooter(doc, currentPage);

  // Signature Page
  doc.addPage();
  currentPage++;
  addHeader(doc, "Signature Page");
  
  y = 50;
  doc.setFontSize(11);
  doc.setTextColor(...BRAND_COLORS.text);
  
  const sigIntro = doc.splitTextToSize(
    "IN WITNESS WHEREOF, the undersigned Members have executed this Operating Agreement as of the date first written above.",
    170
  );
  doc.text(sigIntro, 20, y);
  y += sigIntro.length * 6 + 20;
  
  // Signature blocks
  for (let i = 1; i <= 3; i++) {
    doc.setFont("helvetica", "bold");
    doc.text(`MEMBER ${i}:`, 20, y);
    y += 15;
    
    doc.setDrawColor(...BRAND_COLORS.bronze);
    doc.line(20, y, 100, y);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND_COLORS.bronze);
    doc.text("Signature", 55, y + 4);
    
    doc.line(120, y, 180, y);
    doc.text("Date", 145, y + 4);
    y += 15;
    
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.line(20, y, 100, y);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND_COLORS.bronze);
    doc.text("Print Name", 55, y + 4);
    
    doc.line(120, y, 180, y);
    doc.text("Ownership %", 140, y + 4);
    y += 25;
    
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_COLORS.text);
  }
  
  addFooter(doc, currentPage);

  return doc;
};
