import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Navigation } from "lucide-react";
import { useNavigate } from "react-router";
import { getPopularDestinations } from "@/api/toursApi";

export function TourSearchBar() {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureLocation, setDepartureLocation] = useState("Hà Nội");
  const [popularDestinations, setPopularDestinations] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const departureWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const predefinedDepartureLocations = ["Thanh Hóa", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];

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
      if (departureWrapperRef.current && !departureWrapperRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (departureDate) params.append("date", departureDate);
    if (departureLocation && departureLocation !== "Tất cả") params.append("from", departureLocation);
    
    navigate(`/tours/search?${params.toString()}`);
  };

  return (
    <div className="bg-card/90 dark:bg-card/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 items-center border border-border w-full transition-all">
      {/* Destination Input with Custom Suggestions */}
      <div className="relative flex-[1.5] w-full" ref={wrapperRef}>
        <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 focus-within:bg-muted/60 rounded-xl border-2 border-transparent focus-within:border-primary/50 transition-all">
          <Search className="w-5 h-5 text-primary/70" />
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

      {/* Date Input */}
      <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 focus-within:bg-muted/60 rounded-xl border-2 border-transparent focus-within:border-primary/50 transition-all">
        <Calendar className="w-5 h-5 text-primary/70" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Ngày khởi hành</span>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-transparent border-none outline-none text-sm text-foreground font-bold cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>
      </div>

      {/* Departure Location */}
      <div 
        className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 focus-within:bg-muted/60 rounded-xl border-2 border-transparent focus-within:border-primary/50 transition-all relative"
        ref={departureWrapperRef}
      >
        <Navigation className="w-5 h-5 text-primary/70" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Khởi hành từ</span>
          <input 
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm text-foreground font-bold placeholder:text-muted-foreground/50"
            placeholder="Điểm khởi hành"
            value={departureLocation}
            onChange={(e) => {
              setDepartureLocation(e.target.value);
              setShowDepartureSuggestions(true);
            }}
            onFocus={() => setShowDepartureSuggestions(true)}
          />
        </div>

        {/* Departure Suggestions Dropdown */}
        {showDepartureSuggestions && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full min-w-[200px] bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border z-50 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2 uppercase tracking-widest opacity-80">
              <Navigation className="w-4 h-4" />
              Điểm khởi hành
            </h4>
            <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1">
              {predefinedDepartureLocations
                .filter(loc => departureLocation === "Tất cả" || loc.toLowerCase().includes(departureLocation.toLowerCase()))
                .map((loc, i) => (
                  <button
                    key={i}
                    className="text-left px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-semibold flex items-center gap-3 group shrink-0"
                    onClick={() => {
                      setDepartureLocation(loc);
                      setShowDepartureSuggestions(false);
                    }}
                  >
                    <span className="truncate">{loc}</span>
                  </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Tìm kiếm</span>
      </button>
    </div>
  );
}
  

