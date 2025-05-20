import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyGrid } from "@/components/search/PropertyGrid";
import { parseSearchParams, createSearchQueryString } from "@/lib/propertyUtils";
import { SlidersHorizontal, Search, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const { isMobile } = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [filterParams, setFilterParams] = useState<Record<string, any>>({});
  
  // Parse URL search params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || "");
    
    const params = parseSearchParams(searchParams);
    setFilterParams(params);
    
    // Set search query from location parameter
    if (params.location) {
      setSearchQuery(params.location);
    }
  }, [location]);
  
  // Fetch properties based on search criteria
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery<Property[]>({
    queryKey: [`/api/properties?${createSearchQueryString(filterParams)}`],
  });
  
  // Handle search submission
  const handleSearch = () => {
    const newParams = { ...filterParams, location: searchQuery };
    setLocation(`/search?${createSearchQueryString(newParams)}`);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    const updatedFilters = { ...filterParams, ...newFilters };
    setFilterParams(updatedFilters);
    setLocation(`/search?${createSearchQueryString(updatedFilters)}`);
  };
  
  const totalResults = properties?.length || 0;
  const hasActiveFilters = Object.values(filterParams).some(value => 
    value !== undefined && value !== '' && value !== false
  );
  
  return (
    <>
      <Helmet>
        <title>Search Properties | HomeDirect</title>
        <meta
          name="description"
          content="Find your dream home. Search properties for sale by owner with no agent commissions."
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Mobile Search Controls */}
          {isMobile && (
            <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10"
                    placeholder="City, Address, ZIP, or Neighborhood"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{isLoading ? '...' : totalResults}</span> 
                  <span className="text-gray-500"> properties found</span>
                </div>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters {hasActiveFilters && <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <div className="py-2">
                      <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
                      <SearchFilters 
                        filters={filterParams} 
                        onChange={handleFilterChange}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}
        
          {/* Desktop Left Sidebar with Filters */}
          {!isMobile && showFilters && (
            <div className="w-1/4 bg-white rounded-lg shadow p-6">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10"
                  placeholder="City, Address, ZIP, or Neighborhood"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  className="absolute inset-y-0 right-0 px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <SearchFilters 
                  filters={filterParams} 
                  onChange={handleFilterChange} 
                />
              </div>
            </div>
          )}
          
          {/* Main Content - Property Results */}
          <div className={`flex-1 ${!isMobile && showFilters ? '' : 'w-full'}`}>
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-secondary">
                  {isLoading ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    <>Search Results {totalResults > 0 && `(${totalResults})`}</>
                  )}
                </h1>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Property Results */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Properties</h2>
                <p className="text-gray-600 mb-4">
                  There was a problem fetching the property listings. Please try again.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : properties && properties.length > 0 ? (
              <PropertyGrid properties={properties} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
                <p className="text-gray-600 mb-4">
                  We couldn't find any properties matching your search criteria. Try adjusting your filters.
                </p>
                <Button onClick={() => handleFilterChange({})}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
