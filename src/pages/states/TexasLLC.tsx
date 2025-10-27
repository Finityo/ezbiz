import StateTemplate from "./StateTemplate";

const TexasLLC = () => {
  return (
    <StateTemplate
      stateName="Texas"
      stateCode="TX"
      entityType="llc"
      stateFee={300}
      processingTime="2-3 weeks"
      requirements={[
        "Unique business name not in use in Texas",
        "Texas registered agent with physical address",
        "Certificate of Formation filed with Secretary of State",
        "Operating Agreement (strongly recommended)",
        "No franchise tax for revenue under $1.23M"
      ]}
      benefits={[
        "No state income tax",
        "Strong asset protection laws",
        "Business-friendly regulatory environment",
        "Large and diverse economy",
        "Simple formation process"
      ]}
    />
  );
};

export default TexasLLC;
