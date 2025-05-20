import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@shared/schema";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the filter type for our properties
type PropertyFilters = {
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  minBaths: string;
  propertyType: string;
  sort: string;
};

export default function PropertiesPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Initialize filters with defaults
  const defaultFilters: PropertyFilters = {
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBeds: searchParams.get('minBeds') || '',
    minBaths: searchParams.get('minBaths') || '',
    propertyType: searchParams.get('propertyType') || '',
    sort: searchParams.get('sort') || 'newest'
  };
  
  // State for filters
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  
  // Local form state
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(defaultFilters);
  
  // Query to fetch properties
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
  });
  
  // Apply filters when the Search button is clicked
  const applyFilters = () => {
    setFilters(localFilters);
    
    // Update URL with new filters
    const newParams = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        newParams.set(key, String(value));
      }
    });
    
    setLocation(`/properties?${newParams.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    const resetFilters: PropertyFilters = {
      minPrice: '',
      maxPrice: '',
      minBeds: '',
      minBaths: '',
      propertyType: '',
      sort: 'newest'
    };
    
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    setLocation('/properties');
  };
  
  // Handle input changes
  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <>
      <Helmet>
        <title>Browse Properties | HomeDirect</title>
        <meta
          name="description"
          content="Browse available properties for sale. Find your dream home with detailed listings and powerful search filters."
        />
      </Helmet>
      
      <div className="py-12 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">Browse Properties</h1>
            <p className="text-gray-600">
              Find your perfect home from our wide selection of properties
            </p>
          </div>
          
          {/* Search Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <Select
                  value={localFilters.minBeds}
                  onValueChange={(value) => handleFilterChange('minBeds', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <Select
                  value={localFilters.minBaths}
                  onValueChange={(value) => handleFilterChange('minBaths', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <Select
                  value={localFilters.propertyType}
                  onValueChange={(value) => handleFilterChange('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <Select
                  value={localFilters.sort}
                  onValueChange={(value) => handleFilterChange('sort', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={applyFilters}>
                Search Properties
              </Button>
            </div>
          </div>
          
          {/* Property Results */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="text-center p-8">
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Properties</h2>
                  <p className="text-gray-600 mb-4">
                    There was a problem fetching the property listings. Please try again.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : properties && properties.length > 0 ? (
              <div>
                <div className="flex justify-between mb-6">
                  <p className="text-gray-500">
                    Showing {properties.length} properties
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <h2 className="text-xl font-semibold text-secondary mb-2">No Properties Found</h2>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any properties matching your search criteria. Try adjusting your filters.
                  </p>
                  <Button onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}