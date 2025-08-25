import { useQuery } from "@tanstack/react-query";
import type { UserMission, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function GamificationSidebar() {
  const { user, isAuthenticated } = useAuth();

  const { data: userMissions = [] } = useQuery<UserMission[]>({
    queryKey: ["/api/user-missions"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  const currentMission = userMissions.find((mission) => !mission.isCompleted);
  const recentAchievements = [
    { icon: "fa-check", color: "fantasy-emerald", text: "First Custom Design" },
    { icon: "fa-star", color: "fantasy-gold", text: "Lore Master Badge" },
  ];

  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpForNextLevel = level * 1000;
  const xpProgress = ((xp % 1000) / 1000) * 100;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-4 top-24 w-72 z-40" data-testid="gamification-sidebar-desktop">
        <Card className="shadow-lg border border-fantasy-purple/20">
          <CardContent className="p-4 space-y-4">
            {/* User Level */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fantasy-purple to-fantasy-rose rounded-full flex items-center justify-center mb-2">
                <i className="fas fa-dragon text-white text-xl"></i>
              </div>
              <h3 className="font-cinzel font-bold text-fantasy-purple" data-testid="text-user-title">
                {user?.title || 'Dream Weaver'}
              </h3>
              <p className="text-sm text-gray-500" data-testid="text-user-level">Level {level}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-fantasy-purple to-fantasy-rose h-2 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1" data-testid="text-xp-progress">
                {xp % 1000}/{1000} XP to next level
              </p>
            </div>

            {/* Current Mission */}
            {currentMission ? (
              <div className="bg-fantasy-purple/5 rounded-lg p-3">
                <h4 className="font-semibold text-fantasy-purple mb-2 flex items-center">
                  <i className="fas fa-scroll mr-2"></i>
                  Active Quest
                </h4>
                <p className="text-sm text-gray-700 mb-2" data-testid="text-current-mission">
                  {currentMission.mission?.title || 'Complete the "Moonlit Assassin" lore quiz to unlock exclusive colorway'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500" data-testid="text-mission-progress">
                    Progress: {currentMission.progress}/{currentMission.maxProgress}
                  </span>
                  <Button 
                    size="sm"
                    className="text-xs bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                    data-testid="button-continue-mission"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-fantasy-purple/5 rounded-lg p-3">
                <h4 className="font-semibold text-fantasy-purple mb-2 flex items-center">
                  <i className="fas fa-scroll mr-2"></i>
                  No Active Quests
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  Complete actions to unlock new missions!
                </p>
                <Button 
                  size="sm"
                  className="text-xs bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
                  onClick={() => window.location.href = '/shop'}
                  data-testid="button-explore-shop"
                >
                  Explore Shop
                </Button>
              </div>
            )}

            {/* Recent Achievements */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <i className="fas fa-trophy mr-2 text-fantasy-gold"></i>
                Recent Unlocks
              </h4>
              <div className="space-y-2">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className={`w-6 h-6 bg-${achievement.color} rounded-full flex items-center justify-center`}>
                      <i className={`fas ${achievement.icon} text-white text-xs`}></i>
                    </div>
                    <span data-testid={`text-achievement-${index}`}>{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Gamification Panel */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-fantasy-purple/20 p-4 z-40" data-testid="gamification-sidebar-mobile">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fantasy-purple to-fantasy-rose rounded-full flex items-center justify-center">
              <i className="fas fa-dragon text-white text-sm"></i>
            </div>
            <div>
              <p className="font-semibold text-sm" data-testid="text-mobile-user-title">
                {user?.title || 'Dream Weaver'}
              </p>
              <p className="text-xs text-gray-500" data-testid="text-mobile-user-stats">
                {user?.points || 0} pts • Level {level}
              </p>
            </div>
          </div>
          <Button 
            size="sm"
            className="bg-fantasy-purple text-white hover:bg-fantasy-purple/80"
            data-testid="button-mobile-view-quests"
          >
            View Quests
          </Button>
        </div>
      </div>
    </>
  );
}
