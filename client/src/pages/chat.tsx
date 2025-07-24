import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Send, Search, Bell, Paperclip, Image, Mic, Smile, MoreVertical, ArrowDown, Upload, Link, Plus, Heart, Share, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SheepIcon } from "@/components/SheepIcon";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  avatar: string;
  color: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  author: string;
  avatar: string;
  color: string;
  likes: number;
  commentCount: number;
}

interface PostWithComments extends Post {
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  avatar: string;
  color: string;
}

export default function Chat() {
  const [inputMessage, setInputMessage] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch messages from database
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/messages'],
    refetchInterval: 5000, // Refresh every 5 seconds for live updates
  });

  // Fetch posts from database
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch individual post with comments
  const { data: postWithComments } = useQuery<PostWithComments>({
    queryKey: ['/api/posts', selectedPost],
    enabled: !!selectedPost,
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        content,
        userId: 1 // Using TraderPro as default user for demo
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const response = await apiRequest('POST', '/api/posts', {
        title,
        content,
        userId: 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setIsCreatePostOpen(false);
      setPostTitle("");
      setPostContent("");
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest('POST', `/api/posts/${postId}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    }
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const response = await apiRequest('POST', `/api/posts/${postId}/comments`, {
        content,
        userId: 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts', selectedPost] });
      setCommentContent("");
    }
  });

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && !createMessageMutation.isPending) {
      createMessageMutation.mutate(inputMessage);
      setInputMessage("");
    }
  };

  const handleCreatePost = () => {
    if (postTitle.trim() && postContent.trim() && !createPostMutation.isPending) {
      createPostMutation.mutate({ title: postTitle, content: postContent });
    }
  };

  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  const handleAddComment = () => {
    if (commentContent.trim() && selectedPost && !createCommentMutation.isPending) {
      createCommentMutation.mutate({ postId: selectedPost, content: commentContent });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Water Flow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100">
          <div className="water-flow absolute inset-0"></div>
        </div>
        
        {/* Flying Butterflies */}
        <div className="butterflies-container absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`butterfly butterfly-${i + 1} absolute`}>
              <div className="butterfly-body"></div>
              <div className="butterfly-wings">
                <div className="wing wing-left"></div>
                <div className="wing wing-right"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Generated Banner */}
      <div className="relative z-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 py-4 px-6 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <SheepIcon size={48} className="animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">CUTBAR FINANCE</h1>
              <p className="text-yellow-100 text-sm">Community Hub • Trading • Finance • Investment</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-6 text-white">
            <div className="text-center">
              <div className="text-xl font-bold">24/7</div>
              <div className="text-xs">Live Chat</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">500+</div>
              <div className="text-xs">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">🏆</div>
              <div className="text-xs">Premium</div>  
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border">
              <TabsTrigger value="chat" className="flex items-center space-x-2 px-6 py-2">
                <MessageCircle size={18} />
                <span>Live Chat</span>
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center space-x-2 px-6 py-2">
                <Edit3 size={18} />
                <span>Community Posts</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "posts" && (
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                    <Plus size={18} className="mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Enter post title..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind about finance and trading?"
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleCreatePost} 
                      disabled={createPostMutation.isPending || !postTitle.trim() || !postContent.trim()}
                      className="w-full"
                    >
                      {createPostMutation.isPending ? "Creating..." : "Create Post"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Chat Tab Content */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-96 flex flex-col shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <div 
                ref={chatHistoryRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading messages...</div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${message.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                          {message.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                            <p className="text-gray-900 text-sm">{message.content}</p>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 ml-1">
                            <span className="font-medium">{message.author}</span> • {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}

                    {createMessageMutation.isPending && (
                      <div className="flex items-start space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Chat Input */}
            <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Share your financial insights..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={createMessageMutation.isPending || !inputMessage.trim()}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl"
                  >
                    <Send size={16} className="mr-2" />
                    {createMessageMutation.isPending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab Content */}
          <TabsContent value="posts" className="space-y-6">
            {postsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading posts...</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.length === 0 ? (
                  <Card className="p-8 text-center bg-white/95 backdrop-blur-sm">
                    <div className="text-gray-500">
                      <Edit3 size={48} className="mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="text-sm">Be the first to share your financial insights with the community!</p>
                    </div>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${post.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                            {post.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{post.title}</h3>
                              <span className="text-xs text-gray-500">{post.timestamp}</span>
                            </div>
                            <p className="text-gray-700 mb-4">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Button
                                  onClick={() => handleLikePost(post.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <Heart size={16} className="mr-1" />
                                  {post.likes}
                                </Button>
                                <Button
                                  onClick={() => setSelectedPost(post.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-blue-500"
                                >
                                  <MessageCircle size={16} className="mr-1" />
                                  {post.commentCount}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-green-500"
                                >
                                  <Share size={16} className="mr-1" />
                                  Share
                                </Button>
                              </div>
                              <span className="text-xs text-gray-500">by {post.author}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Details Dialog */}
      {selectedPost && postWithComments && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{postWithComments.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">{postWithComments.content}</p>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Comments ({postWithComments.comments?.length || 0})</h4>
                
                <div className="space-y-3 mb-4">
                  {postWithComments.comments?.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${comment.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <p className="text-sm text-gray-900">{comment.content}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {comment.author} • {comment.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={createCommentMutation.isPending || !commentContent.trim()}
                  >
                    {createCommentMutation.isPending ? "Adding..." : "Comment"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}