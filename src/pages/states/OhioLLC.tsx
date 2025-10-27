import StateTemplate from "./StateTemplate";

const OhioLLC = () => {
  return (
    <StateTemplate
      stateName="Ohio"
      stateCode="OH"
      entityType="llc"
      stateFee={99}
      processingTime="1-2 weeks"
      requirements={[
        "Unique business name with LLC designation",
        "Ohio registered agent required",
        "Articles of Organization filed with Secretary of State",
        "Operating Agreement recommended",
        "Initial report filed within first year"
      ]}
      benefits={[
        "Low formation fees",
        "No publication requirement",
        "Strong liability protection",
        "Simple compliance",
        "Central U.S. location"
      ]}
    />
  );
};

export default OhioLLC;
