import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { type Property, type User } from "@shared/schema";
import { PremiumBadge } from "@/components/common/PremiumBadge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { SubmitOffer } from "@/components/property/SubmitOffer";
import { ContactSeller } from "@/components/property/ContactSeller";
import { formatPrice, formatTimeAgo } from "@/lib/propertyUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bed, Bath, LandPlot, Eye, Heart, Share2 } from "lucide-react";
import { Helmet } from "react-helmet";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const propertyId = parseInt(params.id);
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Fetch property details
  const {
    data: property,
    isLoading: isPropertyLoading,
    error: propertyError,
  } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !isNaN(propertyId),
  });
  
  // Fetch seller information if property is loaded
  const {
    data: seller,
    isLoading: isSellerLoading,
  } = useQuery<User>({
    queryKey: [property ? `/api/auth/user/${property.userId}` : null],
    enabled: !!property && !!property.userId,
  });
  
  // Redirect if invalid ID
  useEffect(() => {
    if (!isNaN(propertyId) && propertyError) {
      navigate("/not-found");
    }
  }, [propertyId, propertyError, navigate]);
  
  // Loading state
  if (isPropertyLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Skeleton className="w-full h-96" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <Skeleton className="h-10 w-40 mb-2" />
                  <Skeleton className="h-6 w-64 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
              <Skeleton className="h-64 w-full mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Error state
  if (propertyError || !property) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Property Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The property you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{property.title} | HomeDirect</title>
        <meta
          name="description"
          content={`${property.bedrooms} bed, ${property.bathrooms} bath, ${property.squareFeet.toLocaleString()} sqft home for sale at ${property.address}, ${property.city}, ${property.state} ${property.zipCode} for ${formatPrice(property.price)}.`}
        />
        <meta property="og:title" content={`${property.title} | HomeDirect`} />
        <meta
          property="og:description"
          content={`${property.bedrooms} bed, ${property.bathrooms} bath, ${property.squareFeet.toLocaleString()} sqft home for sale at ${property.address}, ${property.city}, ${property.state} ${property.zipCode} for ${formatPrice(property.price)}.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={property.featuredImage || ""} />
      </Helmet>
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={property.featuredImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&h=600"}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
              {property.isPremium && (
                <div className="absolute top-6 left-6">
                  <PremiumBadge />
                </div>
              )}
              <div className="absolute top-6 right-6 flex space-x-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-2">
                    {formatPrice(property.price)}
                  </h1>
                  <p className="text-xl text-gray-700 mb-1">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                  <p className="text-gray-600">
                    Listed {formatTimeAgo(property.createdAt)} · For sale by owner
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Eye className="h-5 w-5 mr-2" />
                    <span>{property.viewCount} people viewed this property</span>
                  </div>
                  {!isAuthenticated ? (
                    <a href="/api/login">
                      <Button className="bg-[hsl(var(--premium))] hover:bg-amber-500 text-white">
                        Log In to Contact Seller
                      </Button>
                    </a>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        className="bg-[hsl(var(--premium))] hover:bg-amber-500 text-white"
                        onClick={() => navigate(`/property/${property.id}/contact`)}
                      >
                        Contact Seller
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/property/${property.id}/contact?tab=offer`)}
                      >
                        Make Offer
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center">
                  <Bed className="text-primary text-xl mr-3 h-6 w-6" />
                  <div>
                    <p className="text-gray-600 text-sm">Bedrooms</p>
                    <p className="text-lg font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="text-primary text-xl mr-3 h-6 w-6" />
                  <div>
                    <p className="text-gray-600 text-sm">Bathrooms</p>
                    <p className="text-lg font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <LandPlot className="text-primary text-xl mr-3 h-6 w-6" />
                  <div>
                    <p className="text-gray-600 text-sm">Square Feet</p>
                    <p className="text-lg font-semibold">{property.squareFeet.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <PropertyGallery 
                propertyId={property.id}
                featuredImage={property.featuredImage}
              />

              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">About This Home</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    {property.description}
                  </p>
                </div>
              </div>

              <PropertyFeatures propertyId={property.id} />

              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">Location</h2>
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-4xl mb-3 mx-auto">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p className="text-gray-700">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600">Year Built</p>
                    <p className="font-medium">{property.yearBuilt || "Not specified"}</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">{property.status}</p>
                  </div>
                </div>
              </div>

              <SubmitOffer property={property} />
              
              <ContactSeller property={property} seller={seller} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
