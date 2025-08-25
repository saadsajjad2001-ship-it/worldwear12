import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CustomDesign, Order, UserMission, User } from "@shared/schema";
import Navigation from "@/components/navigation";
import GamificationSidebar from "@/components/gamification-sidebar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: customDesigns = [], isLoading: designsLoading } = useQuery<CustomDesign[]>({
    queryKey: ["/api/custom-designs"],
    enabled: isAuthenticated
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated
  });

  const { data: userMissions = [], isLoading: missionsLoading } = useQuery<UserMission[]>({
    queryKey: ["/api/user-missions"],
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
    document.title = "Profile - Burkaya Corp";
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-fantasy-purple border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'in_production':
      case 'delivered':
        return 'bg-fantasy-emerald';
      case 'under_review':
      case 'processing':
        return 'bg-fantasy-purple';
      case 'shipped':
        return 'bg-fantasy-gold';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <GamificationSidebar />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-fantasy-purple to-fantasy-rose rounded-xl p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      data-testid="img-profile-avatar"
                    />
                  ) : (
                    <i className="fas fa-user text-white text-2xl"></i>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="font-cinzel text-3xl font-bold mb-2" data-testid="text-profile-name">
                    {user?.firstName || user?.username || 'Dream Weaver'}
                  </h1>
                  <p className="text-xl opacity-90 mb-4" data-testid="text-profile-title">
                    {user?.title || 'Dream Weaver'} • Level {user?.level || 1}
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-coins text-fantasy-gold"></i>
                      <span className="font-semibold" data-testid="text-profile-points">
                        {user?.points || 0} points
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-star text-fantasy-gold"></i>
                      <span className="font-semibold" data-testid="text-profile-xp">
                        {user?.xp || 0} XP
                      </span>
                    </div>
                    {user?.isCreator && (
                      <Badge className="bg-fantasy-gold text-fantasy-dark">
                        Creator
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <Tabs defaultValue="designs" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="designs" data-testid="tab-custom-designs">Custom Designs</TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
              <TabsTrigger value="missions" data-testid="tab-missions">Missions</TabsTrigger>
            </TabsList>

            {/* Custom Designs */}
            <TabsContent value="designs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-cinzel text-2xl font-bold text-fantasy-dark">Your Custom Designs</h2>
                <Button 
                  className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  onClick={() => window.location.href = '/custom-design'}
                  data-testid="button-new-design"
                >
                  <i className="fas fa-plus mr-2"></i>
                  New Design
                </Button>
              </div>

              {designsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : customDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customDesigns.map((design: any) => (
                    <Card key={design.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-cinzel" data-testid={`text-design-type-${design.id}`}>
                            {getStatusLabel(design.designType)}
                          </CardTitle>
                          <Badge className={`${getStatusColor(design.status)} text-white`}>
                            {getStatusLabel(design.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3" data-testid={`text-design-description-${design.id}`}>
                          {design.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Budget: {design.budgetRange}
                          </span>
                          {design.estimatedPrice && (
                            <span className="font-semibold text-fantasy-purple" data-testid={`text-design-price-${design.id}`}>
                              ${design.estimatedPrice}
                            </span>
                          )}
                        </div>
                        {design.designerNotes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Designer Notes:</p>
                            <p className="text-sm text-gray-600" data-testid={`text-design-notes-${design.id}`}>
                              {design.designerNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-magic text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2" data-testid="text-no-designs">No custom designs yet</h3>
                  <p className="text-gray-500 mb-4">Start creating your dream garments!</p>
                  <Button 
                    className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                    onClick={() => window.location.href = '/custom-design'}
                    data-testid="button-create-first-design"
                  >
                    Create Your First Design
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="space-y-6">
              <h2 className="font-cinzel text-2xl font-bold text-fantasy-dark">Order History</h2>

              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                                Order #{order.id.slice(-8)}
                              </h3>
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-2" data-testid={`text-order-date-${order.id}`}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {order.trackingNumber && (
                              <p className="text-sm text-gray-600" data-testid={`text-order-tracking-${order.id}`}>
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-fantasy-purple text-lg" data-testid={`text-order-total-${order.id}`}>
                              ${order.total}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              data-testid={`button-view-order-${order.id}`}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-shopping-bag text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2" data-testid="text-no-orders">No orders yet</h3>
                  <p className="text-gray-500 mb-4">Start shopping to see your orders here!</p>
                  <Button 
                    className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                    onClick={() => window.location.href = '/shop'}
                    data-testid="button-start-shopping"
                  >
                    Start Shopping
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Missions */}
            <TabsContent value="missions" className="space-y-6">
              <h2 className="font-cinzel text-2xl font-bold text-fantasy-dark">Your Missions</h2>

              {missionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userMissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userMissions.map((mission: any) => (
                    <Card key={mission.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold" data-testid={`text-mission-title-${mission.id}`}>
                            {mission.mission?.title || 'Mission'}
                          </h3>
                          {mission.isCompleted && (
                            <Badge className="bg-fantasy-emerald text-white">
                              <i className="fas fa-check mr-1"></i>
                              Complete
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4" data-testid={`text-mission-description-${mission.id}`}>
                          {mission.mission?.description || 'Complete this mission to earn rewards!'}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span data-testid={`text-mission-progress-${mission.id}`}>
                              {mission.progress}/{mission.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-fantasy-purple to-fantasy-rose h-2 rounded-full transition-all"
                              style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {mission.mission && (
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex space-x-4 text-sm">
                              {mission.mission.xpReward > 0 && (
                                <span className="text-fantasy-purple">
                                  +{mission.mission.xpReward} XP
                                </span>
                              )}
                              {mission.mission.pointsReward > 0 && (
                                <span className="text-fantasy-gold">
                                  +{mission.mission.pointsReward} pts
                                </span>
                              )}
                            </div>
                            {!mission.isCompleted && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                data-testid={`button-continue-mission-${mission.id}`}
                              >
                                Continue
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-scroll text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2" data-testid="text-no-missions">No active missions</h3>
                  <p className="text-gray-500">Complete actions to unlock new missions and earn rewards!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
