import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Home, UserPlus, Building } from "lucide-react";

export default function RegisterSelectionPage() {
  const [, navigate] = useLocation();

  const handleSelection = (userType: string) => {
    // Store user selection in local storage and redirect to login
    localStorage.setItem("userTypeSelection", userType);
    window.location.href = "/login";
  };

  return (
    <>
      <Helmet>
        <title>Register as Buyer or Seller | HomeDirect</title>
        <meta
          name="description"
          content="Register to buy or sell properties on HomeDirect. Find your perfect home or list your property for sale."
        />
      </Helmet>

      <div className="py-12 min-h-screen flex flex-col justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary mb-4">Join HomeDirect</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you want to use HomeDirect. You can always change your role later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary cursor-pointer"
              onClick={() => handleSelection("buyer")}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
                  <UserPlus className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-secondary mb-4">Register as a Buyer</h2>
              <p className="text-gray-600 text-center mb-6">
                Browse listings, save favorites, contact sellers, and make offers on properties.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Browse all available properties</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Contact sellers directly</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Schedule property viewings</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Submit and track offers</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => handleSelection("buyer")}
              >
                Continue as Buyer
              </Button>
            </div>

            <div 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-[hsl(var(--premium))] cursor-pointer"
              onClick={() => handleSelection("seller")}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-[hsl(var(--premium))]/10 w-20 h-20 rounded-full flex items-center justify-center">
                  <Building className="h-10 w-10 text-[hsl(var(--premium))]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-secondary mb-4">Register as a Seller</h2>
              <p className="text-gray-600 text-center mb-6">
                List your property, connect with buyers, and manage offers - all without agent commissions.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create detailed property listings</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Upgrade to Premium for better visibility</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manage showing requests</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Receive and respond to offers</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-[hsl(var(--premium))] hover:bg-amber-500 text-white"
                onClick={() => handleSelection("seller")}
              >
                Continue as Seller
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500">
              Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}