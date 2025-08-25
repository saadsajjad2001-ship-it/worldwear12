import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { CartItem, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems.reduce((total: number, item) => total + item.quantity, 0);

  const navItems = [
    { href: "/shop", label: "Shop", icon: "fa-store" },
    { href: "/custom-design", label: "Write a Design", icon: "fa-magic" },
    { href: "/imagination-lab", label: "Imagination Lab", icon: "fa-lightbulb" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-fantasy-purple/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/" : "/"} className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 bg-gradient-to-br from-fantasy-purple to-fantasy-rose rounded-full flex items-center justify-center">
              <i className="fas fa-crown text-white text-lg"></i>
            </div>
            <div>
              <h1 className="font-cinzel font-bold text-xl text-fantasy-purple">Burkaya</h1>
              <p className="text-xs text-gray-500 -mt-1">Where Imagination Becomes Reality</p>
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-fantasy-dark hover:text-fantasy-purple transition-colors font-medium flex items-center space-x-2 ${
                    location === item.href ? 'text-fantasy-purple' : ''
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              ))
            ) : (
              <>
                <a href="#collections" className="text-fantasy-dark hover:text-fantasy-purple transition-colors font-medium">
                  Collections
                </a>
                <a href="#shop" className="text-fantasy-dark hover:text-fantasy-purple transition-colors font-medium">
                  Shop
                </a>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Points Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-fantasy-gold/10 px-3 py-1 rounded-full">
                  <i className="fas fa-coins text-fantasy-gold"></i>
                  <span className="text-sm font-medium" data-testid="text-nav-points">
                    {user?.points || 0}
                  </span>
                  <span className="text-xs text-gray-500">pts</span>
                </div>
                
                {/* Search */}
                <Button variant="ghost" size="sm" data-testid="button-nav-search">
                  <i className="fas fa-search"></i>
                </Button>
                
                {/* Cart */}
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative" data-testid="button-nav-cart">
                    <i className="fas fa-shopping-bag"></i>
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-fantasy-rose text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                
                {/* Profile */}
                <Link href="/profile">
                  <Button variant="ghost" size="sm" data-testid="button-nav-profile">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user-circle text-xl"></i>
                    )}
                  </Button>
                </Link>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                data-testid="button-nav-login"
              >
                Login
              </Button>
            )}
            
            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-nav-mobile-menu"
            >
              <i className="fas fa-bars"></i>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200" data-testid="nav-mobile-menu">
            {isAuthenticated ? (
              <div className="space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-fantasy-dark hover:text-fantasy-purple transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <i className={`fas ${item.icon} mr-2`}></i>
                    {item.label}
                  </Link>
                ))}
                <div className="px-4 py-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <i className="fas fa-coins text-fantasy-gold"></i>
                    <span className="font-medium">{user?.points || 0} points</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <a 
                  href="#collections" 
                  className="block px-4 py-2 text-fantasy-dark hover:text-fantasy-purple transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
                </a>
                <a 
                  href="#shop" 
                  className="block px-4 py-2 text-fantasy-dark hover:text-fantasy-purple transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </a>
                <div className="px-4 py-2">
                  <Button 
                    onClick={() => window.location.href = '/api/login'}
                    className="w-full bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  >
                    Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
