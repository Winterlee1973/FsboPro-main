import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, MessageSquare, Handshake } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Home className="text-primary text-2xl" />,
      title: "1. Create Your Listing",
      description: "Upload photos, add property details, set your price, and choose your listing package."
    },
    {
      icon: <MessageSquare className="text-primary text-2xl" />,
      title: "2. Connect with Buyers",
      description: "Receive messages and offers directly from interested buyers through our secure platform."
    },
    {
      icon: <Handshake className="text-primary text-2xl" />,
      title: "3. Close the Deal",
      description: "Negotiate terms, accept an offer, and use our resources to complete the sale process."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            How HomeDirect Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sell your home directly to buyers in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="feature-icon">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/list-property">
            <Button size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
