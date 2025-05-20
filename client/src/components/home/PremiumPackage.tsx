import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Check } from "lucide-react";

export function PremiumPackage() {
  const features = [
    {
      title: "Featured Placement",
      description: "Your property appears at the top of search results"
    },
    {
      title: "Professional Photography",
      description: "High-quality photos that showcase your home"
    },
    {
      title: "Virtual Tour",
      description: "Immersive 3D walkthrough of your property"
    },
    {
      title: "Unlimited Photos",
      description: "No limit on the number of photos you can upload"
    },
    {
      title: "SEO Optimization",
      description: "Enhanced visibility in search engines"
    },
    {
      title: "Social Media Promotion",
      description: "Your listing shared across our networks"
    },
    {
      title: "Premium Badge",
      description: "Stand out with a verified premium listing badge"
    },
    {
      title: "Detailed Analytics",
      description: "Track views, saves, and buyer interest"
    }
  ];

  return (
    <section id="premium-package" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-[hsl(var(--premium))] bg-opacity-20 text-[hsl(var(--premium))] px-4 py-1 rounded-full text-sm font-semibold mb-3">
            SELLER ADVANTAGE
          </span>
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Premium Listing Package
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get maximum visibility for your property with our comprehensive premium listing package.
          </p>
        </div>

        <div className="premium-gradient rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="p-8 md:p-12 bg-white">
              <h3 className="text-2xl font-bold text-secondary mb-6">
                Premium Listing
              </h3>
              <div className="mb-6">
                <div className="text-5xl font-bold text-[hsl(var(--premium))] mb-2">$999</div>
                <p className="text-gray-600">One-time payment</p>
              </div>
              <Link href="/list-property">
                <Button className="w-full bg-[hsl(var(--premium))] hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg shadow mb-6">
                  Get Started
                </Button>
              </Link>
              <p className="text-gray-600 text-sm">No recurring fees or hidden charges</p>
            </div>

            <div className="md:col-span-2 p-8 md:p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">
                Everything You Need to Sell Faster
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-[hsl(var(--premium))] mr-3 pt-1">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-gray-200 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
