import { useState } from "react";
import { User, Property, Message } from "@shared/schema";
import { formatTimeAgo } from "@/lib/propertyUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Home, User as UserIcon } from "lucide-react";

type Conversation = {
  userId: string;
  propertyId: number;
  lastMessageDate: string;
  unreadCount: number;
};

interface ConversationListProps {
  conversations: Conversation[];
  users: User[];
  properties: Property[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
  currentUser: User | null | undefined;
}

export function ConversationList({
  conversations,
  users,
  properties,
  selectedConversation,
  onSelectConversation,
  isLoading,
  currentUser
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(convo => {
    const otherUser = users.find(u => u.id === convo.userId);
    const property = properties.find(p => p.id === convo.propertyId);
    
    return (
      (otherUser?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property?.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      !searchQuery
    );
  });
  
  // Sort conversations by date (newest first)
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length > 0 ? (
          sortedConversations.map((conversation) => {
            const otherUser = users.find(u => u.id === conversation.userId);
            const property = properties.find(p => p.id === conversation.propertyId);
            
            // Extract name for display
            const displayName = otherUser?.firstName && otherUser?.lastName
              ? `${otherUser.firstName} ${otherUser.lastName}`
              : otherUser?.email
                ? otherUser.email.split('@')[0]
                : `User ${conversation.userId.substring(0, 8)}`;
            
            return (
              <div
                key={`${conversation.userId}-${conversation.propertyId}`}
                className={`p-3 border-b cursor-pointer transition-colors ${
                  selectedConversation?.userId === conversation.userId && 
                  selectedConversation?.propertyId === conversation.propertyId
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {otherUser?.profileImageUrl ? (
                      <img 
                        src={otherUser.profileImageUrl} 
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatTimeAgo(conversation.lastMessageDate)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600 truncate">
                      <Home className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {property?.title || `Property #${conversation.propertyId}`}
                      </span>
                    </div>
                    
                    {conversation.unreadCount > 0 && currentUser?.id === conversation.userId && (
                      <Badge className="mt-1 text-xs">
                        {conversation.unreadCount} new
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-500">
            {searchQuery ? (
              <>
                <p>No conversations found</p>
                <button 
                  className="text-primary text-sm mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No conversations yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
