import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import Navigation from "@/components/navigation";
import GamificationSidebar from "@/components/gamification-sidebar";
import ProductCard from "@/components/product-card";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

export default function Shop() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    inspiration: "",
    sortBy: "featured"
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", filters],
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
    document.title = "Shop - Burkaya Corp";
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
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 space-y-6 bg-white p-6 rounded-xl shadow-lg">
                <h3 className="font-cinzel text-xl font-bold text-fantasy-dark" data-testid="text-filters-title">Filters</h3>
                
                {/* Category Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.category === 'clothing'}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, category: checked ? 'clothing' : '' }))
                        }
                        data-testid="checkbox-category-clothing"
                      />
                      <span className="text-sm">Clothing</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.category === 'accessories'}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, category: checked ? 'accessories' : '' }))
                        }
                        data-testid="checkbox-category-accessories"
                      />
                      <span className="text-sm">Accessories</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.category === 'footwear'}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, category: checked ? 'footwear' : '' }))
                        }
                        data-testid="checkbox-category-footwear"
                      />
                      <span className="text-sm">Footwear</span>
                    </label>
                  </div>
                </div>

                {/* Inspiration Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Inspiration</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.inspiration === 'K-Drama'}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, inspiration: checked ? 'K-Drama' : '' }))
                        }
                        data-testid="checkbox-inspiration-kdrama"
                      />
                      <span className="text-sm">K-Drama</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.inspiration === 'Anime'}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, inspiration: checked ? 'Anime' : '' }))
                        }
                        data-testid="checkbox-inspiration-anime"
                      />
                      <span className="text-sm">Anime</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.inspiration === 'Fantasy'}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, inspiration: checked ? 'Fantasy' : '' }))
                        }
                        data-testid="checkbox-inspiration-fantasy"
                      />
                      <span className="text-sm">Fantasy</span>
                    </label>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({ search: "", category: "", type: "", inspiration: "", sortBy: "featured" })}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
                <div className="relative flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search for your perfect piece..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                    data-testid="input-search-products"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger className="w-48" data-testid="select-sort-products">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Sort by: Featured</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
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
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {/* Load More */}
                  <div className="text-center mt-12">
                    <Button 
                      variant="outline" 
                      className="border-2 border-fantasy-purple text-fantasy-purple hover:bg-fantasy-purple hover:text-white"
                      data-testid="button-load-more-products"
                    >
                      Load More Products
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-search text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2" data-testid="text-no-products">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
