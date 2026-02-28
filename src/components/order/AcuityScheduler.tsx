import { useEffect } from "react";

export default function AcuityScheduler() {
  useEffect(() => {
    const src = "https://embed.acuityscheduling.com/js/embed.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = src;
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-4">
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=38549422&ref=embedded_csp"
        title="Schedule Appointment"
        width="100%"
        height="800"
        frameBorder={0}
        allow="payment"
      />
    </div>
  );
}
