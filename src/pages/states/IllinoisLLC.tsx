import StateTemplate from "./StateTemplate";

const IllinoisLLC = () => {
  return (
    <StateTemplate
      stateName="Illinois"
      stateCode="IL"
      entityType="llc"
      stateFee={150}
      processingTime="2-3 weeks"
      requirements={[
        "Unique business name with LLC or Limited Liability Company",
        "Illinois registered agent required",
        "Articles of Organization filed",
        "Annual report due each year",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "Major economic hub",
        "Access to diverse markets",
        "Strong infrastructure",
        "Good liability protection",
        "Favorable business climate"
      ]}
    />
  );
};

export default IllinoisLLC;
