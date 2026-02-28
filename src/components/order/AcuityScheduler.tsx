import { useEffect } from "react";

const AcuityScheduler = () => {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://embed.acuityscheduling.com/js/embed.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://embed.acuityscheduling.com/js/embed.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-6">
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=38549422&ref=embedded_csp"
        title="Schedule Appointment"
        width="100%"
        height="800"
        frameBorder="0"
        allow="payment"
      />
    </div>
  );
};

export default AcuityScheduler;
