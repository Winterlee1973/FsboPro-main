import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/propertyUtils";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, DollarSign } from "lucide-react";
import { PremiumTransaction } from "@shared/schema";
import { Link } from "wouter";

export function AdminTransactionList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  
  // Fetch transactions
  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery<PremiumTransaction[]>({
    queryKey: ["/api/admin/transactions"],
  });
  
  // Filter transactions based on search query
  const filteredTransactions = transactions?.filter(transaction => 
    transaction.stripePaymentId.includes(searchQuery) ||
    transaction.userId.includes(searchQuery) ||
    transaction.propertyId.toString().includes(searchQuery)
  ) || [];
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Paginate transactions
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * perPage, 
    currentPage * perPage
  );
  
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get total revenue
  const totalRevenue = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Premium listing payment transactions</CardDescription>
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
          <CardDescription>Failed to load transactions</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-500 mb-4">
            There was an error loading the transaction data.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Premium Transactions</CardTitle>
          <CardDescription>Track premium listing payments</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <div>
            <span className="text-sm font-medium">Total Revenue</span>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(totalRevenue / 100)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by payment ID, user ID, property ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Badge variant="outline" className="ml-2">
            {filteredTransactions.length} transactions
          </Badge>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(transaction.amount / 100)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.stripePaymentId.substring(0, 12)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.userId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Link href={`/properties/${transaction.propertyId}`}>
                        <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                          #{transaction.propertyId}
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No transactions found</p>
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
    </Card>
  );
}
