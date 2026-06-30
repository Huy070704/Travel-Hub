import { useEffect, useState } from "react";
import { getReports, updateReportStatus } from "@/api/adminApi";
import { toast } from "sonner";

export function ReportsTab() {
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportFilter, setReportFilter] = useState("Tất cả báo cáo");

  const fetchReportsData = async () => {
    setIsLoadingReports(true);
    try {
      const data = await getReports();
      setReportsData(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleUpdateReport = async (reportId: number, status: 'Resolved' | 'Rejected') => {
    try {
      await updateReportStatus(reportId, status);
      toast.success(`Đã ${status === 'Resolved' ? 'duyệt (ẩn bài viết)' : 'từ chối'} báo cáo thành công.`);
      fetchReportsData(); // Refresh list
    } catch (error) {
      console.error("Failed to update report", error);
      toast.error("Có lỗi xảy ra khi xử lý báo cáo.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-2 overflow-x-auto">
          {["Tất cả báo cáo", "Pending", "Resolved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setReportFilter(tab)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                reportFilter === tab
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {isLoadingReports ? (
          <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu báo cáo...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Lý do</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người báo cáo</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Nội dung bài viết</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reportsData
                  .filter(r => reportFilter === "Tất cả báo cáo" || r.status === reportFilter)
                  .map((report) => (
                  <tr key={report.reportID} className="border-b border-border hover:bg-muted/50 transition-all">
                    <td className="py-3 px-4 font-semibold text-red-500">{report.reason}</td>
                    <td className="py-3 px-4 text-sm font-medium">{report.reporterName}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs">
                      <div className="font-medium text-foreground line-clamp-1">{report.postTitle}</div>
                      <div className="line-clamp-2">{report.postContent}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(report.reportDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        report.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        report.status === "Resolved" ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {report.status === "Pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateReport(report.reportID, 'Resolved')}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-all font-semibold"
                          >
                            Duyệt (Ẩn bài)
                          </button>
                          <button
                            onClick={() => handleUpdateReport(report.reportID, 'Rejected')}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-all font-semibold"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {reportsData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Chưa có báo cáo nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
