import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchSection() {
  const [, setLocation] = useLocation();
  const [propertyId, setPropertyId] = useState("");

  const handleSearch = () => {
    if (propertyId) {
      setLocation(`/property/${propertyId}`);
    }
  };

  return (
    <div className="search-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <div className="flex">
            <Input
              type="text"
              className="flex-grow rounded-r-none"
              placeholder="Property ID"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              className="rounded-l-none bg-primary hover:bg-primary/90"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
