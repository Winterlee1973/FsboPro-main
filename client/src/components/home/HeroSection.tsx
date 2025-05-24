import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Search } from "lucide-react";

export function HeroSection() {
  const [propertyId, setPropertyId] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    if (propertyId) {
      setLocation(`/property/${propertyId}`);
    }
  };

  return (
    <div className="bg-gray-100 py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-full">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Search by Property ID
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Enter a Property ID to directly view its details.
          </p>
          
          <div className="mb-8 max-w-lg mx-auto flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <Input
              type="text"
              className="flex-grow h-14 px-5 text-xl font-bold bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-none"
              placeholder="Enter Property ID"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-6 rounded-l-none"
              onClick={handleSearch}
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
