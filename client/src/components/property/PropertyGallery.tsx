import { useState, useEffect } from "react"; // Added useEffect
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { type PropertyImage } from "@shared/schema"; // No longer needed directly
// import { Skeleton } from "@/components/ui/skeleton"; // No longer needed

// Define ImageObject locally, or import from a shared types file
interface ImageObject {
  url: string;
  caption?: string;
}

interface PropertyGalleryProps {
  allImages: ImageObject[];
  // To control the modal from outside, we'll need a way to set showFullGallery.
  // This will be handled in a subsequent task. For now, we'll add a prop
  // to externally control its visibility and initial image.
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function PropertyGallery({ allImages, isOpen, onClose, initialIndex = 0 }: PropertyGalleryProps) {
  const [showFullGallery, setShowFullGallery] = useState(isOpen);
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);

  useEffect(() => {
    setShowFullGallery(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);
  
  // Early return if no images are provided, though PropertyDetailPage should ideally handle this.
  if (!allImages || allImages.length === 0) {
    return null; 
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
  
  // Fullscreen gallery
  const fullGallery = (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex flex-col"> {/* Increased z-index */}
      <div className="flex justify-between p-4">
        <div className="text-white text-sm">
          {currentImageIndex + 1} / {allImages.length}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white" 
          onClick={() => {
            setShowFullGallery(false);
            onClose(); // Call the onClose prop
          }}
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
          src={allImages[currentImageIndex].url}
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
              src={image.url}
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
    <>
      {showFullGallery && fullGallery}
    </>
  );
}
