import StateTemplate from "./StateTemplate";

const VirginiaLLC = () => {
  return (
    <StateTemplate
      stateName="Virginia"
      stateCode="VA"
      entityType="llc"
      stateFee={100}
      processingTime="2-3 weeks"
      requirements={[
        "Unique business name with LLC or Limited Liability Company",
        "Virginia registered agent required",
        "Articles of Organization filed",
        "Annual report due by registered agent",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "East Coast location",
        "Strong economy",
        "Business-friendly regulations",
        "Good liability protection",
        "Low formation fees"
      ]}
    />
  );
};

export default VirginiaLLC;
