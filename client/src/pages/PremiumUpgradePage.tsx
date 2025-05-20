import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeToPremium } from "@/components/listing/UpgradeToPremium";
import { Button } from "@/components/ui/button";
import { Property } from "@shared/schema";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function PremiumUpgradePage() {
  const params = useParams<{ id: string }>();
  const propertyId = parseInt(params.id);
  const [, navigate] = useLocation();
  
  // Fetch property details
  const {
    data: property,
    isLoading,
    error,
  } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !isNaN(propertyId),
  });
  
  // Redirect if invalid ID
  useEffect(() => {
    if (!isNaN(propertyId) && error) {
      navigate("/not-found");
    }
  }, [propertyId, error, navigate]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto my-16 text-center px-4">
        <h1 className="text-2xl font-bold text-secondary mb-4">
          Property Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the property you're looking for. It may have been removed or the ID is invalid.
        </p>
        <Button onClick={() => navigate("/list-property")}>
          Create a New Listing
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Upgrade to Premium Listing | HomeDirect</title>
        <meta
          name="description"
          content="Upgrade your property listing to premium status. Get priority placement, enhanced visibility, and more potential buyers."
        />
        <meta property="og:title" content="Upgrade to Premium Listing | HomeDirect" />
        <meta
          property="og:description"
          content="Upgrade your property listing to premium status. Get priority placement, enhanced visibility, and more potential buyers."
        />
      </Helmet>
      
      <UpgradeToPremium property={property} />
    </>
  );
}
