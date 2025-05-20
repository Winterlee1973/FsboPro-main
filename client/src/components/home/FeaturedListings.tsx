import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "../property/PropertyCard";
import { Link } from "wouter";
import { type Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedListings() {
  const {
    data: featuredProperties,
    isLoading,
    error,
  } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-60" />
                <div className="p-5">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-secondary mb-2">
              Unable to load featured listings
            </h2>
            <p className="text-gray-500">
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-properties" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">
            Featured Premium Listings
          </h2>
          <span className="text-primary font-medium">Featured Properties</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties && featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-semibold text-secondary mb-2">
                No premium listings available
              </h3>
              <p className="text-gray-500 mb-4">
                Be the first to add a premium listing and get featured here!
              </p>
              <Link href="/list-property">
                <span className="text-primary font-medium hover:underline cursor-pointer">
                  Create a Listing
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
