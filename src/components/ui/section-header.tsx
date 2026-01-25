import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  accentPosition?: "top" | "bottom" | "both";
}

const SectionHeader = ({
  title,
  subtitle,
  centered = true,
  className,
  accentPosition = "top"
}: SectionHeaderProps) => {
  const AccentLine = () => (
    <div className={cn(
      "h-1 w-16 rounded-full bg-secondary",
      centered && "mx-auto"
    )} />
  );

  return (
    <div className={cn(
      "mb-10",
      centered && "text-center",
      className
    )}>
      {(accentPosition === "top" || accentPosition === "both") && (
        <div className="mb-4">
          <AccentLine />
        </div>
      )}
      
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      
      {(accentPosition === "bottom" || accentPosition === "both") && (
        <div className="mt-4">
          <AccentLine />
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
