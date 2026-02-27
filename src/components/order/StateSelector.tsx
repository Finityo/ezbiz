import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATE_FILING_FEES } from "@/lib/state-fees";

const POPULAR_STATES = ["Florida", "Texas", "California", "Delaware", "Wyoming", "Nevada"];

const ALL_STATES = Object.keys(STATE_FILING_FEES).sort();

interface StateSelectorProps {
  selected: string;
  onSelect: (state: string) => void;
  slotAfterPopular?: React.ReactNode;
}

const StateSelector = ({ selected, onSelect, slotAfterPopular }: StateSelectorProps) => {
  const [search, setSearch] = useState("");

  const filteredStates = useMemo(() => {
    if (!search.trim()) return [];
    return ALL_STATES.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const displayStates = search.trim() ? filteredStates : [];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search states..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Popular States */}
      {!search.trim() && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Popular States
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR_STATES.map((state) => {
              const fee = STATE_FILING_FEES[state] || 0;
              const isSelected = selected === state;
              return (
                <Card
                  key={state}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-md",
                    isSelected && "border-primary shadow-md bg-primary/5 ring-1 ring-primary/20"
                  )}
                  onClick={() => onSelect(state)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{state}</p>
                      <p className="text-sm text-muted-foreground">${fee} filing fee</p>
                    </div>
                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Slot for veteran gate or other content */}
      {slotAfterPopular}

      {/* All States / Search Results */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {search.trim() ? `Results (${displayStates.length})` : "All States"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-1">
          {(search.trim() ? displayStates : ALL_STATES).map((state) => {
            const fee = STATE_FILING_FEES[state] || 0;
            const isSelected = selected === state;
            return (
              <Card
                key={state}
                className={cn(
                  "p-3 cursor-pointer transition-all hover:shadow-sm text-sm",
                  isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20"
                )}
                onClick={() => onSelect(state)}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium truncate">{state}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-muted-foreground text-xs">${fee}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StateSelector;
