import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ConsultationType {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
}

interface ConsultationTypeCardProps {
  type: ConsultationType;
  acuityOwnerId: string;
}

const openAcuityPopup = (ownerId: string) => {
  const width = 600;
  const height = 800;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  window.open(
    `https://app.acuityscheduling.com/schedule.php?owner=${ownerId}`,
    'acuity',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
  );
};

const ConsultationTypeCard = ({ type, acuityOwnerId }: ConsultationTypeCardProps) => {
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
        <Button onClick={() => openAcuityPopup(acuityOwnerId)} className="w-full mt-auto">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Now
        </Button>
      </CardContent>
    </Card>
  );
};

export { openAcuityPopup };
export default ConsultationTypeCard;
