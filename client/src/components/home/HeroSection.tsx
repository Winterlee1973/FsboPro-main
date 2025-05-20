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
      // Check if search query is a property ID (a number)
      const propertyId = parseInt(searchQuery.trim());
      if (!isNaN(propertyId)) {
        // If it's a number, navigate to the property detail page
        navigate(`/property/${propertyId}`);
      } else {
        // Otherwise, direct to featured properties section
        navigate(`/#featured-properties`);
      }
    }
  };

  return (
    <div className="relative bg-secondary h-[550px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&h=1000"
          alt="Modern luxury home"
          className="object-cover w-full h-full opacity-60"
        />
        <div className="hero-overlay"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Find Your Dream Home Directly from Owners
          </h1>
          <p className="text-xl text-white mb-6">
            Browse exclusive listings, connect with sellers, and discover your perfect property without agent fees.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8 relative">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search by Property ID or Address"
                className="w-full h-12 px-4 pr-12 rounded-l-md text-base focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-4 rounded-r-md"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </form>
          
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
        </div>
      </div>
    </div>
  );
}
