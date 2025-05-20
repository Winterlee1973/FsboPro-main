import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Sell Your Home Without the Middleman?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Join thousands of homeowners who have successfully sold their properties and saved on commission fees.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/list-property">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary font-semibold hover:bg-gray-100"
            >
              Create Your Listing
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
