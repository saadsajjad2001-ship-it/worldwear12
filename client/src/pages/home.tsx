import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import GamificationSidebar from "@/components/gamification-sidebar";
import ProductCard from "@/components/product-card";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true }],
    enabled: isAuthenticated
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    document.title = "Home - Burkaya Corp";
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-fantasy-purple border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <GamificationSidebar />
      
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-4xl font-bold text-fantasy-dark mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover our most popular fantasy-inspired pieces</p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fas fa-tshirt text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Products</h3>
              <p className="text-gray-500">Check back soon for our latest featured items!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
