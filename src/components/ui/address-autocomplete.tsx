import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

export interface ParsedAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: ParsedAddress) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface Suggestion {
  id: string;
  place_name: string;
  address?: string;
  text: string;
  context?: Array<{ id: string; text: string; short_code?: string }>;
  properties?: { address?: string };
}

function parseMapboxFeature(feature: Suggestion): ParsedAddress {
  const ctx = feature.context || [];
  const getCtx = (prefix: string) =>
    ctx.find((c) => c.id.startsWith(prefix));

  const streetNumber = feature.address || feature.properties?.address || "";
  const streetName = feature.text || "";
  const address1 = streetNumber ? `${streetNumber} ${streetName}` : streetName;

  const placeCtx = getCtx("place");
  const regionCtx = getCtx("region");
  const postcodeCtx = getCtx("postcode");
  const countryCtx = getCtx("country");

  return {
    address1,
    address2: "",
    city: placeCtx?.text || "",
    state: regionCtx?.text || "",
    zip: postcodeCtx?.text || "",
    country: countryCtx?.short_code?.toUpperCase() || "US",
  };
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing an address...",
  disabled = false,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const suppressFetchRef = useRef(false);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!MAPBOX_TOKEN || query.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_TOKEN}&country=us&types=address&autocomplete=true&limit=5`
        );
        const data = await res.json();
        if (data.features) {
          setSuggestions(data.features);
          setOpen(data.features.length > 0);
        }
      } catch (err) {
        console.error("Address autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  const handleSelect = (suggestion: Suggestion) => {
    const parsed = parseMapboxFeature(suggestion);
    suppressFetchRef.current = true;
    onChange(parsed.address1);
    onSelect(parsed);
    setOpen(false);
    setSuggestions([]);
  };

  if (!MAPBOX_TOKEN) {
    // Fallback: render a plain input if no token configured
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pr-8", className)}
            autoComplete="off"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No addresses found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.place_name}
                  onSelect={() => handleSelect(s)}
                  className="cursor-pointer"
                >
                  <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{s.place_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
