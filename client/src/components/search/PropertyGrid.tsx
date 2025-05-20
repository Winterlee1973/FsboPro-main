import { useState } from "react";
import { type Property } from "@shared/schema";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;
  
  // Sort properties based on selected option
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "bedrooms":
        return b.bedrooms - a.bedrooms;
      case "bathrooms":
        return b.bathrooms - a.bathrooms;
      case "sqft":
        return b.squareFeet - a.squareFeet;
      case "views":
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });
  
  // Get current page of properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  
  return (
    <div>
      <div className="flex justify-between mb-6">
        <p className="text-gray-500">
          Showing {indexOfFirstProperty + 1}-
          {Math.min(indexOfLastProperty, properties.length)} of {properties.length} results
        </p>
        
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
            <SelectItem value="bathrooms">Most Bathrooms</SelectItem>
            <SelectItem value="sqft">Largest Size</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                // Show first 2 pages, current page, and last 2 pages
                const pageNumber = index + 1;
                const showPageNumber = 
                  pageNumber <= 2 || 
                  pageNumber > totalPages - 2 || 
                  Math.abs(pageNumber - currentPage) <= 1;
                
                // Show ellipsis for page gaps
                if (!showPageNumber) {
                  // Show ellipsis only once between gaps
                  if (pageNumber === 3 || pageNumber === totalPages - 2) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <span className="px-4">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
