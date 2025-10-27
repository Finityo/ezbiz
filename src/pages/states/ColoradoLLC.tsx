import StateTemplate from "./StateTemplate";

const ColoradoLLC = () => {
  return (
    <StateTemplate
      stateName="Colorado"
      stateCode="CO"
      entityType="llc"
      stateFee={50}
      processingTime="1-2 weeks"
      requirements={[
        "Unique business name with LLC designation",
        "Colorado registered agent required",
        "Articles of Organization filed online",
        "Periodic report due annually",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "Lowest formation fee in U.S.",
        "Business-friendly environment",
        "Fast processing",
        "Growing tech hub",
        "Simple online filing"
      ]}
    />
  );
};

export default ColoradoLLC;
