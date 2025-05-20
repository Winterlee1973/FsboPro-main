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
  const [searchParams, setSearchParams] = useState({
    location: "",
    price: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
  });

  const handleChange = (
    key: keyof typeof searchParams,
    value: string
  ) => {
    setSearchParams({
      ...searchParams,
      [key]: value,
    });
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (searchParams.location) {
      queryParams.append("location", searchParams.location);
    }
    
    if (searchParams.price && searchParams.price !== "Any Price") {
      const [min, max] = searchParams.price
        .replace("$", "")
        .replace("k", "000")
        .replace("M", "000000")
        .replace("Any Price", "")
        .replace(" ", "")
        .split("-");
      
      if (min) queryParams.append("minPrice", min);
      if (max) queryParams.append("maxPrice", max);
    }
    
    if (
      searchParams.propertyType &&
      searchParams.propertyType !== "All Home Types"
    ) {
      queryParams.append("propertyType", searchParams.propertyType);
    }
    
    // Redirect to featured properties section
    setLocation(`/#featured-properties`);
  };

  return (
    <div className="search-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="text"
              className="pl-10"
              placeholder="City, Address, ZIP, or Neighborhood"
              value={searchParams.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/5">
            <Select
              value={searchParams.price}
              onValueChange={(value) => handleChange("price", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Any Price">Any Price</SelectItem>
                  <SelectItem value="$100k-$300k">$100k - $300k</SelectItem>
                  <SelectItem value="$300k-$500k">$300k - $500k</SelectItem>
                  <SelectItem value="$500k-$700k">$500k - $700k</SelectItem>
                  <SelectItem value="$700k-$1M">$700k - $1M</SelectItem>
                  <SelectItem value="$1M+">$1M+</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/5">
            <Select
              value={searchParams.propertyType}
              onValueChange={(value) => handleChange("propertyType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Home Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="All Home Types">All Home Types</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Condo/Townhouse">Condo/Townhouse</SelectItem>
                  <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/5">
            <Select
              value={searchParams.bedrooms}
              onValueChange={(value) => handleChange("bedrooms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Any">Any Bedrooms</SelectItem>
                  <SelectItem value="1+">1+ Bedrooms</SelectItem>
                  <SelectItem value="2+">2+ Bedrooms</SelectItem>
                  <SelectItem value="3+">3+ Bedrooms</SelectItem>
                  <SelectItem value="4+">4+ Bedrooms</SelectItem>
                  <SelectItem value="5+">5+ Bedrooms</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/5">
            <Select
              value={searchParams.bathrooms}
              onValueChange={(value) => handleChange("bathrooms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Any">Any Bathrooms</SelectItem>
                  <SelectItem value="1+">1+ Bathrooms</SelectItem>
                  <SelectItem value="2+">2+ Bathrooms</SelectItem>
                  <SelectItem value="3+">3+ Bathrooms</SelectItem>
                  <SelectItem value="4+">4+ Bathrooms</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/5">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSearch}
            >
              Find Homes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
