import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar as CalendarIcon, X } from "lucide-react";
import { useNavigate } from "react-router";
import { getPopularDestinations, getDepartureLocations, getGuideTourDates } from "@/api/toursApi";
import { Calendar } from "@/components/ui/calendar";


// Hàm lấy ngày hiện tại chính xác theo múi giờ local (Sửa lỗi UTC của Code 1)
const getLocalDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Hàm định dạng ngày hiển thị dd/mm/yyyy
const formatDate = (dateStr: string) => {
  if (!dateStr) return "Chọn ngày đi";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export function TourSearchBar() {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(""); // Để trống mặc định theo Code 2
  const [departureLocation, setDepartureLocation] = useState("Tất cả");
  const [popularDestinations, setPopularDestinations] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  
  // Logic Code 2: Quản lý trạng thái người dùng đang gõ tìm kiếm điểm khởi hành
  const [isSearchingDeparture, setIsSearchingDeparture] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const departureWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [departureLocations, setDepartureLocations] = useState<string[]>(["Thanh Hóa", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"]);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [guideTourDates, setGuideTourDates] = useState<string[]>([]);
  const dateWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch địa điểm hot từ API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const dests = await getPopularDestinations();
        setPopularDestinations(dests);
      } catch (error) {
        console.error("Failed to load destinations", error);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch địa điểm khởi hành từ API
  useEffect(() => {
    const fetchDepartureLocations = async () => {
      try {
        const locs = await getDepartureLocations();
        setDepartureLocations(locs);
      } catch (error) {
        console.error("Failed to load departure locations", error);
      }
    };
    fetchDepartureLocations();
  }, []);

  // Fetch ngày khởi hành có sẵn từ TourGuide
  useEffect(() => {
    const fetchGuideTourDates = async () => {
      try {
        const dates = await getGuideTourDates();
        setGuideTourDates(dates);
      } catch (error) {
        console.error("Failed to load guide tour dates", error);
      }
    };
    fetchGuideTourDates();
  }, []);

  // Xử lý click ngoài vùng dropdown để đóng menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (departureWrapperRef.current && !departureWrapperRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false);
        setIsSearchingDeparture(false);
        if (!departureLocation) {
          setDepartureLocation("Tất cả");
        }
      }
      if (dateWrapperRef.current && !dateWrapperRef.current.contains(event.target as Node)) {
        setShowCalendarDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [departureLocation]);

  // Điều hướng tìm kiếm
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (departureDate) params.append("date", departureDate);
    if (departureLocation && departureLocation !== "Tất cả") params.append("from", departureLocation);

    navigate(`/tours/search?${params.toString()}`);
  };

  // Kích hoạt mở hộp thoại chọn ngày mượt mà
  const handleDateContainerClick = () => {
    setShowCalendarDropdown(prev => !prev);
  };

  return (
    <div className="bg-card/90 dark:bg-card/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 items-center border border-border w-full transition-all">
      
      {/* 1. Điểm khởi hành (Giao diện Code 1 + Logic Code 2) */}
      <div
        className="flex-1 w-full h-14 flex items-center gap-3 pl-3 pr-4 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200/80 dark:hover:bg-slate-800/60 rounded-full border border-transparent focus-within:border-primary/30 focus-within:bg-card transition-all relative"
        ref={departureWrapperRef}
      >
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-600 shrink-0">
          <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-300" />
        </div>
        <div className="flex flex-col flex-1 min-w-0 text-left pr-4">
          <span className="text-[11px] text-muted-foreground font-semibold">Điểm khởi hành</span>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm text-primary dark:text-primary font-bold placeholder:text-primary"
            placeholder="Tất cả"
            value={departureLocation}
            onChange={(e) => {
              setDepartureLocation(e.target.value);
              setShowDepartureSuggestions(true);
              setIsSearchingDeparture(true); // Đánh dấu đang gõ tìm kiếm chuyên sâu
            }}
            onFocus={() => {
              if (departureLocation === "Tất cả") {
                setDepartureLocation("");
              }
              setShowDepartureSuggestions(true);
            }}
          />
        </div>
        {departureLocation && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDepartureLocation(departureLocation === "Tất cả" ? "" : "Tất cả");
              setIsSearchingDeparture(false);
            }}
            className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Dropdown gợi ý điểm khởi hành */}
        {showDepartureSuggestions && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full min-w-[200px] bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border z-50 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2 uppercase tracking-widest opacity-80">
              <MapPin className="w-4 h-4" />
              Điểm khởi hành
            </h4>
            <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1">
              {departureLocations
                // Áp dụng logic lọc thông minh từ Code 2: Không bị ẩn danh sách khi bấm chọn lại
                .filter(loc => !isSearchingDeparture || departureLocation === "Tất cả" || loc.toLowerCase().includes(departureLocation.toLowerCase()))
                .map((loc, i) => (
                  <button
                    key={i}
                    className="text-left px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-semibold flex items-center gap-3 group shrink-0"
                    onClick={() => {
                      setDepartureLocation(loc);
                      setShowDepartureSuggestions(false);
                      setIsSearchingDeparture(false);
                    }}
                  >
                    <span className="truncate">{loc}</span>
                  </button>
                ))}
              {isSearchingDeparture && departureLocations.filter(loc => loc.toLowerCase().includes(departureLocation.toLowerCase())).length === 0 && (
                <span className="text-xs text-muted-foreground text-center py-2">Không tìm thấy địa điểm</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Điểm đến (Giao diện Code 1 chuẩn chỉnh) */}
      <div className="relative flex-[1.5] w-full" ref={wrapperRef}>
        <div className="flex items-center gap-3 pl-3 pr-4 py-2 h-14 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0">
            <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-300" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 text-left">
            <span className="text-[11px] text-muted-foreground font-semibold">Điểm đến</span>
            <input
              type="text"
              placeholder="Địa điểm bất kỳ..."
              className="w-full bg-transparent border-none outline-none text-sm text-foreground focus:text-primary font-bold placeholder:text-muted-foreground/60"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Dropdown gợi ý địa điểm hot */}
        {showSuggestions && popularDestinations.length > 0 && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full md:w-[600px] bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border z-50 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-widest opacity-80">
              <MapPin className="w-4 h-4" />
              Địa điểm hot
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularDestinations.filter(d => d.toLowerCase().includes(destination.toLowerCase())).map((dest, i) => (
                <button
                  key={i}
                  className="text-left px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-semibold flex items-center gap-3 group border border-transparent hover:border-primary/20"
                  onClick={() => {
                    setDestination(dest);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="truncate">{dest}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Ô Chọn Ngày Đi (Giao diện Code 1 + Popover Calendar tùy chỉnh) */}
      <div 
        ref={dateWrapperRef}
        onClick={handleDateContainerClick}
        className="flex-1 w-full h-14 flex items-center gap-3 pl-3 pr-4 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200/80 dark:hover:bg-slate-800/60 rounded-full border border-transparent focus-within:border-primary/30 transition-all relative cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-600 shrink-0 pointer-events-none">
          <CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-300" />
        </div>
        <div className="flex flex-col flex-1 min-w-0 text-left pointer-events-none">
          <span className="text-[11px] text-muted-foreground font-semibold text-ellipsis overflow-hidden whitespace-nowrap">Ngày đi</span>
          <span className="text-sm font-bold text-primary dark:text-primary">
            {formatDate(departureDate)}
          </span>
        </div>

        {/* Dropdown Lịch tùy chỉnh */}
        {showCalendarDropdown && (
          <div 
            className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-auto bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={parseLocalDate(departureDate)}
              onSelect={(date) => {
                if (date) {
                  setDepartureDate(formatDateToYYYYMMDD(date));
                } else {
                  setDepartureDate("");
                }
                setShowCalendarDropdown(false);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              modifiers={{
                hasTour: (date) => guideTourDates.includes(formatDateToYYYYMMDD(date))
              }}
              modifiersClassNames={{
                hasTour: "relative after:absolute after:bottom-[3px] after:left-1/2 after:-translate-x-1/2 after:size-1.5 after:bg-red-500 after:rounded-full after:z-10"
              }}
              initialFocus
            />
          </div>
        )}
      </div>

      {/* 4. Nút Tìm kiếm (Giữ màu xanh Navy thương hiệu thanh lịch của Code 1) */}
      <button
        onClick={handleSearch}
        className="w-full md:w-auto h-14 px-10 bg-[#0F4C81] dark:bg-primary hover:bg-[#0d4372] dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-full font-bold text-base shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group shrink-0 cursor-pointer"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Tìm kiếm</span>
      </button>

    </div>
  );
}