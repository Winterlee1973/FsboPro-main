import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Property, Offer, Message, PremiumTransaction } from "@shared/schema";
import { formatPrice, formatTimeAgo } from "@/lib/propertyUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Home, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  Award, 
  ArrowUpRight, 
  Plus,
  Check, 
  X,
  User,
  BarChart4,
  LogOut
} from "lucide-react";
import { PremiumBadge } from "@/components/common/PremiumBadge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase"; // Import supabase client
import { Helmet } from "react-helmet";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SellerDashboard() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation(); // Use setLocation from wouter
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("properties");
  
  // Fetch user's properties
  const {
    data: properties,
    isLoading: isPropertiesLoading,
  } = useQuery<Property[]>({
    queryKey: [user ? `/api/users/${user?.id}/properties` : null],
    enabled: isAuthenticated && !!user,
  });
  
  // Fetch offers on user's properties
  const {
    data: receivedOffers,
    isLoading: isOffersLoading,
  } = useQuery<Offer[]>({
    queryKey: ["/api/users/received-offers"],
    enabled: isAuthenticated,
  });
  
  // Fetch messages related to user's properties
  const {
    data: propertyMessages,
    isLoading: isMessagesLoading,
  } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });
  
  // Fetch premium transactions
  const {
    data: premiumTransactions,
    isLoading: isTransactionsLoading,
  } = useQuery<PremiumTransaction[]>({
    queryKey: [user ? `/api/users/${user?.id}/transactions` : null],
    enabled: isAuthenticated && !!user,
  });
  
  // Handle offer response (accept/reject)
  const handleOfferResponse = async (offerId: number, status: 'accepted' | 'rejected') => {
    try {
      await apiRequest("PUT", `/api/offers/${offerId}/status`, { status });
      
      toast({
        title: `Offer ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
        description: `You have ${status === 'accepted' ? 'accepted' : 'rejected'} the offer.`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/users/received-offers"] });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${status} offer. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  // If auth is still loading, show skeleton
  if (isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-8 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // If not authenticated or not a seller, redirect to appropriate page
  if (!isAuthLoading && (!isAuthenticated || (user && user.userType !== 'seller'))) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>
              {!isAuthenticated ? "Sign In Required" : "Seller Access Required"}
            </CardTitle>
            <CardDescription>
              {!isAuthenticated 
                ? "You need to be signed in to view the seller dashboard." 
                : "You need to be registered as a seller to access this page."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {!isAuthenticated ? (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            ) : (
              <Button onClick={() => setLocation("/list-property")}>
                Become a Seller
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/login"); // Redirect to login page after logout
  };

  // Prepare chart data
  const prepareViewsData = () => {
    if (!properties) return [];
    
    return properties.map(property => ({
      name: property.address.split(',')[0],
      views: property.viewCount,
      isPremium: property.isPremium,
    })).slice(0, 5); // Limit to 5 properties for better display
  };
  
  const renderPropertyList = () => {
    if (isPropertiesLoading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (!properties || properties.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Properties Listed</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any property listings yet. Create your first listing to start selling.
            </p>
            <Link href="/list-property">
              <Button>Create a Listing</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={property.featuredImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-lg">{formatPrice(property.price)}</div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {property.bedrooms} bd | {property.bathrooms} ba | {property.squareFeet.toLocaleString()} sqft
                      </div>
                      <div className="text-sm mb-2">{property.address}, {property.city}</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Eye className="h-3 w-3 mr-1" />
                          {property.viewCount} views
                        </div>
                        {property.isPremium && <PremiumBadge />}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/properties/${property.id}`}>
                        <Button variant="outline" size="sm" className="w-full">View</Button>
                      </Link>
                      {!property.isPremium && (
                        <Link href={`/premium-upgrade/${property.id}`}>
                          <Button variant="outline" size="sm" className="w-full">Upgrade</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderOffers = () => {
    if (isOffersLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (!receivedOffers || receivedOffers.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Offers Received</h3>
            <p className="text-muted-foreground mb-4">
              You haven't received any offers on your properties yet. Upgrading to premium can help attract more buyers.
            </p>
            <Link href="/list-property">
              <Button>List a New Property</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-4">
        {receivedOffers.map((offer) => (
          <Card key={offer.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg mb-1">
                    Offer: {formatPrice(offer.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Received {formatTimeAgo(offer.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">From Buyer #{offer.buyerId.substring(0, 8)}</span>
                  </div>
                  {offer.message && (
                    <div className="text-sm bg-gray-50 p-2 rounded-md mt-2 mb-2">
                      "{offer.message}"
                    </div>
                  )}
                  <div className="text-sm">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      offer.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : offer.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/properties/${offer.propertyId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Property
                    </Button>
                  </Link>
                  {offer.status === 'pending' && (
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" size="sm" className="w-full">
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Accept this offer?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to accept this offer of {formatPrice(offer.amount)}? 
                              This will notify the buyer that their offer has been accepted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleOfferResponse(offer.id, 'accepted')}>
                              Accept Offer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full text-red-500 border-red-200">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject this offer?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this offer of {formatPrice(offer.amount)}? 
                              This will notify the buyer that their offer has been rejected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleOfferResponse(offer.id, 'rejected')}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Reject Offer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderTransactions = () => {
    if (isTransactionsLoading) {
      return (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (!premiumTransactions || premiumTransactions.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Premium Upgrades</h3>
            <p className="text-muted-foreground mb-4">
              You haven't upgraded any of your properties to premium yet. Premium listings get more visibility and sell faster.
            </p>
            {properties && properties.length > 0 ? (
              <Link href={`/premium-upgrade/${properties[0].id}`}>
                <Button>Upgrade to Premium</Button>
              </Link>
            ) : (
              <Link href="/list-property">
                <Button>Create a Listing</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-4">
        {premiumTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold mb-1">
                    Premium Upgrade: {formatPrice(transaction.amount / 100)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Transaction ID: {transaction.stripePaymentId.substring(0, 16)}...
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Purchased on {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/properties/${transaction.propertyId}`}>
                  <Button variant="outline" size="sm">
                    View Property
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderAnalytics = () => {
    const viewsData = prepareViewsData();
    
    if (isPropertiesLoading) {
      return <Skeleton className="h-80 w-full" />;
    }
    
    if (!properties || properties.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart4 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              You need to have properties listed to see analytics data.
            </p>
            <Link href="/list-property">
              <Button>Create a Listing</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Views</CardTitle>
          <CardDescription>
            Total views across your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [value, 'Views']}
                  labelFormatter={(label: string) => `Property: ${label}`}
                />
                <Bar 
                  dataKey="views" 
                  fill="hsl(var(--primary))" 
                  name="Views"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 justify-between">
          <div className="text-sm text-muted-foreground">
            Premium listings typically get 3x more views.
          </div>
          <Link href="/list-property">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Property
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };
  
  // Calculate summary statistics
  const totalProperties = properties?.length || 0;
  const premiumProperties = properties?.filter(p => p.isPremium).length || 0;
  const totalOffers = receivedOffers?.length || 0;
  const pendingOffers = receivedOffers?.filter(o => o.status === 'pending').length || 0;
  
  return (
    <>
      <Helmet>
        <title>Seller Dashboard | HomeDirect</title>
        <meta
          name="description"
          content="Manage your property listings, view offers from buyers, and analyze property performance."
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Seller Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your listings, offers, and premium upgrades
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/list-property">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Listing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                Buyer Dashboard
              </Button>
            </Link>
            <a href="/api/logout">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isPropertiesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  totalProperties
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Active listings ({premiumProperties} premium)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isOffersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  pendingOffers
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Pending offers ({totalOffers} total)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isPropertiesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  properties?.reduce((acc, p) => acc + p.viewCount, 0) || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Total property views
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isMessagesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  propertyMessages?.filter(m => !m.isRead && m.toUserId === user?.id).length || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Unread buyer messages
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="mt-0">
            {renderPropertyList()}
          </TabsContent>
          
          <TabsContent value="offers" className="mt-0">
            {renderOffers()}
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            {renderAnalytics()}
          </TabsContent>
          
          <TabsContent value="premium" className="mt-0">
            {renderTransactions()}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
