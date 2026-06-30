import { useEffect, useState } from "react";
import { getDestinations } from "@/api/destinationsApi";
import type { DestinationDto } from "@/types/destinations";
import { Search, ChevronDown, Edit, Eye } from "lucide-react";
import { DestinationModal } from "../DestinationModal";
import { PROVINCES } from "../../lib/constants";

export function DestinationsTab() {
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [destPage, setDestPage] = useState(1);
  const [destTotalPages, setDestTotalPages] = useState(1);
  const [destSearch, setDestSearch] = useState("");
  const [debouncedDestSearch, setDebouncedDestSearch] = useState("");
  const [destLocation, setDestLocation] = useState("all");
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationDto | null>(null);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);

  const fetchDestinationsData = async () => {
    setIsLoadingDestinations(true);
    try {
      const response = await getDestinations(debouncedDestSearch, undefined, undefined, destPage, 10, destLocation === "all" ? undefined : destLocation);
      setDestinations(response.items);
      setDestTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch destinations", error);
    } finally {
      setIsLoadingDestinations(false);
    }
  };

  // Debounce destination search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDestSearch(destSearch);
      setDestPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [destSearch]);

  useEffect(() => {
    fetchDestinationsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destPage, debouncedDestSearch, destLocation]);

  return (
    <div className="space-y-6">
      {/* Search & Add */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm điểm đến..."
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="relative border border-border rounded-xl bg-muted overflow-hidden focus-within:ring-2 focus-within:ring-primary md:w-64 shrink-0">
            <select
              value={destLocation}
              onChange={(e) => {
                setDestLocation(e.target.value);
                setDestPage(1);
              }}
              className="w-full h-full pl-4 pr-10 py-3 bg-transparent text-foreground outline-none appearance-none cursor-pointer"
            >
              <option value="all" className="bg-background text-foreground">Tất cả tỉnh/thành</option>
              {PROVINCES.map(prov => (
                <option key={prov} value={prov} className="bg-background text-foreground">{prov}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={() => { setSelectedDestination(null); setIsDestModalOpen(true); }}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            Thêm điểm đến
          </button>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {isLoadingDestinations ? (
          <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Điểm đến</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Từ khóa</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Tỉnh/Thành phố</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Chi phí (VND)</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => (
                    <tr key={dest.destinationID} className="border-b border-border hover:bg-muted/50 transition-all">
                      <td className="py-3 px-4 font-semibold">
                        <div className="flex items-center gap-3">
                          <img src={dest.image?.split(',')[0] || "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=100"} alt={dest.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span>{dest.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {dest.keyMain || "Chưa có"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{dest.cityProvince}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-primary">{dest.totalTourCost ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dest.totalTourCost) : "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          Hoạt động
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted rounded transition-all" onClick={() => window.open(`/destination/${dest.destinationID}`, '_blank')}>
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded transition-all" onClick={() => { setSelectedDestination(dest); setIsDestModalOpen(true); }}>
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {destinations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy điểm đến nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {destTotalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={destPage === 1}
                  onClick={() => setDestPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="text-sm font-medium mx-4">
                  Trang {destPage} / {destTotalPages}
                </span>
                <button
                  disabled={destPage === destTotalPages}
                  onClick={() => setDestPage(prev => Math.min(destTotalPages, prev + 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isDestModalOpen && (
        <DestinationModal
          initialData={selectedDestination}
          onClose={() => setIsDestModalOpen(false)}
          onSaved={() => {
            setIsDestModalOpen(false);
            fetchDestinationsData();
          }}
        />
      )}
    </div>
  );
}
