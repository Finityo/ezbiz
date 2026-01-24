import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ConsultationType {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  calendlyEvent: string;
}

interface ConsultationTypeCardProps {
  type: ConsultationType;
  calendlyUsername: string;
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const ConsultationTypeCard = ({ type, calendlyUsername }: ConsultationTypeCardProps) => {
  const handleSchedule = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: `https://calendly.com/${calendlyUsername}/${type.calendlyEvent}`
      });
    }
  };

  return (
    <Card className="text-center hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
          {type.icon}
        </div>
        <CardTitle className="text-xl">{type.title}</CardTitle>
        <Badge variant="outline">{type.duration}</Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 flex-1">{type.description}</p>
        <Button onClick={handleSchedule} className="w-full mt-auto">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsultationTypeCard;
