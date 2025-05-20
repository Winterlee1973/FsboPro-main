import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Home, Bed, Bath, LandPlot, Eye, Heart, Share2, Award } from "lucide-react";
import { Helmet } from "react-helmet";

export default function SamplePropertyPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Sample property data
  const property = {
    id: 11743,
    title: "Luxury Waterfront Home with Private Dock",
    description: "This stunning waterfront property offers breathtaking views and luxury living at its finest. With 5 bedrooms, 4.5 bathrooms, and over 4,000 square feet of living space, this home is perfect for families and entertaining. Features include a gourmet kitchen with high-end appliances, a spacious primary suite with lake views, and a finished basement with a home theater. The outdoor space is equally impressive with a private dock, outdoor kitchen, and infinity pool. Located in a sought-after neighborhood with excellent schools and just minutes from shopping and dining.",
    price: 1250000,
    address: "123 Lakeshore Drive",
    city: "Lakeside",
    state: "CA",
    zipCode: "90210",
    bedrooms: 5,
    bathrooms: 4.5,
    squareFeet: 4200,
    lotSize: 0.75,
    yearBuilt: 2015,
    propertyType: "House",
    status: "Active",
    isPremium: true,
    viewCount: 253,
    images: [
      {
        id: 1, 
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=800",
        caption: "Front exterior view"
      },
      {
        id: 2, 
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=800",
        caption: "Living room with lake view"
      },
      {
        id: 3, 
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=800",
        caption: "Gourmet kitchen"
      },
      {
        id: 4, 
        url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=800",
        caption: "Master bedroom suite"
      },
      {
        id: 5, 
        url: "https://images.unsplash.com/photo-1600563438938-a9a27215d8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=800",
        caption: "Outdoor patio and pool"
      }
    ],
    features: [
      "Private dock",
      "Infinity pool",
      "Outdoor kitchen",
      "Home theater",
      "Smart home system",
      "Wine cellar",
      "3-car garage",
      "Gourmet kitchen",
      "Walk-in closets"
    ]
  };

  // Format price with commas and dollar sign
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>{property.title} | HomeDirect</title>
        <meta
          name="description"
          content={`${property.bedrooms} bed, ${property.bathrooms} bath, ${property.squareFeet.toLocaleString()} sqft home for sale at ${property.address}, ${property.city}, ${property.state} ${property.zipCode} for ${formatPrice(property.price)}.`}
        />
      </Helmet>
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={property.images[0].url}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
              {property.isPremium && (
                <div className="absolute top-6 left-6">
                  <div className="bg-[hsl(var(--premium))] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    Premium Listing
                  </div>
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
                    Listed May 4, 2025 · For sale by owner
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

              {/* Photo Gallery */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.images.map((image) => (
                    <div key={image.id} className="rounded-lg overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.caption}
                        className="w-full h-64 object-cover transition hover:opacity-90 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">About This Home</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    {property.description}
                  </p>
                </div>
              </div>

              {/* Features Section */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">Features & Amenities</h2>
                <div className="grid md:grid-cols-3 gap-y-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">{property.status}</p>
                  </div>
                </div>
              </div>

              {/* Contact Action Buttons */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!isAuthenticated ? (
                    <a href="/api/login">
                      <Button size="lg" className="bg-[hsl(var(--premium))] hover:bg-amber-500 text-white">
                        Log In to Contact Seller
                      </Button>
                    </a>
                  ) : (
                    <>
                      <Button 
                        size="lg"
                        className="bg-[hsl(var(--premium))] hover:bg-amber-500 text-white"
                        onClick={() => navigate(`/property/${property.id}/contact`)}
                      >
                        Contact Seller
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => navigate(`/property/${property.id}/contact?tab=offer`)}
                      >
                        Make an Offer
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}