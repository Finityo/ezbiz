import StateTemplate from "./StateTemplate";

const DelawareLLC = () => {
  return (
    <StateTemplate
      stateName="Delaware"
      stateCode="DE"
      entityType="llc"
      stateFee={90}
      processingTime="1-2 weeks"
      requirements={[
        "Unique business name available in Delaware",
        "Delaware registered agent required",
        "Certificate of Formation filed",
        "Operating Agreement recommended",
        "Annual franchise tax of $300"
      ]}
      benefits={[
        "Business-friendly legal system",
        "Strong privacy protections",
        "No state corporate income tax for out-of-state income",
        "Flexible business structure",
        "Respected Court of Chancery"
      ]}
    />
  );
};

export default DelawareLLC;
