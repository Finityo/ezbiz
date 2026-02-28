import * as React from "react";

const ACUITY_OWNER_ID = "38549422";

interface AcuitySchedulerProps {
  /** Optional CSS class for the wrapper div */
  className?: string;
  /** Height of the iframe (default 600px) */
  height?: number;
}

const AcuityScheduler: React.FC<AcuitySchedulerProps> = ({ className, height = 600 }) => {
  const src = `https://app.acuityscheduling.com/schedule.php?owner=${ACUITY_OWNER_ID}`;

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Schedule an Appointment"
        width="100%"
        height={height}
        frameBorder="0"
        className="rounded-lg border border-border"
        allow="payment"
      />
    </div>
  );
};

export default AcuityScheduler;
