import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property, Offer, Message } from "@shared/schema";
import { formatPrice, formatTimeAgo } from "@/lib/propertyUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Heart, Eye, MessageSquare, ChevronRight, Award, LogOut } from "lucide-react";
import { Helmet } from "react-helmet";

export default function UserDashboard() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("saved");
  
  // Fetch user's saved properties (favorites)
  const {
    data: savedProperties,
    isLoading: isSavedLoading,
  } = useQuery<Property[]>({
    queryKey: ["/api/users/saved-properties"],
    enabled: isAuthenticated,
  });
  
  // Fetch user's offers
  const {
    data: offers,
    isLoading: isOffersLoading,
  } = useQuery<Offer[]>({
    queryKey: [user ? `/api/users/${user.id}/offers` : null],
    enabled: isAuthenticated && !!user,
  });
  
  // Fetch user's messages
  const {
    data: messages,
    isLoading: isMessagesLoading,
  } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });
  
  // If auth is still loading, show skeleton
  if (isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-8 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in to view your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <a href="/api/login">
              <Button>Sign In</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const renderSavedProperties = () => {
    if (isSavedLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (!savedProperties || savedProperties.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Saved Properties</h3>
            <p className="text-muted-foreground mb-4">
              You haven't saved any properties yet. Browse listings and click the heart icon to save properties.
            </p>
            <Link href="/search">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={property.featuredImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.isPremium && (
                <div className="absolute top-2 left-2">
                  <div className="bg-[hsl(var(--premium))] text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                </div>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 bg-white/80 text-primary rounded-full h-8 w-8"
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <div className="font-bold text-lg text-secondary">{formatPrice(property.price)}</div>
                <div className="text-sm text-muted-foreground">
                  {property.bedrooms} bd | {property.bathrooms} ba | {property.squareFeet.toLocaleString()} sqft
                </div>
              </div>
              <div className="text-sm text-secondary mb-4 line-clamp-1">{property.address}, {property.city}</div>
              <div className="flex justify-between items-center">
                <Link href={`/properties/${property.id}`}>
                  <Button variant="link" className="px-0 h-auto font-medium">View Details</Button>
                </Link>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 mr-1" />
                  {property.viewCount}
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
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (!offers || offers.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Offers Made</h3>
            <p className="text-muted-foreground mb-4">
              You haven't made any offers on properties yet. Browse listings to find your dream home.
            </p>
            <Link href="/search">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="font-semibold mb-1">
                    Offer: {formatPrice(offer.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Submitted {formatTimeAgo(offer.createdAt)}
                  </div>
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
                <div className="sm:text-right">
                  <Link href={`/properties/${offer.propertyId}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      View Property
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderMessages = () => {
    if (isMessagesLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (!messages || messages.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Messages</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any messages yet. Contact property owners to ask questions or schedule viewings.
            </p>
            <Link href="/search">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={message.isRead ? '' : 'border-primary'}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold">
                  {message.fromUserId === user?.id ? 'You' : 'Seller'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(message.createdAt)}
                </div>
              </div>
              <p className="text-sm mb-3 line-clamp-2">{message.message}</p>
              <div className="flex justify-between items-center">
                <Link href={`/properties/${message.propertyId}`}>
                  <Button variant="outline" size="sm">View Property</Button>
                </Link>
                <Link href="/messages">
                  <Button variant="link" size="sm" className="h-auto p-0">
                    View Conversation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="text-center mt-4">
          <Link href="/messages">
            <Button variant="outline">View All Messages</Button>
          </Link>
        </div>
      </div>
    );
  };
  
  // Check if the user is a seller
  const isSeller = user?.userType === 'seller';
  
  return (
    <>
      <Helmet>
        <title>Your Dashboard | HomeDirect</title>
        <meta
          name="description"
          content="Manage your saved properties, offers, and messages on HomeDirect."
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Your Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your saved properties, offers, and messages
            </p>
          </div>
          <div className="flex gap-3">
            {isSeller ? (
              <Link href="/seller-dashboard">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Seller Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/list-property">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Become a Seller
                </Button>
              </Link>
            )}
            <a href="/api/logout">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Saved Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isSavedLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  savedProperties?.length || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Properties you've saved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                Active Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isOffersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  offers?.filter(o => o.status === 'pending').length || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Offers you've submitted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {isMessagesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  messages?.filter(m => !m.isRead && m.toUserId === user?.id).length || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Messages waiting for your response</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="saved">Saved Properties</TabsTrigger>
            <TabsTrigger value="offers">Your Offers</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="mt-0">
            {renderSavedProperties()}
          </TabsContent>
          
          <TabsContent value="offers" className="mt-0">
            {renderOffers()}
          </TabsContent>
          
          <TabsContent value="messages" className="mt-0">
            {renderMessages()}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
