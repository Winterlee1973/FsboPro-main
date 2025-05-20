import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, UserCog, User, Ban, CheckCircle } from "lucide-react";
import { User as UserType } from "@shared/schema";

export function AdminUsersList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  
  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
  });
  
  // Handle user role change
  const handleUserRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiRequest("PUT", `/api/admin/users/${userId}/role`, { userType: newRole });
      
      toast({
        title: "User Role Updated",
        description: `User role has been changed to ${newRole}`,
      });
      
      // Invalidate users query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };
  
  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.id.includes(searchQuery)
  ) || [];
  
  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * perPage, 
    currentPage * perPage
  );
  
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Show user details
  const showUserDetails = (user: UserType) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all system users</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load users</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-500 mb-4">There was an error loading the user data.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage system users and their permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-2">
              {filteredUsers.length} users
            </Badge>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {user.profileImageUrl ? (
                            <img 
                              src={user.profileImageUrl} 
                              alt={user.firstName || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : `User ${user.id.substring(0, 8)}`}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        user.userType === "admin" 
                          ? "default" 
                          : user.userType === "seller" 
                            ? "outline" 
                            : "secondary"
                      }>
                        {user.userType}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.email || "No email"}</TableCell>
                    <TableCell>{user.createdAt ? formatDate(user.createdAt) : "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => showUserDetails(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserRoleChange(user.id, "admin")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserRoleChange(user.id, "seller")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Make Seller
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserRoleChange(user.id, "buyer")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Make Buyer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                    {searchQuery && (
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
      
      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about this user
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-2">
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {selectedUser.profileImageUrl ? (
                    <img 
                      src={selectedUser.profileImageUrl} 
                      alt={selectedUser.firstName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">ID</p>
                  <p className="text-sm text-gray-500">{selectedUser.id}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">User Type</p>
                  <Badge variant={
                    selectedUser.userType === "admin" 
                      ? "default" 
                      : selectedUser.userType === "seller" 
                        ? "outline" 
                        : "secondary"
                  }>
                    {selectedUser.userType}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">First Name</p>
                  <p className="text-sm text-gray-500">{selectedUser.firstName || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Name</p>
                  <p className="text-sm text-gray-500">{selectedUser.lastName || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-500">{selectedUser.email || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : "Unknown"}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.updatedAt ? formatDate(selectedUser.updatedAt) : "Unknown"}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Stripe Customer</p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.stripeCustomerId || "Not registered"}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
