import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatorSubmission } from "@shared/schema";
import Navigation from "@/components/navigation";
import GamificationSidebar from "@/components/gamification-sidebar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ImaginationLab() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [submissionForm, setSubmissionForm] = useState({
    title: "",
    description: "",
    category: "",
    conceptImages: [] as string[],
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<CreatorSubmission[]>({
    queryKey: ["/api/creator-submissions"],
    enabled: isAuthenticated
  });

  const createSubmissionMutation = useMutation({
    mutationFn: async (submissionData: any) => {
      return await apiRequest("POST", "/api/creator-submissions", submissionData);
    },
    onSuccess: () => {
      toast({
        title: "Submission Created",
        description: "Your idea has been submitted to the Imagination Lab! The community will vote on it.",
      });
      setSubmissionForm({
        title: "",
        description: "",
        category: "",
        conceptImages: [],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/creator-submissions"] });
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
        description: "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ id, increment }: { id: string; increment: number }) => {
      return await apiRequest("POST", `/api/creator-submissions/${id}/vote`, { increment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator-submissions"] });
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
        description: "Failed to vote. Please try again.",
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
    document.title = "Imagination Lab - Burkaya Corp";
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-fantasy-purple border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionForm.title || !submissionForm.description || !submissionForm.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createSubmissionMutation.mutate(submissionForm);
  };

  const handleVote = (submissionId: string, increment: number) => {
    voteMutation.mutate({ id: submissionId, increment });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'in_production':
        return 'bg-fantasy-emerald';
      case 'under_review':
        return 'bg-fantasy-purple';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Under Review';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'in_production':
        return 'In Production';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <GamificationSidebar />
      
      {/* Imagination Lab Header */}
      <section className="py-16 bg-fantasy-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #6B46C1 0%, transparent 50%), radial-gradient(circle at 75% 75%, #EC4899 0%, transparent 50%)"
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
          <div className="text-center mb-12">
            <h1 className="font-cinzel text-4xl font-bold mb-4">Imagination Lab</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Where creators turn ideas into reality and earn rewards for their imagination</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Creator Benefits */}
            <div className="lg:col-span-2">
              <h2 className="font-cinzel text-2xl font-bold mb-6">Become a Creator</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-fantasy-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lightbulb text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Submit Your Ideas</h3>
                    <p className="text-gray-300">Upload concepts, sketches, or detailed descriptions. Our community votes on the best designs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-fantasy-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-coins text-fantasy-dark"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Earn Royalties</h3>
                    <p className="text-gray-300">Get 15% royalty on every sale of your approved designs, plus bonus points for popular items.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-fantasy-rose rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-crown text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Build Your Legacy</h3>
                    <p className="text-gray-300">Top creators get featured profiles, exclusive collaborations, and early access to new tools.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-cinzel text-xl font-bold mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Creators</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Ideas Submitted</span>
                  <span className="font-bold">3,891</span>
                </div>
                <div className="flex justify-between">
                  <span>Designs in Production</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Royalties Paid</span>
                  <span className="font-bold">$47,329</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-80">
          <Tabs defaultValue="browse" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse" data-testid="tab-browse-submissions">Browse Submissions</TabsTrigger>
              <TabsTrigger value="submit" data-testid="tab-submit-idea">Submit Idea</TabsTrigger>
            </TabsList>

            {/* Browse Submissions */}
            <TabsContent value="browse" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-cinzel text-2xl font-bold text-fantasy-dark">Community Showcase</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48" data-testid="select-filter-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="submitted">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_production">In Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {submissionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : submissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {submissions.map((submission: any) => (
                    <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg" data-testid={`text-submission-title-${submission.id}`}>
                            {submission.title}
                          </h3>
                          <Badge className={`${getStatusColor(submission.status)} text-white`}>
                            {getStatusLabel(submission.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3" data-testid={`text-submission-description-${submission.id}`}>
                          {submission.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{submission.category}</Badge>
                            <span className="text-xs text-gray-500">
                              by @creator{submission.creatorId?.slice(-4)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVote(submission.id, 1)}
                              disabled={voteMutation.isPending}
                              data-testid={`button-upvote-${submission.id}`}
                            >
                              <i className="fas fa-thumbs-up mr-1"></i>
                              {submission.votes || 0}
                            </Button>
                            <div className="flex items-center text-sm text-gray-500">
                              <i className="fas fa-star text-fantasy-gold mr-1"></i>
                              {submission.rating || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-lightbulb text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2" data-testid="text-no-submissions">No submissions yet</h3>
                  <p className="text-gray-500">Be the first to submit your creative idea!</p>
                </div>
              )}
            </TabsContent>

            {/* Submit Idea */}
            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl text-fantasy-dark">Submit Your Idea</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitIdea} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-fantasy-dark mb-2">
                        Title *
                      </label>
                      <Input
                        placeholder="Give your idea a catchy name"
                        value={submissionForm.title}
                        onChange={(e) => setSubmissionForm(prev => ({ ...prev, title: e.target.value }))}
                        data-testid="input-submission-title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-fantasy-dark mb-2">
                        Category *
                      </label>
                      <Select 
                        value={submissionForm.category} 
                        onValueChange={(value) => setSubmissionForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger data-testid="select-submission-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="footwear">Footwear</SelectItem>
                          <SelectItem value="armor">Armor</SelectItem>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-fantasy-dark mb-2">
                        Description *
                      </label>
                      <Textarea
                        rows={6}
                        placeholder="Describe your idea in detail. Include inspiration, materials, colors, special features, and why it would be amazing..."
                        value={submissionForm.description}
                        onChange={(e) => setSubmissionForm(prev => ({ ...prev, description: e.target.value }))}
                        data-testid="textarea-submission-description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-fantasy-dark mb-2">
                        Concept Images (optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-fantasy-purple transition-colors cursor-pointer">
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600 mb-2">Upload sketches, references, or concept art</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        size="lg"
                        className="bg-gradient-to-r from-fantasy-gold to-fantasy-rose text-fantasy-dark hover:scale-105 transition-transform shadow-xl"
                        disabled={createSubmissionMutation.isPending}
                        data-testid="button-submit-idea"
                      >
                        {createSubmissionMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-fantasy-dark border-t-transparent rounded-full mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-lightbulb mr-2"></i>
                            Submit to Lab
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
