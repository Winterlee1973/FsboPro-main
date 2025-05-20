import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import { PremiumBadge } from "@/components/common/PremiumBadge";
import { type Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatTimeAgo } from "@/lib/propertyUtils";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group">
      <div className="relative">
        <img
          src={property.featuredImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
          alt={property.title}
          className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
        />
        {property.isPremium && (
          <div className="absolute top-4 left-4">
            <PremiumBadge />
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-lg text-sm font-medium">
          <Badge variant="outline">
            {property.propertyType}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-secondary mb-1">
              {formatPrice(property.price)}
            </h3>
            <p className="text-gray-600">
              {property.bedrooms} bd | {property.bathrooms} ba | {property.squareFeet.toLocaleString()} sqft
            </p>
          </div>
          <button 
            onClick={toggleFavorite}
            className={`text-gray-400 hover:text-primary ${isFavorited ? 'text-primary' : ''}`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
        <p className="text-gray-800 font-medium mt-3 mb-1">
          {property.address}, {property.city}, {property.state} {property.zipCode}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Listed {formatTimeAgo(property.createdAt)} · For sale by owner
        </p>
        <div className="flex justify-between">
          <Link href={`/property/${property.id}`}>
            <Button variant="link" className="px-0">
              View Details
            </Button>
          </Link>
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="h-4 w-4 mr-1" />
            {property.viewCount} views
          </div>
        </div>
      </div>
    </div>
  );
}
