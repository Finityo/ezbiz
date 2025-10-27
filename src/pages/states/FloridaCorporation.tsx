import StateTemplate from "./StateTemplate";

const FloridaCorporation = () => {
  return (
    <StateTemplate
      stateName="Florida"
      stateCode="FL"
      entityType="corporation"
      stateFee={70}
      processingTime="1-2 weeks"
      requirements={[
        "Unique corporate name available",
        "Florida registered agent",
        "Articles of Incorporation filed",
        "Bylaws and organizational meeting",
        "Annual report filing required"
      ]}
      benefits={[
        "No state income tax",
        "Attractive to investors",
        "Strong legal framework",
        "International business hub",
        "Easy compliance requirements"
      ]}
    />
  );
};

export default FloridaCorporation;
