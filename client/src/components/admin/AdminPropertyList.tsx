import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Award,
  Home
} from "lucide-react";
import { Property } from "@shared/schema";
import { formatPrice } from "@/lib/propertyUtils";

export function AdminPropertyList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  
  // Fetch properties
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery<Property[]>({
    queryKey: ["/api/admin/properties"],
  });
  
  // Handle property status change
  const handlePropertyStatusChange = async (propertyId: number, newStatus: string) => {
    try {
      await apiRequest("PUT", `/api/admin/properties/${propertyId}/status`, { status: newStatus });
      
      toast({
        title: "Property Updated",
        description: `Property status has been changed to ${newStatus}`,
      });
      
      // Invalidate properties query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
    }
  };
  
  // Handle premium status change
  const handlePremiumStatusChange = async (propertyId: number, isPremium: boolean) => {
    try {
      await apiRequest("PUT", `/api/admin/properties/${propertyId}/premium`, { 
        isPremium, 
        // If setting to premium, set expiration to 30 days from now
        premiumUntil: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null 
      });
      
      toast({
        title: "Premium Status Updated",
        description: isPremium ? "Property has been upgraded to premium" : "Premium status removed",
      });
      
      // Invalidate properties query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update premium status",
        variant: "destructive",
      });
    }
  };
  
  // Filter properties based on search query and status filter
  const filteredProperties = properties?.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.zipCode.includes(searchQuery);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "premium" && property.isPremium) ||
      property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Paginate properties
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * perPage, 
    currentPage * perPage
  );
  
  const totalPages = Math.ceil(filteredProperties.length / perPage);
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Manage all property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
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
          <CardDescription>Failed to load properties</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-500 mb-4">There was an error loading the property data.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] })}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>Manage property listings across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search properties..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="premium">Premium Only</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="ml-2 hidden sm:inline-flex">
              {filteredProperties.length} listings
            </Badge>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                          {property.featuredImage ? (
                            <img 
                              src={property.featuredImage} 
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Home className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium line-clamp-1">{property.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {property.address}, {property.city}
                          </div>
                          {property.isPremium && (
                            <div className="flex items-center mt-1">
                              <Award className="h-3 w-3 text-amber-500 mr-1" />
                              <span className="text-xs text-amber-500 font-medium">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(property.price)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        property.status === "active" 
                          ? "default" 
                          : property.status === "pending" 
                            ? "secondary" 
                            : property.status === "sold" 
                              ? "outline" 
                              : "destructive"
                      }>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(property.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/properties/${property.id}`} target="_blank">
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Listing
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handlePropertyStatusChange(property.id, "active")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePropertyStatusChange(property.id, "pending")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePropertyStatusChange(property.id, "sold")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Sold
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePropertyStatusChange(property.id, "inactive")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handlePremiumStatusChange(property.id, !property.isPremium)}
                          >
                            <Award className="mr-2 h-4 w-4" />
                            {property.isPremium ? "Remove Premium" : "Make Premium"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No properties found</p>
                    {(searchQuery || statusFilter !== "all") && (
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="mt-2"
                      >
                        Clear filters
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
    </Card>
  );
}
