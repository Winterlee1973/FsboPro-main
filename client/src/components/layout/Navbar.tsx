import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/main"; // Import Supabase client
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogIn, Menu, UserPlus } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [location] = useLocation();
  const isMobile = useMobile();
  const { user, isAuthenticated } = useAuth();

  // Check if link is active
  const isActive = (path: string) => {
    // Special case for the "Buy" link on the home page
    if (path === "/#featured-properties" && location === "/") {
      return "border-b-2 border-blue-500 text-blue-500 font-semibold";
    }
    return location === path ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600 hover:text-blue-500";
  };

  // Links for navigation
  const links = [
    { title: "Find A Property", path: "/#featured-properties" },
    { title: "Sell Your Home", path: "/list-property" },
    { title: "How It Works", path: "/how-it-works" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-blue-500 font-bold text-3xl">HomeDirect</span>
            </Link>
          </div>
          
          {/* Main Navigation */}
          <div className="hidden md:flex justify-center flex-1 px-2">
            <div className="flex items-center">
              {links.map((link) => (
                <Link key={link.path} href={link.path}>
                  <span className={`${isActive(link.path)} px-4 py-4 text-base cursor-pointer transition-colors duration-200 whitespace-nowrap`}>
                    {link.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/list-property">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
                List Your Home
              </Button>
            </Link>
            <div className="flex space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1 items-center border-gray-300">
                    {isAuthenticated ? 'Account' : 'Log In / Register'} <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account Access</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = "/api/logout";
                      }}>
                        <LogIn className="mr-2 h-4 w-4" /> Log Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => window.location.href = "/login"}>
                        <LogIn className="mr-2 h-4 w-4" /> Log In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = "/register"}>
                        <UserPlus className="mr-2 h-4 w-4" /> Register as Buyer or Seller
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-6">
                  {links.map((link) => (
                    <Link key={link.path} href={link.path}>
                      <span className="text-xl font-medium cursor-pointer">
                        {link.title}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <Link href="/list-property">
                      <Button className="w-full mb-3 bg-blue-500 hover:bg-blue-600">List Your Home</Button>
                    </Link>
                    <div className="space-y-3">
                      {isAuthenticated ? (
                        <Button 
                          variant="outline" 
                          className="w-full flex justify-center items-center gap-2"
                          onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = "/api/logout";
                          }}
                        >
                          <LogIn className="h-4 w-4" /> Log Out
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            className="w-full flex justify-center items-center gap-2"
                            onClick={() => window.location.href = "/login"}
                          >
                            <LogIn className="h-4 w-4" /> Log In
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full flex justify-center items-center gap-2"
                            onClick={() => window.location.href = "/register"}
                          >
                            <UserPlus className="h-4 w-4" /> Register as Buyer/Seller
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
