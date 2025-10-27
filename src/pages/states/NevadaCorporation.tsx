import StateTemplate from "./StateTemplate";

const NevadaCorporation = () => {
  return (
    <StateTemplate
      stateName="Nevada"
      stateCode="NV"
      entityType="corporation"
      stateFee={725}
      processingTime="2-3 weeks"
      requirements={[
        "Unique corporate name available",
        "Nevada registered agent required",
        "Articles of Incorporation filed",
        "Initial List of Officers/Directors",
        "Annual report and business license"
      ]}
      benefits={[
        "No corporate income tax",
        "Strong shareholder privacy",
        "No franchise tax on income",
        "Flexible corporate structure",
        "Director/officer liability protection"
      ]}
    />
  );
};

export default NevadaCorporation;
