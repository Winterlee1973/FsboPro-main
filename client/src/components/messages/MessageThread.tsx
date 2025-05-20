import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Property, Message } from "@shared/schema";
import { formatPrice } from "@/lib/propertyUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PremiumBadge } from "@/components/common/PremiumBadge";
import { Link } from "wouter";
import { Send, ExternalLink, Home, User as UserIcon } from "lucide-react";

interface MessageThreadProps {
  conversation: {
    userId: string;
    propertyId: number;
  };
  otherUser?: User;
  property?: Property;
  currentUser?: User | null;
}

export function MessageThread({
  conversation,
  otherUser,
  property,
  currentUser
}: MessageThreadProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages for this conversation
  const {
    data: messages,
    isLoading,
    error,
    refetch
  } = useQuery<Message[]>({
    queryKey: [`/api/conversations/${conversation.userId}/${conversation.propertyId}`],
    enabled: !!conversation.userId && !!conversation.propertyId,
  });
  
  // Format date
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mark messages as read
  useEffect(() => {
    if (messages && messages.length > 0 && currentUser) {
      const unreadMessages = messages.filter(
        msg => msg.toUserId === currentUser.id && !msg.isRead
      );
      
      if (unreadMessages.length > 0) {
        // Mark messages as read
        unreadMessages.forEach(async (msg) => {
          try {
            await apiRequest("POST", `/api/messages/${msg.id}/read`, {});
          } catch (error) {
            console.error("Error marking message as read:", error);
          }
        });
        
        // Invalidate conversation queries to update unread count
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      }
    }
  }, [messages, currentUser]);
  
  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentUser) return;
    
    setIsSending(true);
    
    try {
      await apiRequest("POST", "/api/messages", {
        toUserId: conversation.userId,
        propertyId: conversation.propertyId,
        message: message.trim(),
      });
      
      setMessage("");
      
      // Refresh messages
      refetch();
      
      // Invalidate conversation queries
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  if (!otherUser || !property) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Conversation details not available</p>
        </div>
      </div>
    );
  }
  
  // Extract name for display
  const displayName = otherUser.firstName && otherUser.lastName
    ? `${otherUser.firstName} ${otherUser.lastName}`
    : otherUser.email
      ? otherUser.email.split('@')[0]
      : `User ${otherUser.id.substring(0, 8)}`;
  
  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {otherUser.profileImageUrl ? (
              <img 
                src={otherUser.profileImageUrl} 
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{displayName}</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Home className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[250px]">{property.address}</span>
            </div>
          </div>
        </div>
        <Link href={`/properties/${property.id}`}>
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            View Property
          </Button>
        </Link>
      </div>
      
      {/* Property Info (Mini Card) */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <div className="h-14 w-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
            {property.featuredImage ? (
              <img 
                src={property.featuredImage} 
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Home className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold truncate">{property.title}</div>
                <div className="text-sm text-gray-600 truncate">{formatPrice(property.price)}</div>
              </div>
              {property.isPremium && <PremiumBadge />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <Skeleton className={`h-12 w-2/3 rounded-lg`} />
            </div>
          ))
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">Error loading messages</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isSelf = msg.fromUserId === currentUser?.id;
            
            return (
              <div
                key={msg.id}
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isSelf
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isSelf ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-4 text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message below</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            autoFocus
          />
          <Button type="submit" disabled={!message.trim() || isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
