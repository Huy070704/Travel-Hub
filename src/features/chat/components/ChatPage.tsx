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
  Loader2,
  Users,
  Plus,
  Trash2,
  UserPlus,
  Lock
} from "lucide-react";
import { getConversations, getMessages, createGroupChat, deleteGroupChat, deleteMessage, addParticipantToGroup } from "@/api/chatApi";
import { getAcceptedBuddies } from "@/api/buddiesApi";
import type { BuddyDto } from "@/types/buddies";
import { signalrService } from "@/api/signalrService";
import { getMyProfile, getPublicProfile } from "@/api/usersApi";
import type { ConversationDto, MessageDto } from "@/types/chat";
import type { UserProfileDto, PublicUserProfileDto } from "@/types/users";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";

const getAvatar = (id: number) => {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
  ];
  return avatars[id % avatars.length];
};

// Helper function to convert URLs in text to clickable links
const renderMessageWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 underline underline-offset-2 break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const receiverIdFromUrl = userId ? Number(userId) : null;

  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [myProfile, setMyProfile] = useState<UserProfileDto | null>(null);
  const [receiverProfile, setReceiverProfile] = useState<PublicUserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [buddies, setBuddies] = useState<BuddyDto[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);

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

        if (receiverIdFromUrl) {
          try {
            const receiver = await getPublicProfile(receiverIdFromUrl);
            setReceiverProfile(receiver);
          } catch (e) {
            console.error("Failed to load receiver profile", e);
          }
        }

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
    if (!user?.isPremium) {
      navigate("/premium");
      return;
    }
    if (!messageInput.trim() || !myProfile) return;

    const currentConversationInfo = conversations.find(c => c.chatID === currentChatId);
    const isGroupChat = currentConversationInfo?.isGroupChat;
    
    let targetReceiverId = receiverIdFromUrl;
    
    if (!isGroupChat) {
      if (!targetReceiverId && currentChatId) {
         const otherMsg = messages.find(m => m.senderID !== myProfile.userID);
         if (otherMsg) {
           targetReceiverId = otherMsg.senderID;
         } else if (currentConversationInfo?.otherUserID) {
           targetReceiverId = currentConversationInfo.otherUserID;
         }
      }

      if (!targetReceiverId && !currentChatId) {
        toast.error("Lỗi: Không xác định được người nhận tin nhắn.");
        return;
      }
    }

    const currentMsg = messageInput;
    setMessageInput(""); // Optimistic clear

    try {
      if (isGroupChat && currentChatId) {
        await signalrService.sendMessage(undefined, currentMsg, currentChatId);
      } else {
        await signalrService.sendMessage(targetReceiverId || undefined, currentMsg, currentChatId || undefined);
      }
    } catch (error) {
      console.error("Failed to send", error);
      setMessageInput(currentMsg); // Revert on failure
    }
  };

  const handleCreateGroup = async () => {
    if (!user?.isPremium) {
      navigate("/premium");
      return;
    }
    if (!newGroupName.trim()) return;
    setIsCreatingGroup(true);
    try {
      const res = await createGroupChat(newGroupName);
      toast.success("Tạo nhóm thành công!");
      setShowCreateGroupModal(false);
      setNewGroupName("");
      const convos = await getConversations();
      setConversations(convos);
      setCurrentChatId(res.chatID);
    } catch (error) {
      console.error("Failed to create group", error);
      toast.error("Có lỗi xảy ra khi tạo nhóm.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!currentChatId || !currentConversationInfo?.isGroupChat) return;

    toast("Xác nhận giải tán nhóm", {
      description: "Bạn có chắc chắn muốn giải tán nhóm này không? Mọi tin nhắn sẽ bị xóa vĩnh viễn.",
      action: {
        label: "Giải tán",
        onClick: async () => {
          try {
            await deleteGroupChat(currentChatId);
            toast.success("Đã giải tán nhóm thành công.");
            setCurrentChatId(null);
            const convos = await getConversations();
            setConversations(convos);
          } catch (error) {
            console.error("Failed to delete group", error);
            toast.error("Có lỗi xảy ra khi giải tán nhóm.");
          }
        }
      },
      cancel: {
        label: "Hủy"
      }
    });
  };

  const handleOpenAddMember = async () => {
    try {
      const buddyList = await getAcceptedBuddies();
      setBuddies(buddyList);
      setShowAddMemberModal(true);
    } catch (error) {
      console.error("Failed to load buddies", error);
      toast.error("Không thể tải danh sách bạn bè.");
    }
  };

  const handleAddMember = async (userId: number) => {
    if (!currentChatId) return;
    setIsAddingMember(true);
    try {
      await addParticipantToGroup(currentChatId, userId);
      toast.success("Đã thêm thành viên vào nhóm!");
      setShowAddMemberModal(false);
      // Giả sử backend trả về event hoặc ta fetch lại chat để cập nhật số thành viên
      const convos = await getConversations();
      setConversations(convos);
    } catch (error: any) {
      console.error("Failed to add member", error);
      toast.error(error.response?.data || "Có lỗi xảy ra khi thêm thành viên.");
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    toast("Xác nhận xóa", {
      description: "Bạn có chắc muốn xóa tin nhắn này?",
      action: {
        label: "Xóa",
        onClick: async () => {
          try {
            await deleteMessage(messageId);
            // Xóa tin nhắn khỏi state
            setMessages(prev => prev.filter(m => m.messageID !== messageId));
            toast.success("Đã xóa tin nhắn.");
          } catch (error) {
            console.error("Failed to delete message", error);
            toast.error("Có lỗi xảy ra khi xóa tin nhắn.");
          }
        }
      },
      cancel: {
        label: "Hủy"
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const currentConversationInfo = conversations.find(c => c.chatID === currentChatId);
  const chatName = currentConversationInfo?.chatName || receiverProfile?.username || "Cuộc trò chuyện mới";
  const chatAvatar = currentConversationInfo?.avatarURL || receiverProfile?.avatarURL || getAvatar(currentConversationInfo?.otherUserID || receiverProfile?.userID || 0);

  // Use a group icon for group chats if no specific avatar
  const displayAvatar = currentConversationInfo?.isGroupChat ? undefined : chatAvatar;

  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex flex-col">
      <div className="w-full h-full flex-1 overflow-hidden bg-card border-t border-border flex">
        {/* Conversations List */}
        <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 bg-card border-r border-border h-full flex flex-col min-h-0 z-10 shadow-lg">
            {/* Search Header */}
            <div className="p-4 border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                    <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                    Tin nhắn
                  </h2>
                  <button 
                    onClick={() => {
                      if (!user?.isPremium) {
                        navigate("/premium");
                        return;
                      }
                      setShowCreateGroupModal(true);
                    }}
                    className={`p-2 rounded-full transition-all shadow-sm ${!user?.isPremium ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"}`}
                    title="Tạo Nhóm Mới"
                  >
                    {!user?.isPremium ? <Lock className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm cuộc trò chuyện..."
                  className="w-full pl-10 pr-4 py-3 bg-background rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm text-foreground"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-scroll custom-scrollbar">
              {conversations.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>Chưa có cuộc trò chuyện.</p>
                  <p className="text-sm mt-2">Vào bảng tin cộng đồng và kết nối với bạn bè!</p>
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
                    {conversation.isGroupChat ? (
                      <div className="w-14 h-14 rounded-full shadow-sm border border-border bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                        <Users className="w-7 h-7" />
                      </div>
                    ) : (
                      <img
                        src={conversation.avatarURL || getAvatar(conversation.otherUserID || 0)}
                        alt={conversation.chatName || "Chat"}
                        className="w-14 h-14 rounded-full object-cover shadow-sm border border-border"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold truncate text-base text-foreground">{conversation.chatName}</h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">
                        {conversation.lastMessageDate ? new Date(conversation.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate font-medium">
                        {conversation.lastMessage || "Đã bắt đầu trò chuyện"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-background h-full flex min-h-0 relative min-w-0">
            {currentChatId || receiverIdFromUrl ? (
              <>
                {/* Middle Chat Column */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0 relative">
                  {/* Chat Header */}
                  <div className="bg-card/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {currentConversationInfo?.isGroupChat ? (
                          <div className="w-12 h-12 rounded-full border border-border bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                            <Users className="w-6 h-6" />
                          </div>
                        ) : (
                          <img
                            src={chatAvatar}
                            alt={chatName}
                            className="w-12 h-12 rounded-full object-cover border border-border"
                          />
                        )}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-sm" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight text-foreground">
                          {chatName}
                        </h3>
                        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                          Đang hoạt động
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-full transition-all text-primary">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-full transition-all text-primary">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-full transition-all text-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </button>
                    </div>
                  </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-scroll custom-scrollbar p-6 space-y-6 bg-background relative">
                  {/* Watermark/Background Pattern could go here */}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground">Gửi tin nhắn để bắt đầu cuộc trò chuyện!</p>
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
                            src={message.avatarURL || getAvatar(message.senderID)} 
                            className="w-8 h-8 rounded-full mr-3 mt-auto mb-1 border border-border flex-shrink-0 object-cover" 
                            alt="avatar"
                          />
                        )}
                        <div
                          className={`max-w-[70%] ${
                            isMe
                              ? "bg-gradient-to-r from-primary to-secondary text-white rounded-2xl rounded-br-sm shadow-md"
                              : "bg-card border border-border text-foreground rounded-2xl rounded-bl-sm shadow-sm"
                          } px-5 py-3 relative group/msg`}
                        >
                          {isMe && (
                            <button
                              onClick={() => handleDeleteMessage(message.messageID)}
                              className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 bg-destructive/10 text-destructive rounded-full opacity-0 group-hover/msg:opacity-100 transition-all hover:bg-destructive hover:text-white"
                              title="Xóa tin nhắn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!isMe && <div className="text-xs font-bold mb-1 text-primary">{message.senderUsername}</div>}
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                            {renderMessageWithLinks(message.content || "")}
                          </p>
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
                <div className="bg-card border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                  {/* Travel Sticker Suggestions */}
                  <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                    {["✈️ Đi thôi!", "🏖️ Đi biển?", "🍜 Tour ẩm thực!", "📸 Chỗ chụp ảnh!", "Được, tôi sẽ gửi hành trình."].map((sticker, index) => (
                      <button
                        key={index}
                        className="px-4 py-1.5 bg-muted/80 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-full text-sm whitespace-nowrap transition-all font-medium text-foreground"
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
                        onFocus={(e) => {
                          if (!user?.isPremium) {
                            e.target.blur();
                            navigate("/premium");
                          }
                        }}
                        placeholder={!user?.isPremium ? "🔒 Mở khóa Premium để nhắn tin" : "Nhập tin nhắn..."}
                        className={`w-full px-5 py-4 bg-muted/50 rounded-2xl border border-border focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12 text-[15px] ${!user?.isPremium ? "text-amber-500 font-medium placeholder:text-amber-500/70" : "text-foreground placeholder:text-muted-foreground"}`}
                        disabled={!user?.isPremium}
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
              </div>
                
                {/* Right Info Sidebar */}
                <div className="w-[320px] hidden lg:flex flex-col border-l border-border bg-card flex-shrink-0 overflow-y-auto custom-scrollbar">
                  {/* Avatar and Name */}
                  <div className="flex flex-col items-center pt-8 pb-6 px-4">
                    <div className="relative mb-4">
                      {currentConversationInfo?.isGroupChat ? (
                        <div className="w-20 h-20 rounded-full border border-border bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
                          <Users className="w-10 h-10" />
                        </div>
                      ) : (
                        <img
                          src={chatAvatar}
                          alt={chatName}
                          className="w-20 h-20 rounded-full object-cover border border-border shadow-md"
                        />
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-foreground text-center">{chatName}</h3>
                   
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-6 px-4 pb-6 border-b border-border">
                    {currentConversationInfo?.isGroupChat && (
                      <>
                        <button onClick={handleOpenAddMember} className="flex flex-col items-center gap-2 group">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <UserPlus className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">Thêm bạn</span>
                        </button>
                        <button onClick={handleDeleteGroup} className="flex flex-col items-center gap-2 group">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-destructive/10 group-hover:text-destructive transition-colors">
                            <Trash2 className="w-5 h-5 text-foreground group-hover:text-destructive" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground group-hover:text-destructive transition-colors">Giải tán</span>
                        </button>
                      </>
                    )}
                    <button className="flex flex-col items-center gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Search className="w-5 h-5 text-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">Tìm kiếm</span>
                    </button>
                  </div>

                  {/* Accordion Menu */}
                  <div className="flex flex-col p-2 space-y-1">
                    {[
                      "Thông tin về đoạn chat",
                      "Tùy chỉnh đoạn chat",
                      "File phương tiện và file",
                      "Quyền riêng tư và hỗ trợ"
                    ].map((item, idx) => (
                      <button key={idx} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="font-semibold text-sm text-foreground">{item}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50 bg-background w-full">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Tin nhắn của bạn</h3>
                <p className="text-muted-foreground max-w-sm">Chọn một cuộc trò chuyện từ danh sách hoặc bắt đầu một cuộc trò chuyện mới từ hồ sơ người dùng để bắt đầu trò chuyện.</p>
              </div>
            )}
          </div>
        </div>
      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
              <Users className="w-6 h-6 text-primary" />
              Tạo nhóm chat mới
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Tên nhóm</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ví dụ: Team đi Đà Lạt..."
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-foreground"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateGroupModal(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-medium transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || isCreatingGroup}
                className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingGroup ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tạo nhóm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
              <UserPlus className="w-6 h-6 text-primary" />
              Thêm bạn bè vào nhóm
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {buddies.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Bạn chưa có Buddy nào để mời.</p>
              ) : (
                buddies.map(buddy => (
                  <div key={buddy.buddyUserID} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <img src={buddy.avatarURL || getAvatar(buddy.buddyUserID)} alt={buddy.buddyUsername} className="w-10 h-10 rounded-full object-cover" />
                      <div className="font-semibold">{buddy.buddyUsername}</div>
                    </div>
                    <button 
                      onClick={() => handleAddMember(buddy.buddyUserID)}
                      disabled={isAddingMember}
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all disabled:opacity-50 text-sm font-medium"
                    >
                      Mời
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-medium transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
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
