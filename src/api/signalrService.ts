import * as signalR from '@microsoft/signalr';
import type { MessageDto } from '@/types/chat';

// Lấy base URL từ biến môi trường hoặc mặc định
const baseURL = (import.meta as any).env.VITE_API_BASE_URL
  ? (import.meta as any).env.VITE_API_BASE_URL.replace('/api', '')
  : 'http://localhost:5190';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting: boolean = false;

  public async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseURL}/hubs/chat`, {
        accessTokenFactory: () => {
          const token = localStorage.getItem('token');
          return token ? token : '';
        }
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    } finally {
      this.isConnecting = false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  public onReceiveMessage(callback: (message: MessageDto) => void) {
    if (this.connection) {
      this.connection.on("ReceiveMessage", callback);
    }
  }

  public offReceiveMessage(callback: (message: MessageDto) => void) {
    if (this.connection) {
      this.connection.off("ReceiveMessage", callback);
    }
  }

  public async joinChat(conversationId: number) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("JoinChat", conversationId);
    }
  }

  public async sendMessage(receiverId: number, content: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("SendMessage", receiverId, content);
    } else {
      console.error("SignalR is not connected. Cannot send message.");
    }
  }
}

export const signalrService = new SignalRService();
