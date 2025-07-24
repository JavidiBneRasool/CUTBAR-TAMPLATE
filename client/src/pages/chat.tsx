import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Send, Search, Bell, Paperclip, Image, Mic, Smile, MoreVertical, ArrowDown, Upload, Link } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  avatar: string;
  color: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Welcome to CUTBAR FINANCE community! Share your trading insights and market analysis here. 📈",
      timestamp: "5 minutes ago",
      author: "TraderPro",
      avatar: "T",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "2",
      content: "Just uploaded my latest market report. Check out the bullish trend on tech stocks! 📊",
      timestamp: "3 minutes ago",
      author: "MarketGuru",
      avatar: "M",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "3",
      content: "Great analysis! I've shared a link to my portfolio performance dashboard for everyone to review.",
      timestamp: "2 minutes ago",
      author: "FinanceWiz",
      avatar: "F",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "4",
      content: "Love this community chat! Perfect for real-time financial discussions. Upload your charts and let's discuss! 💰",
      timestamp: "1 minute ago",
      author: "CryptoKing",
      avatar: "C",
      color: "from-orange-500 to-red-600"
    },
    {
      id: "5",
      content: "The live background animations make this chat so engaging! Ready to share some investment tips. 🦋",
      timestamp: "Just now",
      author: "InvestorAce",
      avatar: "I",
      color: "from-teal-500 to-blue-600"
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: inputMessage,
        timestamp: "Just now",
        author: "You",
        avatar: "Y",
        color: "from-indigo-500 to-purple-600"
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage("");
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

      {/* Header Section */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CUTBAR FINANCE</h1>
                <p className="text-sm text-gray-500">Community Chat</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600">
                <Search size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600">
                <Bell size={18} />
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 relative z-10">
        
        {/* Welcome Message */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-4 animate-bounce-gentle">
            <MessageCircle className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CUTBAR FINANCE</h2>
          <p className="text-gray-600 max-w-md mx-auto">Join our community chat and share your financial insights. Upload links, images, and connect with fellow traders.</p>
        </div>

        {/* Chat History/Lobby Section - Centered */}
        <div className="flex-1 mb-6">
          <Card className="h-96 flex flex-col animate-slide-up shadow-lg bg-white/95 backdrop-blur-sm">
            
            {/* Chat Header */}
            <CardHeader className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Chat History</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 h-auto p-1">
                    <MoreVertical size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages Container */}
            <div 
              ref={chatHistoryRef}
              className="chat-history flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.map((message, index) => (
                <div key={message.id} className="chat-message animate-slide-up">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${message.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                      {message.avatar}
                    </div>
                    <div className="flex-1">
                      <div className={`message-bubble ${index % 2 === 0 ? 'bg-gray-100' : 'bg-purple-100'} rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm`}>
                        <p className="text-gray-900 text-sm">{message.content}</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 ml-1">{message.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{messages.length} messages</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={scrollToBottom}
                  className="hover:text-indigo-600 transition-colors duration-200 h-auto p-0 text-xs"
                >
                  <span>Scroll to bottom</span>
                  <ArrowDown size={12} className="ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Input Section - Fixed at Bottom */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 pt-4">
          <Card className="animate-slide-up shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Share your financial insights, upload links or images..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="chat-input w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500 h-auto p-0">
                        <Smile size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="send-button bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <span>Send</span>
                  <Send size={16} className="ml-2" />
                </Button>
              </div>
              
              {/* Upload and Link Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500 h-auto p-1">
                    <Upload size={16} />
                    <span className="ml-1 text-xs">Upload</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500 h-auto p-1">
                    <Link size={16} />
                    <span className="ml-1 text-xs">Link</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500 h-auto p-1">
                    <Image size={16} />
                    <span className="ml-1 text-xs">Image</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500 h-auto p-1">
                    <Paperclip size={16} />
                    <span className="ml-1 text-xs">File</span>
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  Press Enter to send • Upload files & links
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Powered by <span className="font-medium text-green-600">CUTBAR FINANCE</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
