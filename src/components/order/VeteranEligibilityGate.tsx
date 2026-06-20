import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import VVLDownloadButton from "@/components/veteran/VVLDownloadButton";
import { Award, CheckCircle2, FileDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VeteranEligibilityGateProps {
  isVeteran: boolean;
  setIsVeteran: (v: boolean) => void;
  isFormedInTexas2022: boolean;
  setIsFormedInTexas2022: (v: boolean) => void;
  selectedState?: string;
  vvlDownloaded?: boolean;
  onVvlDownloaded?: () => void;
  waiverAmount?: number;
}

const VeteranEligibilityGate = ({
  isVeteran,
  setIsVeteran,
  isFormedInTexas2022,
  setIsFormedInTexas2022,
  selectedState,
  vvlDownloaded = false,
  onVvlDownloaded,
  waiverAmount = 300,
}: VeteranEligibilityGateProps) => {
  const isTexasSelected = selectedState === "Texas" || selectedState === "TX";
  const [answeredVeteran, setAnsweredVeteran] = useState(isVeteran);
  const [answeredTexasFormation, setAnsweredTexasFormation] = useState(isFormedInTexas2022);
  const qualifies = isTexasSelected && isVeteran && isFormedInTexas2022;

  const ChoiceButton = ({
    active,
    onClick,
    children,
    testId,
  }: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
    testId?: string;
  }) => (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "min-h-12 flex-1 justify-center text-base font-semibold transition-all",
        active && "shadow-md",
      )}
    >
      {children}
    </Button>
  );

  if (!selectedState) return null;

  return (
    <section
      data-testid="veteran-eligibility-section"
      className="mt-6 overflow-hidden rounded-xl border border-secondary/30 bg-secondary/5 shadow-sm animate-fade-in"
      aria-labelledby="veteran-eligibility-title"
    >
      <div className="border-b border-secondary/20 bg-background/70 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-secondary/15 p-2">
            <ShieldCheck className="h-5 w-5 text-secondary" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">Texas veteran filing-fee waiver</p>
            <h3 id="veteran-eligibility-title" className="text-lg font-semibold font-display">
              Veteran Eligibility Check
            </h3>
            <p className="text-sm text-muted-foreground">
              Answer two quick questions to see if the Texas state filing fee can be removed from this order.
            </p>
          </div>
        </div>
      </div>

      {!isTexasSelected ? (
        <div className="p-4 sm:p-5 text-sm text-muted-foreground">
          The Texas veteran waiver applies only to Texas formations. Select Texas to check eligibility.
        </div>
      ) : (
        <div className="p-4 sm:p-5 space-y-5">
          <div className="space-y-3">
            <p className="font-semibold">Are all owners honorably discharged U.S. veterans?</p>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                active={answeredVeteran && isVeteran}
                testId="veteran-yes"
                onClick={() => {
                  setAnsweredVeteran(true);
                  setIsVeteran(true);
                  trackEvent("veteran_eligibility_select", { selection: "yes" });
                }}
              >
                Yes
              </ChoiceButton>
              <ChoiceButton
                active={answeredVeteran && !isVeteran}
                testId="veteran-no"
                onClick={() => {
                  setAnsweredVeteran(true);
                  setAnsweredTexasFormation(false);
                  setIsVeteran(false);
                  setIsFormedInTexas2022(false);
                  trackEvent("veteran_eligibility_select", { selection: "no" });
                }}
              >
                No
              </ChoiceButton>
            </div>
          </div>

          {answeredVeteran && isVeteran && (
            <div className="space-y-3 border-t border-secondary/20 pt-5 animate-fade-in">
              <p className="font-semibold">Will this entity be formed in Texas on or after January 1, 2022?</p>
              <div className="grid grid-cols-2 gap-3">
                <ChoiceButton
                  active={answeredTexasFormation && isFormedInTexas2022}
                  testId="texas-formation-yes"
                  onClick={() => {
                    setAnsweredTexasFormation(true);
                    setIsFormedInTexas2022(true);
                    trackEvent("veteran_eligibility_select", { selection: "formed_tx_2022_yes" });
                  }}
                >
                  Yes
                </ChoiceButton>
                <ChoiceButton
                  active={answeredTexasFormation && !isFormedInTexas2022}
                  testId="texas-formation-no"
                  onClick={() => {
                    setAnsweredTexasFormation(true);
                    setIsFormedInTexas2022(false);
                    trackEvent("veteran_eligibility_select", { selection: "formed_tx_2022_no" });
                  }}
                >
                  No
                </ChoiceButton>
              </div>
            </div>
          )}

          {qualifies && (
            <div className="rounded-lg border border-success/30 bg-success/10 p-4 sm:p-5 space-y-4 animate-scale-in">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-success/15 p-2">
                  <Award className="h-5 w-5 text-success" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-bold text-success">Texas Veteran Waiver Eligibility</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You appear eligible for the Texas veteran filing-fee waiver. Download the VVL form now, then create or sign in to your account so this draft can be saved for review.
                  </p>
                </div>
              </div>

              <div className="rounded-md border bg-background/80 p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <FileDown className="h-4 w-4 text-secondary" aria-hidden="true" />
                  Next step: download your Veteran Verification Letter form
                </p>
                <p className="mt-1 text-muted-foreground">
                  The ${waiverAmount} Texas filing fee is removed after your VVL and Comptroller Form 05-904 are verified.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <VVLDownloadButton source="eligibility_gate" onDownloaded={onVvlDownloaded} />
                {vvlDownloaded && (
                  <p className="text-sm font-medium text-success flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Download recorded
                  </p>
                )}
              </div>
            </div>
          )}

          {answeredVeteran && !isVeteran && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
              You can still continue with standard Texas filing. The veteran filing-fee waiver will not be applied.
            </div>
          )}

          {answeredTexasFormation && isVeteran && !isFormedInTexas2022 && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
              Thank you for your service. This waiver requires a Texas formation on or after January 1, 2022, but you can still proceed with standard filing.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default VeteranEligibilityGate;
