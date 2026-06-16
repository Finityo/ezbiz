import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Star, ArrowRight } from "lucide-react";

interface FilingPathStepProps {
  onSelect: (path: "standard" | "texas_veteran_waiver") => void;
}

const FilingPathStep = ({ onSelect }: FilingPathStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Choose Your Filing Path</h2>
        <p className="text-muted-foreground">Pick how you'd like to start your business formation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 cursor-pointer hover:border-primary transition-colors flex flex-col"
              onClick={() => onSelect("standard")}>
          <div className="rounded-md bg-primary/10 p-2 w-fit mb-3">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Start Standard LLC Filing</h3>
          <p className="text-sm text-muted-foreground flex-grow">
            File in any state. Pay the standard state filing fee and our service fees at checkout.
            Best path for most businesses.
          </p>
          <Button className="mt-4 w-full" onClick={(e) => { e.stopPropagation(); onSelect("standard"); }}>
            Start Standard Filing <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>

        <Card className="p-6 cursor-pointer hover:border-primary transition-colors flex flex-col border-secondary/40"
              onClick={() => onSelect("texas_veteran_waiver")}>
          <div className="rounded-md bg-secondary/10 p-2 w-fit mb-3">
            <ShieldCheck className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Use Texas Veteran Waiver</h3>
          <p className="text-sm text-muted-foreground flex-grow">
            For honorably discharged Texas veterans forming on or after Jan 1, 2022.
            Upload your TVC verification & Form 05-904 in your dashboard. State fee is waived after approval.
          </p>
          <Button variant="secondary" className="mt-4 w-full"
                  onClick={(e) => { e.stopPropagation(); onSelect("texas_veteran_waiver"); }}>
            Use Veteran Waiver <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        You can still proceed with standard checkout later if your waiver isn't approved.
      </p>
    </div>
  );
};

export default FilingPathStep;
