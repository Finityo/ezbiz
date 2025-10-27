import StateTemplate from "./StateTemplate";

const WashingtonLLC = () => {
  return (
    <StateTemplate
      stateName="Washington"
      stateCode="WA"
      entityType="llc"
      stateFee={200}
      processingTime="2-3 weeks"
      requirements={[
        "Unique business name with LLC designation",
        "Washington registered agent required",
        "Certificate of Formation filed",
        "Annual report due by filing anniversary",
        "Operating Agreement recommended"
      ]}
      benefits={[
        "No state income tax",
        "Strong tech industry",
        "Pacific Northwest hub",
        "Growing economy",
        "Business-friendly climate"
      ]}
    />
  );
};

export default WashingtonLLC;
