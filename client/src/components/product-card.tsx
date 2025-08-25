import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    basePrice: string;
    category: string;
    type: string;
    inspiration?: string;
    imageUrl?: string;
    tags?: string[];
    isFeatured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
        customizations: {},
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart!`,
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clothing':
        return 'bg-fantasy-emerald/10 text-fantasy-emerald';
      case 'accessories':
        return 'bg-fantasy-rose/10 text-fantasy-rose';
      case 'footwear':
        return 'bg-fantasy-purple/10 text-fantasy-purple';
      case 'armor':
        return 'bg-fantasy-gold/10 text-fantasy-gold';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pre_made':
        return 'bg-fantasy-emerald/10 text-fantasy-emerald';
      case 'semi_custom':
        return 'bg-fantasy-purple/10 text-fantasy-purple';
      case 'fully_custom':
        return 'bg-fantasy-gold/10 text-fantasy-gold';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pre_made':
        return 'Ready to Wear';
      case 'semi_custom':
        return 'Semi-Custom';
      case 'fully_custom':
        return 'Fully Custom';
      default:
        return type;
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl || "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 space-y-1">
            <Badge className={getCategoryColor(product.category)}>
              {product.category}
            </Badge>
            {product.isFeatured && (
              <Badge className="bg-fantasy-gold text-fantasy-dark">
                Featured
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full ${
              isLiked ? 'text-fantasy-rose' : 'text-gray-400 hover:text-fantasy-rose'
            } bg-white/80 hover:bg-white transition-colors`}
            onClick={handleToggleLike}
            data-testid={`button-like-${product.id}`}
          >
            <i className={`fas fa-heart ${isLiked ? 'text-fantasy-rose' : ''}`}></i>
          </Button>
        </div>
        
        <CardContent className="p-4">
          {/* Product Type and Inspiration */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className={getTypeColor(product.type)}>
              {getTypeLabel(product.type)}
            </Badge>
            {product.inspiration && (
              <Badge variant="outline" className="bg-fantasy-rose/10 text-fantasy-rose">
                {product.inspiration}
              </Badge>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 group-hover:text-fantasy-purple transition-colors line-clamp-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
            {product.description || "Discover the magic of fantasy-inspired fashion with this unique piece."}
          </p>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xl text-fantasy-dark" data-testid={`text-product-price-${product.id}`}>
                {product.type === 'fully_custom' ? 'From ' : ''}${product.basePrice}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {product.type === 'pre_made' ? (
                <Button 
                  size="sm"
                  className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  onClick={handleQuickAdd}
                  disabled={addToCartMutation.isPending}
                  data-testid={`button-quick-add-${product.id}`}
                >
                  {addToCartMutation.isPending ? (
                    <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Quick Add'
                  )}
                </Button>
              ) : product.type === 'semi_custom' ? (
                <Button 
                  size="sm"
                  className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  data-testid={`button-customize-${product.id}`}
                >
                  Customize
                </Button>
              ) : (
                <Button 
                  size="sm"
                  className="bg-fantasy-gold text-fantasy-dark hover:bg-fantasy-gold/80"
                  data-testid={`button-design-${product.id}`}
                >
                  Design
                </Button>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
