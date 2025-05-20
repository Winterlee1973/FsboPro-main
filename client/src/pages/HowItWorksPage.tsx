import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Home, 
  Search, 
  FileText, 
  Camera, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Shield
} from "lucide-react";

export default function HowItWorksPage() {
  const [, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>How It Works | HomeDirect</title>
        <meta
          name="description"
          content="Learn how HomeDirect helps you sell your home directly without a realtor. For Sale By Owner simplified."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-secondary mb-6">
              How HomeDirect Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We make it easy to sell your home directly without a realtor, 
              saving you thousands in commission fees while connecting you 
              with serious buyers.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/list-property")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              List Your Property <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">
            The Simple 4-Step Process
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-secondary mb-3">1. Create Your Listing</h3>
              <p className="text-gray-600 text-center">
                Complete our simple form with your property details, add high-quality photos, and set your price.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-secondary mb-3">2. Upgrade to Premium</h3>
              <p className="text-gray-600 text-center">
                Boost visibility with our Premium package. Get featured placement, enhanced property details, and more buyer interest.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-secondary mb-3">3. Connect with Buyers</h3>
              <p className="text-gray-600 text-center">
                Receive inquiries directly from interested buyers. Schedule viewings and answer questions on your terms.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-secondary mb-3">4. Close the Deal</h3>
              <p className="text-gray-600 text-center">
                Receive and negotiate offers through our platform. When you're ready, finalize the sale directly with the buyer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Premium Listing Benefits
            </h2>
            <p className="text-xl text-gray-600">
              For just $999, our Premium package gives you everything you need to sell your home faster and at the best price.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Search className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-secondary">Enhanced Visibility</h3>
              </div>
              <p className="text-gray-600">
                Your property gets featured placement on our homepage and appears at the top of search results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-secondary">More Photos & Virtual Tour</h3>
              </div>
              <p className="text-gray-600">
                Upload up to 25 high-quality photos and add a virtual tour link to showcase your property.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-secondary">Higher Engagement</h3>
              </div>
              <p className="text-gray-600">
                Premium listings receive 3.5x more views and 2.8x more inquiries than standard listings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-secondary">Advanced Scheduling</h3>
              </div>
              <p className="text-gray-600">
                Premium listing includes an integrated showing schedule so buyers can book appointments with you directly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-secondary">Verified Badge</h3>
              </div>
              <p className="text-gray-600">
                Premium listings display a verified badge, building buyer trust and increasing your credibility.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-secondary">Dedicated Support</h3>
              </div>
              <p className="text-gray-600">
                Premium sellers get priority customer support and guidance throughout the selling process.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/list-property")}
              className="bg-[hsl(var(--premium))] hover:bg-amber-500 text-white"
            >
              Create Premium Listing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-3">
                How much can I save selling without a realtor?
              </h3>
              <p className="text-gray-600">
                On average, sellers save 5-6% of their home's sale price by not paying realtor commissions. On a $400,000 home, that's $20,000-$24,000 in savings!
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-3">
                Do I need any real estate experience?
              </h3>
              <p className="text-gray-600">
                No experience needed! Our platform is designed to guide you through each step of the selling process with clear instructions and resources.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-3">
                What if I need help with legal documents?
              </h3>
              <p className="text-gray-600">
                We provide downloadable templates for common real estate documents. However, we recommend consulting with a real estate attorney for final review.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-3">
                How long do Premium listings stay active?
              </h3>
              <p className="text-gray-600">
                Premium listings remain active for 90 days. If your property hasn't sold in that time, you can renew at a discounted rate or continue with a standard listing.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-3">
                Can I edit my listing after publishing?
              </h3>
              <p className="text-gray-600">
                Yes, you can edit your listing details, photos, and price at any time through your seller dashboard.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-3">
                How do buyers schedule property viewings?
              </h3>
              <p className="text-gray-600">
                Buyers can request viewings directly through your property page. You'll receive notifications and can accept, suggest alternative times, or decline.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate("/contact")}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Ready to Sell Your Home?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of successful FSBO sellers who saved money and had complete control of their home sale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/list-property")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                List Your Property
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/#featured")}
              >
                Browse Listings
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}