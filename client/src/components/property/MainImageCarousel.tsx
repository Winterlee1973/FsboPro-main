import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// Card and CardContent can be used for additional structure if needed, but starting with simple divs
// import { Card, CardContent } from "@/components/ui/card";

interface ImageObject {
  imageUrl: string;
  caption?: string;
}

interface MainImageCarouselProps {
  images: ImageObject[];
}

export function MainImageCarousel({ images }: MainImageCarouselProps) {
  if (!images || images.length === 0) {
    // In a real scenario, PropertyDetailPage should ideally prevent rendering this
    // if there are no images, or show a more integrated placeholder.
    // For now, this serves as a basic guard.
    return (
      <div className="flex items-center justify-center h-[400px] md:h-[500px] bg-gray-100 rounded-md">
        <p className="text-gray-500">No images to display.</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        loop: images.length > 1, // Enable loop only if there's more than one image
      }}
      className="w-full max-w-full relative group" // Added relative and group for button positioning
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-0"> {/* Removed padding for edge-to-edge image */}
              {/* Using a simple div wrapper for the image for now. Card can be added if complex content is needed. */}
              <img
                src={image.imageUrl}
                alt={image.caption || `Property image ${index + 1}`}
                className="w-full h-[400px] md:h-[500px] object-cover rounded-md" // Responsive height and ensure rounding
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-black bg-opacity-50 text-white text-center text-sm">
                  {image.caption}
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && ( // Only show navigation if there's more than one image
        <>
          <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-black h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-black h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
    </Carousel>
  );
}

export default MainImageCarousel;
