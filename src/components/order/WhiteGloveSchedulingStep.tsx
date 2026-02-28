import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface WhiteGloveSchedulingData {
  city: string;
  zipCode: string;
  meetingPlaceType: string;
  meetingPlaceDetails: string;
  preferredDate: Date | undefined;
  preferredTime: string;
  notes: string;
}

interface WhiteGloveSchedulingStepProps {
  data: WhiteGloveSchedulingData;
  onChange: (data: WhiteGloveSchedulingData) => void;
}

const MEETING_PLACE_TYPES = [
  { value: "home", label: "Your Home" },
  { value: "office", label: "Your Office" },
  { value: "coffee-shop", label: "Coffee Shop / Public Space" },
  { value: "coworking", label: "Co-working Space" },
  { value: "other", label: "Other" },
];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const WhiteGloveSchedulingStep = ({ data, onChange }: WhiteGloveSchedulingStepProps) => {
  const update = <K extends keyof WhiteGloveSchedulingData>(field: K, value: WhiteGloveSchedulingData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Service area info */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/[0.06] border border-primary/15 text-sm">
        <Car className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-muted-foreground">
          We'll come to you! Currently serving the <strong className="text-foreground">San Antonio metro area</strong>.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Your City *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="San Antonio"
            />
          </div>
        </div>

        <div>
          <Label>ZIP Code *</Label>
          <Input
            value={data.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            placeholder="78201"
          />
        </div>

        <div>
          <Label>Meeting Place Type *</Label>
          <Select value={data.meetingPlaceType} onValueChange={(v) => update("meetingPlaceType", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Where should we meet?" />
            </SelectTrigger>
            <SelectContent>
              {MEETING_PLACE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Meeting Place Details</Label>
          <Input
            value={data.meetingPlaceDetails}
            onChange={(e) => update("meetingPlaceDetails", e.target.value)}
            placeholder="Address or name of location"
          />
        </div>

        <div>
          <Label>Preferred Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.preferredDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.preferredDate ? format(data.preferredDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.preferredDate}
                onSelect={(d) => update("preferredDate", d)}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Preferred Time *</Label>
          <Select value={data.preferredTime} onValueChange={(v) => update("preferredTime", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Additional Notes</Label>
        <Textarea
          value={data.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Gate codes, parking instructions, special requests…"
          rows={3}
        />
      </div>
    </div>
  );
};

export default WhiteGloveSchedulingStep;
