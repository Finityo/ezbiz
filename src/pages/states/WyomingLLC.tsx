import StateTemplate from "./StateTemplate";

const WyomingLLC = () => {
  return (
    <StateTemplate
      stateName="Wyoming"
      stateCode="WY"
      entityType="llc"
      stateFee={100}
      processingTime="1-2 weeks"
      requirements={[
        "Unique business name with LLC designation",
        "Wyoming registered agent required",
        "Articles of Organization filed",
        "Annual report due first day of anniversary month",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "No state income tax",
        "Lowest fees in the nation",
        "Strong asset protection laws",
        "Maximum privacy protection",
        "Minimal compliance requirements"
      ]}
    />
  );
};

export default WyomingLLC;
