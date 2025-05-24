import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageThread } from "@/components/messages/MessageThread";
import { ArrowLeft } from "lucide-react";
import { User, Property } from "@shared/schema";
import { Helmet } from "react-helmet";

type Conversation = {
  userId: string;
  propertyId: number;
  lastMessageDate: string;
  unreadCount: number;
};

export default function MessageCenter() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [mobileView, setMobileView] = useState(false);
  const [showConversation, setShowConversation] = useState(false);

  // Fetch conversations
  const {
    data: conversations,
    isLoading: isConversationsLoading,
  } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: isAuthenticated,
  });

  // Fetch user details for conversations
  const {
    data: users,
    isLoading: isUsersLoading,
  } = useQuery<User[]>({
    queryKey: ["/api/conversations/users"],
    enabled: isAuthenticated && !!conversations && conversations.length > 0,
  });

  // Fetch property details for conversations
  const {
    data: properties,
    isLoading: isPropertiesLoading,
  } = useQuery<Property[]>({
    queryKey: ["/api/conversations/properties"],
    enabled: isAuthenticated && !!conversations && conversations.length > 0,
  });

  // Check window size for responsive layout
  useEffect(() => {
    const checkMobileView = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Handle selection of a conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (mobileView) {
      setShowConversation(true);
    }
  };

  // Go back to conversation list on mobile
  const handleBackToList = () => {
    setShowConversation(false);
  };

  // If auth is still loading, show skeleton
  if (isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="flex h-[calc(100vh-200px)] gap-4">
          <Skeleton className="w-1/3 h-full" />
          <Skeleton className="w-2/3 h-full" />
        </div>
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
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You need to be signed in to view your messages.</p>
            <a href="/login">
              <Button>Sign In</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Message Center | HomeDirect</title>
        <meta
          name="description"
          content="Communicate directly with buyers and sellers about properties."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-secondary">
            {mobileView && showConversation ? (
              <Button variant="ghost" className="mr-2 -ml-2" onClick={handleBackToList}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
            ) : null}
            Message Center
          </h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex h-[calc(100vh-200px)] min-h-[500px]">
            {/* Conversation List (hide on mobile when a conversation is selected) */}
            {(!mobileView || !showConversation) && (
              <div className={`${mobileView ? 'w-full' : 'w-1/3'} border-r`}>
                <ConversationList
                  conversations={conversations || []}
                  users={users || []}
                  properties={properties || []}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                  isLoading={isConversationsLoading || isUsersLoading || isPropertiesLoading}
                  currentUser={user}
                />
              </div>
            )}

            {/* Message Thread (hide on mobile when no conversation is selected) */}
            {(!mobileView || showConversation) && (
              <div className={`${mobileView ? 'w-full' : 'w-2/3'} flex flex-col`}>
                {selectedConversation ? (
                  <MessageThread
                    conversation={selectedConversation}
                    otherUser={users?.find(u => u.id === selectedConversation.userId)}
                    property={properties?.find(p => p.id === selectedConversation.propertyId)}
                    currentUser={user}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-500">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
