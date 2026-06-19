import { useState } from "react";
import { Star, TrendingUp, Filter, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewsRatingsTab() {
  const [activeFilter, setActiveFilter] = useState("all");

  const ratingDistribution = [
    { stars: 5, count: 184, percentage: 82 },
    { stars: 4, count: 32, percentage: 14 },
    { stars: 3, count: 6, percentage: 3 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const reviews = [
    {
      id: 1,
      customer: { name: "Emma Watson", avatar: "https://i.pravatar.cc/150?u=emma" },
      tour: "Tour ẩm thực Phố Cổ Hà Nội",
      rating: 5,
      date: "18 Thg 10, 2024",
      content: "Trải nghiệm cực kỳ tuyệt vời! Nguyên rất am hiểu và đưa chúng tôi đến những nơi mà chúng tôi sẽ không bao giờ tự tìm thấy. Cà phê trứng là điểm nhấn của chuyến đi.",
      likes: 12
    },
    {
      id: 2,
      customer: { name: "David Kim", avatar: "https://i.pravatar.cc/150?u=david" },
      tour: "Chèo Kayak Khám phá Hang động Vịnh Hạ Long",
      rating: 4,
      date: "15 Thg 10, 2024",
      content: "Tour chèo kayak tuyệt vời. Các hang động rất đẹp và ít đông đúc hơn tôi mong đợi. Chỉ cho 4 sao vì xe đón trễ khoảng 15 phút, nhưng nhìn chung là hoàn hảo.",
      likes: 4
    },
    {
      id: 3,
      customer: { name: "Sarah Williams", avatar: "https://i.pravatar.cc/150?u=sarah" },
      tour: "Trekking bản địa Sapa",
      rating: 5,
      date: "10 Thg 10, 2024",
      content: "Chuyến đi này đã thay đổi góc nhìn của tôi về Việt Nam. Ngắm nhìn các bản làng và tìm hiểu về văn hóa trực tiếp từ hướng dẫn viên là một trải nghiệm sâu sắc. Rất khuyến khích cho bất kỳ ai có sức khỏe tốt.",
      likes: 28
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đánh giá & Xếp hạng</h1>
        <p className="text-muted-foreground mt-1">Theo dõi chất lượng dịch vụ và đọc phản hồi của khách hàng.</p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Overall Rating Card */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-4">Đánh giá trung bình</h3>
          <div className="text-6xl font-bold text-foreground mb-4">4.8</div>
          <div className="flex items-center gap-1 text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-6 h-6 ${i < 4 ? 'fill-current' : 'fill-current text-yellow-400/30'}`} />
            ))}
          </div>
          <p className="text-muted-foreground">Dựa trên <span className="font-bold text-foreground">224</span> đánh giá</p>
        </div>

        {/* Distribution Chart */}
        <div className="md:col-span-2 bg-card rounded-3xl shadow-sm border border-border p-8">
          <h3 className="text-lg font-bold mb-6">Phân bố đánh giá</h3>
          <div className="space-y-4">
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16 text-sm font-medium">
                  <span>{row.stars}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">
                  {row.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Satisfaction Metric */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">96% Khách hàng hài lòng</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Khách hàng đã đặt lại hoặc giới thiệu bạn</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20">
          Chia sẻ thành công
        </Button>
      </div>

      {/* Reviews List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Đánh giá gần đây</h2>
          
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('all')}
              className="rounded-full"
            >
              Tất cả
            </Button>
            <Button 
              variant={activeFilter === '5' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('5')}
              className="rounded-full gap-1"
            >
              5 <Star className="w-3 h-3 fill-current" />
            </Button>
            <Button 
              variant={activeFilter === '4' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('4')}
              className="rounded-full gap-1"
            >
              4 <Star className="w-3 h-3 fill-current" />
            </Button>
            <Button 
              variant={activeFilter === '3-' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('3-')}
              className="rounded-full gap-1"
            >
              Từ 3 trở xuống
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                
                {/* Avatar & Info */}
                <div className="sm:w-48 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={review.customer.avatar} alt={review.customer.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold">{review.customer.name}</h4>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {review.tour}
                    </span>
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-4">
                    {review.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Hữu ích ({review.likes})
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="px-8 rounded-full border-border text-foreground hover:bg-muted">
            Tải thêm đánh giá
          </Button>
        </div>
      </div>
      
    </div>
  );
}
