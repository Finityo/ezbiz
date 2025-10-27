import StateTemplate from "./StateTemplate";

const CaliforniaLLC = () => {
  return (
    <StateTemplate
      stateName="California"
      stateCode="CA"
      entityType="llc"
      stateFee={70}
      processingTime="3-5 weeks"
      requirements={[
        "Unique business name ending in LLC or L.L.C.",
        "California registered agent with physical address",
        "Articles of Organization filed with Secretary of State",
        "Operating Agreement (recommended)",
        "Federal Tax ID (EIN) from IRS"
      ]}
      benefits={[
        "Limited liability protection for owners",
        "Flexible management structure",
        "Pass-through taxation available",
        "Enhanced business credibility",
        "Easier to raise capital"
      ]}
    />
  );
};

export default CaliforniaLLC;
