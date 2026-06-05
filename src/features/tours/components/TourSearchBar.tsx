import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Navigation } from "lucide-react";
import { useNavigate } from "react-router";
import { getPopularDestinations } from "@/api/toursApi";

export function TourSearchBar() {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureLocation, setDepartureLocation] = useState("Tất cả");
  const [popularDestinations, setPopularDestinations] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (departureDate) params.append("date", departureDate);
    if (departureLocation && departureLocation !== "Tất cả") params.append("from", departureLocation);
    
    navigate(`/tours/search?${params.toString()}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 items-center border border-white/20 w-full">
      {/* Destination Input with Custom Suggestions */}
      <div className="relative flex-[1.5] w-full" ref={wrapperRef}>
        <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border-2 border-transparent focus-within:border-primary transition-all">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Bạn muốn đi đâu?"
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-medium"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {/* Dropdown Suggestions */}
        {showSuggestions && popularDestinations.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[600px] bg-white rounded-2xl shadow-2xl border border-border z-50 p-6 overflow-hidden">
            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-wide">
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
                  {dest}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date Input */}
      <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border-2 border-transparent focus-within:border-primary transition-all">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <div className="flex flex-col w-full">
          <span className="text-xs text-muted-foreground font-medium mb-0.5">Ngày khởi hành</span>
          <input
            type="date"
            className="w-full bg-transparent border-none outline-none text-sm text-foreground font-bold"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>
      </div>

      {/* Departure Location */}
      <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border-2 border-transparent focus-within:border-primary transition-all">
        <Navigation className="w-5 h-5 text-muted-foreground" />
        <div className="flex flex-col w-full">
          <span className="text-xs text-muted-foreground font-medium mb-0.5">Khởi hành từ</span>
          <select 
            className="w-full bg-transparent border-none outline-none text-sm text-foreground font-bold cursor-pointer"
            value={departureLocation}
            onChange={(e) => setDepartureLocation(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Cần Thơ">Cần Thơ</option>
            <option value="Hải Phòng">Hải Phòng</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        Tìm
      </button>
    </div>
  );
}
