import StateTemplate from "./StateTemplate";

const NevadaLLC = () => {
  return (
    <StateTemplate
      stateName="Nevada"
      stateCode="NV"
      entityType="llc"
      stateFee={425}
      processingTime="2-3 weeks"
      requirements={[
        "Unique business name with LLC or Limited-Liability Company",
        "Nevada registered agent with street address",
        "Articles of Organization with Secretary of State",
        "Initial List of Managers/Members filed",
        "Annual List and Commerce Tax filing"
      ]}
      benefits={[
        "No state income tax",
        "Strong privacy protections",
        "Exceptional asset protection",
        "Business-friendly regulations",
        "No franchise tax on income"
      ]}
    />
  );
};

export default NevadaLLC;
