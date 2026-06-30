import {
  BarChart3,
  Users,
  MapPin,
  Calendar,
  BadgeCheck,
  MessageSquare,
  Activity,
  type LucideIcon,
} from "lucide-react";

export const PROVINCES = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
  "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
  "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long",
  "Vĩnh Phúc", "Yên Bái", "Phú Yên",
];

export interface DashboardTab {
  id: "overview" | "users" | "destinations" | "bookings" | "guides" | "posts" | "reports";
  label: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

// Single source of truth for sidebar nav + page header (title/subtitle) per tab.
export const DASHBOARD_TABS: DashboardTab[] = [
  {
    id: "overview",
    label: "Tổng quan",
    icon: BarChart3,
    title: "Tổng quan hệ thống",
    subtitle: "Theo dõi hiệu suất và sự tăng trưởng của nền tảng",
  },
  {
    id: "users",
    label: "Người dùng",
    icon: Users,
    title: "Quản lý người dùng",
    subtitle: "Quản lý và xem tất cả người dùng đã đăng ký",
  },
  {
    id: "destinations",
    label: "Điểm đến",
    icon: MapPin,
    title: "Quản lý điểm đến",
    subtitle: "Quản lý các điểm đến du lịch và danh sách",
  },
  {
    id: "bookings",
    label: "Đặt Tour",
    icon: Calendar,
    title: "Quản lý Đặt Tour",
    subtitle: "Theo dõi và quản lý các đơn đặt tour từ khách hàng",
  },
  {
    id: "guides",
    label: "Duyệt HDV",
    icon: BadgeCheck,
    title: "Duyệt Hướng Dẫn Viên",
    subtitle: "Xem xét và phê duyệt các đơn đăng ký trở thành Hướng Dẫn Viên",
  },
  {
    id: "posts",
    label: "Bài viết",
    icon: MessageSquare,
    title: "Quản lý bài viết",
    subtitle: "Quản lý bài viết cộng đồng và nội dung",
  },
  {
    id: "reports",
    label: "Báo cáo",
    icon: Activity,
    title: "Báo cáo & Kiểm duyệt",
    subtitle: "Xem xét và xử lý các báo cáo từ người dùng",
  },
];

export type DashboardTabId = DashboardTab["id"];
