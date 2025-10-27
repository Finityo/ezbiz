import StateTemplate from "./StateTemplate";

const NewYorkLLC = () => {
  return (
    <StateTemplate
      stateName="New York"
      stateCode="NY"
      entityType="llc"
      stateFee={200}
      processingTime="2-4 weeks"
      requirements={[
        "Unique business name ending with LLC or L.L.C.",
        "New York registered agent with physical address",
        "Articles of Organization filed with Department of State",
        "Publication requirement in two newspapers for 6 weeks",
        "Operating Agreement (strongly recommended)"
      ]}
      benefits={[
        "Strong liability protection",
        "Access to major financial markets",
        "Credible business location",
        "Flexible management structure",
        "No residency requirements"
      ]}
    />
  );
};

export default NewYorkLLC;
