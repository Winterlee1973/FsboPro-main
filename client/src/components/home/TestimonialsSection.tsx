import { Star, StarHalf } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      text: "I saved over $15,000 in commission fees by using HomeDirect. The premium listing gave my house amazing visibility, and I had multiple offers within a week!",
      name: "Jennifer L.",
      location: "Austin, TX",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      text: "The virtual tour and professional photos that came with my premium listing made all the difference. Buyers could really see the value of my home before visiting.",
      name: "Michael R.",
      location: "Seattle, WA",
      rating: 5,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      text: "I was hesitant about selling without an agent, but HomeDirect made it easy. The direct messaging with buyers helped me find the right family for my home.",
      name: "Sarah T.",
      location: "Denver, CO",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    }
  ];

  // Helper function to render stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="fill-[hsl(var(--premium))] text-[hsl(var(--premium))]" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="fill-[hsl(var(--premium))] text-[hsl(var(--premium))]" />
      );
    }
    
    return stars;
  };

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how homeowners like you sold their properties with HomeDirect
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="flex items-center mb-4">
                <div className="flex text-[hsl(var(--premium))]">
                  {renderRating(testimonial.rating)}
                </div>
                <p className="ml-2 text-sm text-gray-600">{testimonial.rating.toFixed(1)}</p>
              </div>
              <blockquote className="mb-4">
                <p className="text-gray-800">{testimonial.text}</p>
              </blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-secondary">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
