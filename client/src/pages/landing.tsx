import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  useEffect(() => {
    document.title = "Burkaya Corp - Where Imagination Becomes Reality";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <HeroSection />

      {/* Featured Collections */}
      <section id="collections" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-4xl font-bold text-fantasy-dark mb-4">Featured Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover curated fashion inspired by your favorite worlds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Collection Card 1 */}
            <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Korean drama inspired collection" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark/80 to-transparent"></div>
              <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-fantasy-rose px-2 py-1 rounded-full text-xs font-medium">K-Drama</span>
                  <span className="bg-fantasy-gold px-2 py-1 rounded-full text-xs font-medium">Limited</span>
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2">Royal Court Romance</h3>
                <p className="text-sm opacity-90 mb-3">Elegant pieces inspired by historical K-dramas</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">From $45</span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-fantasy-dark hover:bg-fantasy-purple hover:text-white"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="explore-collection-kdrama"
                  >
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Collection Card 2 */}
            <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Mystical fantasy collection" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark/80 to-transparent"></div>
              <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-fantasy-purple px-2 py-1 rounded-full text-xs font-medium">Fantasy</span>
                  <span className="bg-fantasy-emerald px-2 py-1 rounded-full text-xs font-medium">New</span>
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2">Moonlit Assassin</h3>
                <p className="text-sm opacity-90 mb-3">Stealth-inspired pieces for the modern rogue</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">From $65</span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-fantasy-dark hover:bg-fantasy-purple hover:text-white"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="explore-collection-fantasy"
                  >
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Collection Card 3 */}
            <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Anime inspired collection" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark/80 to-transparent"></div>
              <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-fantasy-rose px-2 py-1 rounded-full text-xs font-medium">Anime</span>
                  <span className="bg-fantasy-gold px-2 py-1 rounded-full text-xs font-medium">Popular</span>
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2">Neo Tokyo Streets</h3>
                <p className="text-sm opacity-90 mb-3">Cyberpunk-meets-kawaii street fashion</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">From $35</span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-fantasy-dark hover:bg-fantasy-purple hover:text-white"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="explore-collection-anime"
                  >
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customization Tiers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-4xl font-bold text-fantasy-dark mb-4">Your Style, Your Way</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose how you want to bring your imagination to life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pre-Made Collections */}
            <Card className="bg-white p-8 text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-fantasy-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-tshirt text-fantasy-emerald text-2xl"></i>
                </div>
                <h3 className="font-cinzel text-2xl font-bold mb-4 text-fantasy-dark">Pre-Made Collections</h3>
                <p className="text-gray-600 mb-6">Ready-to-wear pieces inspired by popular fandoms and original fantasy worlds</p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Instant availability</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Quality-tested designs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-emerald"></i>
                    <span>Multiple size options</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-fantasy-emerald text-white hover:bg-fantasy-emerald/80"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-shop-premade"
                >
                  Shop Now
                </Button>
              </CardContent>
            </Card>

            {/* Semi-Custom */}
            <Card className="bg-white p-8 text-center hover:shadow-xl transition-shadow border-2 border-fantasy-purple">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-fantasy-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-palette text-fantasy-purple text-2xl"></i>
                </div>
                <h3 className="font-cinzel text-2xl font-bold mb-4 text-fantasy-dark">Semi-Custom</h3>
                <div className="bg-fantasy-purple text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Most Popular
                </div>
                <p className="text-gray-600 mb-6">Customize colors, materials, and details on our base designs</p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-purple"></i>
                    <span>Color customization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-purple"></i>
                    <span>Material options</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-purple"></i>
                    <span>Personal sigils/symbols</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-customize-semicustom"
                >
                  Customize
                </Button>
              </CardContent>
            </Card>

            {/* Fully Custom */}
            <Card className="bg-white p-8 text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-fantasy-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-magic text-fantasy-gold text-2xl"></i>
                </div>
                <h3 className="font-cinzel text-2xl font-bold mb-4 text-fantasy-dark">Fully Custom</h3>
                <p className="text-gray-600 mb-6">Work with our designers to create completely unique pieces from your imagination</p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-gold"></i>
                    <span>One-of-a-kind designs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-gold"></i>
                    <span>Designer collaboration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-fantasy-gold"></i>
                    <span>Premium materials</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-fantasy-gold text-fantasy-dark hover:bg-fantasy-gold/80"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-start-fullycustom"
                >
                  Start Creating
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
