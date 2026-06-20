import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FileBadge2 } from "lucide-react";
import VVLDownloadButton from "@/components/veteran/VVLDownloadButton";

interface VeteranWaiverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vvlDownloaded: boolean;
  onVvlDownloaded: () => void;
  waiverAmount?: number;
}

/**
 * Confirmation dialog shown when a customer qualifies for the
 * Texas Veteran $300 filing-fee waiver. Embeds the VVL PDF download
 * and reports back via `onVvlDownloaded` so the draft order can be
 * patched and `vvl_pdf_downloaded` event logged.
 */
const VeteranWaiverDialog = ({
  open,
  onOpenChange,
  vvlDownloaded,
  onVvlDownloaded,
  waiverAmount = 300,
}: VeteranWaiverDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-3 rounded-full bg-success/10 p-3 w-fit">
            <FileBadge2 className="h-7 w-7 text-success" />
          </div>
          <DialogTitle className="text-center text-2xl">
            🇺🇸 You qualify for the Texas Veteran Waiver
          </DialogTitle>
          <DialogDescription className="text-center">
            The <strong>${waiverAmount} state filing fee</strong> will be waived once we
            verify your Veteran Verification Letter (VVL) and Comptroller Form 05-904.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-success/20 bg-success/5 p-4 space-y-2">
            <p className="text-sm font-semibold">Next steps</p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Download the VVL form below and complete it.</li>
              <li>Upload it (plus Form 05-904) from your dashboard.</li>
              <li>We submit your formation with the $300 fee removed.</li>
            </ol>
          </div>

          <div className="flex flex-col items-center gap-3">
            <VVLDownloadButton source="waiver_dialog" />
            {vvlDownloaded && (
              <p className="text-xs text-success flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> VVL download recorded on your order
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Skip for now
          </Button>
          <Button
            onClick={() => {
              onVvlDownloaded();
              onOpenChange(false);
            }}
          >
            Got it — continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VeteranWaiverDialog;
