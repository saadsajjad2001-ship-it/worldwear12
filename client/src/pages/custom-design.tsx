import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import GamificationSidebar from "@/components/gamification-sidebar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CustomDesign() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    designType: "",
    description: "",
    inspirationSources: [] as string[],
    budgetRange: "",
    referenceImages: [] as string[],
  });

  const createDesignMutation = useMutation({
    mutationFn: async (designData: any) => {
      return await apiRequest("POST", "/api/custom-designs", designData);
    },
    onSuccess: () => {
      toast({
        title: "Design Submitted",
        description: "Your custom design request has been submitted successfully! We'll get back to you within 24-48 hours.",
      });
      setFormData({
        designType: "",
        description: "",
        inspirationSources: [],
        budgetRange: "",
        referenceImages: [],
      });
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
        description: "Failed to submit design. Please try again.",
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
    document.title = "Write a Design - Burkaya Corp";
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-fantasy-purple border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  const handleInspirationChange = (source: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      inspirationSources: checked 
        ? [...prev.inspirationSources, source]
        : prev.inspirationSources.filter(s => s !== source)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.designType || !formData.description || !formData.budgetRange) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.description.length < 50) {
      toast({
        title: "Description Too Short",
        description: "Please provide a more detailed description (minimum 50 characters).",
        variant: "destructive",
      });
      return;
    }

    createDesignMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <GamificationSidebar />
      
      {/* Write a Design Section */}
      <section className="py-16 bg-gradient-to-br from-fantasy-purple/5 to-fantasy-rose/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-cinzel text-4xl font-bold text-fantasy-dark mb-4">Write a Design</h1>
            <p className="text-xl text-gray-600">Describe your dream garment and watch our AI bring it to life</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-cinzel text-2xl text-fantasy-dark">Design Your Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Design Type */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-3">What are you creating? *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'clothing', icon: 'fa-tshirt', label: 'Clothing' },
                      { value: 'accessories', icon: 'fa-gem', label: 'Accessories' },
                      { value: 'footwear', icon: 'fa-socks', label: 'Footwear' },
                      { value: 'armor', icon: 'fa-shield-alt', label: 'Armor' },
                    ].map((type) => (
                      <label key={type.value} className="relative">
                        <input 
                          type="radio" 
                          name="design-type" 
                          value={type.value} 
                          className="sr-only peer"
                          checked={formData.designType === type.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, designType: e.target.value }))}
                          data-testid={`radio-design-type-${type.value}`}
                        />
                        <div className="peer-checked:bg-fantasy-purple peer-checked:text-white bg-gray-100 text-gray-700 p-3 rounded-lg text-center cursor-pointer transition-all hover:bg-gray-200 peer-checked:hover:bg-fantasy-purple/80">
                          <i className={`fas ${type.icon} mb-2 block`}></i>
                          <span className="text-sm">{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Design Description */}
                <div>
                  <label htmlFor="design-description" className="block text-sm font-semibold text-fantasy-dark mb-2">
                    Describe your vision *
                  </label>
                  <Textarea 
                    id="design-description"
                    rows={4}
                    placeholder="Paint your vision with words... Describe the style, colors, materials, inspiration, and any special details you want to include."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    data-testid="textarea-design-description"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/50 characters minimum
                  </p>
                </div>

                {/* Inspiration Sources */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-3">Inspiration Sources (optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Anime/Manga',
                      'K-Drama',
                      'Video Games',
                      'Historical',
                      'Fantasy Novels',
                      'Original World'
                    ].map((source) => (
                      <label key={source} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={formData.inspirationSources.includes(source)}
                          onCheckedChange={(checked) => handleInspirationChange(source, checked as boolean)}
                          data-testid={`checkbox-inspiration-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        />
                        <span className="text-sm">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-2">
                    Budget Range *
                  </label>
                  <Select 
                    value={formData.budgetRange} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
                  >
                    <SelectTrigger data-testid="select-budget-range">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50-100">$50 - $100 (Basic custom)</SelectItem>
                      <SelectItem value="100-200">$100 - $200 (Premium custom)</SelectItem>
                      <SelectItem value="200-500">$200 - $500 (Luxury custom)</SelectItem>
                      <SelectItem value="500+">$500+ (Bespoke creation)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reference Images */}
                <div>
                  <label className="block text-sm font-semibold text-fantasy-dark mb-2">
                    Reference Images (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-fantasy-purple transition-colors cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600 mb-2">Drop images here or click to upload</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-gradient-to-r from-fantasy-purple to-fantasy-rose text-white hover:scale-105 transition-transform shadow-xl"
                    disabled={createDesignMutation.isPending}
                    data-testid="button-submit-design"
                  >
                    {createDesignMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Create My Design
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
