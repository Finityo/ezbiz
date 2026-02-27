import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface VeteranEligibilityGateProps {
  isVeteran: boolean;
  setIsVeteran: (v: boolean) => void;
  isFormedInTexas2022: boolean;
  setIsFormedInTexas2022: (v: boolean) => void;
}

const VeteranEligibilityGate = ({
  isVeteran,
  setIsVeteran,
  isFormedInTexas2022,
  setIsFormedInTexas2022,
}: VeteranEligibilityGateProps) => (
  <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 space-y-4">
    <p className="font-semibold font-display text-sm">Are ALL owners honorably discharged U.S. veterans?</p>
    <div className="flex gap-3">
      <Button
        size="sm"
        variant={isVeteran ? "default" : "outline"}
        onClick={() => { setIsVeteran(true); trackEvent('veteran_eligibility_select', { selection: 'yes' }); }}
      >
        Yes
      </Button>
      <Button
        size="sm"
        variant={!isVeteran ? "default" : "outline"}
        onClick={() => { setIsVeteran(false); setIsFormedInTexas2022(false); trackEvent('veteran_eligibility_select', { selection: 'no' }); }}
      >
        No
      </Button>
    </div>

    {isVeteran && (
      <>
        <div className="border-t pt-4">
          <p className="font-semibold font-display text-sm mb-3">Will the entity be formed in Texas on or after January 1, 2022?</p>
          <div className="flex gap-3">
            <Button
              size="sm"
              variant={isFormedInTexas2022 ? "default" : "outline"}
              onClick={() => { setIsFormedInTexas2022(true); trackEvent('veteran_eligibility_select', { selection: 'formed_tx_2022_yes' }); trackEvent('veteran_qualification_met', { qualifies: true }); }}
            >
              Yes
            </Button>
            <Button
              size="sm"
              variant={!isFormedInTexas2022 ? "default" : "outline"}
              onClick={() => { setIsFormedInTexas2022(false); trackEvent('veteran_eligibility_select', { selection: 'formed_tx_2022_no' }); }}
            >
              No
            </Button>
          </div>
        </div>

        {isVeteran && isFormedInTexas2022 && (
          <div className="p-3 rounded-md bg-success/10 border border-success/20 text-sm text-foreground flex items-start gap-2">
            <span className="text-success font-bold">✓</span>
            <div>
              <p className="font-semibold">Potential Veteran-Owned Qualification</p>
              <p className="mt-1 text-muted-foreground">You may qualify for Texas veteran-owned business benefits. You will need:</p>
              <ul className="mt-1 text-muted-foreground list-disc list-inside">
                <li>TVC verification letter (each owner)</li>
                <li>Comptroller Form 05-904</li>
              </ul>
            </div>
          </div>
        )}

        {isVeteran && !isFormedInTexas2022 && (
          <div className="p-3 rounded-md bg-primary/5 border border-primary/10 text-sm text-foreground flex items-start gap-2">
            <span>🇺🇸</span>
            <span>Thank you for your service. The veteran filing fee exemption requires formation in Texas on or after January 1, 2022. You may still proceed with standard filing.</span>
          </div>
        )}
      </>
    )}
  </div>
);

export default VeteranEligibilityGate;
