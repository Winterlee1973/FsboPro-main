import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type PropertyImage } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGalleryProps {
  propertyId: number;
  featuredImage?: string;
}

export function PropertyGallery({ propertyId, featuredImage }: PropertyGalleryProps) {
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: images, isLoading } = useQuery<PropertyImage[]>({
    queryKey: [`/api/properties/${propertyId}/images`],
    enabled: !!propertyId,
  });
  
  // Combine featured image with other images
  const allImages = [
    ...(featuredImage ? [{ imageUrl: featuredImage, caption: 'Featured Image' }] : []),
    ...(images || [])
  ];
  
  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-96 rounded-lg mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!allImages.length) {
    return (
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
        <p className="text-gray-500">No images available for this property</p>
      </div>
    );
  }
  
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  // Gallery grid view
  const galleryGrid = (
    <>
      <h2 className="text-2xl font-bold text-secondary mb-4">Photo Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allImages.slice(0, 4).map((image, index) => (
          <img 
            key={index}
            src={image.imageUrl} 
            alt={image.caption || `Property image ${index + 1}`}
            className="rounded-lg object-cover h-48 w-full cursor-pointer hover:opacity-90 transition"
            onClick={() => {
              setCurrentImageIndex(index);
              setShowFullGallery(true);
            }}
          />
        ))}
      </div>
      {allImages.length > 4 && (
        <div className="mt-4 text-center">
          <Button 
            variant="link"
            onClick={() => setShowFullGallery(true)}
          >
            View All {allImages.length} Photos
          </Button>
        </div>
      )}
    </>
  );
  
  // Fullscreen gallery
  const fullGallery = (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="flex justify-between p-4">
        <div className="text-white text-sm">
          {currentImageIndex + 1} / {allImages.length}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white" 
          onClick={() => setShowFullGallery(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 text-white hover:bg-white/10 z-10"
          onClick={() => handleNavigate('prev')}
        >
          <ChevronLeft className="h-10 w-10" />
        </Button>
        
        <img 
          src={allImages[currentImageIndex].imageUrl} 
          alt={allImages[currentImageIndex].caption || `Property image ${currentImageIndex + 1}`}
          className="max-h-[80vh] max-w-[90vw] object-contain"
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 text-white hover:bg-white/10 z-10"
          onClick={() => handleNavigate('next')}
        >
          <ChevronRight className="h-10 w-10" />
        </Button>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="p-4 bg-black bg-opacity-50">
        <div className="flex overflow-x-auto gap-2 py-2">
          {allImages.map((image, index) => (
            <img 
              key={index}
              src={image.imageUrl} 
              alt={image.caption || `Thumbnail ${index + 1}`}
              className={cn(
                "h-16 w-24 object-cover rounded cursor-pointer transition",
                currentImageIndex === index ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
              )}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="border-t border-gray-200 pt-8 mb-8">
      {galleryGrid}
      {showFullGallery && fullGallery}
    </div>
  );
}
