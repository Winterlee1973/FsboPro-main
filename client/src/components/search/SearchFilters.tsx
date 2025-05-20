import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/propertyUtils";

interface SearchFiltersProps {
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  // Price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 5000000,
  ]);
  
  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    propertyType: filters.propertyType || "",
    minBeds: filters.minBeds || "",
    minBaths: filters.minBaths || "",
    status: filters.status || "active",
    premiumOnly: filters.premiumOnly || false,
  });
  
  // Update local filters when props change
  useEffect(() => {
    setLocalFilters({
      propertyType: filters.propertyType || "",
      minBeds: filters.minBeds || "",
      minBaths: filters.minBaths || "",
      status: filters.status || "active",
      premiumOnly: filters.premiumOnly || false,
    });
    
    setPriceRange([
      filters.minPrice || 0,
      filters.maxPrice || 5000000,
    ]);
  }, [filters]);
  
  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  // Apply price range filter
  const applyPriceRange = () => {
    onChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };
  
  // Format price labels
  const formatPriceLabel = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}k`;
    } else {
      return `$${price}`;
    }
  };
  
  // Handle local filter changes
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    onChange({
      [key]: value
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      propertyType: "",
      minBeds: "",
      minBaths: "",
      status: "active",
      premiumOnly: false,
    });
    
    setPriceRange([0, 5000000]);
    
    onChange({
      propertyType: "",
      minBeds: "",
      minBaths: "",
      status: "active",
      premiumOnly: false,
      minPrice: 0,
      maxPrice: 5000000,
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Price Range</Label>
          <div className="text-sm font-medium">
            {formatPriceLabel(priceRange[0])} - {formatPriceLabel(priceRange[1])}
          </div>
        </div>
        <Slider
          defaultValue={[0, 5000000]}
          value={priceRange}
          min={0}
          max={5000000}
          step={50000}
          onValueChange={handlePriceRangeChange}
          onValueCommit={applyPriceRange}
          className="my-6"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span>$5M+</span>
        </div>
      </div>
      
      {/* Property Type */}
      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select 
          value={localFilters.propertyType} 
          onValueChange={(value) => handleFilterChange("propertyType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Property Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Property Types</SelectItem>
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Condo/Townhouse">Condo/Townhouse</SelectItem>
            <SelectItem value="Multi-Family">Multi-Family</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Beds */}
      <div className="space-y-2">
        <Label>Bedrooms</Label>
        <Select 
          value={localFilters.minBeds.toString()} 
          onValueChange={(value) => handleFilterChange("minBeds", value ? parseInt(value) : "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Baths */}
      <div className="space-y-2">
        <Label>Bathrooms</Label>
        <Select 
          value={localFilters.minBaths.toString()} 
          onValueChange={(value) => handleFilterChange("minBaths", value ? parseFloat(value) : "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="1.5">1.5+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="2.5">2.5+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select 
          value={localFilters.status} 
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Listings</SelectItem>
            <SelectItem value="pending">Pending Sales</SelectItem>
            <SelectItem value="sold">Sold Properties</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Premium Only */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Premium Listings Only</Label>
          <p className="text-xs text-gray-500">Show only premium verified listings</p>
        </div>
        <Switch 
          checked={localFilters.premiumOnly}
          onCheckedChange={(checked) => handleFilterChange("premiumOnly", checked)}
        />
      </div>
      
      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
