import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  const handleExploreCollections = () => {
    if (isAuthenticated) {
      window.location.href = "/shop?featured=true";
    } else {
      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCreateCustom = () => {
    if (isAuthenticated) {
      window.location.href = "/custom-design";
    } else {
      window.location.href = "/api/login";
    }
  };

  const handleJoinLab = () => {
    if (isAuthenticated) {
      window.location.href = "/imagination-lab";
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with fantasy landscape */}
      <div className="absolute inset-0 bg-gradient-to-br from-fantasy-purple/20 to-fantasy-rose/20">
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Mystical fantasy landscape" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-fantasy-gold rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-fantasy-rose rounded-full animate-float opacity-40" style={{animationDelay: '-1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-fantasy-purple rounded-full animate-float opacity-50" style={{animationDelay: '-2s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl" data-testid="text-hero-title">
          Where Imagination<br/>
          <span className="bg-gradient-to-r from-fantasy-gold to-fantasy-rose bg-clip-text text-transparent">
            Becomes Reality
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg font-light" data-testid="text-hero-tagline">
          Wear the World You Imagine
        </p>
        
        <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto drop-shadow-lg" data-testid="text-hero-description">
          Fantasy-inspired fashion that brings your favorite stories to life. From everyday wearables to cosplay-ready pieces, create and customize the wardrobe of your dreams.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-fantasy-purple to-fantasy-rose text-white hover:scale-105 transition-transform shadow-xl animate-glow"
            onClick={handleExploreCollections}
            data-testid="button-hero-explore-collections"
          >
            Explore Collections
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 transition-all shadow-xl"
            onClick={handleCreateCustom}
            data-testid="button-hero-create-custom"
          >
            Create Custom Design
          </Button>
          <Button 
            size="lg"
            className="bg-fantasy-gold text-fantasy-dark hover:scale-105 transition-transform shadow-xl"
            onClick={handleJoinLab}
            data-testid="button-hero-join-lab"
          >
            Join Imagination Lab
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <i className="fas fa-chevron-down text-white text-2xl opacity-70"></i>
        </div>
      </div>
    </section>
  );
}
