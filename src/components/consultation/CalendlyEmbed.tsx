import { useEffect } from "react";

interface CalendlyEmbedProps {
  url: string;
  height?: number;
}

const CalendlyEmbed = ({ url, height = 700 }: CalendlyEmbedProps) => {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    head?.appendChild(script);

    return () => {
      head?.removeChild(script);
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget w-full rounded-lg overflow-hidden"
      data-url={url}
      style={{ minWidth: "320px", height: `${height}px` }}
    />
  );
};

export default CalendlyEmbed;
