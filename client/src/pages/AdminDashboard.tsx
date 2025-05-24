import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminUsersList } from "@/components/admin/AdminUsersList";
import { AdminPropertyList } from "@/components/admin/AdminPropertyList";
import { AdminTransactionList } from "@/components/admin/AdminTransactionList";
import { Home, User, DollarSign, Award, Settings, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { supabase } from "@/lib/supabase"; // Import supabase client

export default function AdminDashboard() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation(); // Use setLocation from wouter
  const [activeTab, setActiveTab] = useState("properties");
  
  // Fetch admin statistics
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.userType === "admin",
  });

  // Handle loading state
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
  
  // Check if user is authenticated and is an admin
  if (!isAuthLoading && (!isAuthenticated || (user && user.userType !== "admin"))) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need administrative privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setLocation("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/login"); // Redirect to login page after logout
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | HomeDirect</title>
        <meta
          name="description"
          content="Administrative dashboard for managing users, properties, and transactions."
        />
      </Helmet>
      
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Admin Sidebar */}
          <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-secondary text-white">
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <div 
                className={`flex items-center px-3 py-2 rounded-md ${activeTab === "properties" ? "bg-primary" : "hover:bg-gray-700"} cursor-pointer`}
                onClick={() => setActiveTab("properties")}
              >
                <Home className="mr-2 h-5 w-5" />
                <span>Properties</span>
              </div>
              <div 
                className={`flex items-center px-3 py-2 rounded-md ${activeTab === "users" ? "bg-primary" : "hover:bg-gray-700"} cursor-pointer`}
                onClick={() => setActiveTab("users")}
              >
                <User className="mr-2 h-5 w-5" />
                <span>Users</span>
              </div>
              <div 
                className={`flex items-center px-3 py-2 rounded-md ${activeTab === "transactions" ? "bg-primary" : "hover:bg-gray-700"} cursor-pointer`}
                onClick={() => setActiveTab("transactions")}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                <span>Transactions</span>
              </div>
              <div 
                className={`flex items-center px-3 py-2 rounded-md ${activeTab === "settings" ? "bg-primary" : "hover:bg-gray-700"} cursor-pointer`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-5 w-5" />
                <span>Settings</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
            <Button variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white/10 gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:ml-64 flex-1">
            <header className="bg-white shadow">
              <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-secondary">
                    Dashboard
                  </h1>
                  <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="py-6 px-4 sm:px-6 lg:px-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Home className="h-5 w-5 mr-2 text-primary" />
                      Total Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">
                      {isStatsLoading ? <Skeleton className="h-8 w-16" /> : (stats?.totalProperties || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isStatsLoading ? <Skeleton className="h-4 w-28" /> : `${stats?.premiumProperties || 0} premium`}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">
                      {isStatsLoading ? <Skeleton className="h-8 w-16" /> : (stats?.totalUsers || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isStatsLoading ? <Skeleton className="h-4 w-28" /> : `${stats?.sellerUsers || 0} sellers, ${stats?.buyerUsers || 0} buyers`}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Premium Listings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">
                      {isStatsLoading ? <Skeleton className="h-8 w-16" /> : (stats?.premiumProperties || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isStatsLoading ? <Skeleton className="h-4 w-28" /> : `${stats?.premiumPercentage || 0}% of all listings`}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">
                      {isStatsLoading ? <Skeleton className="h-8 w-16" /> : (`$${stats?.totalRevenue?.toLocaleString() || 0}`)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isStatsLoading ? <Skeleton className="h-4 w-28" /> : `${stats?.transactionsCount || 0} transactions`}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Mobile Tabs */}
              <div className="block md:hidden mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Tab Contents */}
              <div className="mt-4">
                {activeTab === "properties" && (
                  <AdminPropertyList />
                )}
                
                {activeTab === "users" && (
                  <AdminUsersList />
                )}
                
                {activeTab === "transactions" && (
                  <AdminTransactionList />
                )}
                
                {activeTab === "settings" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Site Settings</CardTitle>
                      <CardDescription>Manage global site settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        Settings functionality coming soon.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
