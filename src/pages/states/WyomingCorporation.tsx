import StateTemplate from "./StateTemplate";

const WyomingCorporation = () => {
  return (
    <StateTemplate
      stateName="Wyoming"
      stateCode="WY"
      entityType="corporation"
      stateFee={100}
      processingTime="1-2 weeks"
      requirements={[
        "Unique corporate name",
        "Wyoming registered agent",
        "Articles of Incorporation",
        "Bylaws and organizational meeting",
        "Annual report filing"
      ]}
      benefits={[
        "No state corporate income tax",
        "Low filing and maintenance fees",
        "Strong privacy protections",
        "Business-friendly laws",
        "Simple compliance"
      ]}
    />
  );
};

export default WyomingCorporation;
