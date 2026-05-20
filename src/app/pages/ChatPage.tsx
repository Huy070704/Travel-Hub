import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MapPin,
  Calendar,
  DollarSign,
  Plane
} from "lucide-react";

export function ChatPage() {
  const [messageInput, setMessageInput] = useState("");

  const conversations = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        online: true,
      },
      lastMessage: "That sounds perfect! When are you thinking?",
      timestamp: "2m ago",
      unread: 2,
    },
    {
      id: 2,
      user: {
        name: "Marcus Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        online: false,
      },
      lastMessage: "Thanks for the Barcelona tips!",
      timestamp: "1h ago",
      unread: 0,
    },
    {
      id: 3,
      user: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        online: true,
      },
      lastMessage: "I'm interested in joining your Bali trip!",
      timestamp: "3h ago",
      unread: 1,
    },
    {
      id: 4,
      user: {
        name: "Alex Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        online: false,
      },
      lastMessage: "The itinerary looks great",
      timestamp: "1d ago",
      unread: 0,
    },
  ];

  const currentChat = conversations[0];

  const messages = [
    {
      id: 1,
      sender: "them",
      text: "Hey! I saw your post about Tokyo. I'm also planning a trip there!",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "That's awesome! When are you planning to go?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "them",
      text: "I was thinking mid-June, around the 15th-22nd. What about you?",
      timestamp: "10:33 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "Same dates! That's perfect. Are you looking to split accommodation costs?",
      timestamp: "10:35 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "Yes! I found some great hostels in Shibuya. They have dorms for around $25/night",
      timestamp: "10:36 AM",
    },
    {
      id: 6,
      sender: "them",
      text: "Also, I made a rough itinerary. Want to check it out?",
      timestamp: "10:36 AM",
    },
    {
      id: 7,
      sender: "me",
      text: "Definitely! Send it over",
      timestamp: "10:38 AM",
    },
    {
      id: 8,
      sender: "them",
      text: "That sounds perfect! When are you thinking?",
      timestamp: "10:40 AM",
    },
  ];

  const sharedTrip = {
    destination: "Tokyo, Japan",
    dates: "Jun 15-22, 2026",
    budget: "$800-1000",
    travelers: 2,
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          {/* Conversations List */}
          <div className="md:col-span-4 bg-white border-r border-border h-full flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-border">
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-all border-b border-border ${
                    conversation.id === currentChat.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.user.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold truncate">{conversation.user.name}</h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 ml-2">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-8 bg-background h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={currentChat.user.avatar}
                    alt={currentChat.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {currentChat.user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <Link to={`/profile/${currentChat.id}`} className="font-semibold hover:text-primary">
                    {currentChat.user.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {currentChat.user.online ? "Active now" : "Offline"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-full transition-all">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-full transition-all">
                  <Video className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-full transition-all">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === "me"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-white border border-border"
                    } rounded-2xl px-4 py-3 shadow-sm`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "me" ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Shared Trip Card */}
              <div className="flex justify-center my-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-primary/20">
                  <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5" />
                      <span className="font-semibold">Shared Trip</span>
                    </div>
                    <h3 className="text-xl font-bold">{sharedTrip.destination}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{sharedTrip.dates}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>{sharedTrip.budget} per person</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{sharedTrip.travelers} travelers</span>
                    </div>
                    <Link
                      to="/itinerary/1"
                      className="block w-full py-3 bg-primary text-white rounded-xl hover:shadow-lg transition-all text-center mt-4"
                    >
                      View Itinerary
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-2 hover:bg-muted rounded-full transition-all"
                >
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-muted rounded-full border border-border focus:ring-2 focus:ring-primary outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-full transition-all"
                  >
                    <Smile className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

              {/* Travel Sticker Suggestions */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Quick replies:</span>
                {["✈️ Let's go!", "🏖️ Beach day?", "🍜 Food tour!", "📸 Photo spot!"].map((sticker, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm whitespace-nowrap transition-all"
                    onClick={() => setMessageInput(sticker)}
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
