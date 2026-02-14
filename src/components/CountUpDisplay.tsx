import { useCountUp } from "@/hooks/useCountUp";

interface CountUpDisplayProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

const CountUpDisplay = ({ end, suffix = "", prefix = "", decimals = 0, duration = 2000, className }: CountUpDisplayProps) => {
  const { ref, display } = useCountUp({ end, suffix, prefix, decimals, duration });
  return <div ref={ref} className={className}>{display}</div>;
};

export default CountUpDisplay;
