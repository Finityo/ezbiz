import StateTemplate from "./StateTemplate";

const FloridaLLC = () => {
  return (
    <StateTemplate
      stateName="Florida"
      stateCode="FL"
      entityType="llc"
      stateFee={125}
      processingTime="1-2 weeks"
      requirements={[
        "Unique business name with LLC designation",
        "Florida registered agent required",
        "Articles of Organization filed online",
        "Annual report due by May 1st",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "No state income tax",
        "Low formation fees",
        "Fast processing times",
        "Business-friendly climate",
        "Strong asset protection laws"
      ]}
    />
  );
};

export default FloridaLLC;
