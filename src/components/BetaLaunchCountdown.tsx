import { useEffect, useState } from "react";

// 30 days from March 11, 2026
const LAUNCH_DATE = new Date("2026-04-10T00:00:00");
const CORPNET_AFFILIATE_LINK = "https://www.corpnet.com/?pid=16443";

function calculateTimeLeft() {
  const difference = +LAUNCH_DATE - +new Date();
  if (difference <= 0) return null;
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function BetaLaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <section className="w-full py-12 border-y border-border bg-muted/40">
      <div className="max-w-5xl mx-auto text-center px-6">
        <h2 className="text-2xl font-bold mb-2">
          🚧 EZ Biz Platform Launch
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Our full platform is launching soon. Start your business instantly
          through our trusted filing partner while beta testing continues.
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-4 sm:gap-6 text-center mb-8">
          {([
            ["days", "Days"],
            ["hours", "Hours"],
            ["minutes", "Minutes"],
            ["seconds", "Seconds"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <div className="text-3xl font-bold text-foreground">
                {timeLeft[key as keyof typeof timeLeft]}
              </div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            window.open(CORPNET_AFFILIATE_LINK, "_blank", "noopener,noreferrer")
          }
          className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Start Your Business Now
        </button>
      </div>
    </section>
  );
}
