import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const shopLinks = [
    { href: isAuthenticated ? "/shop" : "#", label: "All Products" },
    { href: isAuthenticated ? "/shop?featured=true" : "#", label: "New Arrivals" },
    { href: isAuthenticated ? "/shop" : "#collections", label: "Collections" },
    { href: isAuthenticated ? "/custom-design" : "#", label: "Custom Designs" },
    { href: isAuthenticated ? "/shop?sale=true" : "#", label: "Sale" },
  ];

  const createLinks = [
    { href: isAuthenticated ? "/imagination-lab" : "#", label: "Imagination Lab" },
    { href: isAuthenticated ? "/custom-design" : "#", label: "Write a Design" },
    { href: isAuthenticated ? "/imagination-lab?tab=submit" : "#", label: "Creator Portal" },
    { href: "#", label: "Design Guidelines" },
    { href: "#", label: "Royalty Program" },
  ];

  const supportLinks = [
    { href: "#", label: "Size Guide" },
    { href: "#", label: "Shipping Info" },
    { href: "#", label: "Returns" },
    { href: "#", label: "Contact Us" },
    { href: "#", label: "FAQ" },
  ];

  const socialLinks = [
    { href: "#", icon: "fab fa-instagram", label: "Instagram" },
    { href: "#", icon: "fab fa-tiktok", label: "TikTok" },
    { href: "#", icon: "fab fa-discord", label: "Discord" },
    { href: "#", icon: "fab fa-youtube", label: "YouTube" },
  ];

  const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" },
  ];

  return (
    <footer className="bg-fantasy-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-fantasy-purple to-fantasy-rose rounded-full flex items-center justify-center">
                <i className="fas fa-crown text-white text-lg"></i>
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-xl">Burkaya</h3>
                <p className="text-xs text-gray-400 -mt-1">Where Imagination Becomes Reality</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4" data-testid="text-footer-brand-description">
              Transform your favorite stories into wearable art. Join thousands of creators and fans bringing imagination to life.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="text-gray-400 hover:text-fantasy-purple transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {shopLinks.map((link, index) => (
                <li key={index}>
                  {isAuthenticated ? (
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                      data-testid={`link-footer-shop-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                      data-testid={`link-footer-shop-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Create */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Create</h4>
            <ul className="space-y-2 text-sm">
              {createLinks.map((link, index) => (
                <li key={index}>
                  {isAuthenticated ? (
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                      data-testid={`link-footer-create-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                      data-testid={`link-footer-create-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                    data-testid={`link-footer-support-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm" data-testid="text-footer-copyright">
            © 2024 Burkaya Corp. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-gray-400 hover:text-white text-sm transition-colors"
                data-testid={`link-footer-legal-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
