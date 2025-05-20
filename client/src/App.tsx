import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import SamplePropertyPage from "@/pages/SamplePropertyPage";
import ContactSellerPage from "@/pages/ContactSellerPage";
import ListingPage from "@/pages/ListingPage";
import PremiumUpgradePage from "@/pages/PremiumUpgradePage";
import UserDashboard from "@/pages/UserDashboard";
import SellerDashboard from "@/pages/SellerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import MessageCenter from "@/pages/MessageCenter";
import HowItWorksPage from "@/pages/HowItWorksPage";
import RegisterSelectionPage from "@/pages/RegisterSelectionPage";
import PropertiesPage from "@/pages/PropertiesPage";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Check if current route is admin dashboard to hide navbar/footer
  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className="min-h-screen">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/property/11743" component={SamplePropertyPage} />
          <Route path="/property/:id" component={PropertyDetailPage} />
          <Route path="/property/:id/contact" component={ContactSellerPage} />
          <Route path="/list-property" component={ListingPage} />
          <Route path="/premium-upgrade/:id" component={PremiumUpgradePage} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/seller-dashboard" component={SellerDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/messages" component={MessageCenter} />
          <Route path="/how-it-works" component={HowItWorksPage} />
          <Route path="/register" component={RegisterSelectionPage} />
          <Route path="/properties" component={PropertiesPage} />
          {/* Property detail page contains contact/bidding functionality */}
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
