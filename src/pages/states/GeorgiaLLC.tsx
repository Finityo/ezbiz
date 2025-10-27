import StateTemplate from "./StateTemplate";

const GeorgiaLLC = () => {
  return (
    <StateTemplate
      stateName="Georgia"
      stateCode="GA"
      entityType="llc"
      stateFee={100}
      processingTime="2-3 weeks"
      requirements={[
        "Unique business name with LLC or Limited Liability Company",
        "Georgia registered agent required",
        "Articles of Organization filed online",
        "Annual registration fee due by April 1st",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "Business-friendly state",
        "Low formation costs",
        "Growing economy",
        "No publication requirement",
        "Simple compliance"
      ]}
    />
  );
};

export default GeorgiaLLC;
