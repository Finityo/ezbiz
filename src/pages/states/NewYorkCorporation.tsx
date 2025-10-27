import StateTemplate from "./StateTemplate";

const NewYorkCorporation = () => {
  return (
    <StateTemplate
      stateName="New York"
      stateCode="NY"
      entityType="corporation"
      stateFee={125}
      processingTime="2-4 weeks"
      requirements={[
        "Unique corporate name",
        "New York registered agent",
        "Certificate of Incorporation filed",
        "Corporate bylaws required",
        "Annual franchise tax filing"
      ]}
      benefits={[
        "Enhanced credibility with investors",
        "Easier to raise capital",
        "Stock option flexibility",
        "Perpetual existence",
        "Clear ownership structure"
      ]}
    />
  );
};

export default NewYorkCorporation;
