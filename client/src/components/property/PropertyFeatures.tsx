import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { type PropertyFeature } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyFeaturesProps {
  propertyId: number;
}

export function PropertyFeatures({ propertyId }: PropertyFeaturesProps) {
  const { data: features, isLoading, error } = useQuery<PropertyFeature[]>({
    queryKey: [`/api/properties/${propertyId}/features`],
    enabled: !!propertyId,
  });
  
  if (isLoading) {
    return (
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Features & Amenities</h2>
        <div className="grid md:grid-cols-3 gap-y-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-40" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !features) {
    return (
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Features & Amenities</h2>
        <p className="text-gray-600">Unable to load property features.</p>
      </div>
    );
  }
  
  if (features.length === 0) {
    return (
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Features & Amenities</h2>
        <p className="text-gray-600">No features listed for this property.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8 mb-8">
      <h2 className="text-2xl font-bold text-secondary mb-4">Features & Amenities</h2>
      <div className="grid md:grid-cols-3 gap-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check className="text-primary mr-2" />
            <span className="text-gray-700">{feature.feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
