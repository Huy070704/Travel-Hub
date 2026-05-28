import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
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
  Plane,
  Loader2
} from "lucide-react";
import { getConversations, getMessages } from "@/api/chatApi";
import { signalrService } from "@/api/signalrService";
import { getMyProfile } from "@/api/usersApi";
import type { ConversationDto, MessageDto } from "@/types/chat";
import type { UserProfileDto } from "@/types/users";

const getAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
};

export function ChatPage() {
  const { userId } = useParams();
  const receiverIdFromUrl = userId ? Number(userId) : null;

  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [myProfile, setMyProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChatIdRef = useRef<number | null>(null);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  // 1. Initial Load & SignalR Setup
  useEffect(() => {
    const init = async () => {
      try {
        const profile = await getMyProfile();
        setMyProfile(profile);

        const convos = await getConversations();
        setConversations(convos);

        await signalrService.connect();

        // Register SignalR listener
        const messageHandler = (msg: MessageDto) => {
          const activeChatId = currentChatIdRef.current;
          
          setMessages(prev => {
            // Only add if it's for the currently open chat
            if (activeChatId === msg.chatID || activeChatId === null) {
              // Avoid duplicates
              if (!prev.find(m => m.messageID === msg.messageID)) {
                return [...prev, msg];
              }
            }
            return prev;
          });
          
          // Set currentChatId if we just started a chat
          if (activeChatId === null) {
            setCurrentChatId(msg.chatID);
          }
          
          // Also update the conversation list last message
          setConversations(prevConvos => {
            let updated = false;
            const newConvos = prevConvos.map(c => {
              if (c.chatID === msg.chatID) {
                updated = true;
                return { ...c, lastMessage: msg.content, lastMessageDate: msg.sentDate };
              }
              return c;
            });

            // If it's a new chat not in the list, we would ideally fetch the conversation list again, 
            // but for simplicity we'll just refetch if we detect a new chatID.
            if (!updated) {
              getConversations().then(setConversations);
            }
            
            return newConvos.sort((a, b) => new Date(b.lastMessageDate || 0).getTime() - new Date(a.lastMessageDate || 0).getTime());
          });
        };

        signalrService.onReceiveMessage(messageHandler);

        // If a receiver is specified in URL, we want to open that chat.
        // We'll figure out if a chat already exists with them.
        // But since we don't have the other user's ID in ConversationDto, we might just have to send the first message to create it.
        if (convos.length > 0 && !receiverIdFromUrl) {
          setCurrentChatId(convos[0].chatID);
        }

      } catch (error) {
        console.error("Failed to init chat", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    return () => {
      // Normally we might disconnect or remove listeners here
      // signalrService.disconnect();
    };
  }, []); // Run once on mount

  // 2. Select Chat
  useEffect(() => {
    if (currentChatId) {
      const loadMessages = async () => {
        try {
          const res = await getMessages(currentChatId, 1, 50);
          setMessages(res.items);
          await signalrService.joinChat(currentChatId);
        } catch (error) {
          console.error("Failed to load messages", error);
        }
      };
      loadMessages();
    }
  }, [currentChatId]);

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !myProfile) return;

    let targetReceiverId = receiverIdFromUrl;
    
    // If we are in an existing chat and don't know the receiverId from URL
    if (!targetReceiverId && currentChatId) {
       // Look into the loaded messages to find the other person's ID
       const otherMsg = messages.find(m => m.senderID !== myProfile.userID);
       if (otherMsg) {
         targetReceiverId = otherMsg.senderID;
       }
    }

    if (!targetReceiverId) {
      alert("Error: Cannot determine the recipient of this chat. Please start a chat from their profile.");
      return;
    }

    const currentMsg = messageInput;
    setMessageInput(""); // Optimistic clear

    try {
      await signalrService.sendMessage(targetReceiverId, currentMsg);
      // The message will come back via SignalR ReceiveMessage, 
      // so we don't necessarily need to manually append it, 
      // but SignalR Caller.SendAsync ensures we get it.
    } catch (error) {
      console.error("Failed to send", error);
      setMessageInput(currentMsg); // Revert on failure
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const currentConversationInfo = conversations.find(c => c.chatID === currentChatId);

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-full shadow-2xl overflow-hidden rounded-none md:rounded-t-2xl mt-0 md:mt-4 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          {/* Conversations List */}
          <div className="md:col-span-4 bg-white border-r border-border h-full flex flex-col z-10 shadow-lg">
            {/* Search Header */}
            <div className="p-4 border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                Messages
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {conversations.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No conversations yet.</p>
                  <p className="text-sm mt-2">Go to the community feed and connect with a buddy!</p>
                </div>
              )}
              {conversations.map((conversation) => (
                <button
                  key={conversation.chatID}
                  onClick={() => setCurrentChatId(conversation.chatID)}
                  className={`w-full p-4 flex items-start gap-4 hover:bg-muted/80 transition-all border-b border-border ${
                    conversation.chatID === currentChatId ? "bg-primary/10 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={getAvatar(conversation.chatName || "Chat")}
                      alt={conversation.chatName || "Chat"}
                      className="w-14 h-14 rounded-full object-cover shadow-sm border border-border"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold truncate text-base">{conversation.chatName}</h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">
                        {conversation.lastMessageDate ? new Date(conversation.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate font-medium">
                        {conversation.lastMessage || "Started a chat"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-8 bg-slate-50 h-full flex flex-col relative">
            {currentChatId || receiverIdFromUrl ? (
              <>
                {/* Chat Header */}
                <div className="bg-white/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={getAvatar(currentConversationInfo?.chatName || "New User")}
                        alt={currentConversationInfo?.chatName || "New User"}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        {currentConversationInfo?.chatName || "New Conversation"}
                      </h3>
                      <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-all text-muted-foreground">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-all text-muted-foreground">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 hover:bg-muted rounded-full transition-all text-muted-foreground">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 relative">
                  {/* Watermark/Background Pattern could go here */}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8" />
                      </div>
                      <p>Send a message to start the conversation!</p>
                    </div>
                  )}

                  {messages.map((message) => {
                    const isMe = message.senderID === myProfile?.userID;
                    return (
                      <div
                        key={message.messageID}
                        className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
                      >
                        {!isMe && (
                          <img 
                            src={getAvatar(message.senderUsername)} 
                            className="w-8 h-8 rounded-full mr-3 mt-auto mb-1 border border-border flex-shrink-0" 
                            alt="avatar"
                          />
                        )}
                        <div
                          className={`max-w-[70%] ${
                            isMe
                              ? "bg-gradient-to-r from-primary to-secondary text-white rounded-2xl rounded-br-sm shadow-md"
                              : "bg-white border border-border text-foreground rounded-2xl rounded-bl-sm shadow-sm"
                          } px-5 py-3`}
                        >
                          {!isMe && <div className="text-xs font-bold mb-1 text-primary">{message.senderUsername}</div>}
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <div
                            className={`text-[10px] mt-1.5 text-right font-medium ${
                              isMe ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                  {/* Travel Sticker Suggestions */}
                  <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                    {["✈️ Let's go!", "🏖️ Beach day?", "🍜 Food tour!", "📸 Photo spot!", "Sure, I'll send the itinerary."].map((sticker, index) => (
                      <button
                        key={index}
                        className="px-4 py-1.5 bg-muted/80 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-full text-sm whitespace-nowrap transition-all font-medium"
                        onClick={() => setMessageInput(sticker)}
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button
                      type="button"
                      className="p-3 bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-all text-muted-foreground flex-shrink-0"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-5 py-4 bg-muted/50 rounded-2xl border border-border focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12 text-[15px]"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Your Messages</h3>
                <p className="text-muted-foreground max-w-sm">Select a conversation from the list or start a new one from a user's profile to begin chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  )
}
