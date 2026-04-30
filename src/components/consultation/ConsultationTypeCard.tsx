import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
const CONTACT_PHONE_TEL = "+18308371955";

interface ConsultationType {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  price?: string;
}

interface ConsultationTypeCardProps {
  type: ConsultationType;
  /** Retained for backward compatibility — no longer used. */
  acuityOwnerId?: string;
}

// Backward-compat export: old call sites import this. It now opens a tel: link
// instead of an Acuity scheduling popup.
const openAcuityPopup = (_ownerId?: string) => {
  if (typeof window !== "undefined") {
    window.location.href = `tel:${CONTACT_PHONE_TEL}`;
  }
};

const ConsultationTypeCard = ({ type }: ConsultationTypeCardProps) => {
  const phoneHref = `tel:${CONTACT_PHONE_TEL}`;
  return (
    <Card className="text-center hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
          {type.icon}
        </div>
        <CardTitle className="text-xl">{type.title}</CardTitle>
        <div className="flex items-center justify-center gap-2 mt-1">
          <Badge variant="outline">{type.duration}</Badge>
          {type.price && (
            <Badge variant={type.price === "Free" ? "default" : "secondary"} className="text-sm font-semibold">
              {type.price}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 flex-1">{type.description}</p>
        <Button asChild className="w-full mt-auto">
          <a href={phoneHref}>
            <Phone className="h-4 w-4 mr-2" />
            Call Us to Discuss
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export { openAcuityPopup };
export default ConsultationTypeCard;
