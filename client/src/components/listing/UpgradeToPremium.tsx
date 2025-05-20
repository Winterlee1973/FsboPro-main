import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { PremiumBadge } from "@/components/common/PremiumBadge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/propertyUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Check, ChevronRight, AlertCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Property } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Make sure to call loadStripe outside of a component's render to avoid recreating the Stripe object
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn("Missing Stripe public key - payment features may be limited");
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Premium features list
const PREMIUM_FEATURES = [
  "Featured Placement at the top of search results",
  "Professional Photography service",
  "Virtual Tour of your property",
  "Unlimited Photos",
  "SEO Optimization for better visibility",
  "Social Media Promotion",
  "Premium Badge on your listing",
  "Detailed Analytics dashboard"
];

interface CheckoutFormProps {
  propertyId: number;
  onSuccess: () => void;
}

function CheckoutForm({ propertyId, onSuccess }: CheckoutFormProps) {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment");
        toast({
          title: "Payment Failed",
          description: error.message || "Please check your card details and try again.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Verify the payment with our backend
        await apiRequest("POST", "/api/premium-listing/verify", {
          paymentIntentId: paymentIntent.id,
          propertyId,
        });
        
        toast({
          title: "Payment Successful",
          description: "Your listing has been upgraded to premium!",
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
        
        // Call the success callback
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "There was a problem processing your payment.",
        variant: "destructive",
      });
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <PaymentElement />
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? "Processing..." : "Pay $999 - Upgrade to Premium"}
      </Button>
    </form>
  );
}

interface UpgradeToPremiumProps {
  property: Property;
}

export function UpgradeToPremium({ property }: UpgradeToPremiumProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if the property is already premium
  const isPremium = property.isPremium;
  
  // Check if the user is the owner of the property
  const isOwner = user && user.id === property.userId;
  
  useEffect(() => {
    // If the user is authenticated and the property is not already premium
    // and the user is the owner, initialize Stripe
    if (isAuthenticated && !isPremium && isOwner && showPayment && !clientSecret) {
      initializePayment();
    }
  }, [isAuthenticated, property, showPayment, isOwner, isPremium, clientSecret]);
  
  const initializePayment = async () => {
    if (!stripePromise) {
      toast({
        title: "Payment Not Available",
        description: "Payment processing is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        propertyId: property.id,
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      console.error("Payment initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuccess = () => {
    // Redirect to the property page after successful upgrade
    setTimeout(() => {
      navigate(`/properties/${property.id}`);
    }, 2000);
  };
  
  // If the property is already premium, show a message
  if (isPremium) {
    return (
      <Card className="max-w-3xl mx-auto my-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PremiumBadge className="mx-auto" />
          </div>
          <CardTitle className="text-2xl">Already a Premium Listing!</CardTitle>
          <CardDescription>
            This property is already enjoying all premium benefits until{" "}
            {property.premiumUntil 
              ? new Date(property.premiumUntil).toLocaleDateString() 
              : "the end of your subscription"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => navigate(`/properties/${property.id}`)}
              className="mt-4"
            >
              View Your Listing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If the user is not the owner, they can't upgrade the property
  if (isAuthenticated && !isOwner) {
    return (
      <Card className="max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-xl text-red-500">Not Authorized</CardTitle>
          <CardDescription>
            You are not the owner of this property and cannot upgrade it to premium.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={() => navigate(`/properties/${property.id}`)}
            variant="outline"
          >
            View Property
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If the user is not authenticated, prompt them to sign in
  if (!isAuthenticated) {
    return (
      <Card className="max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-xl">Sign In Required</CardTitle>
          <CardDescription>
            You need to be signed in to upgrade your listing to premium.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <a href="/api/login">
            <Button>Sign In to Continue</Button>
          </a>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-block bg-[hsl(var(--premium))] bg-opacity-20 text-[hsl(var(--premium))] px-4 py-1 rounded-full text-sm font-semibold mb-3">
          PREMIUM UPGRADE
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-2">
          Upgrade Your Listing to Premium
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get maximum visibility and sell your property faster with our Premium Listing package.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Your Property</span>
              <span className="text-[hsl(var(--premium))]">{formatPrice(property.price)}</span>
            </CardTitle>
            <CardDescription>
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-100">
              <img
                src={property.featuredImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <div className="flex gap-4 text-gray-600">
              <span>{property.bedrooms} bd</span>
              <span>{property.bathrooms} ba</span>
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
            <p className="text-gray-600 line-clamp-3">{property.description}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 text-[hsl(var(--premium))] mr-2" />
              Premium Listing Package
            </CardTitle>
            <CardDescription>
              One-time payment of ${(999).toLocaleString()} for 30 days of premium benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showPayment ? (
              <>
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm propertyId={property.id} onSuccess={handleSuccess} />
                  </Elements>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Payment Not Available</AlertTitle>
                    <AlertDescription>
                      Unable to initialize payment processing. Please try again later.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <>
                <ul className="space-y-3">
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--premium))]" />
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => setShowPayment(true)} 
                    className="w-full bg-[hsl(var(--premium))] hover:bg-amber-500 text-white font-semibold"
                    size="lg"
                  >
                    Upgrade Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          {!showPayment && (
            <CardFooter className="flex justify-center border-t pt-6">
              <Button 
                variant="outline"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                Continue with Free Listing
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
