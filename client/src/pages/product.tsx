import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import Navigation from "@/components/navigation";
import GamificationSidebar from "@/components/gamification-sidebar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Product() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: isAuthenticated && !!id
  });

  const addToCartMutation = useMutation({
    mutationFn: async (cartData: any) => {
      return await apiRequest("POST", "/api/cart", cartData);
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
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
    if (product) {
      document.title = `${product.name} - Burkaya Corp`;
    }
  }, [product]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-fantasy-purple border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <GamificationSidebar />
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <GamificationSidebar />
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2" data-testid="text-product-not-found">Product not found</h3>
              <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => setLocation("/shop")} data-testid="button-back-to-shop">
                Back to Shop
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    const customizations: any = {};
    if (selectedSize) customizations.size = selectedSize;
    if (selectedColor) customizations.color = selectedColor;

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      customizations,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <GamificationSidebar />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg">
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              </div>
              
              {/* Additional images would go here */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-fantasy-purple cursor-pointer">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"} 
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-fantasy-purple/10 text-fantasy-purple">
                    {product.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-fantasy-gold/10 text-fantasy-gold">
                    {product.type?.replace('_', ' ')}
                  </Badge>
                  {product.inspiration && (
                    <Badge variant="secondary" className="bg-fantasy-rose/10 text-fantasy-rose">
                      {product.inspiration}
                    </Badge>
                  )}
                </div>
                <h1 className="font-cinzel text-3xl font-bold text-fantasy-dark mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                <div className="text-3xl font-bold text-fantasy-purple" data-testid="text-product-price">
                  ${product.basePrice}
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p data-testid="text-product-description">{product.description}</p>
              </div>

              {/* Product Options */}
              <div className="space-y-4">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-2">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger data-testid="select-product-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">XS</SelectItem>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                      <SelectItem value="xxl">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-2">Color</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger data-testid="select-product-color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">Midnight Black</SelectItem>
                      <SelectItem value="purple">Royal Purple</SelectItem>
                      <SelectItem value="gold">Ancient Gold</SelectItem>
                      <SelectItem value="rose">Mystic Rose</SelectItem>
                      <SelectItem value="emerald">Forest Emerald</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-2">Quantity</label>
                  <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                    <SelectTrigger className="w-24" data-testid="select-product-quantity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  data-testid="button-add-to-cart"
                >
                  {addToCartMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-bag mr-2"></i>
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-fantasy-rose text-fantasy-rose hover:bg-fantasy-rose hover:text-white"
                  data-testid="button-add-to-wishlist"
                >
                  <i className="fas fa-heart"></i>
                </Button>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Product Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Handcrafted attention to detail</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Fantasy-inspired design</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Comfortable everyday wear</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
