import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Search } from "lucide-react";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const propertyId = parseInt(searchQuery.trim());
      if (!isNaN(propertyId)) {
        navigate(`/property/${propertyId}`);
      } else {
        // If not a number, perhaps we show an error or do nothing,
        // for now, let's keep it simple and assume valid ID for direct navigation
        // or navigate to a search results page if that was the intent for non-ID searches.
        // For this redesign, we're focusing on ID search.
        console.warn("Search query is not a valid Property ID:", searchQuery);
        // Optionally, navigate to a generic search page:
        // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <div className="bg-gray-100 py-24">
      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-full">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Search by Property ID
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Enter a Property ID to directly view its details.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8 max-w-lg mx-auto">
            <div className="flex">
              <Input
                type="text"
                placeholder="Enter Property ID"
                className="w-full h-14 px-5 pr-16 rounded-l-lg text-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-6 rounded-r-lg"
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
          </form>
          
          {/* 
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#featured-properties">
              <Button
                className="bg-[hsl(var(--premium))] hover:bg-amber-500 text-white font-semibold px-6 py-3"
                size="lg"
              >
                Browse Featured Properties
              </Button>
            </Link>
            <Link href="/property/11743">
              <Button
                className="bg-white text-secondary hover:bg-gray-100 font-semibold px-6 py-3"
                size="lg"
              >
                View Sample Property
              </Button>
            </Link>
          </div> 
          */}
        </div>
      </div>
    </div>
  );
}
